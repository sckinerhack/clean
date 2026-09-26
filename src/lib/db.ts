import fs from 'fs';
import path from 'path';
import { connectToDatabase } from './mongodb';
import { PhoneModel } from '@/models/Phone';
import { Phone, PhoneInput, ApprovalStatus } from '@/types/phone';
import { INITIAL_SEED_PHONES } from './seed-data';

// Local storage path for fallback when MONGODB_URI is not set
const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_FILE_PATH = path.join(DATA_DIR, 'phones.json');

// In-memory cache for fallback mode
let memoryStore: Phone[] | null = null;

function loadLocalStore(): Phone[] {
  if (memoryStore !== null) return memoryStore;

  try {
    if (fs.existsSync(JSON_FILE_PATH)) {
      const content = fs.readFileSync(JSON_FILE_PATH, 'utf-8');
      if (content.trim()) {
        memoryStore = JSON.parse(content);
        return memoryStore!;
      }
    }
  } catch (err) {
    console.warn('Could not read local JSON store:', err);
  }

  // Only seed initial default data when file does not exist at all
  memoryStore = [...INITIAL_SEED_PHONES];
  saveLocalStore(memoryStore);
  return memoryStore;
}

function saveLocalStore(phones: Phone[]) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(phones, null, 2), 'utf-8');
    memoryStore = phones;
  } catch (err) {
    console.error('Failed to write local JSON store:', err);
  }
}

export async function getAllPhones(): Promise<Phone[]> {
  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn) {
      const docs = await PhoneModel.find().sort({ approval_request_date: -1 }).lean();
      return docs.map((doc: any) => ({
        ...doc,
        _id: doc._id?.toString(),
        id: doc.id || doc._id?.toString(),
      }));
    }
  } catch (err) {
    console.warn('MongoDB connection unavailable, using local store:', err);
  }

  // Fallback to local store
  const phones = loadLocalStore();
  return [...phones].sort(
    (a, b) => new Date(b.approval_request_date).getTime() - new Date(a.approval_request_date).getTime()
  );
}

export async function getPhoneByIdOrQuery(query: string): Promise<Phone | null> {
  const cleanQuery = query.trim().toUpperCase();
  if (!cleanQuery) return null;

  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn) {
      const doc = await PhoneModel.findOne({
        $or: [
          { id: query },
          { imei: { $regex: new RegExp(`^${cleanQuery}$`, 'i') } },
          { imei2: { $regex: new RegExp(`^${cleanQuery}$`, 'i') } },
          { serial_number: { $regex: new RegExp(`^${cleanQuery}$`, 'i') } },
        ],
      }).lean();

      if (doc) {
        return {
          ...doc,
          _id: (doc as any)._id?.toString(),
          id: (doc as any).id || (doc as any)._id?.toString(),
        };
      }
    }
  } catch (err) {
    console.warn('MongoDB query error, falling back to local store:', err);
  }

  const phones = loadLocalStore();
  const found = phones.find(
    (p) =>
      p.id === query ||
      (p as any)._id === query ||
      p.imei.toUpperCase() === cleanQuery ||
      (p.imei2 && p.imei2.toUpperCase() === cleanQuery) ||
      p.serial_number.toUpperCase() === cleanQuery
  );

  return found || null;
}

export async function createPhone(input: PhoneInput): Promise<{ phone?: Phone; error?: string }> {
  const newId = crypto.randomUUID();
  const now = new Date().toISOString();

  const phoneData: Phone = {
    ...input,
    id: newId,
    imei: input.imei.trim(),
    serial_number: input.serial_number.trim(),
    approval_status: input.approval_status || 'Pending',
    approval_request_date: now,
  };

  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn) {
      // Check duplicate
      const existing = await PhoneModel.findOne({
        $or: [{ imei: phoneData.imei }, { serial_number: phoneData.serial_number }],
      }).lean();

      if (existing) {
        if (existing.imei === phoneData.imei) {
          return { error: `Device with IMEI ${phoneData.imei} already exists in database.` };
        }
        return { error: `Device with Serial Number ${phoneData.serial_number} already exists in database.` };
      }

      const createdDoc = await PhoneModel.create(phoneData);
      return {
        phone: {
          ...createdDoc.toObject(),
          _id: createdDoc._id.toString(),
          id: createdDoc.id,
        },
      };
    }
  } catch (err: any) {
    if (err.code === 11000) {
      return { error: 'Duplicate IMEI or Serial Number detected.' };
    }
    console.warn('MongoDB insertion error, saving to local store fallback:', err);
  }

  // Fallback to local store
  const phones = loadLocalStore();
  const dupImei = phones.find((p) => p.imei.toUpperCase() === phoneData.imei.toUpperCase());
  if (dupImei) {
    return { error: `Device with IMEI ${phoneData.imei} already exists in database.` };
  }

  const dupSerial = phones.find((p) => p.serial_number.toUpperCase() === phoneData.serial_number.toUpperCase());
  if (dupSerial) {
    return { error: `Device with Serial Number ${phoneData.serial_number} already exists in database.` };
  }

  phones.unshift(phoneData);
  saveLocalStore(phones);

  return { phone: phoneData };
}

export async function updatePhoneStatus(
  id: string,
  status: ApprovalStatus
): Promise<Phone | null> {
  const targetId = String(id).trim();

  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn) {
      const updated = await PhoneModel.findOneAndUpdate(
        { $or: [{ id: targetId }, { imei: targetId }, { serial_number: targetId }] },
        { $set: { approval_status: status } },
        { new: true }
      ).lean();

      if (updated) {
        return {
          ...updated,
          _id: (updated as any)._id?.toString(),
          id: (updated as any).id || (updated as any)._id?.toString(),
        };
      }
    }
  } catch (err) {
    console.warn('MongoDB update status error, falling back to local store:', err);
  }

  const phones = loadLocalStore();
  const index = phones.findIndex(
    (p) =>
      p.id === targetId ||
      (p as any)._id === targetId ||
      p.imei === targetId ||
      p.serial_number === targetId
  );
  if (index !== -1) {
    phones[index].approval_status = status;
    saveLocalStore(phones);
    return phones[index];
  }

  return null;
}

export async function deletePhone(id: string): Promise<boolean> {
  const targetId = String(id).trim();
  if (!targetId) return false;

  try {
    const mongooseConn = await connectToDatabase();
    if (mongooseConn) {
      const res = await PhoneModel.deleteOne({
        $or: [
          { id: targetId },
          { imei: targetId },
          { serial_number: targetId },
        ],
      });
      if (res.deletedCount > 0) return true;
    }
  } catch (err) {
    console.warn('MongoDB delete error, falling back to local store:', err);
  }

  const phones = loadLocalStore();
  const initialLength = phones.length;
  const newPhones = phones.filter(
    (p) =>
      p.id !== targetId &&
      (p as any)._id !== targetId &&
      p.imei !== targetId &&
      p.serial_number !== targetId
  );

  if (newPhones.length < initialLength) {
    saveLocalStore(newPhones);
    return true;
  }
  return false;
}
