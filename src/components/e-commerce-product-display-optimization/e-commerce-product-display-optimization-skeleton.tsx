// src/components/e-commerce-product-display-optimization/e-commerce-product-display-optimization-skeleton.tsx
'use client';

import React from 'react';

export function ProductDisplayOptimizationSkeletonItem() {
  return (
    <div className="border-none bg-transparent rounded-none flex flex-col relative animate-pulse">
      {/* 1. Placeholder Gambar Rasio 3:4 */}
      <div className="relative aspect-[3/4] bg-zinc-200 overflow-hidden rounded-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full animate-[shimmer_1.6s_infinite]" />
      </div>

      {/* 2. Informasi Produk */}
      <div className="pt-3 space-y-2 flex flex-col">
        {/* Swatch dots */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-zinc-200" />
            <span className="w-3 h-3 rounded-full bg-zinc-200" />
            <span className="w-3 h-3 rounded-full bg-zinc-200" />
          </div>
          <span className="h-2.5 w-12 bg-zinc-200" />
        </div>

        {/* Gender / Kategori */}
        <div className="h-2.5 w-24 bg-zinc-200" />

        {/* Nama Produk */}
        <div className="space-y-1">
          <div className="h-3.5 w-full bg-zinc-200" />
          <div className="h-3.5 w-3/4 bg-zinc-200" />
        </div>

        {/* Harga */}
        <div className="flex items-center gap-2 pt-0.5">
          <div className="h-4 w-20 bg-zinc-200" />
          <div className="h-3 w-14 bg-zinc-200" />
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 pt-0.5">
          <div className="h-2.5 w-2.5 bg-zinc-200" />
          <div className="h-2.5 w-16 bg-zinc-200" />
        </div>
      </div>
    </div>
  );
}

export default function ProductDisplayOptimizationSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductDisplayOptimizationSkeletonItem key={idx} />
      ))}
    </div>
  );
}
