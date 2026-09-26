import mongoose, { Schema, Model } from 'mongoose';
import { Phone as PhoneInterface } from '@/types/phone';

const PhoneSchema = new Schema<PhoneInterface>(
  {
    id: { type: String, required: true, unique: true, index: true },
    imei: { type: String, required: true, unique: true, index: true, trim: true },
    imei2: { type: String, default: null, trim: true },
    meid: { type: String, default: null, trim: true },
    serial_number: { type: String, required: true, unique: true, index: true, trim: true },
    model: { type: String, default: null, trim: true },
    model_description: { type: String, default: null, trim: true },
    model_config: { type: String, default: null, trim: true },
    part_number: { type: String, default: null, trim: true },
    wifi_mac: { type: String, default: null, trim: true },
    eid: { type: String, default: null, trim: true },
    first_activation_date: { type: String, default: null, trim: true },
    product_sold_by: { type: String, default: null, trim: true },
    warranty_status: { type: String, default: null, trim: true },
    estimated_purchase_date: { type: String, default: null, trim: true },
    registration_date: { type: String, default: null, trim: true },
    purchase_country: { type: String, default: null, trim: true },
    ios_version: { type: String, default: null, trim: true },
    last_restore_date: { type: String, default: null, trim: true },
    last_unbrick_os_build: { type: String, default: null, trim: true },
    onsite_coverage: { type: String, default: null, trim: true },
    part_covered: { type: String, default: null, trim: true },
    labor_covered: { type: String, default: null, trim: true },
    personalized_device: { type: String, default: null, trim: true },
    loaner_device: { type: String, default: null, trim: true },
    mdm_lock: { type: String, default: null, trim: true },
    find_my_iphone: { type: String, default: null, trim: true },
    icloud_status: { type: String, default: null, trim: true },
    initial_activation_policy_id: { type: String, default: null, trim: true },
    initial_activation_policy_details: { type: String, default: null, trim: true },
    applied_activation_policy_id: { type: String, default: null, trim: true },
    applied_activation_details: { type: String, default: null, trim: true },
    next_tether_policy_id: { type: String, default: null, trim: true },
    next_tether_policy_details: { type: String, default: null, trim: true },
    iccid: { type: String, default: null, trim: true },
    carrier_name: { type: String, default: null, trim: true },
    gsx_unlocked: { type: String, default: null, trim: true },
    unlock_date: { type: String, default: null, trim: true },
    invoice_pdf_url: { type: String, default: null, trim: true },
    approval_status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
      index: true,
    },
    approval_request_date: {
      type: String,
      required: true,
      default: () => new Date().toISOString(),
    },
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  }
);

export const PhoneModel: Model<PhoneInterface> =
  mongoose.models.Phone || mongoose.model<PhoneInterface>('Phone', PhoneSchema);
