'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Phone } from '@/types/phone';
import { DeviceDetailsCard } from '@/components/DeviceDetailsCard';
import { Navbar } from '@/components/Navbar';
import { Search, Smartphone, Loader2, Sparkles, AlertCircle } from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [phone, setPhone] = useState<Phone | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchDevice = async (searchStr: string) => {
    if (!searchStr || !searchStr.trim()) {
      setPhone(null);
      setErrorMsg(null);
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/phones/search?q=${encodeURIComponent(searchStr.trim())}`);
      const data = await res.json();

      if (data.success && data.phone) {
        setPhone(data.phone);
        setErrorMsg(null);
      } else {
        setPhone(null);
        setErrorMsg(data.error || `No device found matching IMEI/Serial "${searchStr}"`);
      }
    } catch (err) {
      console.error('Search error:', err);
      setPhone(null);
      setErrorMsg('Failed to query device database');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      fetchDevice(initialQuery);
    }
  }, [initialQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/?q=${encodeURIComponent(query.trim())}`);
      fetchDevice(query.trim());
    }
  };

  const sampleSearches = [
    { label: '356528181530916 (iPhone 12)', value: '356528181530916' },
    { label: 'YDQ64LJXGG (iPhone 16 Plus)', value: 'YDQ64LJXGG' },
    { label: '354781545034321 (iPhone 15 Pro)', value: '354781545034321' },
    { label: 'JWW6YX06CM (iPhone 17 Pro Max)', value: 'JWW6YX06CM' },
  ];

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-16">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        {/* Hero & Search Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/80 text-blue-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Store Device Inspection & Approval System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Device Verification & GSX Check
          </h1>
          <p className="text-sm sm:text-base text-slate-600">
            Enter an <span className="font-semibold text-slate-900">IMEI</span> or{' '}
            <span className="font-semibold text-slate-900">Serial Number</span> to inspect lock status, warranty coverage, activation history, and manage store approval status.
          </p>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mt-6">
            <div className="relative max-w-2xl mx-auto shadow-xl rounded-2xl">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Enter IMEI (15 digits) or Serial Number..."
                className="w-full pl-12 pr-32 py-4 text-sm sm:text-base bg-white border-2 border-slate-200 rounded-2xl focus:outline-none focus:border-blue-600 text-slate-900 font-mono placeholder:font-sans placeholder:text-slate-400"
              />
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />

              <button
                type="submit"
                disabled={isLoading}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Searching...
                  </span>
                ) : (
                  'Verify Device'
                )}
              </button>
            </div>
          </form>

          {/* Quick Sample Search Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <span className="text-xs text-slate-500 font-medium">Quick Test:</span>
            {sampleSearches.map((s) => (
              <button
                key={s.value}
                type="button"
                onClick={() => {
                  setQuery(s.value);
                  router.push(`/?q=${s.value}`);
                  fetchDevice(s.value);
                }}
                className="px-2.5 py-1 text-[11px] font-mono font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors shadow-2xs cursor-pointer"
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Result / Error */}
        {errorMsg && (
          <div className="max-w-2xl mx-auto p-6 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-2 animate-in fade-in">
            <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
            <h3 className="font-bold text-rose-900 text-base">Device Not Found</h3>
            <p className="text-xs sm:text-sm text-rose-700">{errorMsg}</p>
          </div>
        )}

        {phone && (
          <div className="max-w-5xl mx-auto animate-in fade-in duration-300">
            <DeviceDetailsCard
              phone={phone}
              onStatusUpdate={(newStatus) => {
                setPhone({ ...phone, approval_status: newStatus });
              }}
            />
          </div>
        )}

        {!phone && !errorMsg && !isLoading && (
          <div className="max-w-md mx-auto text-center py-12 px-4 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
            <Smartphone className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-700 text-sm sm:text-base">No Device Selected</h3>
            <p className="text-xs text-slate-500 mt-1">
              Search by IMEI or Serial Number above, or click one of the quick test options.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
