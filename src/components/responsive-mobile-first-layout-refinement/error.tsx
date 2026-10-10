// src/components/responsive-mobile-first-layout-refinement/error.tsx
'use client';

import React from 'react';
import { Smartphone, RefreshCw, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface MobileLayoutErrorProps {
  error?: Error | null;
  reset?: () => void;
  message?: string;
}

export default function ResponsiveMobileFirstLayoutError({
  error,
  reset,
  message,
}: MobileLayoutErrorProps) {
  return (
    <div className="min-h-[380px] flex items-center justify-center p-6 text-center bg-zinc-50 border border-zinc-200 rounded-none">
      <div className="max-w-sm space-y-4">
        <div className="w-12 h-12 bg-zinc-900 text-white flex items-center justify-center mx-auto rounded-none shadow-xs">
          <Smartphone size={24} className="text-[#E60012]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-black uppercase text-zinc-950">
            Kendala Render Layout Ponsel (Mobile-First)
          </h3>
          <p className="text-xs text-zinc-500">
            {message || error?.message || 'Gagal memuat komponen ergonomis zona jempol mobile. Periksa koneksi atau orientasi layar.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 pt-2">
          {reset && (
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2 bg-zinc-950 hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 rounded-none cursor-pointer"
            >
              <RefreshCw size={12} />
              <span>Coba Lagi</span>
            </button>
          )}
          <Link
            href="/"
            className="px-4 py-2 bg-white border border-zinc-300 text-zinc-800 text-xs font-bold uppercase tracking-wider rounded-none"
          >
            Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
