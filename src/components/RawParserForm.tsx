'use client';

import React, { useState } from 'react';
import { parseRawTextToPhone, SAMPLE_RAW_TEXT_GSX } from '@/lib/parser';
import { PhoneInput, ApprovalStatus } from '@/types/phone';
import {
  Wand2,
  FileUp,
  FileText,
  Check,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  Radio,
  Lock,
  Loader2,
  Sparkles,
} from 'lucide-react';

interface RawParserFormProps {
  onSuccess?: () => void;
}

export const RawParserForm: React.FC<RawParserFormProps> = ({ onSuccess }) => {
  const [rawText, setRawText] = useState('');
  const [parsedFields, setParsedFields] = useState<Partial<PhoneInput>>({});
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Trigger parse
  const handleParse = (text: string) => {
    setRawText(text);
    const parsed = parseRawTextToPhone(text);
    setParsedFields((prev) => ({
      ...prev,
      ...parsed,
    }));
  };

  const handlePasteSample = () => {
    handleParse(SAMPLE_RAW_TEXT_GSX);
  };

  const handleFieldChange = (key: keyof PhoneInput, value: string) => {
    setParsedFields((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Upload Invoice PDF file
  const handlePdfUpload = async (file: File) => {
    if (!file) return;

    // Client-side file size check (8 MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMsg('Invoice PDF size exceeds 8MB limit.');
      return;
    }

    setIsUploadingPdf(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setPdfUrl(data.url);
        setPdfFile(file);
      } else {
        setErrorMsg(data.error || 'Failed to upload PDF invoice');
      }
    } catch (err) {
      console.error('PDF upload error:', err);
      setErrorMsg('Failed to upload PDF invoice');
    } finally {
      setIsUploadingPdf(false);
    }
  };

  // Submit device registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!parsedFields.imei || !parsedFields.imei.trim()) {
      setErrorMsg('Primary IMEI number is required.');
      return;
    }

    if (!parsedFields.serial_number || !parsedFields.serial_number.trim()) {
      setErrorMsg('Serial Number is required.');
      return;
    }

    setIsSubmitting(true);

    const payload: PhoneInput = {
      imei: parsedFields.imei.trim(),
      serial_number: parsedFields.serial_number.trim(),
      imei2: parsedFields.imei2 || null,
      meid: parsedFields.meid || null,
      model: parsedFields.model || parsedFields.model_description || 'iPhone Device',
      model_description: parsedFields.model_description || null,
      model_config: parsedFields.model_config || null,
      part_number: parsedFields.part_number || null,
      wifi_mac: parsedFields.wifi_mac || null,
      eid: parsedFields.eid || null,
      first_activation_date: parsedFields.first_activation_date || null,
      product_sold_by: parsedFields.product_sold_by || null,
      warranty_status: parsedFields.warranty_status || null,
      estimated_purchase_date: parsedFields.estimated_purchase_date || null,
      registration_date: parsedFields.registration_date || null,
      purchase_country: parsedFields.purchase_country || null,
      ios_version: parsedFields.ios_version || null,
      last_restore_date: parsedFields.last_restore_date || null,
      last_unbrick_os_build: parsedFields.last_unbrick_os_build || null,
      onsite_coverage: parsedFields.onsite_coverage || null,
      part_covered: parsedFields.part_covered || null,
      labor_covered: parsedFields.labor_covered || null,
      personalized_device: parsedFields.personalized_device || null,
      loaner_device: parsedFields.loaner_device || null,
      mdm_lock: parsedFields.mdm_lock || 'OFF',
      find_my_iphone: parsedFields.find_my_iphone || 'OFF',
      icloud_status: parsedFields.icloud_status || 'Clean',
      initial_activation_policy_id: parsedFields.initial_activation_policy_id || null,
      initial_activation_policy_details: parsedFields.initial_activation_policy_details || null,
      applied_activation_policy_id: parsedFields.applied_activation_policy_id || null,
      applied_activation_details: parsedFields.applied_activation_details || null,
      next_tether_policy_id: parsedFields.next_tether_policy_id || null,
      next_tether_policy_details: parsedFields.next_tether_policy_details || null,
      iccid: parsedFields.iccid || null,
      carrier_name: parsedFields.carrier_name || null,
      gsx_unlocked: parsedFields.gsx_unlocked || null,
      unlock_date: parsedFields.unlock_date || null,
      invoice_pdf_url: pdfUrl || parsedFields.invoice_pdf_url || null,
      approval_status: (parsedFields.approval_status as ApprovalStatus) || 'Pending',
    };

    try {
      const res = await fetch('/api/phones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMsg(`Device successfully registered with ID: ${data.phone.id}`);
        setRawText('');
        setParsedFields({});
        setPdfUrl('');
        setPdfFile(null);
        if (onSuccess) onSuccess();
      } else {
        setErrorMsg(data.error || 'Failed to save device');
      }
    } catch (err: any) {
      console.error('Submit error:', err);
      setErrorMsg(err?.message || 'Error communicating with server');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner / Raw Input Area */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Wand2 className="w-6 h-6 text-blue-600" />
              Raw Text Regex Extractor (GSX Report)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Paste raw check output (e.g. GSX / Apple check) to automatically extract device specifications into editable fields.
            </p>
          </div>

          <button
            type="button"
            onClick={handlePasteSample}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl text-xs sm:text-sm border border-indigo-200 transition-all cursor-pointer shrink-0"
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Paste Sample GSX Report</span>
          </button>
        </div>

        {/* Textarea */}
        <div className="relative">
          <textarea
            rows={7}
            value={rawText}
            onChange={(e) => handleParse(e.target.value)}
            placeholder="Paste raw block text here... Example:&#10;Model Description: IPHONE 13 MIDNIGHT 128GB&#10;IMEI Number: 352364222321865&#10;Serial Number: YDQ64LJXGG"
            className="w-full p-4 text-xs sm:text-sm font-mono bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400 shadow-inner"
          />
        </div>
      </div>

      {/* Invoice PDF File Upload */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
        <h3 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
          <FileUp className="w-5 h-5 text-blue-600" />
          Attach Invoice PDF Document
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Upload store purchase invoice or proof document (PDF format, max 8MB).
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <label className="flex-1 w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-50 hover:bg-slate-100/80 border-2 border-dashed border-slate-300 hover:border-blue-400 rounded-2xl cursor-pointer transition-all">
            <FileText className="w-6 h-6 text-slate-400" />
            <div className="text-left">
              <span className="text-xs sm:text-sm font-semibold text-slate-700 block">
                {pdfFile ? pdfFile.name : 'Click to select Invoice PDF file'}
              </span>
              <span className="text-[11px] text-slate-400">PDF documents up to 8MB</span>
            </div>
            <input
              type="file"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handlePdfUpload(f);
              }}
            />
          </label>

          {isUploadingPdf && (
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading...</span>
            </div>
          )}

          {pdfUrl && (
            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-semibold">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Invoice Attached</span>
            </div>
          )}
        </div>
      </div>

      {/* Form Fields Review Grid */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Parsed Fields Review & Edit</h3>
              <p className="text-xs text-slate-500">
                Review and edit extracted values before saving to the database.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-600">Status:</label>
              <select
                value={parsedFields.approval_status || 'Pending'}
                onChange={(e) =>
                  handleFieldChange('approval_status', e.target.value as ApprovalStatus)
                }
                className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Section 1: Core Identification */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" /> Core Device Info
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Primary IMEI <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={parsedFields.imei || ''}
                  onChange={(e) => handleFieldChange('imei', e.target.value)}
                  placeholder="e.g. 352364222321865"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Serial Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={parsedFields.serial_number || ''}
                  onChange={(e) => handleFieldChange('serial_number', e.target.value)}
                  placeholder="e.g. YDQ64LJXGG"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Device Model
                </label>
                <input
                  type="text"
                  value={parsedFields.model || ''}
                  onChange={(e) => handleFieldChange('model', e.target.value)}
                  placeholder="e.g. iPhone 13 128GB Midnight"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Model Description
                </label>
                <input
                  type="text"
                  value={parsedFields.model_description || ''}
                  onChange={(e) => handleFieldChange('model_description', e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  IMEI 2 (eSIM)
                </label>
                <input
                  type="text"
                  value={parsedFields.imei2 || ''}
                  onChange={(e) => handleFieldChange('imei2', e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">MEID</label>
                <input
                  type="text"
                  value={parsedFields.meid || ''}
                  onChange={(e) => handleFieldChange('meid', e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Warranty & Security */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-indigo-700 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Warranty & Security Locks
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Warranty Status
                </label>
                <input
                  type="text"
                  value={parsedFields.warranty_status || ''}
                  onChange={(e) => handleFieldChange('warranty_status', e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">MDM Lock</label>
                <input
                  type="text"
                  value={parsedFields.mdm_lock || ''}
                  onChange={(e) => handleFieldChange('mdm_lock', e.target.value)}
                  placeholder="OFF"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Find My iPhone (FMI)
                </label>
                <input
                  type="text"
                  value={parsedFields.find_my_iphone || ''}
                  onChange={(e) => handleFieldChange('find_my_iphone', e.target.value)}
                  placeholder="OFF"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Carrier / Network
                </label>
                <input
                  type="text"
                  value={parsedFields.carrier_name || ''}
                  onChange={(e) => handleFieldChange('carrier_name', e.target.value)}
                  placeholder="Unlocked"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GSX SIM Lock Status
                </label>
                <input
                  type="text"
                  value={parsedFields.gsx_unlocked || ''}
                  onChange={(e) => handleFieldChange('gsx_unlocked', e.target.value)}
                  placeholder="Yes"
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Purchase Country
                </label>
                <input
                  type="text"
                  value={parsedFields.purchase_country || ''}
                  onChange={(e) => handleFieldChange('purchase_country', e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3 text-rose-700 text-xs sm:text-sm font-medium">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-700 text-xs sm:text-sm font-medium">
              <Check className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 transition-all text-xs sm:text-sm cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving to Database...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Save Device to Inventory</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
