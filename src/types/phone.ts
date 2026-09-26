export type ApprovalStatus = 'Pending' | 'Approved' | 'Rejected';

export interface Phone {
  _id?: string;
  id: string; // UUID or unique ID string
  imei: string;
  imei2?: string | null;
  meid?: string | null;
  serial_number: string;
  model?: string | null;
  model_description?: string | null;
  model_config?: string | null;
  part_number?: string | null;
  wifi_mac?: string | null;
  eid?: string | null;
  first_activation_date?: string | null;
  product_sold_by?: string | null;
  warranty_status?: string | null;
  estimated_purchase_date?: string | null;
  registration_date?: string | null;
  purchase_country?: string | null;
  ios_version?: string | null;
  last_restore_date?: string | null;
  last_unbrick_os_build?: string | null;
  onsite_coverage?: string | null;
  part_covered?: string | null;
  labor_covered?: string | null;
  personalized_device?: string | null;
  loaner_device?: string | null;
  mdm_lock?: string | null;
  find_my_iphone?: string | null;
  icloud_status?: string | null;
  initial_activation_policy_id?: string | null;
  initial_activation_policy_details?: string | null;
  applied_activation_policy_id?: string | null;
  applied_activation_details?: string | null;
  next_tether_policy_id?: string | null;
  next_tether_policy_details?: string | null;
  iccid?: string | null;
  carrier_name?: string | null;
  gsx_unlocked?: string | null;
  unlock_date?: string | null;
  invoice_pdf_url?: string | null;
  approval_status: ApprovalStatus;
  approval_request_date: string; // ISO String format
  created_at?: string;
  updated_at?: string;
}

export type PhoneInput = Omit<Phone, 'id' | 'approval_request_date' | 'approval_status'> & {
  approval_status?: ApprovalStatus;
};
