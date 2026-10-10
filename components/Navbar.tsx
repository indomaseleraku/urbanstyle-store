// components/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Heart, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { GENDER_TABS, NavbarProps } from '@/lib/constants/navigation';
import AnnouncementTicker from './navbar/AnnouncementTicker';
import UserAccountMenu from './navbar/UserAccountMenu';
import SideNavDrawer from './navbar/SideNavDrawer';
import MobileSearchBar from './navbar/MobileSearchBar';

export default function Navbar({
  categories: _categories,
  selectedCategory: _selectedCategory,
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

  useEffect(() => {
    if (selectedGender === 'wanita') setDrawerGender('wanita');
    else if (selectedGender === 'pria') setDrawerGender('pria');
  }, [selectedGender]);

  const handleSubCategoryClick = (
    gender: string,
    categorySlug: string,
    keyword?: string,
    sortByParam?: string
  ) => {
    onSelectGender(gender);
    onSelectCategory(categorySlug);
    if (keyword !== undefined) onSearchChange(keyword);
    if (sortByParam && onSelectSort) onSelectSort(sortByParam);
    setSideDrawerOpen(false);
    setTimeout(() => {
      const targetId = categorySlug === 'sale' ? 'limited-offer' : 'katalog';
      const el = document.getElementById(targetId) || document.getElementById('katalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleGenderTabClick = (tabValue: string) => {
    onSelectGender(tabValue);
    onSelectCategory('all');
    setTimeout(() => {
      const targetId = tabValue === 'sale' ? 'limited-offer' : 'katalog';
      const el = document.getElementById(targetId) || document.getElementById('katalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <>
      <AnnouncementTicker onOpenInfoModal={onOpenInfoModal} isAdmin={isAdmin} />

      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-3 sm:gap-6">
            
            {/* Left: Dual Box Logo & Department/Gender Tabs */}
            <div className="flex items-center gap-3 sm:gap-6 lg:gap-8">
              <Link href="/" className="flex items-center gap-2 group shrink-0">
                <div className="flex items-center gap-1">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#E60012] text-white font-black text-xs sm:text-sm tracking-tighter flex items-center justify-center shadow-xs">
                    US
                  </div>
                  <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#E60012] text-white font-black text-[9px] sm:text-[10px] tracking-tight flex items-center justify-center leading-none text-center shadow-xs font-sans">
                    アー<br/>バン
                  </div>
                </div>
                <div className="flex flex-col ml-1 hidden sm:flex">
                  <span className="font-black text-base sm:text-lg tracking-tight uppercase text-zinc-950 group-hover:text-[#E60012] transition-colors leading-tight">
                    UrbanStyle
                  </span>
                  <span className="text-[8px] sm:text-[9px] font-bold tracking-[0.25em] uppercase text-zinc-400 -mt-0.5">
                    LifeWear Tokyo
                  </span>
                </div>
              </Link>

              {/* Department/Gender Tabs (Uniqlo ID Benchmark: WANITA, PRIA, SEMUA, LIMITED OFFER) */}
              <nav className="hidden md:flex items-center gap-1">
                {GENDER_TABS.map((tab) => {
                  const isActive = selectedGender === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => handleGenderTabClick(tab.value)}
                      className={`px-3 py-4 text-xs font-bold tracking-wider uppercase transition-all relative flex items-center cursor-pointer ${
                        isActive
                          ? tab.highlight ? 'text-[#E60012] font-black' : 'text-zinc-950 font-black'
                          : tab.highlight ? 'text-[#E60012]/80 hover:text-[#E60012]' : 'text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {isActive && <span className="absolute bottom-0 left-2 right-2 h-[2.5px] bg-[#E60012]" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right: Search Pill + Wishlist + Member + Cart + Menu #menuIcon */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Desktop Search Capsule */}
              <div className="relative hidden xl:block w-52 lg:w-60 focus-within:w-72 transition-all duration-300">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={14} />
                <input
                  type="text"
                  placeholder="Apa yang Anda cari?"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-9 pr-8 py-1.5 text-xs font-medium rounded-none bg-zinc-100 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer"
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
                className="xl:hidden p-2 text-zinc-700 hover:text-black transition-colors bg-transparent cursor-pointer"
                title="Cari produk"
                aria-label="Cari produk"
              >
                <Search size={20} />
              </button>

              {/* Wishlist Heart Icon */}
              <button
                type="button"
                onClick={onOpenWishlist}
                className="p-2 text-zinc-900 hover:text-[#E60012] transition-colors relative bg-transparent cursor-pointer"
                title="Daftar Favorit"
                aria-label="Daftar Favorit"
              >
                <Heart
                  size={20}
                  fill={wishlistCount > 0 ? '#E60012' : 'none'}
                  className={wishlistCount > 0 ? 'text-[#E60012]' : 'text-zinc-900'}
                />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#E60012] text-white text-[9px] font-black flex items-center justify-center rounded-none font-mono">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Member Account Menu */}
              <UserAccountMenu />

              {/* Cart ShoppingBag Icon */}
              <button
                type="button"
                onClick={onOpenCart}
                className="p-2 text-zinc-900 hover:text-black transition-colors relative flex items-center gap-1.5 bg-transparent cursor-pointer"
                title="Keranjang Belanja"
                aria-label="Keranjang Belanja"
              >
                <ShoppingBag size={20} className="text-zinc-900" />
                {cartCount > 0 && (
                  <span className="w-4 h-4 bg-[#E60012] text-white text-[9px] font-black flex items-center justify-center rounded-none">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Uniqlo Mega Menu Hamburger (#menuIcon on the far right) */}
              <button
                id="menuIcon"
                type="button"
                onClick={() => {
                  setDrawerGender(selectedGender === 'wanita' ? 'wanita' : 'pria');
                  setSideDrawerOpen(true);
                }}
                className="p-2 sm:px-2.5 sm:py-1.5 flex items-center gap-1.5 text-zinc-900 hover:text-[#E60012] border border-transparent hover:border-zinc-200 transition-colors cursor-pointer"
                title="Buka Menu Kategori Lengkap"
                aria-label="Buka Menu"
              >
                <Menu size={22} />
                <span className="text-[11px] font-black tracking-widest uppercase hidden sm:inline">MENU</span>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Search Dropdown Bar */}
        {isSearchOpen && (
          <MobileSearchBar
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            onClose={() => setIsSearchOpen(false)}
          />
        )}
      </header>

      {/* 3. Side Navigation Drawer Overlay (1:1 Uniqlo Indonesia Directory) */}
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
