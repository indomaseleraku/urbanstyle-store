// components/pdp/ProductGallery.tsx
'use client';

import React from 'react';
import { getOptimizedImageUrl } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  activeImageIndex: number;
  onSelectImage: (index: number) => void;
  productName: string;
}

export default function ProductGallery({
  images,
  activeImageIndex,
  onSelectImage,
  productName,
}: ProductGalleryProps) {
  const currentImage = images[activeImageIndex] || images[0];

  return (
    <div className="space-y-3">
      {/* Main 3:4 Frame */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F6F6F6] border border-zinc-200 rounded-none group">
        <img
          src={getOptimizedImageUrl(currentImage, 800, 85)}
          alt={productName}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="eager"
        />
      </div>

      {/* Thumbnails Row */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectImage(idx)}
              className={`relative aspect-[3/4] w-14 sm:w-16 shrink-0 overflow-hidden bg-[#F6F6F6] border transition-all rounded-none cursor-pointer ${
                activeImageIndex === idx
                  ? 'border-zinc-950 ring-1 ring-zinc-950'
                  : 'border-zinc-200 opacity-70 hover:opacity-100'
              }`}
              title={`Foto ${idx + 1}`}
            >
              <img
                src={getOptimizedImageUrl(img, 120, 70)}
                alt={`${productName} thumbnail ${idx + 1}`}
                className="w-full h-full object-cover object-center"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
