import { PhoneInput } from '@/types/phone';

const KEY_MAPPINGS: Partial<Record<keyof PhoneInput, string[]>> = {
  model_description: ['model description', 'model desc', 'description'],
  model_config: ['model config', 'config'],
  model: ['model', 'model name', 'device model'],
  imei: ['imei number', 'imei 1', 'imei', 'imei1', 'imei number 1', 'primary imei'],
  imei2: ['imei 2', 'imei2', 'imei 2 number', 'secondary imei'],
  meid: ['meid', 'meid number'],
  serial_number: ['serial number', 'serial', 'serial no', 'sn', 's/n'],
  part_number: ['part number', 'part no', 'mpn', 'part'],
  wifi_mac: ['wi-fi mac', 'wifi mac', 'mac address', 'wlan mac', 'wifi mac address'],
  eid: ['eid', 'eid number', 'esim id'],
  first_activation_date: ['first activation date', 'activation date', 'activated on'],
  product_sold_by: ['product sold by', 'sold by', 'seller'],
  warranty_status: ['warranty status', 'coverage status', 'warranty'],
  estimated_purchase_date: ['estimated purchase date', 'purchase date'],
  registration_date: ['registration date'],
  purchase_country: ['purchase country', 'country'],
  ios_version: ['ios version', 'software version', 'os version'],
  last_restore_date: ['last restore date', 'restore date'],
  last_unbrick_os_build: ['last unbrick os build', 'os build', 'build'],
  onsite_coverage: ['onsite coverage'],
  part_covered: ['part covered'],
  labor_covered: ['labor covered'],
  personalized_device: ['personalized device', 'personalized'],
  loaner_device: ['loaner device', 'loaner'],
  mdm_lock: ['mdm lock', 'mdm status', 'mdm'],
  find_my_iphone: ['find my iphone', 'fmi', 'find my iphone status', 'find my'],
  icloud_status: ['icloud status', 'icloud'],
  initial_activation_policy_id: ['initial activation policy id', 'initial policy id'],
  initial_activation_policy_details: ['initial activation policy details', 'initial policy details', 'initial policy'],
  applied_activation_policy_id: ['applied activation policy id', 'applied policy id'],
  applied_activation_details: ['applied activation details', 'applied policy details', 'applied activation policy details'],
  next_tether_policy_id: ['next tether policy id', 'next tether id'],
  next_tether_policy_details: ['next tether policy details', 'next tether details', 'next tether policy'],
  iccid: ['iccid', 'sim iccid'],
  carrier_name: ['carrier name', 'carrier', 'network'],
  gsx_unlocked: ['gsx unlocked', 'sim lock status', 'lock status', 'unlocked'],
  unlock_date: ['unlock date', 'unlocked on'],
  invoice_pdf_url: ['invoice pdf url', 'invoice url', 'pdf link', 'invoice link'],
  approval_status: ['approval status', 'status'],
};

export function parseRawTextToPhone(rawText: string): Partial<PhoneInput> {
  const result: Partial<PhoneInput> = {};
  if (!rawText || !rawText.trim()) return result;

  const lines = rawText.split(/\r?\n/);

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Match lines formatted as Key: Value or Key = Value or Key \t Value
    const match = trimmed.match(/^([^:=]+)[:=]\s*(.*)$/);
    if (!match) continue;

    const rawKey = match[1].trim().toLowerCase();
    const rawVal = match[2].trim();

    if (!rawVal) continue;

    // Find which property key matches
    for (const [propKey, aliases] of Object.entries(KEY_MAPPINGS)) {
      if (aliases.includes(rawKey)) {
        (result as any)[propKey] = rawVal;
        break;
      }
    }
  }

  return result;
}

export const SAMPLE_RAW_TEXT_GSX = `Model Description: IPHONE 13 MIDNIGHT 128GB-YPT
Model Config: IPHONE 13,ROW,128GB,MIDNIGHT
Model: iPhone 13 128GB Midnight
IMEI Number: 352364222321865
IMEI 2 Number: 352364222321873
MEID: 35236422232186
Serial Number: YDQ64LJXGG
Part Number: MLPF3ZD/A
Wi-Fi MAC: A4:B8:C5:D6:E7:F8
EID: 89049032005008882600024156123456
First Activation Date: 2022-10-15
Product Sold By: APPLE STORE ONLINE
Warranty Status: Out Of Warranty (No Coverage)
Estimated Purchase Date: 2022-10-15
Registration Date: 2022-10-15
Purchase Country: France
iOS Version: 17.4.1
Last Restore Date: 2024-01-10
Last Unbrick OS Build: 21E236
Onsite Coverage: No
Part Covered: No
Labor Covered: No
Personalized Device: No
Loaner Device: No
MDM Lock: OFF
Find My iPhone: OFF
iCloud Status: Clean
Initial Activation Policy ID: 2023
Initial Activation Policy Details: US Reseller Flex Policy
Applied Activation Policy ID: 2023
Applied Activation Details: US Reseller Flex Policy
Next Tether Policy ID: 2023
Next Tether Policy Details: US Reseller Flex Policy
ICCID: 89014103211118510720
Carrier: Unlocked
GSX Unlocked: Yes
Unlock Date: 2022-10-15`;
