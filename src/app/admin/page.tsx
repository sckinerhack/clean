'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { RawParserForm } from '@/components/RawParserForm';
import { PlusCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-16">
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10">
        {/* Navigation Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/inventory"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Inventory</span>
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <PlusCircle className="w-8 h-8 text-blue-600" />
            Admin: Add New Phone Device
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Parse raw text report output from GSX / Apple check or manually enter fields to register a device into MongoDB.
          </p>
        </div>

        {/* Parser Form Component */}
        <RawParserForm
          onSuccess={() => {
            setTimeout(() => {
              router.push('/inventory');
            }, 1500);
          }}
        />
      </div>
    </main>
  );
}
