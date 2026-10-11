// components/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Search, Heart, Menu, X } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { NavbarProps } from '@/lib/constants/navigation';
import AnnouncementTicker from './navbar/AnnouncementTicker';
import UserAccountMenu from './navbar/UserAccountMenu';
import SideNavDrawer from './navbar/SideNavDrawer';
import MobileSearchBar from './navbar/MobileSearchBar';

const DEPARTMENT_TABS = [
  { label: 'WANITA', value: 'wanita' },
  { label: 'PRIA', value: 'pria' },
  { label: 'SEMUA', value: 'all' },
  { label: 'LIMITED OFFER', value: 'sale', highlight: true },
];

const QUICK_CATEGORIES = [
  { label: 'Semua Koleksi', slug: 'all' },
  { label: 'Kemeja & Flannel', slug: 'kemeja' },
  { label: 'Kaos & AIRism', slug: 'kaos' },
  { label: 'Celana Chino & Ankle', slug: 'celana' },
  { label: 'Jaket & Outerwear', slug: 'jaket' },
  { label: 'Limited Offer', slug: 'sale', isSpecial: true },
];

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

  useEffect(() => {
    if (selectedGender === 'wanita') setDrawerGender('wanita');
    else if (selectedGender === 'pria') setDrawerGender('pria');
  }, [selectedGender]);

  const scrollToTarget = (targetId: string) => {
    setTimeout(() => {
      const el = document.getElementById(targetId) || document.getElementById('katalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSubCategoryClick = (gender: string, categorySlug: string, keyword?: string, sortByParam?: string) => {
    onSelectGender(gender);
    onSelectCategory(categorySlug);
    if (keyword !== undefined) onSearchChange(keyword);
    if (sortByParam && onSelectSort) onSelectSort(sortByParam);
    setSideDrawerOpen(false);
    scrollToTarget(categorySlug === 'sale' ? 'limited-offer' : 'katalog');
  };

  const handleGenderTabClick = (tabValue: string) => {
    onSelectGender(tabValue);
    onSelectCategory('all');
    scrollToTarget(tabValue === 'sale' ? 'limited-offer' : 'katalog');
  };

  const handleQuickCategoryClick = (categorySlug: string) => {
    if (categorySlug === 'sale') {
      onSelectGender('sale');
      onSelectCategory('all');
    } else {
      if (selectedGender === 'sale') onSelectGender('all');
      onSelectCategory(categorySlug);
    }
    scrollToTarget(categorySlug === 'sale' ? 'limited-offer' : 'katalog');
  };

  return (
    <>
      <AnnouncementTicker onOpenInfoModal={onOpenInfoModal} isAdmin={isAdmin} />

      <header className="bg-white border-b border-zinc-200 sticky top-0 z-40 transition-colors">
        {/* Tier 2: Main Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-6 relative">
            {/* Left: Pure Dual Box Logo & Department Tabs */}
            <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 h-full">
              <Link href="/" className="flex items-center gap-1 group shrink-0" title="UrbanStyle LifeWear">
                <div className="w-[38px] h-[38px] bg-[#E60012] text-white font-black text-sm tracking-tighter flex items-center justify-center shadow-xs rounded-none">
                  US
                </div>
                <div className="w-[38px] h-[38px] bg-[#E60012] text-white font-black text-[10px] tracking-tight flex items-center justify-center leading-none text-center shadow-xs font-sans rounded-none">
                  アー<br />バン
                </div>
              </Link>

              {/* Department Tabs: WANITA, PRIA, SEMUA, LIMITED OFFER */}
              <nav className="hidden md:flex items-center gap-1 h-full">
                {DEPARTMENT_TABS.map((tab) => {
                  const isActive = selectedGender === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      onClick={() => handleGenderTabClick(tab.value)}
                      className={`px-3.5 h-full text-xs font-bold tracking-wider uppercase transition-all relative flex items-center cursor-pointer ${
                        isActive
                          ? tab.highlight ? 'text-[#E60012] font-black' : 'text-zinc-950 font-black'
                          : tab.highlight ? 'text-[#E60012]/80 hover:text-[#E60012]' : 'text-zinc-600 hover:text-zinc-950'
                      }`}
                    >
                      <span>{tab.label}</span>
                      {isActive && <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#E60012]" />}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Right: Search Capsule w-64..80 + Wishlist + Member + Cart + Menu */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Desktop Search Capsule */}
              <div className="relative hidden lg:block w-64 xl:w-80 transition-all duration-300">
                <input
                  type="text"
                  placeholder="Apa yang Anda cari?"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 text-xs font-medium rounded-full bg-zinc-100 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 transition-all"
                />
                {searchQuery ? (
                  <button type="button" onClick={() => onSearchChange('')} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors cursor-pointer" title="Hapus pencarian">
                    <X size={14} />
                  </button>
                ) : (
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={15} />
                )}
              </div>

              {/* Mobile Search Toggle */}
              <button type="button" onClick={() => setIsSearchOpen(!isSearchOpen)} className="lg:hidden p-2 text-zinc-700 hover:text-black transition-colors bg-transparent cursor-pointer" title="Cari produk" aria-label="Cari produk">
                <Search size={20} />
              </button>

              {/* Wishlist Heart */}
              <button type="button" onClick={onOpenWishlist} className="p-2 text-zinc-900 hover:text-[#E60012] transition-colors relative bg-transparent cursor-pointer" title="Daftar Favorit" aria-label="Daftar Favorit">
                <Heart size={21} fill={wishlistCount > 0 ? '#E60012' : 'none'} className={wishlistCount > 0 ? 'text-[#E60012]' : 'text-zinc-900'} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#E60012] text-white text-[9px] font-black flex items-center justify-center rounded-full tabular-nums">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Member Account */}
              <UserAccountMenu />

              {/* Cart ShoppingBag */}
              <button type="button" onClick={onOpenCart} className="p-2 text-zinc-900 hover:text-black transition-colors relative flex items-center gap-1.5 bg-transparent cursor-pointer" title="Keranjang Belanja" aria-label="Keranjang Belanja">
                <ShoppingBag size={21} className="text-zinc-900" />
                {cartCount > 0 && (
                  <span className="w-4 h-4 bg-[#E60012] text-white text-[9px] font-black flex items-center justify-center rounded-none tabular-nums">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Menu #menuIcon */}
              <button id="menuIcon" type="button" onClick={() => { setDrawerGender(selectedGender === 'wanita' ? 'wanita' : 'pria'); setSideDrawerOpen(true); }} className="p-2 sm:px-2.5 sm:py-1.5 flex items-center gap-1.5 text-zinc-900 hover:text-[#E60012] border border-transparent hover:border-zinc-200 transition-colors cursor-pointer" title="Buka Menu Kategori Lengkap" aria-label="Buka Menu">
                <Menu size={22} />
                <span className="text-[11px] font-black tracking-widest uppercase hidden sm:inline">MENU</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tier 3: Quick-Category Aisle */}
        <div className="bg-zinc-50/95 border-t border-zinc-200/80 py-2 px-4 sm:px-6 lg:px-8 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto flex items-center gap-2 sm:gap-2.5 text-xs">
            <span className="text-[10px] font-black tracking-widest text-zinc-400 uppercase shrink-0 hidden sm:inline mr-1">
              KATEGORI:
            </span>
            {QUICK_CATEGORIES.map((cat) => {
              const isSelected = cat.slug === 'sale'
                ? selectedGender === 'sale'
                : selectedCategory === cat.slug && selectedGender !== 'sale';
              return (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => handleQuickCategoryClick(cat.slug)}
                  className={`px-3 py-1 text-[11px] font-bold tracking-wide uppercase whitespace-nowrap transition-all rounded-none cursor-pointer ${
                    cat.isSpecial
                      ? isSelected
                        ? 'bg-[#E60012] text-white border border-[#E60012]'
                        : 'text-[#E60012] border border-[#E60012]/40 hover:bg-[#E60012] hover:text-white'
                      : isSelected
                        ? 'bg-zinc-950 text-white'
                        : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/70'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Search Dropdown Bar */}
        {isSearchOpen && (
          <MobileSearchBar searchQuery={searchQuery} onSearchChange={onSearchChange} onClose={() => setIsSearchOpen(false)} />
        )}
      </header>

      {/* Side Navigation Drawer Overlay */}
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
