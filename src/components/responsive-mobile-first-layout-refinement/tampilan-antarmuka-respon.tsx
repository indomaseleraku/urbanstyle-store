// src/components/responsive-mobile-first-layout-refinement/tampilan-antarmuka-respon.tsx
'use client';

import React, { useState } from 'react';
import { 
  Home, 
  Grid, 
  Heart, 
  ShoppingBag, 
  User, 
  ChevronRight, 
  Smartphone, 
  Tablet, 
  Monitor,
  Check,
  X,
  Sparkles
} from 'lucide-react';
import { MobileLayoutConfigInput } from '@/lib/validations/responsive-mobile-first-layout-refinement.schema';

interface TampilanAntarmukaResponProps {
  config: MobileLayoutConfigInput;
  cartCount?: number;
  wishlistCount?: number;
  onOpenCategorySheet?: () => void;
  onOpenCart?: () => void;
  onOpenWishlist?: () => void;
}

export default function TampilanAntarmukaRespon({
  config,
  cartCount = 2,
  wishlistCount = 3,
  onOpenCategorySheet,
  onOpenCart,
  onOpenWishlist,
}: TampilanAntarmukaResponProps) {
  const [activeTab, setActiveTab] = useState<'beranda' | 'kategori' | 'favorit' | 'keranjang' | 'akun'>('beranda');

  return (
    <div className="space-y-6">
      {/* Visual Header Penjelasan Ergonomi Mobile 1:1 */}
      <div className="p-4 sm:p-5 bg-zinc-50 border border-zinc-200 rounded-none space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 bg-[#E60012] text-white rounded-none">
              <Smartphone size={15} />
            </span>
            <h3 className="text-xs sm:text-sm font-black uppercase text-zinc-950">
              Arsitektur Navigasi Mobile-First (Thumb-Zone Ergonomics)
            </h3>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 uppercase">
            TARGET SENTUH &gt;= 48PX
          </span>
        </div>

        <p className="text-xs text-zinc-600 leading-relaxed">
          Dirancang untuk pengoperasian satu jempol (*one-thumb navigation*) pada ponsel berlayar besar. Menghilangkan ketergantungan pada menu burger sudut kiri atas yang sulit dijangkau.
        </p>

        {/* 3 Indikator Spesifikasi Ergonomi */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-200 text-xs">
          <div className="p-2.5 bg-white border border-zinc-200">
            <span className="text-[10px] text-zinc-400 uppercase font-mono block">Zona Jempol Bawah</span>
            <span className="font-bold font-mono text-zinc-950">Tinggi {config.thumbZoneHeightPx}px (5-Tab)</span>
          </div>
          <div className="p-2.5 bg-white border border-zinc-200">
            <span className="text-[10px] text-zinc-400 uppercase font-mono block">Ukuran Target Sentuh</span>
            <span className="font-bold font-mono text-zinc-950">Min. {config.touchTargetMinSizePx}px WCAG 2.1</span>
          </div>
          <div className="p-2.5 bg-white border border-zinc-200">
            <span className="text-[10px] text-zinc-400 uppercase font-mono block">Slide Sheet Kategori</span>
            <span className="font-bold font-mono text-[#E60012]">Transisi {config.categoryDrawerAnimation.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Simulator Antarmuka Mobile Phone Frame */}
      <div className="max-w-sm mx-auto bg-white border-2 border-zinc-950 shadow-2xl rounded-none overflow-hidden relative">
        {/* Top Status Bar Mockup */}
        <div className="bg-zinc-950 text-white px-4 py-2 flex items-center justify-between text-[11px] font-mono">
          <span>09:41</span>
          <div className="flex items-center gap-1.5">
            <span>5G</span>
            <span className="w-3 h-2 bg-emerald-400 inline-block" />
          </div>
        </div>

        {/* Top Minimalist Mobile Header */}
        <div className="p-3 border-b border-zinc-200 flex items-center justify-between bg-white">
          <div className="flex items-center gap-1.5">
            <span className="w-5 h-5 bg-[#E60012] text-white flex items-center justify-center font-black text-[10px]">
              US
            </span>
            <span className="text-xs font-black uppercase text-zinc-950">UrbanStyle</span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 uppercase">LifeWear</span>
        </div>

        {/* Interactive Category Horizontal Swipe Strip */}
        <div className="px-3 py-2 border-b border-zinc-100 flex items-center gap-2 overflow-x-auto text-[11px] font-bold uppercase no-scrollbar">
          {['Semua', 'Pria', 'Wanita', 'AIRism', 'Limited 🔥'].map((cat, idx) => (
            <span
              key={idx}
              className={`px-3 py-1 whitespace-nowrap border shrink-0 ${
                idx === 0
                  ? 'bg-zinc-950 text-white border-zinc-950'
                  : 'bg-zinc-50 text-zinc-700 border-zinc-200'
              }`}
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Mock Content Feed */}
        <div className="p-4 space-y-3 min-h-[280px] bg-[#FAFAFA]">
          <div className="aspect-[16/9] bg-zinc-200 flex items-center justify-center text-zinc-400 text-xs font-mono">
            [ HERO BANNER 2:1 MOBILE ]
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-2 bg-white border border-zinc-200 space-y-1">
              <div className="aspect-[3/4] bg-zinc-100" />
              <p className="text-[10px] font-bold uppercase line-clamp-1">Kemeja Flannel</p>
              <p className="text-[11px] font-mono font-bold text-[#E60012]">Rp 299.000</p>
            </div>
            <div className="p-2 bg-white border border-zinc-200 space-y-1">
              <div className="aspect-[3/4] bg-zinc-100" />
              <p className="text-[10px] font-bold uppercase line-clamp-1">Kaos AIRism</p>
              <p className="text-[11px] font-mono font-bold text-zinc-950">Rp 199.000</p>
            </div>
          </div>
        </div>

        {/* 5-Tab Sticky Bottom Thumb Bar Simulator (Wajib Uniqlo Mobile 1:1) */}
        <nav
          style={{ height: `${config.thumbZoneHeightPx}px` }}
          className="bg-white border-t border-zinc-200 flex items-center justify-around px-2 shadow-lg"
        >
          {/* Tab 1: Beranda */}
          <button
            type="button"
            onClick={() => setActiveTab('beranda')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
              activeTab === 'beranda' ? 'text-[#E60012] font-black' : 'text-zinc-600'
            }`}
          >
            <Home size={18} />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Beranda</span>
          </button>

          {/* Tab 2: Kategori */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('kategori');
              if (onOpenCategorySheet) onOpenCategorySheet();
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
              activeTab === 'kategori' ? 'text-[#E60012] font-black' : 'text-zinc-600'
            }`}
          >
            <Grid size={18} />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Kategori</span>
          </button>

          {/* Tab 3: Favorit */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('favorit');
              if (onOpenWishlist) onOpenWishlist();
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative cursor-pointer ${
              activeTab === 'favorit' ? 'text-[#E60012] font-black' : 'text-zinc-600'
            }`}
          >
            <div className="relative">
              <Heart size={18} fill={wishlistCount > 0 ? '#E60012' : 'none'} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#E60012] text-white text-[8px] font-mono px-1 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Favorit</span>
          </button>

          {/* Tab 4: Tas */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('keranjang');
              if (onOpenCart) onOpenCart();
            }}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative cursor-pointer ${
              activeTab === 'keranjang' ? 'text-[#E60012] font-black' : 'text-zinc-600'
            }`}
          >
            <div className="relative">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-[#E60012] text-white text-[8px] font-mono px-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Tas</span>
          </button>

          {/* Tab 5: Akun */}
          <button
            type="button"
            onClick={() => setActiveTab('akun')}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
              activeTab === 'akun' ? 'text-[#E60012] font-black' : 'text-zinc-600'
            }`}
          >
            <User size={18} />
            <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Akun</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
