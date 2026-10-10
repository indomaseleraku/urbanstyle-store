// components/Navbar.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShoppingBag, 
  Search, 
  Heart, 
  LayoutDashboard, 
  Menu, 
  X, 
  RotateCcw, 
  Truck,
  Sparkles,
  User,
  Shield,
  LogOut,
  Package,
  MapPin,
  Tag,
  ChevronDown,
  Copy
} from 'lucide-react';
import { Category } from '@/lib/types';
import { ModalType } from './InformationModals';
import { useAuth } from '@/lib/auth-context';

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

interface MegaMenuLink {
  label: string;
  category: string;
  search?: string;
  sort?: string;
  badge?: string;
  badgeStyle?: 'red' | 'black' | 'gray' | 'blue' | 'yellow';
}

interface MegaMenuColumn {
  title: string;
  enTitle: string;
  links: MegaMenuLink[];
}

interface MegaMenuData {
  genderTitle: string;
  subtitle: string;
  columns: MegaMenuColumn[];
  lookbook: {
    tag: string;
    title: string;
    subtitle: string;
    desc: string;
    imageUrl: string;
    category: string;
    search?: string;
  };
}

const MEN_MEGA_MENU: MegaMenuData = {
  genderTitle: 'PRIA',
  subtitle: 'Siluet Esensial & Busana Harian Minimalis Tokyo',
  columns: [
    {
      title: 'ATASAN',
      enTitle: 'Tops',
      links: [
        { label: 'Semua Atasan', category: 'all', search: 'atasan' },
        { label: 'Kaos & T-Shirt Santai', category: 'kaos', search: '' },
        { label: 'Kaos AIRism Serat Sejuk', category: 'kaos', search: 'AIRism', badge: 'AIRism', badgeStyle: 'blue' },
        { label: 'Kemeja Flannel Kotak', category: 'kemeja', search: 'Flannel', badge: 'Populer', badgeStyle: 'gray' },
        { label: 'Kemeja Kerja & Oxford', category: 'kemeja', search: 'Oxford' },
        { label: 'Polo Shirt Katun', category: 'kaos', search: 'Polo' },
        { label: 'Sweatshirt & Hoodie', category: 'jaket', search: 'Hoodie' },
      ],
    },
    {
      title: 'BAWAHAN',
      enTitle: 'Bottoms',
      links: [
        { label: 'Semua Bawahan', category: 'celana', search: '' },
        { label: 'Celana Chino & Ankle', category: 'celana', search: 'Chino', badge: 'Stretch', badgeStyle: 'gray' },
        { label: 'Celana Smart Pants', category: 'celana', search: 'Ankle' },
        { label: 'Jeans & Selvedge Denim', category: 'celana', search: 'Jeans' },
        { label: 'Celana Pendek (Shorts)', category: 'celana', search: 'Short' },
        { label: 'Celana Rileks & Jogger', category: 'celana', search: 'Jogger' },
        { label: 'Celana Kargo & Utilitas', category: 'celana', search: 'Kargo' },
      ],
    },
    {
      title: 'LUARAN',
      enTitle: 'Outerwear',
      links: [
        { label: 'Semua Luaran', category: 'jaket', search: '' },
        { label: 'Parka Saku Proteksi UV', category: 'jaket', search: 'Parka', badge: 'UV Cut', badgeStyle: 'yellow' },
        { label: 'Jaket Kasual & Workwear', category: 'jaket', search: 'Jaket' },
        { label: 'Jaket Fleece Hangat', category: 'jaket', search: 'Fleece' },
        { label: 'Cardigan & Sweater Rajut', category: 'jaket', search: 'Cardigan' },
        { label: 'Luaran Tahan Air & Angin', category: 'jaket', search: 'Windproof' },
      ],
    },
    {
      title: 'KOLEKSI KHUSUS',
      enTitle: 'Featured & Offers',
      links: [
        { label: 'Limited Offer (Penawaran Spesial)', category: 'sale', badge: 'LIMITED OFFER', badgeStyle: 'red' },
        { label: 'Koleksi Terbaru (New Arrivals)', category: 'all', sort: 'newest', badge: 'NEW', badgeStyle: 'black' },
        { label: 'Best of LifeWear (Paling Dicari)', category: 'all', sort: 'popular', badge: '★ 4.8+', badgeStyle: 'yellow' },
        { label: 'Filosofi Katun LifeWear', category: 'kemeja' },
        { label: 'Lihat Semua Produk Pria', category: 'all' },
      ],
    },
  ],
  lookbook: {
    tag: 'LOOKBOOK 2026',
    title: 'Koleksi Esensial Pria',
    subtitle: 'SILUET ESENSIAL HARIAN',
    desc: 'Paduan kemeja flannel katun murni double-brushed dan celana chino elastis untuk kenyamanan aktivitas setiap hari.',
    imageUrl: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=700&q=80',
    category: 'all',
  },
};

const WOMEN_MEGA_MENU: MegaMenuData = {
  genderTitle: 'WANITA',
  subtitle: 'Kenyamanan Anggun & Siluet Esensial Wanita',
  columns: [
    {
      title: 'ATASAN',
      enTitle: 'Tops',
      links: [
        { label: 'Semua Atasan Wanita', category: 'all', search: 'atasan' },
        { label: 'Kaos Katun Lembut & T-Shirt', category: 'kaos', search: '' },
        { label: 'Atasan & Kamisol AIRism', category: 'kaos', search: 'AIRism', badge: 'AIRism', badgeStyle: 'blue' },
        { label: 'Kemeja Flannel & Blus Rileks', category: 'kemeja', search: 'Flannel', badge: 'Populer', badgeStyle: 'gray' },
        { label: 'Blus Rayon Sutra Sintetis', category: 'kemeja', search: 'Blus' },
        { label: 'Cardigan & Sweater Rajut', category: 'jaket', search: 'Cardigan' },
        { label: 'Sweat & Hoodie Santai', category: 'jaket', search: 'Hoodie' },
      ],
    },
    {
      title: 'BAWAHAN',
      enTitle: 'Bottoms',
      links: [
        { label: 'Semua Bawahan Wanita', category: 'celana', search: '' },
        { label: 'Celana Ankle & Smart Trousers', category: 'celana', search: 'Ankle', badge: 'Favorit', badgeStyle: 'gray' },
        { label: 'Celana Lebar (Wide Pants)', category: 'celana', search: 'Wide' },
        { label: 'Rok Kasual & Lipit (Skirts)', category: 'celana', search: 'Rok' },
        { label: 'Jeans & Stretch Denim', category: 'celana', search: 'Jeans' },
        { label: 'Celana Rileks & Loungewear', category: 'celana', search: 'Rileks' },
        { label: 'Celana Pendek Santai', category: 'celana', search: 'Short' },
      ],
    },
    {
      title: 'LUARAN',
      enTitle: 'Outerwear',
      links: [
        { label: 'Semua Luaran Wanita', category: 'jaket', search: '' },
        { label: 'Parka Saku UV Protection', category: 'jaket', search: 'Parka', badge: 'UV Cut', badgeStyle: 'yellow' },
        { label: 'Jaket Kasual & Windproof', category: 'jaket', search: 'Jaket' },
        { label: 'Cardigan Rajut Ringan', category: 'jaket', search: 'Cardigan' },
        { label: 'Jaket Fleece Hangat Lembut', category: 'jaket', search: 'Fleece' },
        { label: 'Blazer Kasual Santai', category: 'jaket', search: 'Blazer' },
      ],
    },
    {
      title: 'KOLEKSI KHUSUS',
      enTitle: 'Featured & Offers',
      links: [
        { label: 'Limited Offer (Penawaran Spesial)', category: 'sale', badge: 'LIMITED OFFER', badgeStyle: 'red' },
        { label: 'Koleksi Terbaru (New Arrivals)', category: 'all', sort: 'newest', badge: 'NEW', badgeStyle: 'black' },
        { label: 'Best of LifeWear Wanita', category: 'all', sort: 'popular', badge: '★ 4.8+', badgeStyle: 'yellow' },
        { label: 'Sentuhan Alami & Sejuk', category: 'kaos', search: 'AIRism' },
        { label: 'Lihat Semua Produk Wanita', category: 'all' },
      ],
    },
  ],
  lookbook: {
    tag: 'LOOKBOOK 2026',
    title: 'Kenyamanan Anggun & Bersih',
    subtitle: 'SILUET MENGALIR & SEJUK',
    desc: 'Sentuhan serat alami bernapas dengan potongan santai yang anggun untuk mobilitas sepanjang hari.',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80',
    category: 'all',
  },
};

export default function Navbar({
  categories,
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
  const { user, isAuthenticated, isAdmin, openAuthModal, logout } = useAuth();
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [drawerGender, setDrawerGender] = useState<'pria' | 'wanita'>('pria');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [copiedVoucher, setCopiedVoucher] = useState(false);

  const handleCopyVoucher = () => {
    navigator.clipboard.writeText('URBANWELCOME50');
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2500);
  };

  const POPULAR_KEYWORDS = ['Flannel', 'AIRism', 'Chino', 'Parka', 'Heavyweight', 'Oversized'];

  // Deteksi scroll untuk efek dinamis (TICKET-01: Overlay Lookbook)
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

  // Lock body scroll saat side drawer terbuka
  useEffect(() => {
    if (sideDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sideDrawerOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSideDrawerOpen(false);
        setUserDropdownOpen(false);
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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

  // Tutup dropdown user saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      {/* 1. Top Announcement Ticker (Bergulir alami bersama halaman, tidak sticky agar transparansi murni) */}
      <div className="bg-[#111111] text-white text-[10px] sm:text-xs py-2 px-4 text-center font-bold tracking-wider flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="hidden sm:flex items-center gap-4 text-zinc-400">
            <button 
              onClick={() => onOpenInfoModal('shipping')} 
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Truck size={13} />
              <span>GRATIS ONGKIR MIN. RP 400.000</span>
            </button>
            <span>•</span>
            <button 
              onClick={() => onOpenInfoModal('return')} 
              className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={13} />
              <span>GARANSI RETUR 30 HARI</span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleCopyVoucher}
            className="mx-auto sm:mx-0 flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer group"
            title="Klik untuk salin kode voucher Rp 50.000"
          >
            <span className="text-[#E60012] font-black bg-black/40 px-1.5 py-0.5 group-hover:bg-[#E60012] group-hover:text-white transition-colors">
              MEMBER VOUCHER
            </span>
            <span className="text-zinc-200 uppercase flex items-center gap-1.5 text-[10px] sm:text-xs">
              <span>{copiedVoucher ? '✓ KODE TERSALIN: URBANWELCOME50' : 'Gunakan URBANWELCOME50 Potongan Rp 50.000'}</span>
              <Copy size={11} className="text-zinc-400 group-hover:text-white" />
            </span>
          </button>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onOpenInfoModal('lifewear')}
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Tentang LifeWear
            </button>
            {isAdmin && (
              <Link
                href="/admin"
                className="text-white font-mono text-[10px] bg-[#E60012] px-2 py-0.5 font-bold uppercase tracking-wider"
              >
                Dasbor SIM ↗
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* 2. Dynamic Transparent Sticky Header (Transparan di atas hero, putih bersih saat di-scroll) */}
      <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-xs border-b border-zinc-200'
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Brand Logo & Menu Trigger (Uniqlo Dual Box Style: Latin US + Japanese Katakana) */}
          <div className="flex items-center gap-3 sm:gap-5">
            <button 
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
                {/* Box 1: English */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#E60012] text-white font-black text-xs sm:text-sm tracking-tighter flex items-center justify-center shadow-xs">
                  US
                </div>
                {/* Box 2: Japanese Katakana */}
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-[#E60012] text-white font-black text-[9px] sm:text-[10px] tracking-tight flex items-center justify-center leading-none text-center shadow-xs font-sans">
                  アー<br/>バン
                </div>
              </div>

              <div className="flex flex-col ml-1">
                <span className={`font-black text-base sm:text-lg tracking-tight uppercase group-hover:text-[#E60012] transition-colors ${
                  isScrolled ? 'text-zinc-950' : 'text-white'
                }`}>
                  UrbanStyle
                </span>
                <span className={`text-[8px] sm:text-[9px] font-bold tracking-[0.25em] uppercase -mt-1 transition-colors ${
                  isScrolled ? 'text-zinc-400' : 'text-white/80'
                }`}>
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
              <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors pointer-events-none ${
                isScrolled ? 'text-zinc-400' : 'text-white/70'
              }`} size={14} />
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
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`xl:hidden p-2 transition-colors bg-transparent ${
                isScrolled ? 'text-zinc-700 hover:text-black' : 'text-white hover:text-white/80'
              }`}
              title="Cari produk"
            >
              <Search size={19} />
            </button>

            {/* User Profile / Auth Button */}
            {isAuthenticated && user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full transition-all cursor-pointer shadow-xs group bg-transparent ${
                    isScrolled
                      ? 'border border-zinc-300 hover:border-zinc-500 text-zinc-900'
                      : 'border border-white/30 hover:border-white/60 text-white'
                  }`}
                  title="Menu Akun Member"
                >
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black text-white shadow-xs transition-transform group-hover:scale-105 ${
                    isAdmin 
                      ? 'bg-gradient-to-tr from-[#E60012] to-rose-600' 
                      : 'bg-gradient-to-tr from-zinc-950 to-zinc-700'
                  }`}>
                    {user.full_name?.slice(0, 2).toUpperCase() || 'US'}
                  </div>
                  <span className={`text-xs font-bold max-w-[85px] sm:max-w-[110px] truncate hidden sm:inline ${
                    isScrolled ? 'text-zinc-800' : 'text-white'
                  }`}>
                    {user.full_name?.split(' ')[0] || 'Member'}
                  </span>
                  <ChevronDown size={13} className={`transition-transform duration-200 ${
                    isScrolled ? 'text-zinc-400 group-hover:text-zinc-700' : 'text-white/80 group-hover:text-white'
                  } ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Menu Member */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-zinc-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95">
                    <div className="px-4 py-2 border-b border-zinc-100">
                      <p className="text-xs font-bold text-zinc-950 truncate uppercase">{user.full_name}</p>
                      <p className="text-[10px] text-zinc-500 truncate">{user.email}</p>
                      <span className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 ${
                        isAdmin ? 'bg-red-100 text-[#E60012]' : 'bg-zinc-100 text-zinc-800'
                      }`}>
                        {isAdmin ? '🛡️ Administrator SIM' : '✨ UrbanStyle Member'}
                      </span>
                    </div>

                    <div className="py-1 text-xs">
                      <Link
                        href="/account/profile"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-black"
                      >
                        <User size={14} />
                        <span>Profil Saya</span>
                      </Link>
                      <Link
                        href="/account/orders"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-black"
                      >
                        <Package size={14} />
                        <span>Riwayat Pesanan</span>
                      </Link>
                      <Link
                        href="/account/address"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-black"
                      >
                        <MapPin size={14} />
                        <span>Buku Alamat</span>
                      </Link>
                      <Link
                        href="/account/coupons"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-zinc-700 hover:bg-zinc-50 hover:text-black"
                      >
                        <Tag size={14} />
                        <span>Kupon Saya</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-[#E60012] font-bold hover:bg-red-50 border-t border-zinc-100"
                        >
                          <Shield size={14} />
                          <span>Dasbor SIM Eksekutif</span>
                        </Link>
                      )}
                    </div>

                    <div className="pt-1 border-t border-zinc-100">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={14} />
                        <span>Keluar Akun</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  isScrolled
                    ? 'border border-zinc-300 hover:border-black text-zinc-900 hover:text-black bg-transparent'
                    : 'border border-white/40 hover:border-white text-white hover:bg-white/10 bg-transparent'
                }`}
              >
                <User size={14} className={isScrolled ? 'text-zinc-900' : 'text-white'} />
                <span className="hidden sm:inline">Masuk</span>
              </button>
            )}

            {/* Wishlist Button (❤️) */}
            <button
              onClick={onOpenWishlist}
              className={`p-2 transition-colors relative bg-transparent ${
                isScrolled
                  ? 'text-zinc-900 hover:text-[#E60012]'
                  : 'text-white hover:text-red-200'
              }`}
              title="Daftar Favorit"
            >
              <Heart size={19} fill={wishlistCount > 0 ? '#E60012' : 'none'} className={wishlistCount > 0 ? 'text-[#E60012]' : isScrolled ? 'text-zinc-900' : 'text-white'} />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#E60012] text-white text-[9px] font-black flex items-center justify-center rounded-full">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button (🛒) */}
            <button
              onClick={onOpenCart}
              className={`p-2 transition-colors relative flex items-center gap-1.5 bg-transparent ${
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

      {/* Horizontal Category Pill Bar (Uniqlo 1:1 Sub-Nav) */}
        <div className={`w-full transition-all border-t ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md border-zinc-200 shadow-xs'
            : selectedGender !== 'all'
              ? 'bg-zinc-950/90 backdrop-blur-md border-white/10'
              : 'hidden'
        }`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center overflow-x-auto no-scrollbar gap-2 py-2">
              {(() => {
                let pills: { name: string; slug: string }[] = [];
                if (selectedGender === 'pria') {
                  pills = [
                    { name: 'Semua Pria', slug: 'all' },
                    { name: 'Kemeja & Flannel', slug: 'kemeja' },
                    { name: 'Kaos & AIRism', slug: 'kaos' },
                    { name: 'Celana Chino & Ankle', slug: 'celana' },
                    { name: 'Jaket & Outerwear', slug: 'jaket' },
                    { name: 'Limited Offer 🔥', slug: 'sale' },
                  ];
                } else if (selectedGender === 'wanita') {
                  pills = [
                    { name: 'Semua Wanita', slug: 'all' },
                    { name: 'Kemeja & Blus', slug: 'kemeja' },
                    { name: 'Kaos & AIRism', slug: 'kaos' },
                    { name: 'Celana & Bawahan', slug: 'celana' },
                    { name: 'Jaket & Outerwear', slug: 'jaket' },
                    { name: 'Limited Offer 🔥', slug: 'sale' },
                  ];
                } else {
                  pills = [
                    { name: 'Semua Koleksi', slug: 'all' },
                    { name: 'Kemeja & Flannel', slug: 'kemeja' },
                    { name: 'Kaos & AIRism', slug: 'kaos' },
                    { name: 'Celana Chino & Ankle', slug: 'celana' },
                    { name: 'Jaket & Outerwear', slug: 'jaket' },
                    { name: 'Limited Offer 🔥', slug: 'sale' },
                  ];
                }

                return pills.map((pill) => {
                  const isActive = selectedCategory === pill.slug;
                  return (
                    <button
                      key={pill.slug}
                      type="button"
                      onClick={() => {
                        onSelectCategory(pill.slug);
                        if (pill.slug === 'sale') {
                          const el = document.getElementById('limited-offer') || document.getElementById('katalog');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          const el = document.getElementById('katalog');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className={`whitespace-nowrap px-3.5 py-1 text-xs font-bold uppercase tracking-wider transition-colors shrink-0 cursor-pointer ${
                        isActive
                          ? 'bg-zinc-950 text-white'
                          : isScrolled
                            ? 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                            : 'bg-white/15 hover:bg-white/25 text-white'
                      }`}
                    >
                      {pill.name}
                    </button>
                  );
                });
              })()}
            </div>
          </div>
        </div>

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
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700"
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
                onClick={() => {
                  onSearchChange(kw);
                  setIsSearchOpen(false);
                }}
                className="px-2 py-1 bg-white border border-zinc-300 text-zinc-700 hover:border-zinc-950 shrink-0 text-xs"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>
      )}

      </header>

    {/* Side Navigation Drawer Overlay (1:1 Uniqlo Indonesia Directory) */}
    {sideDrawerOpen && (
      <div className="fixed inset-0 z-50 overflow-hidden">
        {/* Backdrop */}
        <div 
          onClick={() => setSideDrawerOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        />

        {/* Drawer Panel */}
        <aside className="fixed inset-y-0 left-0 max-w-md w-full bg-white shadow-2xl z-50 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
          <div>
            {/* Top Header of Drawer */}
            <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#E60012] text-white font-black text-xs tracking-tighter flex items-center justify-center">
                  US
                </div>
                <div className="w-8 h-8 bg-[#E60012] text-white font-black text-[9px] tracking-tight flex items-center justify-center leading-none text-center font-sans">
                  アー<br/>バン
                </div>
                <div className="ml-1">
                  <span className="font-black text-sm uppercase tracking-tight block text-zinc-950">URBANSTYLE</span>
                  <span className="text-[8px] font-bold tracking-[0.2em] uppercase text-zinc-400 block -mt-1">LIFEWEAR DIRECTORY</span>
                </div>
              </div>

              <button
                onClick={() => setSideDrawerOpen(false)}
                className="p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
                title="Tutup Menu"
                aria-label="Tutup Menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Gender Segmented Switcher inside Drawer */}
            <div className="p-4 bg-zinc-50 border-b border-zinc-200">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDrawerGender('pria')}
                  className={`py-2 text-xs font-black uppercase tracking-wider transition-all text-center cursor-pointer ${
                    drawerGender === 'pria'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  PRIA
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerGender('wanita')}
                  className={`py-2 text-xs font-black uppercase tracking-wider transition-all text-center cursor-pointer ${
                    drawerGender === 'wanita'
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'bg-white text-zinc-600 border border-zinc-200 hover:border-zinc-400'
                  }`}
                >
                  WANITA
                </button>
              </div>
            </div>

            {/* Category Directory Tree */}
            <div className="p-4 sm:p-5 space-y-6">
              {(() => {
                const menuData = drawerGender === 'pria' ? MEN_MEGA_MENU : WOMEN_MEGA_MENU;
                return (
                  <>
                    {menuData.columns.map((col, colIdx) => (
                      <div key={colIdx} className="space-y-2">
                        <div className="pb-1.5 border-b border-zinc-950 flex items-baseline justify-between">
                          <h4 className="text-xs font-black uppercase tracking-wider text-zinc-950">
                            {col.title}
                          </h4>
                          <span className="text-[10px] text-zinc-400 font-mono uppercase">
                            {col.enTitle}
                          </span>
                        </div>
                        <ul className="divide-y divide-zinc-100">
                          {col.links.map((link, linkIdx) => (
                            <li key={linkIdx}>
                              <button
                                type="button"
                                onClick={() => handleSubCategoryClick(drawerGender, link.category, link.search, link.sort)}
                                className="w-full text-left py-2 text-xs text-zinc-700 hover:text-[#E60012] transition-colors flex items-center justify-between group cursor-pointer"
                              >
                                <span className="inline-flex items-center gap-2 truncate">
                                  <span className="w-1.5 h-1.5 bg-zinc-300 group-hover:bg-[#E60012] rounded-full transition-colors shrink-0" />
                                  <span className="font-medium group-hover:translate-x-0.5 transition-transform">{link.label}</span>
                                </span>
                                {link.badge && (
                                  <span className={`text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 shrink-0 ${
                                    link.badgeStyle === 'red' ? 'bg-[#E60012] text-white' :
                                    link.badgeStyle === 'blue' ? 'bg-sky-50 text-sky-700 border border-sky-100' :
                                    link.badgeStyle === 'yellow' ? 'bg-amber-100 text-amber-900' :
                                    link.badgeStyle === 'black' ? 'bg-zinc-950 text-white' :
                                    'bg-zinc-100 text-zinc-600'
                                  }`}>
                                    {link.badge}
                                  </span>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}

                    {/* Lookbook 2026 Visual Editorial Card */}
                    <div className="pt-2">
                      <div
                        onClick={() => handleSubCategoryClick(drawerGender, menuData.lookbook.category, menuData.lookbook.search)}
                        className="group relative aspect-[16/9] sm:aspect-[4/3] overflow-hidden bg-zinc-100 cursor-pointer border border-zinc-200 shadow-xs"
                      >
                        <img
                          src={menuData.lookbook.imageUrl}
                          alt={menuData.lookbook.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                        <div className="absolute top-2.5 left-2.5 z-10">
                          <span className="bg-[#E60012] text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 shadow-xs">
                            {menuData.lookbook.tag}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent p-4 flex flex-col justify-end text-white">
                          <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest mb-0.5">
                            {menuData.lookbook.subtitle}
                          </span>
                          <h5 className="text-sm font-black uppercase tracking-tight leading-snug">
                            {menuData.lookbook.title}
                          </h5>
                          <p className="text-[10px] text-zinc-300 mt-1 line-clamp-2 leading-relaxed">
                            {menuData.lookbook.desc}
                          </p>
                          <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-white group-hover:text-[#E60012] transition-colors">
                            <span>Jelajahi Gaya Lengkap</span>
                            <span className="transition-transform group-hover:translate-x-1">→</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Customer Service Strip & Guarantees at Bottom of Drawer */}
          <div className="p-4 sm:p-5 border-t border-zinc-200 bg-zinc-50 space-y-3">
            <div className="text-[11px] text-zinc-600 space-y-2">
              <div className="flex items-center gap-2">
                <Truck size={14} className="text-[#E60012] shrink-0" />
                <span><strong>Bebas Ongkos Kirim:</strong> Min. belanja Rp 400.000</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw size={14} className="text-[#E60012] shrink-0" />
                <span><strong>Garansi Retur 30 Hari:</strong> Pengembalian mudah</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-[#E60012] shrink-0" />
                <span><strong>Filosofi LifeWear:</strong> Kualitas busana harian esensial</span>
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-200 grid grid-cols-2 gap-2 text-[10px] font-bold uppercase">
              <button
                onClick={() => { onOpenInfoModal('shipping'); setSideDrawerOpen(false); }}
                className="py-1.5 px-2 text-left bg-white border border-zinc-200 hover:border-zinc-950 text-zinc-700 cursor-pointer"
              >
                Panduan Ongkir →
              </button>
              <button
                onClick={() => { onOpenInfoModal('return'); setSideDrawerOpen(false); }}
                className="py-1.5 px-2 text-left bg-white border border-zinc-200 hover:border-zinc-950 text-zinc-700 cursor-pointer"
              >
                Kebijakan Retur →
              </button>
              <button
                onClick={() => { onOpenInfoModal('lifewear'); setSideDrawerOpen(false); }}
                className="py-1.5 px-2 text-left bg-white border border-zinc-200 hover:border-zinc-950 text-zinc-700 cursor-pointer"
              >
                Filosofi LifeWear →
              </button>
              <button
                onClick={() => { onOpenInfoModal('help'); setSideDrawerOpen(false); }}
                className="py-1.5 px-2 text-left bg-white border border-zinc-200 hover:border-zinc-950 text-zinc-700 cursor-pointer"
              >
                Bantuan & Kontak →
              </button>
            </div>
          </div>
        </aside>
      </div>
    )}
    </>
  );
}
