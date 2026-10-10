// src/components/e-commerce-product-display-optimization/tampilan-antarmuka-e-comm.tsx
'use client';

import React, { useState } from 'react';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { Grid3X3, LayoutGrid, Eye, Sparkles, Filter, SlidersHorizontal, Sun, ZoomIn } from 'lucide-react';
import { ProductDisplayPreferenceInput } from '@/lib/validations/e-commerce-product-display-optimization.schema';

interface TampilanAntarmukaECommProps {
  products: Product[];
  preferences: ProductDisplayPreferenceInput;
  onOpenDetail?: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  wishlistIds?: number[];
}

export default function TampilanAntarmukaEComm({
  products,
  preferences,
  onOpenDetail,
  onToggleWishlist,
  wishlistIds = [],
}: TampilanAntarmukaECommProps) {
  const [viewMode, setViewMode] = useState<'grid-4' | 'grid-2' | 'editorial'>('grid-4');

  return (
    <div className="space-y-6">
      {/* Baris Kontrol Mode Tampilan Uniqlo LifeWear */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-zinc-50 border border-zinc-200 rounded-none">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-[#E60012] text-white rounded-none">
              <Sparkles size={14} />
            </span>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-zinc-950">
              Optimalisasi Tampilan Katalog (Uniqlo 1:1 Standard)
            </h3>
          </div>
          <p className="text-[11px] text-zinc-500">
            Rasio potret 3:4, swatch warna mikro, whitespace lapang, dan eliminasi border luar.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-white border border-zinc-200 p-1">
          <button
            type="button"
            onClick={() => setViewMode('grid-4')}
            className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
              viewMode === 'grid-4'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
            title="Grid 4 Kolom"
          >
            <Grid3X3 size={14} />
            <span className="hidden sm:inline">4 Kolom</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('grid-2')}
            className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
              viewMode === 'grid-2'
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
            title="Grid 2 Kolom"
          >
            <LayoutGrid size={14} />
            <span className="hidden sm:inline">2 Kolom</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('editorial')}
            className={`px-3 py-1.5 text-xs font-bold uppercase transition-all flex items-center gap-1.5 ${
              viewMode === 'editorial'
                ? 'bg-[#E60012] text-white shadow-xs'
                : 'text-zinc-600 hover:text-[#E60012]'
            }`}
            title="Editorial Majalah"
          >
            <Eye size={14} />
            <span className="hidden sm:inline">Editorial</span>
          </button>
        </div>
      </div>

      {/* Grid Katalog Teroptimasi */}
      {products.length === 0 ? (
        <div className="p-12 text-center bg-zinc-50 border border-zinc-200 rounded-none space-y-2">
          <p className="text-xs font-bold uppercase text-zinc-500">Tidak ada produk dalam mode ini</p>
        </div>
      ) : viewMode === 'editorial' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-4">
          {products.slice(0, 6).map((product) => (
            <div
              key={product.id}
              className="bg-white border border-zinc-200 p-5 rounded-none space-y-4 hover:border-zinc-950 transition-colors"
            >
              <div className="relative aspect-[3/4] bg-[#F6F6F6] overflow-hidden">
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-black/80 text-white text-[9px] font-mono uppercase px-2.5 py-1">
                  EDITORIAL FOCUS
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block">
                  {product.category_name} // {product.gender?.toUpperCase()}
                </span>
                <h4 className="text-sm font-bold uppercase text-zinc-950">{product.name}</h4>
                <p className="text-xs text-zinc-500 line-clamp-2">{product.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                  <span className="text-base font-black font-mono text-[#E60012]">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                  {onOpenDetail && (
                    <button
                      type="button"
                      onClick={() => onOpenDetail(product)}
                      className="px-3 py-1.5 bg-zinc-950 text-white text-xs font-bold uppercase hover:bg-[#E60012] transition-colors rounded-none"
                    >
                      Inspeksi Detail →
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div
          className={`grid gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 ${
            viewMode === 'grid-2'
              ? 'grid-cols-2'
              : 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
          }`}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onOpenDetail={onOpenDetail}
              isWishlisted={wishlistIds.includes(product.id)}
              onToggleWishlist={onToggleWishlist || (() => {})}
            />
          ))}
        </div>
      )}
    </div>
  );
}
