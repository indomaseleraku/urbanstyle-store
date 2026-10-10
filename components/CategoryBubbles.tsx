// components/CategoryBubbles.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';

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
    <section className="w-full bg-[#FAFAFA] border-b border-zinc-200 py-6 sm:py-8 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-[#E60012] rounded-none" />
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

        {/* Modular Sharp Story Tiles (Zero Radius rounded-none) */}
        <div className="flex items-center justify-start sm:justify-center gap-4 sm:gap-6 overflow-x-auto no-scrollbar py-2 px-1 -mx-4 sm:mx-0 snap-x">
          {CATEGORY_TILES.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <motion.button
                whileTap={{ scale: 0.96 }}
                key={cat.id}
                type="button"
                onClick={() => handleClick(cat.slug)}
                className="group flex-shrink-0 flex flex-col items-center focus:outline-none snap-start cursor-pointer"
              >
                {/* 3:4 or 1:1 Square Frame with Zero Radius */}
                <div
                  className={`relative w-20 h-24 sm:w-24 sm:h-28 border-2 transition-all duration-300 rounded-none bg-[#F6F6F6] overflow-hidden ${
                    isActive
                      ? 'border-[#E60012] ring-2 ring-[#E60012]/30 scale-105 shadow-sm'
                      : cat.isSpecial
                      ? 'border-red-400 hover:border-[#E60012] hover:scale-105'
                      : 'border-zinc-200 hover:border-zinc-950 hover:scale-105'
                  }`}
                >
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500 rounded-none"
                    loading="lazy"
                  />

                  {cat.isSpecial && (
                    <span className="absolute top-1 right-1 bg-[#E60012] text-white text-[8px] font-black uppercase tracking-widest px-1 py-0.5 rounded-none shadow-xs">
                      HOT
                    </span>
                  )}
                </div>

                {/* Text Label Below Tile */}
                <div className="text-center mt-2 max-w-[105px] sm:max-w-[125px] px-1">
                  <h4
                    className={`text-[11px] sm:text-xs font-black uppercase tracking-tight leading-tight transition-colors ${
                      isActive
                        ? 'text-[#E60012]'
                        : 'text-zinc-900 group-hover:text-[#E60012]'
                    }`}
                  >
                    {cat.name}
                  </h4>
                  <p className="text-[9px] sm:text-[10px] text-zinc-500 font-medium truncate mt-0.5">
                    {cat.tagline}
                  </p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
