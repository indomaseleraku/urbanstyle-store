// components/CategoryBubbles.tsx
'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';

interface CategoryTile {
  id: string;
  name: string;
  tagline: string;
  slug: string;
  imageUrl: string;
  isSpecial?: boolean;
}

const CATEGORY_TILES: CategoryTile[] = [
  {
    id: 'kemeja',
    name: 'Kemeja',
    tagline: 'Flannel & Katun',
    slug: 'kemeja',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'kaos',
    name: 'Kaos & AIRism',
    tagline: 'Sejuk 280 GSM',
    slug: 'kaos',
    imageUrl: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'celana',
    name: 'Celana Chino',
    tagline: 'Ultra Stretch',
    slug: 'celana',
    imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'jaket',
    name: 'Jaket & Outer',
    tagline: 'Proteksi UV',
    slug: 'jaket',
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'sale',
    name: 'Limited Offer 🔥',
    tagline: 'Hemat s/d 30%',
    slug: 'sale',
    imageUrl: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=400&q=80',
    isSpecial: true,
  },
];

interface CategoryBubblesProps {
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  onScrollToCatalog?: () => void;
}

export default function CategoryBubbles({
  selectedCategory,
  onSelectCategory,
  onScrollToCatalog,
}: CategoryBubblesProps) {
  const handleClick = (slug: string) => {
    onSelectCategory(slug);
    if (onScrollToCatalog) {
      onScrollToCatalog();
    }
  };

  return (
    <section className="w-full bg-[#FAFAFA] border-b border-zinc-200 py-6 sm:py-8 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#E60012]" />
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-zinc-950">
              Kategori Cerita LifeWear
            </h3>
            <span className="text-[10px] text-zinc-400 font-mono hidden sm:inline">
              // STORIES & COLLECTIONS
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest hidden sm:inline">
            Pilih kategori untuk melihat koleksi
          </span>
        </div>

        {/* Circular Story Bubbles Container (Swipeable on Mobile, Centered on Desktop) */}
        <div className="flex items-center justify-start sm:justify-center gap-5 sm:gap-8 md:gap-10 overflow-x-auto no-scrollbar py-2 px-2 -mx-4 sm:mx-0 snap-x">
          {CATEGORY_TILES.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleClick(cat.slug)}
                className="group flex-shrink-0 flex flex-col items-center focus:outline-none snap-start cursor-pointer transition-transform"
              >
                {/* 1:1 Circular Avatar with Thin Border / Red Ring */}
                <div
                  className={`relative w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 rounded-full p-1 border-2 transition-all duration-300 ${
                    isActive
                      ? 'border-[#E60012] ring-4 ring-[#E60012]/20 scale-105 shadow-md'
                      : cat.isSpecial
                      ? 'border-red-400 hover:border-[#E60012] hover:scale-105'
                      : 'border-zinc-200 hover:border-zinc-950 hover:scale-105'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-zinc-100">
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>

                  {cat.isSpecial && (
                    <span className="absolute -top-1 -right-1 bg-[#E60012] text-white text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-full shadow-xs">
                      HOT
                    </span>
                  )}
                </div>

                {/* Text Label Below Circle */}
                <div className="text-center mt-2.5 max-w-[105px] sm:max-w-[125px] px-1">
                  <h4
                    className={`text-xs font-black uppercase tracking-tight leading-tight transition-colors ${
                      isActive
                        ? 'text-[#E60012]'
                        : 'text-zinc-900 group-hover:text-[#E60012]'
                    }`}
                  >
                    {cat.name}
                  </h4>
                  <p className="text-[10px] text-zinc-500 font-medium truncate mt-0.5">
                    {cat.tagline}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
