// src/components/e-commerce-product-display-optimization/validasi-input-alur-data.tsx
'use client';

import React from 'react';
import { ProductDisplayFilterInput } from '@/lib/validations/e-commerce-product-display-optimization.schema';
import { CheckCircle2, AlertCircle, Filter, RotateCcw } from 'lucide-react';

interface ValidasiInputAlurDataProps {
  filters: ProductDisplayFilterInput;
  totalFiltered: number;
  totalAvailable: number;
  onResetFilters: () => void;
  isValid: boolean;
  validationErrors?: string[];
}

export default function ValidasiInputAlurData({
  filters,
  totalFiltered,
  totalAvailable,
  onResetFilters,
  isValid,
  validationErrors = [],
}: ValidasiInputAlurDataProps) {
  return (
    <div className="p-4 bg-white border border-zinc-200 rounded-none space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isValid ? (
            <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle size={16} className="text-[#E60012] shrink-0" />
          )}
          <h4 className="text-xs font-black uppercase text-zinc-950">
            Validasi Alur Filter & Status Katalog
          </h4>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="text-[11px] font-bold text-[#E60012] hover:underline uppercase flex items-center gap-1 cursor-pointer"
        >
          <RotateCcw size={12} />
          <span>Reset Filter</span>
        </button>
      </div>

      {/* Rincian Status Filter */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
        <div className="p-2 bg-zinc-50 border border-zinc-100">
          <span className="text-zinc-400 block uppercase text-[9px] font-bold">Gender</span>
          <span className="font-bold font-mono text-zinc-800 uppercase">{filters.gender}</span>
        </div>
        <div className="p-2 bg-zinc-50 border border-zinc-100">
          <span className="text-zinc-400 block uppercase text-[9px] font-bold">Kategori</span>
          <span className="font-bold font-mono text-zinc-800 uppercase">{filters.category}</span>
        </div>
        <div className="p-2 bg-zinc-50 border border-zinc-100">
          <span className="text-zinc-400 block uppercase text-[9px] font-bold">Urutan</span>
          <span className="font-bold font-mono text-zinc-800 uppercase">{filters.sortBy}</span>
        </div>
        <div className="p-2 bg-zinc-50 border border-zinc-100">
          <span className="text-zinc-400 block uppercase text-[9px] font-bold">Hasil Sesuai</span>
          <span className="font-bold font-mono text-zinc-950">{totalFiltered} / {totalAvailable}</span>
        </div>
      </div>

      {validationErrors.length > 0 && (
        <div className="p-2.5 bg-red-50 border border-red-200 text-[#E60012] text-xs space-y-1">
          {validationErrors.map((err, idx) => (
            <p key={idx} className="flex items-center gap-1.5 font-medium">
              <span>•</span>
              <span>{err}</span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
