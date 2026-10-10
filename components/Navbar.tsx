// components/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  Menu, 
  X 
} from 'lucide-react';
import { Category } from '@/lib/types';
import { ModalType } from './InformationModals';
import { useAuth } from '@/lib/auth-context';
import { POPULAR_KEYWORDS } from '@/lib/constants/navigation';
import AnnouncementTicker from './navbar/AnnouncementTicker';
import CategoryPillBar from './navbar/CategoryPillBar';
import UserAccountMenu from './navbar/UserAccountMenu';
import SideNavDrawer from './navbar/SideNavDrawer';

interface NavbarProps {
  categories: Category[];
  selectedCategory: string;
  onSelectCategory: (slug: string) => void;
  selectedGender: string;
  onSelectGender: (gender: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenInfoModal: (type: ModalType) => void;
  onSelectSort?: (sortBy: string) => void;
}

export default function Navbar({
  categories: _categories,
  selectedCategory,
  onSelectCategory,
  selectedGender,
  onSelectGender,
  searchQuery,
  onSearchChange,
  cartCount,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  onOpenInfoModal,
  onSelectSort,
}: NavbarProps) {
  const { isAdmin } = useAuth();
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [drawerGender, setDrawerGender] = useState<'pria' | 'wanita'>('pria');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Deteksi scroll untuk efek dinamis (Overlay Lookbook)
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync drawer gender dengan gender yang sedang aktif
  useEffect(() => {
    if (selectedGender === 'wanita') {
      setDrawerGender('wanita');
    } else if (selectedGender === 'pria') {
      setDrawerGender('pria');
    }
  }, [selectedGender]);

  const handleSubCategoryClick = (
    gender: string,
    categorySlug: string,
    keyword?: string,
    sortByParam?: string
  ) => {
    onSelectGender(gender);
    onSelectCategory(categorySlug);
    if (keyword !== undefined) {
      onSearchChange(keyword);
    }
    if (sortByParam && onSelectSort) {
      onSelectSort(sortByParam);
    }
    setSideDrawerOpen(false);
    setTimeout(() => {
      if (categorySlug === 'sale') {
        const el = document.getElementById('limited-offer') || document.getElementById('katalog');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      } else {
        const el = document.getElementById('katalog');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);
  };

  return (
    <>
      {/* 1. Top Announcement Ticker */}
      <AnnouncementTicker onOpenInfoModal={onOpenInfoModal} isAdmin={isAdmin} />

      {/* 2. Dynamic Transparent Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-zinc-200'
            : 'bg-transparent border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
            
            {/* Brand Logo & Menu Trigger (Uniqlo Dual Box Style: Latin US + Japanese Katakana) */}
            <div className="flex items-center gap-3 sm:gap-5">
              <button
                type="button"
                onClick={() => {
                  setDrawerGender(selectedGender === 'wanita' ? 'wanita' : 'pria');
                  setSideDrawerOpen(true);
                }}
                className={`px-2 sm:px-2.5 py-1.5 flex items-center gap-1.5 focus:outline-none transition-colors border cursor-pointer ${
                  isScrolled 
                    ? 'text-zinc-900 border-zinc-300 hover:border-black bg-zinc-50' 
                    : 'text-white border-white/40 hover:border-white bg-black/20'
                }`}
                title="Buka Menu Kategori Lengkap"
                aria-label="Buka Menu"
              >
                <Menu size={18} />
                <span className="text-[11px] font-black tracking-widest uppercase hidden sm:inline">MENU</span>
              </button>

              <Link href="/" className="flex items-center gap-2 group">
                <div className="flex items-center gap-1">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#E60012] text-white font-black text-xs sm:text-sm tracking-tighter flex items-center justify-center shadow-xs">
                    US
                  </div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#E60012] text-white font-black text-[9px] sm:text-[10px] tracking-tight flex items-center justify-center leading-none text-center shadow-xs font-sans">
                    アー<br/>バン
                  </div>
                </div>

                <div className="flex flex-col ml-1">
                  <span
                    className={`font-black text-base sm:text-lg tracking-tight uppercase group-hover:text-[#E60012] transition-colors ${
                      isScrolled ? 'text-zinc-950' : 'text-white'
                    }`}
                  >
                    UrbanStyle
                  </span>
                  <span
                    className={`text-[8px] sm:text-[9px] font-bold tracking-[0.25em] uppercase -mt-1 transition-colors ${
                      isScrolled ? 'text-zinc-400' : 'text-white/80'
                    }`}
                  >
                    LifeWear Tokyo
                  </span>
                </div>
              </Link>
            </div>

            {/* Gender Navigation Segment Tabs (Direct Filter: SEMUA, PRIA, WANITA, LIMITED OFFER) */}
            <nav className="hidden md:flex items-center gap-1">
              {[
                { label: 'SEMUA', value: 'all' },
                { label: 'PRIA', value: 'pria' },
                { label: 'WANITA', value: 'wanita' },
                { label: 'LIMITED OFFER 🔥', value: 'sale', highlight: true },
              ].map((tab) => {
                const isActive = selectedGender === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => {
                      onSelectGender(tab.value);
                      onSelectCategory('all');
                      if (tab.value === 'sale') {
                        setTimeout(() => {
                          const el = document.getElementById('limited-offer') || document.getElementById('katalog');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                      } else {
                        setTimeout(() => {
                          const el = document.getElementById('katalog');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                      }
                    }}
                    className={`px-3 py-2 text-xs font-black tracking-wider uppercase transition-all relative flex items-center cursor-pointer ${
                      isActive
                        ? tab.highlight 
                          ? 'text-[#E60012]' 
                          : isScrolled ? 'text-zinc-950 font-black' : 'text-white font-black'
                        : tab.highlight 
                          ? 'text-[#E60012]/90 hover:text-[#E60012]' 
                          : isScrolled ? 'text-zinc-600 hover:text-zinc-950' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-3 right-3 h-[2.5px] bg-[#E60012]" />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* Right Action Icons (Search, Auth, Wishlist, Cart) */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Search Input Trigger (Signature Uniqlo Pill Capsule) */}
              <div className="relative hidden xl:block w-60 focus-within:w-72 transition-all duration-300">
                <Search
                  className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                    isScrolled ? 'text-zinc-400' : 'text-white/70'
                  }`}
                  size={14}
                />
                <input
                  type="text"
                  placeholder="Apa yang Anda cari?"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className={`w-full pl-9 pr-8 py-1.5 text-xs font-medium rounded-full transition-all ${
                    isScrolled
                      ? 'bg-zinc-100 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900'
                      : 'bg-white/15 border border-white/30 text-white placeholder-white/70 backdrop-blur-xs focus:outline-none focus:bg-white focus:text-zinc-900 focus:placeholder-zinc-400'
                  }`}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer ${
                      isScrolled ? 'text-zinc-400 hover:text-zinc-900' : 'text-white/70 hover:text-white'
                    }`}
                    title="Hapus pencarian"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              {/* Mobile Search Toggle */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`xl:hidden p-2 transition-colors bg-transparent cursor-pointer ${
                  isScrolled ? 'text-zinc-700 hover:text-black' : 'text-white hover:text-white/80'
                }`}
                title="Cari produk"
              >
                <Search size={19} />
              </button>

              {/* User Profile / Auth Button */}
              <UserAccountMenu isScrolled={isScrolled} />

              {/* Wishlist Button (❤️) */}
              <button
                type="button"
                onClick={onOpenWishlist}
                className={`p-2 transition-colors relative bg-transparent cursor-pointer ${
                  isScrolled
                    ? 'text-zinc-900 hover:text-[#E60012]'
                    : 'text-white hover:text-red-200'
                }`}
                title="Daftar Favorit"
              >
                <Heart
                  size={19}
                  fill={wishlistCount > 0 ? '#E60012' : 'none'}
                  className={
                    wishlistCount > 0 
                      ? 'text-[#E60012]' 
                      : isScrolled ? 'text-zinc-900' : 'text-white'
                  }
                />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#E60012] text-white text-[9px] font-black flex items-center justify-center rounded-full">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart Button (🛒) */}
              <button
                type="button"
                onClick={onOpenCart}
                className={`p-2 transition-colors relative flex items-center gap-1.5 bg-transparent cursor-pointer ${
                  isScrolled
                    ? 'text-zinc-900 hover:text-black'
                    : 'text-white hover:text-white/80'
                }`}
                title="Keranjang Belanja"
              >
                <ShoppingBag size={19} className={isScrolled ? 'text-zinc-900' : 'text-white'} />
                {cartCount > 0 && (
                  <span className="w-4 h-4 bg-[#E60012] text-white text-[9px] font-black flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 3. Horizontal Category Pill Bar (Uniqlo 1:1 Sub-Nav) */}
        <CategoryPillBar
          selectedGender={selectedGender}
          selectedCategory={selectedCategory}
          onSelectCategory={onSelectCategory}
          isScrolled={isScrolled}
        />

        {/* 4. Mobile Search Dropdown Bar */}
        {isSearchOpen && (
          <div className="p-4 bg-zinc-100 border-b border-zinc-300 xl:hidden space-y-3 animate-in slide-in-from-top-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
              <input
                type="text"
                autoFocus
                placeholder="Cari pakaian (misal: Flannel, AIRism, Chino)..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 text-base md:text-xs border border-zinc-300 bg-white focus:outline-none focus:border-zinc-950 rounded-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px]">
              <span className="font-bold text-zinc-400 uppercase tracking-wider shrink-0">Tren:</span>
              {POPULAR_KEYWORDS.map((kw) => (
                <button
                  key={kw}
                  type="button"
                  onClick={() => {
                    onSearchChange(kw);
                    setIsSearchOpen(false);
                  }}
                  className="px-2 py-1 bg-white border border-zinc-300 text-zinc-700 hover:border-zinc-950 shrink-0 text-xs cursor-pointer"
                >
                  {kw}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* 5. Side Navigation Drawer Overlay (1:1 Uniqlo Indonesia Directory) */}
      <SideNavDrawer
        isOpen={sideDrawerOpen}
        onClose={() => setSideDrawerOpen(false)}
        drawerGender={drawerGender}
        onSelectDrawerGender={setDrawerGender}
        onSubCategoryClick={handleSubCategoryClick}
        onOpenInfoModal={onOpenInfoModal}
      />
    </>
  );
}
