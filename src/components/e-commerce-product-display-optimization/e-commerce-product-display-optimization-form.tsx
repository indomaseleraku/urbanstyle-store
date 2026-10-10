// src/components/e-commerce-product-display-optimization/e-commerce-product-display-optimization-form.tsx
'use client';

import React, { useState } from 'react';
import { 
  productDisplayFilterSchema, 
  ProductDisplayFilterInput, 
  productDisplayPreferenceSchema, 
  ProductDisplayPreferenceInput 
} from '@/lib/validations/e-commerce-product-display-optimization.schema';
import { Sliders, Check, RotateCcw, Sparkles } from 'lucide-react';

interface ProductDisplayOptimizationFormProps {
  initialFilters: ProductDisplayFilterInput;
  initialPreferences: ProductDisplayPreferenceInput;
  onApplyFilters: (filters: ProductDisplayFilterInput) => void;
  onApplyPreferences: (prefs: ProductDisplayPreferenceInput) => void;
}

export default function ProductDisplayOptimizationForm({
  initialFilters,
  initialPreferences,
  onApplyFilters,
  onApplyPreferences,
}: ProductDisplayOptimizationFormProps) {
  const [filters, setFilters] = useState<ProductDisplayFilterInput>(initialFilters);
  const [preferences, setPreferences] = useState<ProductDisplayPreferenceInput>(initialPreferences);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    const filterResult = productDisplayFilterSchema.safeParse(filters);
    const prefResult = productDisplayPreferenceSchema.safeParse(preferences);

    if (!filterResult.success) {
      const formatted: Record<string, string> = {};
      filterResult.error.issues.forEach((issue) => {
        formatted[issue.path.join('.')] = issue.message;
      });
      setErrors(formatted);
      return;
    }

    if (!prefResult.success) {
      const formatted: Record<string, string> = {};
      prefResult.error.issues.forEach((issue) => {
        formatted[issue.path.join('.')] = issue.message;
      });
      setErrors(formatted);
      return;
    }

    onApplyFilters(filterResult.data);
    onApplyPreferences(prefResult.data);
    setSuccessMessage('Parameter optimasi tampilan produk berhasil diterapkan!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 bg-white border border-zinc-200 rounded-none space-y-5">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <div className="flex items-center gap-2">
          <Sliders size={16} className="text-[#E60012]" />
          <h4 className="text-xs font-black uppercase text-zinc-950">
            Formulir Konfigurasi Optimasi Tampilan
          </h4>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 uppercase">
          ZOD TYPE-SAFE
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Gender */}
        <div className="space-y-1">
          <label className="font-bold uppercase text-zinc-700">Target Gender:</label>
          <select
            value={filters.gender}
            onChange={(e) => setFilters({ ...filters, gender: e.target.value as any })}
            className="w-full p-2 border border-zinc-300 bg-white text-zinc-900 rounded-none focus:outline-none focus:border-zinc-950"
          >
            <option value="all">Semua Koleksi (All)</option>
            <option value="pria">Pria (Men)</option>
            <option value="wanita">Wanita (Women)</option>
            <option value="unisex">Unisex</option>
          </select>
        </div>

        {/* Urutan SortBy */}
        <div className="space-y-1">
          <label className="font-bold uppercase text-zinc-700">Kriteria Urutan:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
            className="w-full p-2 border border-zinc-300 bg-white text-zinc-900 rounded-none focus:outline-none focus:border-zinc-950"
          >
            <option value="featured">Rekomendasi (Featured)</option>
            <option value="popular">Terpopuler (Rating)</option>
            <option value="price-asc">Harga: Rendah ke Tinggi</option>
            <option value="price-desc">Harga: Tinggi ke Rendah</option>
            <option value="newest">Koleksi Terbaru</option>
          </select>
        </div>

        {/* Kata Kunci Pencarian */}
        <div className="space-y-1 sm:col-span-2">
          <label className="font-bold uppercase text-zinc-700">Kata Kunci Pencarian:</label>
          <input
            type="text"
            value={filters.searchQuery || ''}
            onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
            placeholder="Contoh: Flannel, AIRism, Ankle Pants..."
            className="w-full p-2 border border-zinc-300 text-zinc-900 rounded-none focus:outline-none focus:border-zinc-950"
          />
          {errors.searchQuery && (
            <p className="text-[#E60012] text-[10px] font-medium">{errors.searchQuery}</p>
          )}
        </div>

        {/* Checkbox Options */}
        <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-100">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={(e) => setFilters({ ...filters, inStockOnly: e.target.checked })}
              className="rounded-none text-[#E60012] focus:ring-0 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-bold text-zinc-700 uppercase">Hanya Ready Stock</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={preferences.enableMacroZoom}
              onChange={(e) => setPreferences({ ...preferences, enableMacroZoom: e.target.checked })}
              className="rounded-none text-[#E60012] focus:ring-0 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-bold text-zinc-700 uppercase">Lensa Makro Zoom 2.8x</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={preferences.showWeatherBadges}
              onChange={(e) => setPreferences({ ...preferences, showWeatherBadges: e.target.checked })}
              className="rounded-none text-[#E60012] focus:ring-0 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-bold text-zinc-700 uppercase">Weather Tech Badge</span>
          </label>
        </div>
      </div>

      {successMessage && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check size={14} className="text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
        <button
          type="button"
          onClick={() => {
            setFilters(initialFilters);
            setPreferences(initialPreferences);
            setErrors({});
          }}
          className="px-4 py-2 bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 text-xs font-bold uppercase rounded-none cursor-pointer"
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-[#E60012] hover:bg-[#c80010] text-white text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer shadow-xs"
        >
          Terapkan Pengaturan
        </button>
      </div>
    </form>
  );
}
