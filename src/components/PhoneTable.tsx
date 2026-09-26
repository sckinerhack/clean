'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, ApprovalStatus } from '@/types/phone';
import { StatusBadge } from './StatusBadge';
import { PdfModal } from './PdfModal';
import {
  Search,
  FileText,
  Eye,
  Smartphone,
  Trash2,
  Calendar,
  Hash,
} from 'lucide-react';

interface PhoneTableProps {
  phones: Phone[];
  onStatusChange?: (id: string, newStatus: ApprovalStatus) => void;
  onDeletePhone?: (id: string) => void;
  onSelectPhone?: (phone: Phone) => void;
}

export const PhoneTable: React.FC<PhoneTableProps> = ({
  phones,
  onStatusChange,
  onDeletePhone,
  onSelectPhone,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activePdfUrl, setActivePdfUrl] = useState<string | null>(null);
  const [activePdfTitle, setActivePdfTitle] = useState<string>('');

  const formatDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      if (isNaN(d.getTime())) return isoString;
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    } catch {
      return isoString;
    }
  };

  // Filter phones
  const filteredPhones = phones.filter((phone) => {
    const matchesStatus =
      selectedStatus === 'All' ||
      phone.approval_status.toLowerCase() === selectedStatus.toLowerCase();

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !query ||
      (phone.model && phone.model.toLowerCase().includes(query)) ||
      phone.imei.toLowerCase().includes(query) ||
      phone.serial_number.toLowerCase().includes(query) ||
      (phone.carrier_name && phone.carrier_name.toLowerCase().includes(query));

    return matchesStatus && matchesSearch;
  });

  // Calculate summary counts
  const countApproved = phones.filter((p) => p.approval_status === 'Approved').length;
  const countPending = phones.filter((p) => p.approval_status === 'Pending').length;
  const countRejected = phones.filter((p) => p.approval_status === 'Rejected').length;

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Status Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => {
            const isSelected = selectedStatus === status;
            return (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                }`}
              >
                {status === 'All' && `All (${phones.length})`}
                {status === 'Pending' && `Pending (${countPending})`}
                {status === 'Approved' && `Approved (${countApproved})`}
                {status === 'Rejected' && `Rejected (${countRejected})`}
              </button>
            );
          })}
        </div>

        {/* Text Search Input */}
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Model, IMEI, or Serial..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-slate-900 placeholder:text-slate-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* MOBILE CARD VIEW (visible on screens smaller than md) */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredPhones.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl text-center text-slate-400 border border-slate-200">
            <Smartphone className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium">No devices matched your search or status filter.</p>
          </div>
        ) : (
          filteredPhones.map((phone) => (
            <div
              key={phone.id}
              onClick={() => onSelectPhone && onSelectPhone(phone)}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 cursor-pointer hover:border-blue-300 transition-colors"
            >
              {/* Card Header: Model & Status */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {phone.model || 'iPhone Device'}
                  </h3>
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-0.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{formatDate(phone.approval_request_date)}</span>
                  </div>
                </div>
                <StatusBadge status={phone.approval_status} size="sm" />
              </div>

              {/* Identifier details */}
              <div className="bg-slate-50 p-3 rounded-xl text-xs space-y-1 font-mono">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-400 font-sans">IMEI:</span>
                  <span className="font-semibold text-blue-700">{phone.imei}</span>
                </div>
                <div className="flex justify-between items-center text-slate-700">
                  <span className="text-slate-400 font-sans">Serial:</span>
                  <span className="font-semibold uppercase">{phone.serial_number}</span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                {phone.invoice_pdf_url ? (
                  <button
                    type="button"
                    onClick={() => {
                      setActivePdfUrl(phone.invoice_pdf_url || null);
                      setActivePdfTitle(`${phone.model || 'Device'} Invoice`);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-colors"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>View PDF</span>
                  </button>
                ) : (
                  <span className="text-slate-400 text-xs">No Invoice PDF</span>
                )}

                <div className="flex items-center gap-2">
                  <Link
                    href={`/?q=${encodeURIComponent(phone.imei)}`}
                    className="p-2 text-slate-600 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 rounded-xl transition-colors"
                    title="View details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>

                  {onDeletePhone && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        const deleteId = phone.id || (phone as any)._id || phone.imei;
                        onDeletePhone(deleteId);
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Delete record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DESKTOP TABLE VIEW (visible on md and larger) */}
      <div className="hidden md:block bg-white rounded-3xl shadow-lg border border-slate-200/80 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
                <th className="py-4 px-6">DATE</th>
                <th className="py-4 px-6">MODEL</th>
                <th className="py-4 px-6">IMEI</th>
                <th className="py-4 px-6">SERIAL</th>
                <th className="py-4 px-6">STATUS</th>
                <th className="py-4 px-6 text-center">INVOICE</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
              {filteredPhones.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    <Smartphone className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    No devices matched your search or status filter.
                  </td>
                </tr>
              ) : (
                filteredPhones.map((phone) => (
                  <tr
                    key={phone.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onSelectPhone && onSelectPhone(phone)}
                  >
                    {/* Date */}
                    <td className="py-4 px-6 text-slate-600 font-mono text-xs whitespace-nowrap">
                      {formatDate(phone.approval_request_date)}
                    </td>

                    {/* Model */}
                    <td className="py-4 px-6 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span>{phone.model || 'iPhone Device'}</span>
                      </div>
                    </td>

                    {/* IMEI */}
                    <td className="py-4 px-6 font-mono font-medium text-slate-700 whitespace-nowrap">
                      {phone.imei}
                    </td>

                    {/* Serial */}
                    <td className="py-4 px-6 font-mono text-slate-600 uppercase whitespace-nowrap">
                      {phone.serial_number}
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <StatusBadge status={phone.approval_status} size="sm" />
                    </td>

                    {/* Invoice PDF Link */}
                    <td className="py-4 px-6 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      {phone.invoice_pdf_url ? (
                        <button
                          onClick={() => {
                            setActivePdfUrl(phone.invoice_pdf_url || null);
                            setActivePdfTitle(`${phone.model || 'Device'} Invoice`);
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/70 hover:bg-blue-100 transition-colors cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>PDF</span>
                        </button>
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/?q=${encodeURIComponent(phone.imei)}`}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View device details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        {onDeletePhone && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              e.preventDefault();
                              const deleteId = phone.id || (phone as any)._id || phone.imei;
                              onDeletePhone(deleteId);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PDF View Modal */}
      <PdfModal
        isOpen={!!activePdfUrl}
        onClose={() => setActivePdfUrl(null)}
        pdfUrl={activePdfUrl}
        deviceTitle={activePdfTitle}
      />
    </div>
  );
};
