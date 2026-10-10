// components/pdp/ProductInfo.tsx
'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductInfoProps {
  product: Product;
}

export default function ProductInfo({ product }: ProductInfoProps) {
  const hasDiscount = Boolean(product.original_price && product.original_price > product.price);

  return (
    <div className="space-y-3">
      {/* Category & Badge */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-[#757575]">
          {product.gender?.toUpperCase() || 'UNISEX'} • {product.category_name || 'LIFEWEAR'}
        </span>
        {hasDiscount ? (
          <span className="bg-[#E60012] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-none">
            LIMITED OFFER
          </span>
        ) : product.is_new ? (
          <span className="bg-[#111111] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-none">
            NEW
          </span>
        ) : null}
      </div>

      {/* Product Title */}
      <h1 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-[#111111] leading-tight">
        {product.name}
      </h1>

      {/* Ratings */}
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center text-amber-500">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={13}
              className={i < Math.floor(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-zinc-200'}
            />
          ))}
        </div>
        <span className="font-mono font-bold text-[#111111] tabular-nums">
          {(product.rating || 5.0).toFixed(1)}
        </span>
        <span className="text-[#757575] font-mono tabular-nums">
          ({product.reviews_count || 12} Ulasan)
        </span>
      </div>

      {/* Price Block: Tabular Numbers Monospaced */}
      <div className="flex items-baseline gap-3 pt-1 border-b border-[#E5E5E5] pb-4">
        {hasDiscount ? (
          <>
            <span className="text-xl sm:text-2xl font-bold font-mono text-[#E60012] tabular-nums">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            <span className="text-xs sm:text-sm font-mono text-[#757575] line-through tabular-nums">
              Rp {product.original_price?.toLocaleString('id-ID')}
            </span>
          </>
        ) : (
          <span className="text-xl sm:text-2xl font-bold font-mono text-[#111111] tabular-nums">
            Rp {product.price.toLocaleString('id-ID')}
          </span>
        )}
      </div>
    </div>
  );
}
