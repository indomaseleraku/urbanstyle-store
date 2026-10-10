// components/CapsuleWardrobeBuilder.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Product } from '@/lib/types';
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles, Check, ArrowRight } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/utils';

interface CapsuleWardrobeBuilderProps {
  products: Product[];
  onAddBundleToCart: (items: { product: Product; size: string; colorName: string; quantity: number }[]) => void;
  onOpenProductDetail?: (product: Product) => void;
}

export default function CapsuleWardrobeBuilder({
  products,
  onAddBundleToCart,
  onOpenProductDetail,
}: CapsuleWardrobeBuilderProps) {
  // Filter produk berdasarkan 3 layer esensial OOTD LifeWear
  const topsList = useMemo(() => {
    return products.filter((p) => p.category_id === 1 || p.category_id === 2);
  }, [products]);

  const bottomsList = useMemo(() => {
    return products.filter((p) => p.category_id === 3);
  }, [products]);

  const outerwearList = useMemo(() => {
    return products.filter((p) => p.category_id === 4);
  }, [products]);

  const [topIndex, setTopIndex] = useState(0);
  const [bottomIndex, setBottomIndex] = useState(0);
  const [outerIndex, setOuterIndex] = useState(0);

  const [selectedTopSize, setSelectedTopSize] = useState('M');
  const [selectedBottomSize, setSelectedBottomSize] = useState('M');
  const [selectedOuterSize, setSelectedOuterSize] = useState('L');

  const [isAdded, setIsAdded] = useState(false);

  const selectedTop = topsList[topIndex % topsList.length] || null;
  const selectedBottom = bottomsList[bottomIndex % bottomsList.length] || null;
  const selectedOuter = outerwearList[outerIndex % outerwearList.length] || null;

  // Kalkulasi bundling diskon 15%
  const pricing = useMemo(() => {
    const rawTotal = (selectedTop?.price || 0) + (selectedBottom?.price || 0) + (selectedOuter?.price || 0);
    const discountAmount = Math.round(rawTotal * 0.15);
    const bundleTotal = rawTotal - discountAmount;
    return {
      rawTotal,
      discountAmount,
      bundleTotal,
    };
  }, [selectedTop, selectedBottom, selectedOuter]);

  if (!selectedTop || !selectedBottom || !selectedOuter) return null;

  const handlePrevTop = () => setTopIndex((prev) => (prev > 0 ? prev - 1 : topsList.length - 1));
  const handleNextTop = () => setTopIndex((prev) => (prev + 1) % topsList.length);

  const handlePrevBottom = () => setBottomIndex((prev) => (prev > 0 ? prev - 1 : bottomsList.length - 1));
  const handleNextBottom = () => setBottomIndex((prev) => (prev + 1) % bottomsList.length);

  const handlePrevOuter = () => setOuterIndex((prev) => (prev > 0 ? prev - 1 : outerwearList.length - 1));
  const handleNextOuter = () => setOuterIndex((prev) => (prev + 1) % outerwearList.length);

  const handleAddToCart = () => {
    const bundleItems = [
      {
        product: selectedTop,
        size: selectedTopSize,
        colorName: selectedTop.colors[0]?.name || 'Standard',
        quantity: 1,
      },
      {
        product: selectedBottom,
        size: selectedBottomSize,
        colorName: selectedBottom.colors[0]?.name || 'Standard',
        quantity: 1,
      },
      {
        product: selectedOuter,
        size: selectedOuterSize,
        colorName: selectedOuter.colors[0]?.name || 'Standard',
        quantity: 1,
      },
    ];

    onAddBundleToCart(bundleItems);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2500);
  };

  return (
    <section id="capsule-wardrobe" className="bg-[#FAFAFA] border-y border-zinc-200 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Seksi */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 pb-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#E60012] text-white text-[9px] font-black uppercase tracking-widest mb-2">
              <Sparkles size={11} />
              <span>CAPSULE WARDROBE OOTD STUDIO (FR-31)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950">
              Interactive Capsule Outfit Builder
            </h2>
            <p className="text-xs text-zinc-500 mt-1 max-w-2xl">
              Padu padankan 3 esensial pakaian LifeWear (Atasan, Bawahan, dan Luaran) dalam satu kanvas interaktif. Dapatkan potongan paket bundling 15% otomatis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
              3-PIECE CAPSULE BUNDLE
            </span>
          </div>
        </div>

        {/* Studio Kanvas 3 Lapis Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Kolom Kiri: 3 Carousel Layer Pakaian */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            
            {/* 1. LAYER ATASAN (TOPS) */}
            <div className="bg-white border border-zinc-200 p-3 sm:p-4 rounded-none flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  LAYER 1: ATASAN
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-900">
                  {topIndex + 1}/{topsList.length}
                </span>
              </div>

              {/* Foto Visual + Carousel Controls */}
              <div className="relative aspect-[3/4] bg-[#F6F6F6] my-3 overflow-hidden rounded-none group">
                <img
                  src={getOptimizedImageUrl(selectedTop.image_url, 450, 75)}
                  alt={selectedTop.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handlePrevTop}
                  className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white text-zinc-900 border border-zinc-300 transition-colors cursor-pointer"
                  aria-label="Atasan sebelumnya"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNextTop}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white text-zinc-900 border border-zinc-300 transition-colors cursor-pointer"
                  aria-label="Atasan berikutnya"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Info Produk */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-zinc-950 line-clamp-2 min-h-[32px]">
                  {selectedTop.name}
                </h4>
                <p className="font-mono text-xs font-black text-zinc-900">
                  Rp {selectedTop.price.toLocaleString('id-ID')}
                </p>

                {/* Size Selector */}
                <div className="flex items-center gap-1 pt-1">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase mr-1">Size:</span>
                  {selectedTop.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedTopSize(s)}
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border cursor-pointer ${
                        selectedTopSize === s ? 'border-zinc-950 bg-zinc-950 text-white' : 'border-zinc-300 text-zinc-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. LAYER BAWAHAN (BOTTOMS) */}
            <div className="bg-white border border-zinc-200 p-3 sm:p-4 rounded-none flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  LAYER 2: BAWAHAN
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-900">
                  {bottomIndex + 1}/{bottomsList.length}
                </span>
              </div>

              {/* Foto Visual + Carousel Controls */}
              <div className="relative aspect-[3/4] bg-[#F6F6F6] my-3 overflow-hidden rounded-none group">
                <img
                  src={getOptimizedImageUrl(selectedBottom.image_url, 450, 75)}
                  alt={selectedBottom.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handlePrevBottom}
                  className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white text-zinc-900 border border-zinc-300 transition-colors cursor-pointer"
                  aria-label="Bawahan sebelumnya"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNextBottom}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white text-zinc-900 border border-zinc-300 transition-colors cursor-pointer"
                  aria-label="Bawahan berikutnya"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Info Produk */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-zinc-950 line-clamp-2 min-h-[32px]">
                  {selectedBottom.name}
                </h4>
                <p className="font-mono text-xs font-black text-zinc-900">
                  Rp {selectedBottom.price.toLocaleString('id-ID')}
                </p>

                {/* Size Selector */}
                <div className="flex items-center gap-1 pt-1">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase mr-1">Size:</span>
                  {selectedBottom.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedBottomSize(s)}
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border cursor-pointer ${
                        selectedBottomSize === s ? 'border-zinc-950 bg-zinc-950 text-white' : 'border-zinc-300 text-zinc-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. LAYER LUARAN (OUTERWEAR) */}
            <div className="bg-white border border-zinc-200 p-3 sm:p-4 rounded-none flex flex-col justify-between shadow-xs">
              <div className="flex items-center justify-between pb-2 border-b border-zinc-100">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400">
                  LAYER 3: LUARAN
                </span>
                <span className="text-[10px] font-mono font-bold text-zinc-900">
                  {outerIndex + 1}/{outerwearList.length}
                </span>
              </div>

              {/* Foto Visual + Carousel Controls */}
              <div className="relative aspect-[3/4] bg-[#F6F6F6] my-3 overflow-hidden rounded-none group">
                <img
                  src={getOptimizedImageUrl(selectedOuter.image_url, 450, 75)}
                  alt={selectedOuter.name}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={handlePrevOuter}
                  className="absolute left-1 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white text-zinc-900 border border-zinc-300 transition-colors cursor-pointer"
                  aria-label="Luaran sebelumnya"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  type="button"
                  onClick={handleNextOuter}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-1.5 bg-white/80 hover:bg-white text-zinc-900 border border-zinc-300 transition-colors cursor-pointer"
                  aria-label="Luaran berikutnya"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Info Produk */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold uppercase text-zinc-950 line-clamp-2 min-h-[32px]">
                  {selectedOuter.name}
                </h4>
                <p className="font-mono text-xs font-black text-zinc-900">
                  Rp {selectedOuter.price.toLocaleString('id-ID')}
                </p>

                {/* Size Selector */}
                <div className="flex items-center gap-1 pt-1">
                  <span className="text-[10px] text-zinc-400 font-bold uppercase mr-1">Size:</span>
                  {selectedOuter.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSelectedOuterSize(s)}
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 border cursor-pointer ${
                        selectedOuterSize === s ? 'border-zinc-950 bg-zinc-950 text-white' : 'border-zinc-300 text-zinc-700'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Kolom Kanan: Rekapitulasi Bundling 1-Klik */}
          <div className="lg:col-span-4 bg-white border border-zinc-300 p-5 sm:p-6 rounded-none space-y-5 shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-[#E60012] uppercase tracking-widest block">
                PAKET OOTD LENGKAP 3-IN-1
              </span>
              <h3 className="text-lg font-black uppercase text-zinc-950">
                Ringkasan Bundling OOTD
              </h3>
              <p className="text-xs text-zinc-500">
                Dapatkan 3 pakaian esensial LifeWear yang serasi dengan potongan langsung 15%.
              </p>
            </div>

            {/* List item yang dipilih */}
            <div className="space-y-2.5 border-y border-zinc-200 py-4 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 line-clamp-1 pr-2">
                  1. {selectedTop.name} ({selectedTopSize})
                </span>
                <span className="font-mono font-bold text-zinc-900 shrink-0">
                  Rp {selectedTop.price.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 line-clamp-1 pr-2">
                  2. {selectedBottom.name} ({selectedBottomSize})
                </span>
                <span className="font-mono font-bold text-zinc-900 shrink-0">
                  Rp {selectedBottom.price.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-zinc-600 line-clamp-1 pr-2">
                  3. {selectedOuter.name} ({selectedOuterSize})
                </span>
                <span className="font-mono font-bold text-zinc-900 shrink-0">
                  Rp {selectedOuter.price.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Rincian Harga & Diskon */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Harga Normal 3 Item:</span>
                <span className="font-mono line-through">
                  Rp {pricing.rawTotal.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-[#E60012] font-bold">
                <span>Diskon Bundling 15%:</span>
                <span className="font-mono">
                  - Rp {pricing.discountAmount.toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between items-baseline pt-2 border-t border-zinc-200">
                <span className="text-sm font-black uppercase text-zinc-950">
                  Total Bundling Set:
                </span>
                <span className="text-xl font-mono font-black text-[#E60012]">
                  Rp {pricing.bundleTotal.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* CTA Tambah Bundling ke Keranjang */}
            <button
              type="button"
              onClick={handleAddToCart}
              className="w-full py-3.5 bg-[#111111] hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none shadow-sm cursor-pointer"
            >
              {isAdded ? (
                <>
                  <Check size={16} className="text-emerald-400" />
                  <span>3 ITEM MASUK KE TAS BELANJA!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={16} />
                  <span>+ MASUKKAN 1 SET OOTD (HEMAT 15%)</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
