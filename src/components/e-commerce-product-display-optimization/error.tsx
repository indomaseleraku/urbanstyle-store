// src/components/e-commerce-product-display-optimization/error.tsx
'use client';

import React from 'react';
import { AlertTriangle, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface ProductDisplayErrorProps {
  error?: Error | null;
  reset?: () => void;
  message?: string;
}

export default function ProductDisplayOptimizationError({
  error,
  reset,
  message,
}: ProductDisplayErrorProps) {
  return (
    <div className="min-h-[400px] flex items-center justify-center p-6 text-center bg-zinc-50 border border-zinc-200 rounded-none">
      <div className="max-w-md space-y-4">
        <div className="w-12 h-12 bg-red-100 text-[#E60012] flex items-center justify-center mx-auto rounded-none">
          <AlertTriangle size={24} />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-black uppercase text-zinc-950">
            Kendala Tampilan Katalog Produk
          </h3>
          <p className="text-xs text-zinc-500">
            {message || error?.message || 'Gagal memuat parameter optimasi tampilan produk. Koneksi jaringan terputus atau respon server melebihi batas waktu.'}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          {reset && (
            <button
              type="button"
              onClick={reset}
              className="px-4 py-2 bg-zinc-950 hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 rounded-none cursor-pointer"
            >
              <RefreshCw size={13} />
              <span>Muat Ulang</span>
            </button>
          )}
          <Link
            href="/"
            className="px-4 py-2 bg-white border border-zinc-300 hover:border-zinc-950 text-zinc-800 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 rounded-none"
          >
            <ArrowLeft size={13} />
            <span>Ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
