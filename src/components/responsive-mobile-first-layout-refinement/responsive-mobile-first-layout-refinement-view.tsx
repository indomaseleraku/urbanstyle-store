// src/components/responsive-mobile-first-layout-refinement/responsive-mobile-first-layout-refinement-view.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  MobileLayoutConfigInput, 
  mobileLayoutConfigSchema 
} from '@/lib/validations/responsive-mobile-first-layout-refinement.schema';
import TampilanAntarmukaRespon from './tampilan-antarmuka-respon';
import ValidasiInputAlurData from './validasi-input-alur-data';
import IntegrasiDatabaseStatus from './integrasi-database-status';
import ResponsiveMobileFirstLayoutForm from './responsive-mobile-first-layout-refinement-form';
import ResponsiveMobileFirstLayoutModal from './responsive-mobile-first-layout-refinement-modal';
import ResponsiveMobileFirstLayoutSkeleton from './responsive-mobile-first-layout-refinement-skeleton';
import ResponsiveMobileFirstLayoutError from './error';
import { ArrowLeft, Smartphone, Settings, Sparkles, Layers } from 'lucide-react';

export default function ResponsiveMobileFirstLayoutRefinementView() {
  const [config, setConfig] = useState<MobileLayoutConfigInput>({
    deviceViewport: 'mobile-md',
    bottomNavEnabled: true,
    thumbZoneHeightPx: 56,
    touchTargetMinSizePx: 48,
    enableHapticFeedback: true,
    drawerSwipeThresholdPx: 60,
    categoryDrawerAnimation: 'ease-out',
    stickyBuyBarEnabled: true,
  });

  const [activeTab, setActiveTab] = useState<'preview' | 'pengaturan' | 'status'>('preview');
  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [isDemoCartOpen, setIsDemoCartOpen] = useState(false);
  const [isDemoWishlistOpen, setIsDemoWishlistOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans">
      {/* Header Breadcrumb */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="p-1.5 hover:bg-zinc-100 text-zinc-700 hover:text-zinc-950 transition-colors rounded-none"
              title="Kembali ke Beranda"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                <span>Modul 7</span>
                <span>/</span>
                <span className="text-[#E60012]">Responsive Mobile-First Layout Refinement</span>
              </div>
              <h1 className="text-sm sm:text-base font-black uppercase text-zinc-950 tracking-tight">
                Pengalaman Belanja Ergonomis Satu Jempol (Thumb-Zone)
              </h1>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 bg-zinc-100 p-1 border border-zinc-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1 font-bold uppercase transition-colors ${
                activeTab === 'preview' ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Simulator
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('pengaturan')}
              className={`px-3 py-1 font-bold uppercase transition-colors ${
                activeTab === 'pengaturan' ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Pengaturan
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('status')}
              className={`px-3 py-1 font-bold uppercase transition-colors ${
                activeTab === 'status' ? 'bg-zinc-950 text-white' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              Persistensi
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        
        {/* Validasi Viewport Aktual */}
        <ValidasiInputAlurData config={config} onChangeConfig={(c) => setConfig(c)} />

        {activeTab === 'pengaturan' ? (
          <ResponsiveMobileFirstLayoutForm
            initialConfig={config}
            onApplyConfig={(c) => setConfig(c)}
          />
        ) : activeTab === 'status' ? (
          <IntegrasiDatabaseStatus
            isPersisted={true}
            cachedLayoutVersion="v5.2-mobile-first"
            pwaReady={true}
          />
        ) : (
          <TampilanAntarmukaRespon
            config={config}
            cartCount={2}
            wishlistCount={3}
            onOpenCategorySheet={() => setIsCategorySheetOpen(true)}
            onOpenCart={() => setIsDemoCartOpen(true)}
            onOpenWishlist={() => setIsDemoWishlistOpen(true)}
          />
        )}

      </main>

      {/* Sheet Kategori Mobile (TASK-MOD-7-06) */}
      <ResponsiveMobileFirstLayoutModal
        isOpen={isCategorySheetOpen}
        onClose={() => setIsCategorySheetOpen(false)}
        title="Daftar Kategori Pakaian LifeWear"
        type="bottom-sheet"
      >
        <div className="space-y-2">
          {['Kemeja & Flannel', 'Kaos & AIRism', 'Celana Chino & Ankle', 'Jaket & Outerwear', 'Limited Offer 🔥'].map((cat, idx) => (
            <div key={idx} className="p-3 bg-zinc-50 border border-zinc-200 flex items-center justify-between">
              <span className="font-bold uppercase text-zinc-900">{cat}</span>
              <span className="text-[10px] text-zinc-400 font-mono">10 PRODUK</span>
            </div>
          ))}
        </div>
      </ResponsiveMobileFirstLayoutModal>

      {/* Sheet Tas Belanja Demo */}
      <ResponsiveMobileFirstLayoutModal
        isOpen={isDemoCartOpen}
        onClose={() => setIsDemoCartOpen(false)}
        title="Tas Belanja (Mobile Sheet)"
        type="bottom-sheet"
      >
        <p className="text-zinc-600">Tas belanja aktif terhubung langsung ke slide-over keranjang belanja utama.</p>
      </ResponsiveMobileFirstLayoutModal>

      {/* Sheet Favorit Demo */}
      <ResponsiveMobileFirstLayoutModal
        isOpen={isDemoWishlistOpen}
        onClose={() => setIsDemoWishlistOpen(false)}
        title="Daftar Favorit (Mobile Sheet)"
        type="bottom-sheet"
      >
        <p className="text-zinc-600">Daftar item favorit tersimpan otomatis di profil akun pengguna.</p>
      </ResponsiveMobileFirstLayoutModal>
    </div>
  );
}
