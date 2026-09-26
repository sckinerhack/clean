/**
 * Standalone MongoDB Atlas Seeding Script
 * 
 * Usage:
 *   node scripts/seed-mongodb.js <YOUR_MONGODB_URI>
 *   or set MONGODB_URI in your environment.
 */

const mongoose = require('mongoose');

const mongoUri = process.env.MONGODB_URI || process.argv[2];

if (!mongoUri) {
  console.error('Error: Please provide a MongoDB connection string.');
  console.error('Usage: node scripts/seed-mongodb.js "mongodb+srv://user:pass@cluster.mongodb.net/phone_inventory"');
  process.exit(1);
}

const PhoneSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  imei: { type: String, required: true, unique: true },
  imei2: String,
  meid: String,
  serial_number: { type: String, required: true, unique: true },
  model: String,
  model_description: String,
  model_config: String,
  part_number: String,
  wifi_mac: String,
  eid: String,
  first_activation_date: String,
  product_sold_by: String,
  warranty_status: String,
  estimated_purchase_date: String,
  registration_date: String,
  purchase_country: String,
  ios_version: String,
  last_restore_date: String,
  last_unbrick_os_build: String,
  onsite_coverage: String,
  part_covered: String,
  labor_covered: String,
  personalized_device: String,
  loaner_device: String,
  mdm_lock: String,
  find_my_iphone: String,
  icloud_status: String,
  initial_activation_policy_id: String,
  initial_activation_policy_details: String,
  applied_activation_policy_id: String,
  applied_activation_details: String,
  next_tether_policy_id: String,
  next_tether_policy_details: String,
  iccid: String,
  carrier_name: String,
  gsx_unlocked: String,
  unlock_date: String,
  invoice_pdf_url: String,
  approval_status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  approval_request_date: { type: String, default: () => new Date().toISOString() },
});

const Phone = mongoose.models.Phone || mongoose.model('Phone', PhoneSchema);

const sampleDevices = [
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    imei: '356528181530916',
    imei2: '356528181530924',
    meid: '35652818153091',
    serial_number: 'FFMJ94P0ODXT',
    model: 'iPhone 12',
    model_description: 'IPHONE 12 BLUE 128GB-FRA',
    model_config: 'IPHONE 12,ROW,128GB,BLUE',
    part_number: 'MGJE3ZD/A',
    wifi_mac: 'E4:A7:A0:12:34:56',
    eid: '89049032005008882600024156999123',
    first_activation_date: '2021-04-12',
    product_sold_by: 'FNAC PARIS',
    warranty_status: 'Out Of Warranty',
    estimated_purchase_date: '2021-04-10',
    registration_date: '2021-04-12',
    purchase_country: 'France',
    ios_version: '16.5',
    last_restore_date: '2023-11-04',
    last_unbrick_os_build: '20F66',
    onsite_coverage: 'No',
    part_covered: 'No',
    labor_covered: 'No',
    personalized_device: 'No',
    loaner_device: 'No',
    mdm_lock: 'OFF',
    find_my_iphone: 'OFF',
    icloud_status: 'Clean',
    initial_activation_policy_id: '51',
    initial_activation_policy_details: 'France Orange Flex Policy',
    applied_activation_policy_id: '51',
    applied_activation_details: 'France Orange Flex Policy',
    next_tether_policy_id: '51',
    next_tether_policy_details: 'France Orange Flex Policy',
    iccid: '89330102030405060708',
    carrier_name: 'Orange France',
    gsx_unlocked: 'Yes',
    unlock_date: '2022-04-10',
    invoice_pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    approval_status: 'Rejected',
    approval_request_date: '2026-09-02T20:34:00.000Z',
  },
  {
    id: 'a8b9c10d-1234-4567-89ab-cdef01234567',
    imei: '359944951284302',
    imei2: '359944951284310',
    meid: '35994495128430',
    serial_number: 'YDQ64LJXGG',
    model: 'iPhone 16 Plus',
    model_description: 'IPHONE 16 PLUS BLACK 256GB-FRA',
    model_config: 'IPHONE 16 PLUS,ROW,256GB,BLACK',
    part_number: 'MY763ZD/A',
    wifi_mac: 'A4:C3:F0:88:99:AA',
    eid: '89049032005008882600024156111222',
    first_activation_date: '2025-09-21',
    product_sold_by: 'APPLE STORE OPERA PARIS',
    warranty_status: 'AppleCare+ Active',
    estimated_purchase_date: '2025-09-20',
    registration_date: '2025-09-21',
    purchase_country: 'France',
    ios_version: '18.1',
    last_restore_date: '2026-02-14',
    last_unbrick_os_build: '22A3370',
    onsite_coverage: 'Yes',
    part_covered: 'Yes',
    labor_covered: 'Yes',
    personalized_device: 'No',
    loaner_device: 'No',
    mdm_lock: 'OFF',
    find_my_iphone: 'ON',
    icloud_status: 'Clean',
    initial_activation_policy_id: '2023',
    initial_activation_policy_details: 'Apple Retail Unlocked Policy',
    applied_activation_policy_id: '2023',
    applied_activation_details: 'Apple Retail Unlocked Policy',
    next_tether_policy_id: '2023',
    next_tether_policy_details: 'Apple Retail Unlocked Policy',
    iccid: '89441122334455667788',
    carrier_name: 'Factory Unlocked',
    gsx_unlocked: 'Yes',
    unlock_date: '2025-09-20',
    invoice_pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    approval_status: 'Rejected',
    approval_request_date: '2026-09-01T21:16:00.000Z',
  },
  {
    id: 'f5e4d3c2-b1a0-9876-5432-10fedcba9876',
    imei: '350889861812305',
    imei2: '350889861812313',
    meid: '35088986181230',
    serial_number: 'JWW6YX06CM',
    model: 'iPhone 17 Pro Max',
    model_description: 'IPHONE 17 PRO MAX DESERT TITANIUM 512GB',
    model_config: 'IPHONE 17 PRO MAX,ROW,512GB,DESERT TITANIUM',
    part_number: 'MY893ZD/A',
    wifi_mac: 'FC:FB:FB:12:34:99',
    eid: '89049032005008882600024156777888',
    first_activation_date: '2026-09-21',
    product_sold_by: 'APPLE STORE LE MARCHÉ SAINT-GERMAIN',
    warranty_status: 'AppleCare+ Active',
    estimated_purchase_date: '2026-09-20',
    registration_date: '2026-09-21',
    purchase_country: 'France',
    ios_version: '19.0',
    last_restore_date: '2026-09-21',
    last_unbrick_os_build: '23A100',
    onsite_coverage: 'Yes',
    part_covered: 'Yes',
    labor_covered: 'Yes',
    personalized_device: 'No',
    loaner_device: 'No',
    mdm_lock: 'OFF',
    find_my_iphone: 'OFF',
    icloud_status: 'Clean',
    initial_activation_policy_id: '2023',
    initial_activation_policy_details: 'Factory Unlocked Policy',
    applied_activation_policy_id: '2023',
    applied_activation_details: 'Factory Unlocked Policy',
    next_tether_policy_id: '2023',
    next_tether_policy_details: 'Factory Unlocked Policy',
    iccid: '89440102030405060708',
    carrier_name: 'Factory Unlocked',
    gsx_unlocked: 'Yes',
    unlock_date: '2026-09-20',
    invoice_pdf_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    approval_status: 'Approved',
    approval_request_date: '2026-09-01T18:06:00.000Z',
  },
];

async function seed() {
  try {
    console.log('Connecting to MongoDB Atlas...');
    await mongoose.connect(mongoUri);
    console.log('Connected!');

    console.log('Cleaning existing phones collection...');
    await Phone.deleteMany({});

    console.log('Inserting sample devices...');
    await Phone.insertMany(sampleDevices);

    console.log('Successfully seeded MongoDB Atlas database with sample devices!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seed();
