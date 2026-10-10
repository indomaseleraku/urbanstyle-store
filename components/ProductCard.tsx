// components/ProductCard.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { getOptimizedImageUrl } from '@/lib/utils';
import { Heart, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onOpenDetail?: (product: Product) => void;
  onAddToCart?: (product: Product, size: string, colorName: string) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export default function ProductCard({
  product,
  onOpenDetail,
  isWishlisted,
  onToggleWishlist,
}: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);

  const currentColor = product.colors[selectedColorIndex] || {
    name: 'Standard',
    code: '09 BLACK',
    hex: '#000000',
    image_url: product.image_url,
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onToggleWishlist(product);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (onOpenDetail) {
      onOpenDetail(product);
    }
  };

  const hasDiscount = Boolean(product.original_price && product.original_price > product.price);

  return (
    <div className="group border-none bg-transparent rounded-none transition-all duration-200 flex flex-col relative">
      
      {/* A. BLOK GAMBAR (Rasio 3:4) */}
      <div className="relative aspect-[3/4] overflow-hidden bg-[#F6F6F6] rounded-none">
        <Link href={`/product/${product.id}`} className="block w-full h-full">
          <img
            src={getOptimizedImageUrl(currentColor.image_url, 450, 75)}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-[1.03] transition-transform duration-500"
            loading="lazy"
          />
        </Link>

        {/* Pojok kiri atas: Hanya 1 badge tipis jika ada promo (LIMITED OFFER atau NEW) */}
        {hasDiscount ? (
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span className="bg-[#E60012] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-none shadow-xs">
              LIMITED OFFER
            </span>
          </div>
        ) : product.is_new ? (
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            <span className="bg-[#111111] text-white text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-none shadow-xs">
              NEW
            </span>
          </div>
        ) : null}

        {/* Pojok kanan atas: Tombol icon Wishlist outline tipis transparan (Heart) */}
        <div className="absolute top-2 right-2 z-10">
          <button
            type="button"
            onClick={handleWishlist}
            className={`p-1.5 rounded-none transition-all duration-200 cursor-pointer ${
              isWishlisted
                ? 'text-[#E60012] bg-white/80'
                : 'text-zinc-500 hover:text-[#E60012] bg-white/50 hover:bg-white/80'
            }`}
            title={isWishlisted ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
            aria-label="Wishlist"
          >
            <Heart
              size={17}
              strokeWidth={1.5}
              fill={isWishlisted ? '#E60012' : 'none'}
            />
          </button>
        </div>

        {/* Efek Hover: Tombol Quick View semi-transparan muncul lembut di bagian bawah foto */}
        {onOpenDetail && (
          <button
            type="button"
            onClick={handleQuickView}
            className="absolute inset-x-0 bottom-0 py-2.5 bg-black/60 hover:bg-black/80 backdrop-blur-xs text-white text-[10px] font-bold uppercase tracking-wider text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-1.5 z-10 cursor-pointer"
          >
            <Eye size={13} />
            <span>Lihat Cepat (Quick View)</span>
          </button>
        )}
      </div>

      {/* B. BLOK INFORMASI DI BAWAH FOTO (Airy & Clean) */}
      <div className="pt-3 space-y-1.5 flex flex-col">
        {/* Baris 1: Swatch warna lingkaran mini (diameter 12px-14px) rapi berjajar */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1.5 flex-wrap">
              {product.colors.map((c, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    setSelectedColorIndex(idx);
                  }}
                  className="p-0.5 transition-all flex items-center justify-center cursor-pointer"
                  title={`Warna: ${c.code || c.name}`}
                  aria-label={c.code || c.name}
                >
                  <span
                    className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border transition-all block ${
                      selectedColorIndex === idx
                        ? 'ring-1 ring-zinc-950 ring-offset-1 scale-105 border-zinc-400'
                        : 'border-zinc-300 opacity-80 hover:opacity-100 hover:scale-105'
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
        )}

        {/* Baris 2: Kategori & Gender halus (contoh: "PRIA • Kemeja & Flannel") */}
        <div className="text-zinc-500 text-[11px] font-medium uppercase tracking-wider truncate">
          {product.gender ? product.gender.toUpperCase() : 'UNISEX'}
          {product.category_name ? ` • ${product.category_name}` : ''}
        </div>

        {/* Baris 3: Nama Produk (font-medium text-xs sm:text-sm text-zinc-950 line-clamp-2 leading-snug group-hover:text-[#E60012] transition-colors) */}
        <Link href={`/product/${product.id}`} className="block">
          <h3 className="font-medium text-xs sm:text-sm text-zinc-950 line-clamp-2 leading-snug group-hover:text-[#E60012] transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Baris 4: Blok Harga */}
        <div className="flex items-baseline gap-1.5 flex-wrap pt-0.5">
          {hasDiscount ? (
            <>
              <span className="text-[#E60012] font-mono font-bold text-sm sm:text-base">
                Rp {product.price.toLocaleString('id-ID')}
              </span>
              <span className="text-zinc-400 line-through text-xs font-mono">
                Rp {product.original_price?.toLocaleString('id-ID')}
              </span>
            </>
          ) : (
            <span className="text-zinc-950 font-mono font-bold text-sm sm:text-base">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
          )}
        </div>

        {/* Baris 5: Rating Bintang halus (bintang amber 10px + angka rating "★ 4.8" dan ulasan "(24)") */}
        <div className="flex items-center gap-1 text-[11px] text-zinc-400 pt-0.5">
          <Star size={10} className="fill-amber-400 text-amber-400 shrink-0" />
          <span className="font-medium text-zinc-700 font-mono">
            {(product.rating || 4.8).toFixed(1)}
          </span>
          <span className="text-zinc-400 font-mono">
            ({product.reviews_count || 12})
          </span>
        </div>
      </div>

    </div>
  );
}
