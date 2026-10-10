// src/components/e-commerce-product-display-optimization/integrasi-database-status.tsx
'use client';

import React from 'react';
import { Database, ShieldCheck, Zap, Activity } from 'lucide-react';

interface IntegrasiDatabaseStatusProps {
  totalProducts: number;
  totalCategories: number;
  dbLatencyMs?: number;
  isOnline: boolean;
  rlsEnabled?: boolean;
}

export default function IntegrasiDatabaseStatus({
  totalProducts,
  totalCategories,
  dbLatencyMs = 45,
  isOnline = true,
  rlsEnabled = true,
}: IntegrasiDatabaseStatusProps) {
  return (
    <div className="p-4 bg-zinc-900 text-white rounded-none space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Database size={15} className="text-[#E60012]" />
          <h4 className="text-xs font-black uppercase tracking-wider text-white">
            Status Integrasi Database Katalog (Supabase PostgreSQL)
          </h4>
        </div>

        <div className="flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-300">
            {isOnline ? 'TERHUBUNG' : 'TERPUTUS'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Total SKU Terdaftar</span>
          <span className="text-sm font-black font-mono text-white">{totalProducts} Item</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Kategori Relasional</span>
          <span className="text-sm font-black font-mono text-white">{totalCategories} Kategori</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Latensi Respon</span>
          <span className="text-sm font-black font-mono text-emerald-400">{dbLatencyMs} ms</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Row-Level Security</span>
          <span className="text-sm font-black font-mono text-white flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>{rlsEnabled ? 'AKTIF' : 'NONAKTIF'}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
