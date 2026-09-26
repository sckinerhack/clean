'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, ApprovalStatus } from '@/types/phone';
import { Navbar } from '@/components/Navbar';
import { PhoneTable } from '@/components/PhoneTable';
import { ListFilter, Loader2, RefreshCw, PlusCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';

export default function InventoryPage() {
  const router = useRouter();
  const [phones, setPhones] = useState<Phone[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchPhones = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/phones');
      const data = await res.json();
      if (data.success) {
        setPhones(data.phones || []);
      } else {
        setErrorMsg(data.error || 'Failed to load inventory');
      }
    } catch (err) {
      console.error('Failed to load inventory:', err);
      setErrorMsg('Failed to load inventory');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPhones();
  }, []);

  const handleDeletePhone = async (id: string) => {
    if (!confirm('Are you sure you want to delete this device record?')) return;
    try {
      const res = await fetch(`/api/phones/${encodeURIComponent(id)}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setPhones((prev) =>
          prev.filter((p) => p.id !== id && (p as any)._id !== id && p.imei !== id && p.serial_number !== id)
        );
      } else {
        alert(data.error || 'Failed to delete device');
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Network error while deleting device');
    }
  };

  const countApproved = phones.filter((p) => p.approval_status === 'Approved').length;
  const countPending = phones.filter((p) => p.approval_status === 'Pending').length;
  const countRejected = phones.filter((p) => p.approval_status === 'Rejected').length;

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {/* Page Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
              <ListFilter className="w-8 h-8 text-blue-600" />
              Device Inventory List
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Complete history of verified devices and store approval status. Click any row for full device specs.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-auto">
            <button
              onClick={fetchPhones}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-2xl text-xs sm:text-sm border border-slate-200 shadow-2xs transition-all cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>

            <button
              onClick={() => router.push('/admin')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Device</span>
            </button>
          </div>
        </div>

        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">Total Registered</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{phones.length}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-200/80 bg-emerald-50/30 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-700 font-semibold uppercase tracking-wider">Approved</span>
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
            <span className="text-2xl font-bold text-emerald-900 mt-1 block">{countApproved}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-amber-200/80 bg-amber-50/30 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-700 font-semibold uppercase tracking-wider">Pending</span>
              <Clock className="w-5 h-5 text-amber-600" />
            </div>
            <span className="text-2xl font-bold text-amber-900 mt-1 block">{countPending}</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-rose-200/80 bg-rose-50/30 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-rose-700 font-semibold uppercase tracking-wider">Rejected</span>
              <XCircle className="w-5 h-5 text-rose-600" />
            </div>
            <span className="text-2xl font-bold text-rose-900 mt-1 block">{countRejected}</span>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
            <p className="text-slate-500 font-medium text-sm">Loading phone inventory...</p>
          </div>
        ) : errorMsg ? (
          <div className="bg-rose-50 border border-rose-200 p-6 rounded-3xl text-center text-rose-700 text-sm">
            {errorMsg}
          </div>
        ) : (
          <PhoneTable
            phones={phones}
            onDeletePhone={handleDeletePhone}
            onSelectPhone={(phone) => {
              router.push(`/?q=${encodeURIComponent(phone.imei)}`);
            }}
          />
        )}
      </div>
    </main>
  );
}
