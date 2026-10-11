// components/navbar/VisualMegaMenu.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, Search, Globe } from 'lucide-react';
import { VISUAL_MENU_ITEMS, VisualCategoryItem } from '@/lib/constants/visualMegaMenu';

interface VisualMegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeGender: 'wanita' | 'pria' | 'anak' | 'bayi';
  onSelectGender: (gender: string) => void;
  onSelectCategory: (categorySlug: string) => void;
  onSearchChange: (query: string) => void;
}

export default function VisualMegaMenu({
  isOpen,
  onClose,
  activeGender: initialGender,
  onSelectGender,
  onSelectCategory,
  onSearchChange,
}: VisualMegaMenuProps) {
  const [currentDept, setCurrentDept] = useState<'wanita' | 'pria' | 'anak' | 'bayi'>('wanita');
  const [localSearch, setLocalSearch] = useState('');

  useEffect(() => {
    if (initialGender === 'pria' || initialGender === 'wanita' || initialGender === 'anak' || initialGender === 'bayi') {
      setCurrentDept(initialGender);
    }
  }, [initialGender]);

  // Lock body scroll when mega menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const items: VisualCategoryItem[] = VISUAL_MENU_ITEMS[currentDept] || VISUAL_MENU_ITEMS.wanita;

  const handleCategoryClick = (item: VisualCategoryItem) => {
    onSelectGender(item.gender);
    onSelectCategory(item.categorySlug);
    if (item.searchKeyword) {
      onSearchChange(item.searchKeyword);
    }
    onClose();
    setTimeout(() => {
      document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
    }, 80);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      onSearchChange(localSearch.trim());
      onClose();
      setTimeout(() => {
        document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    }
  };

  const departments: Array<{ id: 'wanita' | 'pria' | 'anak' | 'bayi'; label: string }> = [
    { id: 'wanita', label: 'WANITA' },
    { id: 'pria', label: 'PRIA' },
    { id: 'anak', label: 'ANAK' },
    { id: 'bayi', label: 'BAYI' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
      />

      {/* Full-Width Mega Menu Content Panel */}
      <div className="relative z-10 bg-white border-b border-zinc-300 shadow-2xl max-h-[92vh] flex flex-col overflow-y-auto">
        {/* TOP HEADER ROW: Logo, Department Tabs, Language & Close Button */}
        <div className="border-b border-zinc-200 bg-white sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
            {/* Left: Dual Box Uniqlo Logo & Department Tabs */}
            <div className="flex items-center gap-6 sm:gap-10 h-full">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center gap-1 shrink-0"
                title="UrbanStyle LifeWear"
              >
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#E60012] text-white font-black text-xs sm:text-sm tracking-tighter flex items-center justify-center shadow-xs rounded-none">
                  US
                </div>
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#E60012] text-white font-black text-[9px] sm:text-[10px] tracking-tight flex items-center justify-center leading-none text-center shadow-xs font-sans rounded-none">
                  アー<br />バン
                </div>
              </Link>

              {/* Department Tabs: WANITA, PRIA, ANAK, BAYI */}
              <nav className="flex items-center gap-6 sm:gap-8 h-full">
                {departments.map((dept) => {
                  const isActive = currentDept === dept.id;
                  return (
                    <button
                      key={dept.id}
                      type="button"
                      onClick={() => setCurrentDept(dept.id)}
                      className={`h-full text-sm sm:text-base tracking-wider uppercase transition-all relative flex items-center cursor-pointer ${
                        isActive
                          ? 'text-zinc-950 font-black'
                          : 'text-zinc-500 hover:text-zinc-950 font-bold'
                      }`}
                    >
                      <span>{dept.label}</span>
                      {isActive && (
                        <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-zinc-950" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right: Language indicator (ID ID) & Close Button (X) */}
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="hidden sm:flex items-center gap-1.5 text-zinc-700 text-xs font-bold uppercase">
                <Globe size={16} className="text-zinc-800" />
                <span>ID ID</span>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 text-zinc-500 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer rounded-none"
                aria-label="Tutup Menu"
                title="Tutup Menu"
              >
                <X size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH CAPSULE ROW: "Apa yang Anda cari?" */}
        <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 pt-5 pb-2">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Apa yang Anda cari?"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-6 pr-12 py-3 sm:py-3.5 text-xs sm:text-sm font-medium rounded-full bg-white border border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-zinc-950 focus:ring-1 focus:ring-zinc-950 shadow-xs transition-all"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-950 transition-colors cursor-pointer"
              title="Cari"
            >
              <Search size={18} />
            </button>
          </form>
        </div>

        {/* 6-COLUMN VISUAL CATEGORY GRID */}
        <div className="max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-6 sm:gap-y-8">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleCategoryClick(item)}
                className="group flex flex-col items-center text-center cursor-pointer p-1 transition-transform hover:-translate-y-0.5"
                title={`Koleksi ${item.name}`}
              >
                {/* Isolated Cutout Product Image Container */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 flex items-center justify-center mb-2 overflow-hidden bg-white">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    loading="lazy"
                    className="max-h-full max-w-full object-contain transition-transform duration-200 group-hover:scale-105"
                  />
                </div>

                {/* Category Typography Label */}
                <span className="text-[11px] sm:text-xs text-zinc-800 group-hover:text-black group-hover:underline leading-snug line-clamp-2 max-w-[110px] text-center font-normal">
                  {item.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Bottom Helper Bar */}
        <div className="border-t border-zinc-200 bg-zinc-50 py-3 px-4 text-center text-[11px] text-zinc-500 font-mono uppercase tracking-wider">
          LifeWear Esensial Tokyo // Pilih Kategori untuk Menyaring Katalog Penuh
        </div>
      </div>
    </div>
  );
}
