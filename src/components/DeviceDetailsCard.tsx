'use client';

import React, { useState } from 'react';
import { Phone, ApprovalStatus } from '@/types/phone';
import { StatusBadge } from './StatusBadge';
import { PdfModal } from './PdfModal';
import {
  Smartphone,
  ShieldCheck,
  Lock,
  Radio,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  Cpu,
} from 'lucide-react';

interface DeviceDetailsCardProps {
  phone: Phone;
  onStatusUpdate?: (newStatus: ApprovalStatus) => void;
}

export const DeviceDetailsCard: React.FC<DeviceDetailsCardProps> = ({
  phone,
  onStatusUpdate,
}) => {
  const [currentStatus, setCurrentStatus] = useState<ApprovalStatus>(phone.approval_status);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: ApprovalStatus) => {
    if (newStatus === currentStatus) return;
    setIsUpdating(true);
    setUpdateMsg(null);

    try {
      const res = await fetch(`/api/phones/${phone.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (data.success) {
        setCurrentStatus(newStatus);
        if (onStatusUpdate) {
          onStatusUpdate(newStatus);
        }
        setUpdateMsg(`Approval status updated to ${newStatus}`);
        setTimeout(() => setUpdateMsg(null), 3000);
      } else {
        alert(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Network error while updating status');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 overflow-hidden transition-all">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white p-5 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 text-white shadow-inner shrink-0">
              <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h2 className="text-lg sm:text-2xl font-bold tracking-tight text-white truncate">
                  {phone.model || phone.model_description || 'Apple iPhone'}
                </h2>
                <StatusBadge status={currentStatus} size="sm" />
              </div>
              <p className="text-slate-300 text-xs sm:text-sm font-mono mt-1 break-all">
                IMEI: <span className="text-white font-semibold">{phone.imei}</span>{' '}
                <span className="hidden xs:inline">|</span> Serial:{' '}
                <span className="text-white font-semibold">{phone.serial_number}</span>
              </p>
            </div>
          </div>

          {/* Quick PDF Action */}
          {phone.invoice_pdf_url && (
            <button
              onClick={() => setIsPdfModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl text-xs sm:text-sm shadow-md transition-all self-stretch sm:self-auto cursor-pointer shrink-0"
            >
              <FileText className="w-4 h-4" />
              <span>View Invoice PDF</span>
            </button>
          )}
        </div>

        {/* Approval Quick Bar */}
        <div className="mt-6 pt-5 border-t border-slate-700/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
            <Clock className="w-4 h-4 text-blue-400 shrink-0" />
            <span>
              Request Date:{' '}
              <strong className="text-white font-medium">
                {formatDate(phone.approval_request_date)}
              </strong>
            </span>
          </div>

          {/* Status Action Buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="text-xs text-slate-400 font-medium mr-1 hidden md:inline">
              Update Status:
            </span>

            <button
              onClick={() => handleStatusChange('Approved')}
              disabled={isUpdating || currentStatus === 'Approved'}
              className={`flex-1 md:flex-none flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentStatus === 'Approved'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve</span>
            </button>

            <button
              onClick={() => handleStatusChange('Rejected')}
              disabled={isUpdating || currentStatus === 'Rejected'}
              className={`flex-1 md:flex-none flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentStatus === 'Rejected'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30'
              }`}
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject</span>
            </button>

            <button
              onClick={() => handleStatusChange('Pending')}
              disabled={isUpdating || currentStatus === 'Pending'}
              className={`flex-1 md:flex-none flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                currentStatus === 'Pending'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 border border-amber-500/30'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending</span>
            </button>
          </div>
        </div>

        {updateMsg && (
          <div className="mt-3 px-3 py-1.5 bg-emerald-500/20 border border-emerald-400/40 rounded-lg text-xs text-emerald-200 animate-in fade-in">
            ✓ {updateMsg}
          </div>
        )}
      </div>

      {/* Main Grid: 4 Category Cards */}
      <div className="p-4 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-slate-50/50">
        {/* Category 1: Device Specifications */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-slate-100 text-blue-700">
            <Cpu className="w-5 h-5 text-blue-600 shrink-0" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Device Specifications</h3>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs sm:text-sm">
            <div>
              <dt className="text-slate-500 font-medium">Model</dt>
              <dd className="font-semibold text-slate-800 break-words">{phone.model || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Model Description</dt>
              <dd className="font-semibold text-slate-800 break-words">{phone.model_description || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Model Config</dt>
              <dd className="font-mono text-slate-700 break-words">{phone.model_config || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Primary IMEI</dt>
              <dd className="font-mono font-bold text-blue-700 break-all">{phone.imei}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">IMEI 2 (eSIM)</dt>
              <dd className="font-mono text-slate-700 break-all">{phone.imei2 || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">MEID</dt>
              <dd className="font-mono text-slate-700 break-all">{phone.meid || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Serial Number</dt>
              <dd className="font-mono font-bold text-slate-900 break-all">{phone.serial_number}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Part Number</dt>
              <dd className="font-mono text-slate-700 break-words">{phone.part_number || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Wi-Fi MAC Address</dt>
              <dd className="font-mono text-slate-700 break-all">{phone.wifi_mac || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">EID</dt>
              <dd className="font-mono text-slate-700 break-all">{phone.eid || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">iOS Version</dt>
              <dd className="font-semibold text-slate-800">{phone.ios_version || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Last OS Build</dt>
              <dd className="font-mono text-slate-700">{phone.last_unbrick_os_build || 'N/A'}</dd>
            </div>
          </dl>
        </div>

        {/* Category 2: Warranty & Purchase */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-slate-100 text-indigo-700">
            <ShieldCheck className="w-5 h-5 text-indigo-600 shrink-0" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Warranty & Purchase Details</h3>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs sm:text-sm">
            <div>
              <dt className="text-slate-500 font-medium">Warranty Coverage</dt>
              <dd className="font-semibold text-indigo-900 break-words">
                {phone.warranty_status || 'Unknown'}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">First Activation Date</dt>
              <dd className="font-semibold text-slate-800">{phone.first_activation_date || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Estimated Purchase Date</dt>
              <dd className="font-semibold text-slate-800">
                {phone.estimated_purchase_date || 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Registration Date</dt>
              <dd className="font-semibold text-slate-800">{phone.registration_date || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Sold By</dt>
              <dd className="font-semibold text-slate-800 break-words">{phone.product_sold_by || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Purchase Country</dt>
              <dd className="font-semibold text-slate-800">{phone.purchase_country || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Onsite Coverage</dt>
              <dd className="font-medium text-slate-700">{phone.onsite_coverage || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Parts & Labor Covered</dt>
              <dd className="font-medium text-slate-700">
                {phone.part_covered || 'N/A'} / {phone.labor_covered || 'N/A'}
              </dd>
            </div>
          </dl>
        </div>

        {/* Category 3: Security & Locks */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-slate-100 text-rose-700">
            <Lock className="w-5 h-5 text-rose-600 shrink-0" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Security & Locks</h3>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs sm:text-sm">
            <div>
              <dt className="text-slate-500 font-medium">MDM Lock</dt>
              <dd
                className={`font-bold ${
                  phone.mdm_lock?.toUpperCase() === 'OFF'
                    ? 'text-emerald-700'
                    : 'text-rose-700'
                }`}
              >
                {phone.mdm_lock || 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Find My iPhone (FMI)</dt>
              <dd
                className={`font-bold ${
                  phone.find_my_iphone?.toUpperCase() === 'OFF'
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                }`}
              >
                {phone.find_my_iphone || 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">iCloud Status</dt>
              <dd className="font-semibold text-slate-800">{phone.icloud_status || 'Clean'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Personalized Device</dt>
              <dd className="font-medium text-slate-700">{phone.personalized_device || 'No'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Loaner Device</dt>
              <dd className="font-medium text-slate-700">{phone.loaner_device || 'No'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Last Restore Date</dt>
              <dd className="font-semibold text-slate-800">{phone.last_restore_date || 'N/A'}</dd>
            </div>
          </dl>
        </div>

        {/* Category 4: Carrier & Activation */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2.5 mb-3 pb-2.5 border-b border-slate-100 text-emerald-700">
            <Radio className="w-5 h-5 text-emerald-600 shrink-0" />
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">Carrier & Activation Policies</h3>
          </div>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 text-xs sm:text-sm">
            <div>
              <dt className="text-slate-500 font-medium">Carrier Name</dt>
              <dd className="font-semibold text-slate-800 break-words">{phone.carrier_name || 'Unlocked'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">GSX SIM Unlocked</dt>
              <dd
                className={`font-bold ${
                  phone.gsx_unlocked?.toUpperCase() === 'YES' ||
                  phone.gsx_unlocked?.toUpperCase() === 'UNLOCKED'
                    ? 'text-emerald-700'
                    : 'text-amber-700'
                }`}
              >
                {phone.gsx_unlocked || 'N/A'}
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">Unlock Date</dt>
              <dd className="font-semibold text-slate-800">{phone.unlock_date || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-slate-500 font-medium">ICCID</dt>
              <dd className="font-mono text-slate-700 break-all">{phone.iccid || 'N/A'}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-500 font-medium">Initial Activation Policy</dt>
              <dd className="font-medium text-slate-700 break-words">
                {phone.initial_activation_policy_details || phone.initial_activation_policy_id || 'N/A'}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-500 font-medium">Applied Activation Policy</dt>
              <dd className="font-medium text-slate-700 break-words">
                {phone.applied_activation_details || phone.applied_activation_policy_id || 'N/A'}
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-slate-500 font-medium">Next Tether Policy</dt>
              <dd className="font-medium text-slate-700 break-words">
                {phone.next_tether_policy_details || phone.next_tether_policy_id || 'N/A'}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* PDF Modal */}
      <PdfModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
        pdfUrl={phone.invoice_pdf_url || null}
        deviceTitle={`${phone.model || 'Device'} (${phone.serial_number})`}
      />
    </div>
  );
};
