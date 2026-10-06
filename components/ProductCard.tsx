// components/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { getOptimizedImageUrl } from '@/lib/utils';
import { ShoppingBag, Check, Heart, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail: (product: Product) => void;
  onAddToCart: (product: Product, size: string, colorName: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export default function ProductCard({
  product,
  onOpenDetail,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [isAdded, setIsAdded] = useState(false);

  const currentColor = product.colors[selectedColorIndex] || {
    name: 'Standard',
    code: '09 BLACK',
    hex: '#000000',
    image_url: product.image_url,
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (product.stock <= 0) return;
    onAddToCart(product, selectedSize, currentColor.name);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onOpenDetail(product);
  };

  // Status Stok SIM (Safety Stock Threshold)
  const isOutOfStock = product.stock <= 0;
  const isCriticalStock = product.stock > 0 && product.stock <= 5;
  const isLowStock = product.stock > 5 && product.stock <= 15;
  const isSafeStock = product.stock > 15;
  const hasDiscount = Boolean(product.original_price && product.original_price > product.price);

  return (
    <div className="group bg-white border border-zinc-200 hover:border-zinc-950 rounded-none transition-all duration-200 flex flex-col justify-between relative">
      
      {/* 1. Image Container with Direct Link to PDP */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F6F6F6]">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={getOptimizedImageUrl(currentColor.image_url, 450, 75)}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-103 transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Top Badges (Uniqlo Red & New tags) - Sharp 90 deg */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 pointer-events-none">
          {product.is_new && (
            <span className="bg-[#111111] text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none shadow-xs">
              NEW
            </span>
          )}
          {hasDiscount && (
            <span className="bg-[#E60012] text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none shadow-xs">
              LIMITED OFFER
            </span>
          )}
        </div>

        {/* Top Right Wishlist & Stock */}
        <div className="absolute top-2 right-2 z-10 flex flex-col gap-1.5 items-end">
          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlist}
            className={`p-2 border rounded-none transition-all ${
              isWishlisted
                ? 'bg-[#E60012] border-[#E60012] text-white shadow-sm'
                : 'bg-white/90 border-zinc-300 text-zinc-700 hover:text-[#E60012] hover:bg-white'
            }`}
            title={isWishlisted ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
            aria-label="Wishlist"
          >
            <Heart size={15} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* SIM Stock Status Badge */}
          {isOutOfStock && (
            <span className="bg-zinc-900 text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider rounded-none">
              HABIS
            </span>
          )}
          {isCriticalStock && (
            <span className="bg-[#E60012] text-white text-[9px] font-bold px-2 py-0.5 uppercase tracking-wider flex items-center gap-1 shadow-sm animate-pulse rounded-none">
              <span className="w-1.5 h-1.5 bg-white" />
              <span>Sisa {product.stock}!</span>
            </span>
          )}
          {isLowStock && (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-[9px] font-semibold px-2 py-0.5 uppercase tracking-wider rounded-none">
              Sisa {product.stock}
            </span>
          )}
          {isSafeStock && (
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[9px] font-semibold px-2 py-0.5 uppercase tracking-wider rounded-none">
              Tersedia ({product.stock})
            </span>
          )}
        </div>

        {/* Quick View Floating Overlay on Hover */}
        <button
          type="button"
          onClick={handleQuickView}
          className="absolute inset-x-0 bottom-0 py-2.5 bg-black/75 hover:bg-black text-white text-[10px] font-bold uppercase tracking-wider text-center opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 z-10"
        >
          <Eye size={12} />
          <span>Lihat Cepat (Quick View)</span>
        </button>

      </div>

      {/* 2. Product Details */}
      <div className="p-3 sm:p-3.5 space-y-2.5 flex flex-col justify-between flex-1">
        
        <div className="space-y-2">
          {/* A. Color Swatch Row (Directly below photo, Uniqlo Reference) */}
          <div className="flex items-center justify-between gap-1 pt-0.5">
            <div className="flex items-center gap-1 flex-wrap">
              {product.colors.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedColorIndex(idx);
                  }}
                  className="p-0.5 transition-all flex items-center justify-center"
                  title={`Warna: ${c.code || c.name}`}
                  aria-label={c.code || c.name}
                >
                  <span
                    className={`w-3.5 h-3.5 sm:w-4 sm:h-4 border transition-all block ${
                      selectedColorIndex === idx 
                        ? 'ring-1 ring-zinc-950 scale-110 border-white' 
                        : 'border-zinc-300 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                </button>
              ))}
            </div>
            <span className="text-[10px] text-zinc-400 font-mono shrink-0">
              {product.colors.length} Warna
            </span>
          </div>

          {/* B. Gender & Category Tag */}
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
            <span>
              {product.gender ? product.gender.toUpperCase() : 'UNISEX'} • {product.category_name}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-mono">
              <Star size={10} fill="currentColor" />
              <span className="text-zinc-700">{product.rating || 4.8}</span>
              <span className="text-zinc-400">({product.reviews_count || 12})</span>
            </div>
          </div>

          {/* C. Product Title (Direct Link to PDP) */}
          <Link href={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-xs sm:text-sm text-zinc-950 line-clamp-2 uppercase tracking-tight group-hover:text-[#E60012] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* D. Price Block (Uniqlo Red for discount, jet black for normal) */}
          <div className="flex items-baseline gap-1.5 pt-0.5 flex-wrap">
            <span className={`font-mono font-black text-xs sm:text-base ${hasDiscount ? 'text-[#E60012]' : 'text-zinc-950'}`}>
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            {hasDiscount && (
              <span className="font-mono text-[11px] sm:text-xs text-zinc-400 line-through">
                Rp {product.original_price?.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          {/* E. Size Availability Indicator */}
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-mono pt-0.5">
            <span className="text-zinc-400 uppercase">Ukuran:</span>
            <div className="flex items-center gap-1">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(s);
                  }}
                  className={`px-1.5 py-0.5 text-[9px] font-bold border transition-colors ${
                    selectedSize === s 
                      ? 'bg-zinc-950 text-white border-zinc-950' 
                      : 'bg-zinc-50 text-zinc-600 border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* F. Sleek Action Button (Uniqlo Sharp Industrial) */}
        <div className="pt-2 border-t border-zinc-100">
          <button
            type="button"
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`w-full py-2.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider rounded-none transition-colors flex items-center justify-center gap-1.5 min-h-[38px] ${
              isAdded 
                ? 'bg-emerald-600 text-white' 
                : isOutOfStock 
                ? 'bg-zinc-200 text-zinc-400 cursor-not-allowed' 
                : 'bg-zinc-950 hover:bg-[#E60012] text-white shadow-xs'
            }`}
          >
            {isAdded ? (
              <>
                <Check size={13} className="text-white" />
                <span>Masuk Tas Belanja</span>
              </>
            ) : isOutOfStock ? (
              <span>Stok Habis</span>
            ) : (
              <>
                <ShoppingBag size={13} />
                <span>+ Masuk Tas ({selectedSize})</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}
