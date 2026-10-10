// app/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import LookbookSlider from '@/components/LookbookSlider';
import CategoryBubbles from '@/components/CategoryBubbles';
import LifeWearStorySection from '@/components/LifeWearStorySection';
import MemberLoyaltyBanner from '@/components/MemberLoyaltyBanner';
import ProductCard from '@/components/ProductCard';
import ProductDetailModal from '@/components/ProductDetailModal';
import SizeChartModal from '@/components/SizeChartModal';
import WishlistDrawer from '@/components/WishlistDrawer';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import InformationModals, { ModalType } from '@/components/InformationModals';
import { AuthModal } from '@/components/AuthModal';
import Footer from '@/components/Footer';
import { Product, Category, CartItem, Order } from '@/lib/types';
import { dataStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { SlidersHorizontal, ArrowUpDown, Check, Sparkles, Filter, X, ArrowRight, Home, Heart, ShoppingBag, User } from 'lucide-react';

function HomePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { openAuthModal, user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [visibleCount, setVisibleCount] = useState<number>(8);

  // Debounce search query to prevent constant re-renders and re-fetches
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reset pagination saat filter, kategori, gender, atau pencarian berubah
  useEffect(() => {
    setVisibleCount(8);
  }, [selectedCategory, selectedGender, debouncedSearchQuery, sortBy, inStockOnly]);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState('J&T Express (Reguler)');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Toast Feedback State (UI-06)
  const [toast, setToast] = useState<{
    visible: boolean;
    productName: string;
    colorName: string;
    size: string;
  }>({
    visible: false,
    productName: '',
    colorName: '',
    size: '',
  });

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, visible: false }));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  // Wishlist State
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Detail Modal State
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);

  // Standalone Size Chart Modal
  const [isGlobalSizeChartOpen, setIsGlobalSizeChartOpen] = useState(false);

  // Info Modals (Zero Dead Clicks)
  const [activeInfoModal, setActiveInfoModal] = useState<ModalType>(null);

  // Mobile Category Drawer State (Zero Dead Clicks pada Tab Kategori Mobile)
  const [isMobileCategoryDrawerOpen, setIsMobileCategoryDrawerOpen] = useState(false);

  // Helper resolusi nama kategori termasuk penawaran khusus 'sale'
  const getCategoryDisplayName = (slug: string) => {
    if (slug === 'sale') return 'Limited Offer 🔥';
    return categories.find((c) => c.slug === slug)?.name || slug;
  };

  // Load Initial Wishlist
  useEffect(() => {
    const saved = dataStore.getWishlist();
    setWishlist(saved);
  }, []);

  // Sync from URL Query Parameters
  useEffect(() => {
    const cat = searchParams.get('category');
    const gen = searchParams.get('gender');
    const q = searchParams.get('search');
    const loginReq = searchParams.get('login');
    if (cat) setSelectedCategory(cat);
    if (gen) setSelectedGender(gen);
    if (q) setSearchQuery(q);
    if (loginReq === 'required') openAuthModal();
  }, [searchParams, openAuthModal]);

  // Fetch Categories & Products
  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const cats = await dataStore.getCategories();
      let prods = await dataStore.getProducts(selectedCategory, debouncedSearchQuery, selectedGender, sortBy);
      
      if (inStockOnly) {
        prods = prods.filter(p => p.stock > 0);
      }

      setCategories(cats);
      setProducts(prods);
      setIsLoading(false);
    }
    loadData();
  }, [selectedCategory, selectedGender, debouncedSearchQuery, sortBy, inStockOnly]);

  // Wishlist Handler
  const handleToggleWishlist = (product: Product) => {
    const res = dataStore.toggleWishlist(product);
    setWishlist(dataStore.getWishlist());
  };

  // Move from Wishlist to Cart (TICKET-03)
  const handleMoveToCart = (product: Product, size?: string) => {
    const chosenSize = size || product.sizes[0] || 'M';
    handleAddToCart(product, chosenSize, product.colors[0]?.name || 'Standard', 1);
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  };

  // Add to Cart Handler (Supports Toast Feedback vs Direct Drawer Open)
  const handleAddToCart = (
    product: Product, 
    size: string, 
    colorName: string, 
    quantity: number = 1,
    openDrawer: boolean = false
  ) => {
    setCartItems((prev) => {
      const existingIdx = prev.findIndex(
        (it) => it.product.id === product.id && it.selected_size === size && it.selected_color === colorName
      );
      if (existingIdx !== -1) {
        const updated = [...prev];
        const newQty = updated[existingIdx].quantity + quantity;
        if (newQty <= product.stock) {
          updated[existingIdx].quantity = newQty;
        }
        return updated;
      } else {
        return [...prev, { product, selected_size: size, selected_color: colorName, quantity }];
      }
    });

    if (openDrawer) {
      setIsCartOpen(true);
    } else {
      setToast({
        visible: true,
        productName: product.name,
        colorName,
        size,
      });
    }
  };

  // Instant Buy (Langsung Buka Checkout Modal)
  const handleInstantBuy = (product: Product, size: string, colorName: string, quantity: number = 1) => {
    setCartItems([{ product, selected_size: size, selected_color: colorName, quantity }]);
    setSelectedProductForDetail(null);
    setIsCheckoutOpen(true);
  };

  // Update Cart Qty
  const handleUpdateQty = (index: number, newQty: number) => {
    setCartItems((prev) => {
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      const updated = [...prev];
      if (newQty <= updated[index].product.stock) {
        updated[index].quantity = newQty;
      }
      return updated;
    });
  };

  // Remove Item from Cart
  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Confirm Order Transaction (TPS)
  const handleConfirmOrder = async (payload: {
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    shipping_courier: string;
    shipping_cost: number;
    coupon_code?: string;
    discount_amount?: number;
    payment_method: 'QRIS' | 'Bank Transfer' | 'COD';
    bank_name?: string;
  }) => {
    const res = await dataStore.createOrder({
      ...payload,
      cart_items: cartItems,
    });

    if (res.success) {
      // Refresh produk agar stok terupdate instan
      const prods = await dataStore.getProducts(selectedCategory, searchQuery, selectedGender, sortBy);
      setProducts(prods);
    }

    return res;
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Curated Lists for Editorial Homepage Sections (Eliminate Duplication)
  // 1. Limited Offer: 4 produk diskon/sale
  const limitedOfferProducts = products
    .filter((p) => p.is_sale || (p.original_price && p.original_price > p.price))
    .slice(0, 4);

  // 2. Best of LifeWear: 4 produk ikonik rating tinggi yang BUKAN bagian dari Limited Offer
  const limitedOfferIds = new Set(limitedOfferProducts.map((p) => p.id));
  const bestOfLifeWearProducts = products
    .filter((p) => !limitedOfferIds.has(p.id) && ((p.rating || 0) >= 4.6 || p.is_featured))
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-[#E60012] selection:text-white">
      
      {/* 1. Global Navigation Bar */}
      <Navbar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={(slug) => {
          setSelectedCategory(slug);
        }}
        selectedGender={selectedGender}
        onSelectGender={(g) => {
          setSelectedGender(g);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenInfoModal={(type) => setActiveInfoModal(type)}
        onSelectSort={(sort) => {
          setSortBy(sort);
          const el = document.getElementById('katalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      <main className="flex-1 pb-24 md:pb-12">
        
        {/* 2. Hero Lookbook & Category Story Tiles */}
        {!searchQuery && (
          <>
            {/* 2a. Hero Lookbook Slider (Overlay behind Navbar) */}
            <div className="-mt-16 sm:-mt-20 relative z-0">
              <LookbookSlider
                onSelectCategory={(slug) => {
                  setSelectedCategory(slug);
                  const el = document.getElementById('katalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              />
            </div>

            {/* 2b. Visual Category Story Tiles (TICKET-02: Selalu Tampil agar Mudah Berpindah Kategori) */}
            <CategoryBubbles
              selectedCategory={selectedCategory}
              onSelectCategory={(slug) => {
                if (slug === 'sale') {
                  if (selectedCategory !== 'all') {
                    setSelectedCategory('all');
                  }
                  setTimeout(() => {
                    const el = document.getElementById('limited-offer');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }, 50);
                } else {
                  setSelectedCategory(slug);
                  const el = document.getElementById('katalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              onScrollToCatalog={() => {
                const el = document.getElementById('katalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 2c. Curated Sections (Hanya Tampil di Mode Semua Koleksi) */}
            {selectedCategory === 'all' && (
              <>
                {/* 2c. Curated Section 1: LIMITED OFFER 🔥 (TICKET-04) */}
                {limitedOfferProducts.length > 0 && (
                  <section id="limited-offer" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-b border-zinc-200">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#E60012] text-white text-[9px] font-black uppercase tracking-widest mb-1.5">
                      <Sparkles size={11} />
                      <span>PENAWARAN TERBATAS MINGGU INI</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 flex items-center gap-2">
                      <span>LIMITED OFFER</span>
                      <span className="text-[#E60012]">🔥</span>
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Koleksi pilihan dengan potongan harga khusus untuk waktu terbatas.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('sale');
                      const el = document.getElementById('katalog');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-bold uppercase tracking-wider text-[#E60012] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Lihat Seluruh Penawaran</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:grid-cols-4">
                  {limitedOfferProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onOpenDetail={(p) => setSelectedProductForDetail(p)}
                      onAddToCart={(p, size, color) => handleAddToCart(p, size, color, 1, false)}
                      isWishlisted={wishlist.some(w => w.id === prod.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 2d. Storytelling Section: Filosofi Bahan Tekstil (TICKET-03) */}
            <LifeWearStorySection
              onExploreClick={() => {
                const el = document.getElementById('katalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
              onSelectCategory={(slug) => {
                setSelectedCategory(slug);
                const el = document.getElementById('katalog');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            {/* 2e. Curated Section 2: BEST OF LIFEWEAR ⭐ (TICKET-04) */}
            {bestOfLifeWearProducts.length > 0 && (
              <section id="best-seller" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 border-b border-zinc-200">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-zinc-900 text-white text-[9px] font-black uppercase tracking-widest mb-1.5">
                      <span>PILIHAN TERBAIK KONSUMEN</span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950 flex items-center gap-2">
                      <span>BEST OF LIFEWEAR</span>
                      <span className="text-amber-500">⭐</span>
                    </h2>
                    <p className="text-xs text-zinc-500 mt-1">
                      Koleksi paling dicari dengan tingkat kepuasan pelanggan tertinggi di atas 4.8 bintang.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSortBy('popular');
                      const el = document.getElementById('katalog');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs font-bold uppercase tracking-wider text-zinc-800 hover:text-[#E60012] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Urutkan Terpopuler</span>
                    <ArrowRight size={13} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:grid-cols-4">
                  {bestOfLifeWearProducts.map((prod) => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onOpenDetail={(p) => setSelectedProductForDetail(p)}
                      onAddToCart={(p, size, color) => handleAddToCart(p, size, color, 1, false)}
                      isWishlisted={wishlist.some(w => w.id === prod.id)}
                      onToggleWishlist={handleToggleWishlist}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* 2f. Inspirasi Gaya OOTD (StyleHint Community) */}
            <section className="bg-zinc-50 border-b border-zinc-200 py-10 sm:py-14">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 font-mono">
                    // STYLEHINT COMMUNITY
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-950">
                    Inspirasi Padu Padan Gaya Hidup Nyata
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Temukan inspirasi padu padan outfit fungsional dari komunitas pengguna LifeWear.
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {[
                    { title: 'Kasual Santai Akhir Pekan', tag: 'Kaos Boxy + Easy Shorts', category: 'kaos', img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80' },
                    { title: 'Smart Casual Kantor', tag: 'Kemeja Flannel + Ankle Pants', category: 'kemeja', img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80' },
                    { title: 'Streetwear Minimalis', tag: 'Parka UV + Chino Relaxed', category: 'jaket', img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80' },
                    { title: 'Gaya Monokrom Elegan', tag: 'Oxford Shirt + Chino Hitam', category: 'celana', img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80' },
                  ].map((look, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(look.category);
                        const el = document.getElementById('katalog');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="group relative aspect-[3/4] bg-zinc-200 overflow-hidden border border-zinc-200 text-left cursor-pointer focus:outline-none"
                      title={`Lihat inspirasi koleksi ${look.title}`}
                    >
                      <img src={look.img} alt={look.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-3.5 flex flex-col justify-end text-white">
                        <span className="text-[9px] font-mono text-zinc-300 uppercase tracking-widest">{look.tag}</span>
                        <div className="flex items-center justify-between mt-0.5">
                          <h4 className="text-xs font-bold uppercase tracking-tight">{look.title}</h4>
                          <span className="text-[10px] font-mono text-zinc-300 group-hover:text-white group-hover:translate-x-0.5 transition-all">Lihat →</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {/* 2g. BENEFIT MEMBER: KARTU DIGITAL BARCODE & VOUCHER RP 50.000 (PRD SECTION 8) */}
            <MemberLoyaltyBanner 
              user={user} 
              onOpenAuthModal={openAuthModal} 
            />
          </>
        )}
      </>
    )}

        {/* 3. Catalog Section */}
        <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
          
          {/* Section Header & Breadcrumbs */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-200 pb-5">
            <div>
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1">
                <span>BERANDA</span>
                <span>/</span>
                <span className="text-[#E60012]">
                  {selectedGender === 'all' ? 'SEMUA KOLEKSI' : selectedGender.toUpperCase()}
                </span>
                {selectedCategory !== 'all' && (
                  <>
                    <span>/</span>
                    <span className="text-zinc-800">
                      {getCategoryDisplayName(selectedCategory)}
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950">
                {selectedCategory === 'all' 
                  ? (selectedGender === 'all' ? 'Semua Koleksi Busana LifeWear' : `Koleksi ${selectedGender.toUpperCase()}`)
                  : getCategoryDisplayName(selectedCategory)}
              </h2>
              <p className="text-xs text-zinc-500 mt-1">
                Koleksi pakaian fungsional berdesain sederhana dan berkualitas tinggi untuk kenyamanan keseharian.
              </p>
            </div>

            {/* Sorting & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full border-t border-zinc-100 pt-3">
              <div className="text-[11px] font-medium text-zinc-500 uppercase tracking-wider">
                Menampilkan <strong className="text-zinc-950 font-mono font-bold">{products.length}</strong> dari <strong className="text-zinc-950 font-mono font-bold">{products.length}</strong> Produk LifeWear
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* In-stock toggle */}
                <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 uppercase tracking-wider cursor-pointer select-none border border-zinc-200 px-3 py-2 bg-zinc-50 hover:bg-zinc-100 rounded-none">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded-none text-[#E60012] focus:ring-0 w-3.5 h-3.5"
                  />
                  <span>Hanya Ready Stock</span>
                </label>

                {/* Sort Dropdown */}
                <div className="flex items-center border border-zinc-300 bg-white px-3 py-2 text-xs rounded-none">
                  <ArrowUpDown size={13} className="text-zinc-500 mr-2 shrink-0" />
                  <span className="text-zinc-400 font-bold uppercase mr-2 hidden sm:inline">Urutkan:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-transparent font-bold text-zinc-900 uppercase focus:outline-none cursor-pointer rounded-none"
                  >
                    <option value="featured">Rekomendasi (Featured)</option>
                    <option value="popular">Paling Populer (Rating)</option>
                    <option value="price-asc">Harga: Rendah ke Tinggi</option>
                    <option value="price-desc">Harga: Tinggi ke Rendah</option>
                    <option value="newest">Koleksi Terbaru</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filter & Search Badges Strip */}
          {(selectedGender !== 'all' || selectedCategory !== 'all' || inStockOnly || searchQuery) && (
            <div className="p-3 bg-zinc-50 border border-zinc-200 flex flex-wrap items-center justify-between gap-2.5 text-xs animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-zinc-400 mr-1 flex items-center gap-1">
                  <Filter size={12} />
                  <span>Filter Aktif:</span>
                </span>

                {selectedGender !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedGender('all')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 text-[11px] font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer group shadow-2xs"
                    title="Hapus filter gender"
                  >
                    <span>Gender: {selectedGender === 'pria' ? 'Pria' : 'Wanita'}</span>
                    <X size={12} className="text-zinc-400 group-hover:text-[#E60012]" />
                  </button>
                )}

                {selectedCategory !== 'all' && (
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 text-[11px] font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer group shadow-2xs"
                    title="Hapus filter kategori"
                  >
                    <span>Kategori: {getCategoryDisplayName(selectedCategory)}</span>
                    <X size={12} className="text-zinc-400 group-hover:text-[#E60012]" />
                  </button>
                )}

                {inStockOnly && (
                  <button
                    type="button"
                    onClick={() => setInStockOnly(false)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 text-[11px] font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer group shadow-2xs"
                    title="Tampilkan semua stok"
                  >
                    <span>Hanya Ready Stock</span>
                    <X size={12} className="text-zinc-400 group-hover:text-[#E60012]" />
                  </button>
                )}

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 text-[11px] font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer group shadow-2xs"
                    title="Hapus pencarian"
                  >
                    <span>Cari: "{searchQuery}"</span>
                    <X size={12} className="text-zinc-400 group-hover:text-[#E60012]" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelectedGender('all');
                  setSelectedCategory('all');
                  setInStockOnly(false);
                  setSearchQuery('');
                }}
                className="text-[11px] font-bold text-[#E60012] hover:underline uppercase tracking-wider cursor-pointer ml-auto"
              >
                Reset Semua Filter ✕
              </button>
            </div>
          )}

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6 py-12">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-3 animate-pulse">
                  <div className="aspect-[3/4] bg-zinc-200" />
                  <div className="h-4 bg-zinc-200 w-3/4" />
                  <div className="h-4 bg-zinc-200 w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400">
                <SlidersHorizontal size={32} />
              </div>
              <h3 className="text-base font-black uppercase tracking-wider text-zinc-900">
                Tidak Ada Produk yang Sesuai
              </h3>
              <p className="text-xs text-zinc-500">
                Coba sesuaikan filter kategori, ubah kata kunci pencarian, atau matikan filter stok.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedGender('all');
                  setSearchQuery('');
                  setInStockOnly(false);
                }}
                className="px-6 py-2.5 bg-zinc-900 hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none"
              >
                Tampilkan Semua Koleksi
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 md:grid-cols-3 lg:grid-cols-4">
                {products.slice(0, visibleCount).map((prod) => (
                  <ProductCard
                    key={prod.id}
                    product={prod}
                    onOpenDetail={(p) => setSelectedProductForDetail(p)}
                    onAddToCart={(p, size, color) => handleAddToCart(p, size, color, 1, false)}
                    isWishlisted={wishlist.some(w => w.id === prod.id)}
                    onToggleWishlist={handleToggleWishlist}
                  />
                ))}
              </div>

              {/* Load More Button (+ Tampilkan Koleksi Lainnya) */}
              {visibleCount < products.length && (
                <div className="pt-8 sm:pt-10 text-center space-y-2">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((prev) => Math.min(products.length, prev + 8))}
                    className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-zinc-950 text-zinc-950 hover:text-white border-2 border-zinc-950 text-xs font-black uppercase tracking-widest transition-all rounded-none cursor-pointer shadow-xs inline-flex items-center justify-center gap-2 group"
                  >
                    <span>+ Tampilkan Koleksi Lainnya</span>
                    <span className="text-[10px] text-zinc-400 group-hover:text-zinc-300 font-mono">
                      ({products.length - visibleCount} Produk Tersisa)
                    </span>
                  </button>
                  <p className="text-[11px] text-zinc-400 font-medium">
                    Menampilkan <strong className="text-zinc-900 font-mono">{Math.min(visibleCount, products.length)}</strong> dari <strong className="text-zinc-900 font-mono">{products.length}</strong> produk LifeWear
                  </p>
                </div>
              )}
            </>
          )}

        </section>

      </main>

      {/* 4. Footer */}
      <Footer 
        onOpenInfoModal={(type) => setActiveInfoModal(type)}
        onOpenSizeChart={() => setIsGlobalSizeChartOpen(true)}
        onSelectCategory={(slug) => {
          setSelectedCategory(slug);
          const el = document.getElementById('katalog');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* 5. Product Detail Modal (PDP) */}
      <ProductDetailModal
        product={selectedProductForDetail}
        isOpen={Boolean(selectedProductForDetail)}
        onClose={() => setSelectedProductForDetail(null)}
        onAddToCart={(p, size, color, qty) => handleAddToCart(p, size, color, qty, true)}
        onInstantBuy={(p, size, color, qty) => handleInstantBuy(p, size, color, qty)}
        isWishlisted={selectedProductForDetail ? wishlist.some(w => w.id === selectedProductForDetail.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onOpenInfoModal={(type) => setActiveInfoModal(type)}
      />

      {/* 6. Global Standalone Size Chart Modal */}
      <SizeChartModal
        isOpen={isGlobalSizeChartOpen}
        onClose={() => setIsGlobalSizeChartOpen(false)}
        productName="Standar Ukuran Busana Universal"
        categoryName="Kemeja & Celana"
      />

      {/* 7. Information Modals (Zero Dead Clicks) */}
      <InformationModals
        type={activeInfoModal}
        onClose={() => setActiveInfoModal(null)}
      />

      {/* Auth Modal (Member & Admin Login/Register) */}
      <AuthModal />

      {/* 8. Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        onRemoveFromWishlist={(id) => {
          const prod = wishlist.find(p => p.id === id);
          if (prod) handleToggleWishlist(prod);
        }}
        onMoveToCart={handleMoveToCart}
      />

      {/* 9. Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        selectedCourier={selectedCourier}
        onSelectCourier={setSelectedCourier}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      {/* 10. Checkout Transaction Modal (TPS + QRIS) */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        selectedCourier={selectedCourier}
        onConfirmOrder={handleConfirmOrder}
        onOrderSuccess={() => {
          setCartItems([]);
        }}
      />

      {/* 11. Toast Feedback Belanja (UI-06) */}
      {toast.visible && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 max-w-sm w-[calc(100%-2rem)] bg-white border-2 border-zinc-950 p-4 shadow-2xl animate-in slide-in-from-bottom-4 duration-300 rounded-none">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-[#E60012] text-white flex items-center justify-center shrink-0 text-xs font-black">
              ✓
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#E60012]">
                ITEM MASUK KE TAS BELANJA
              </p>
              <p className="text-xs font-bold text-zinc-950 line-clamp-1 uppercase">
                {toast.productName}
              </p>
              <p className="text-[10px] text-zinc-500 font-medium">
                Varian: {toast.colorName} • Ukuran {toast.size}
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
                  className="px-2.5 py-1.5 border border-zinc-300 hover:border-zinc-950 text-[10px] font-bold uppercase tracking-wider text-zinc-800 rounded-none transition-colors"
                >
                  Lanjut Belanja
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setToast((prev) => ({ ...prev, visible: false }));
                    setIsCartOpen(true);
                  }}
                  className="px-3 py-1.5 bg-zinc-950 hover:bg-[#E60012] text-white text-[10px] font-bold uppercase tracking-wider rounded-none transition-colors flex items-center gap-1"
                >
                  <span>Lihat Tas</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setToast((prev) => ({ ...prev, visible: false }))}
              className="text-zinc-400 hover:text-zinc-950 p-1"
              aria-label="Tutup notifikasi"
            >
              <X size={15} />
            </button>
          </div>
        </div>
      )}

      {/* 12. Mobile Sticky Bottom Navigation Bar (TICKET-01: Thumb Zone 5-Tab) */}
      {(() => {
        const isHomeActive = selectedCategory === 'all' && selectedGender === 'all' && !searchQuery && !inStockOnly && !isWishlistOpen && !isCartOpen;
        const isCategoryActive = (selectedCategory !== 'all' || selectedGender !== 'all') && !isWishlistOpen && !isCartOpen;
        const isWishlistActive = isWishlistOpen;
        const isCartActive = isCartOpen;

        return (
          <nav 
            aria-label="Mobile Navigation"
            className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-zinc-200 md:hidden flex justify-around items-center py-1.5 px-1 shadow-[0_-4px_16px_rgba(0,0,0,0.06)]"
          >
            {/* Tab 1: Beranda */}
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedGender('all');
                setSearchQuery('');
                setInStockOnly(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                isHomeActive ? 'text-[#E60012] font-black' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <Home size={19} className={isHomeActive ? 'stroke-[2.5]' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Beranda</span>
              <span className={`w-1 h-1 rounded-full mt-0.5 ${isHomeActive ? 'bg-[#E60012]' : 'bg-transparent'}`} />
            </button>

            {/* Tab 2: Kategori */}
            <button
              type="button"
              onClick={() => setIsMobileCategoryDrawerOpen(true)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
                isCategoryActive || isMobileCategoryDrawerOpen ? 'text-[#E60012] font-black' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <SlidersHorizontal size={19} className={isCategoryActive || isMobileCategoryDrawerOpen ? 'stroke-[2.5]' : ''} />
              <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Kategori</span>
              <span className={`w-1 h-1 rounded-full mt-0.5 ${isCategoryActive || isMobileCategoryDrawerOpen ? 'bg-[#E60012]' : 'bg-transparent'}`} />
            </button>

            {/* Tab 3: Favorit */}
            <button
              type="button"
              onClick={() => setIsWishlistOpen(true)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
                isWishlistActive ? 'text-[#E60012] font-black' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <div className="relative">
                <Heart size={19} fill={wishlist.length > 0 ? '#E60012' : 'none'} className={wishlist.length > 0 ? 'text-[#E60012]' : ''} />
                {wishlist.length > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#E60012] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                    {wishlist.length}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Favorit</span>
              <span className={`w-1 h-1 rounded-full mt-0.5 ${isWishlistActive ? 'bg-[#E60012]' : 'bg-transparent'}`} />
            </button>

            {/* Tab 4: Tas Belanja */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors relative ${
                isCartActive ? 'text-[#E60012] font-black' : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <div className="relative">
                <ShoppingBag size={19} className={isCartActive ? 'stroke-[2.5]' : ''} />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#E60012] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center font-mono">
                    {totalCartCount}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Tas</span>
              <span className={`w-1 h-1 rounded-full mt-0.5 ${isCartActive ? 'bg-[#E60012]' : 'bg-transparent'}`} />
            </button>

            {/* Tab 5: Akun */}
            <button
              type="button"
              onClick={() => {
                if (user) {
                  router.push('/account');
                } else {
                  openAuthModal();
                }
              }}
              className="flex flex-col items-center justify-center flex-1 py-1 text-zinc-600 hover:text-[#E60012] active:text-[#E60012] transition-colors"
            >
              <User size={19} />
              <span className="text-[10px] font-bold uppercase tracking-wider mt-0.5">Akun</span>
              <span className="w-1 h-1 rounded-full mt-0.5 bg-transparent" />
            </button>
          </nav>
        );
      })()}

      {/* 13. Mobile Category Navigation Drawer / Sheet (Zero Dead Clicks pada Tab Kategori Mobile) */}
      {isMobileCategoryDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden font-sans">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileCategoryDrawerOpen(false)}
          />

          {/* Slide-up Sheet */}
          <div className="fixed inset-x-0 bottom-0 bg-white border-t border-zinc-300 shadow-2xl animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col rounded-none z-10">
            {/* Header */}
            <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-[#E60012] text-white flex items-center justify-center font-black text-xs">
                  US
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-950">
                    Pilih Kategori Busana
                  </h3>
                  <span className="text-[9px] text-zinc-400 font-mono tracking-widest uppercase">
                    // LIFEWEAR CATALOG DIRECTORY
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileCategoryDrawerOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors"
                aria-label="Tutup menu kategori"
              >
                <X size={20} />
              </button>
            </div>

            {/* Gender Toggle Segment */}
            <div className="p-3 border-b border-zinc-200 bg-zinc-100/70">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1.5">
                Target Gender:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: 'SEMUA', val: 'all' },
                  { label: 'PRIA (MEN)', val: 'pria' },
                  { label: 'WANITA (WOMEN)', val: 'wanita' },
                ].map((g) => (
                  <button
                    key={g.val}
                    type="button"
                    onClick={() => setSelectedGender(g.val)}
                    className={`py-2 text-[11px] font-black uppercase tracking-wider text-center transition-colors rounded-none border ${
                      selectedGender === g.val
                        ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                        : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-500'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Buttons List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                Kategori Busana:
              </span>
              {[
                { name: 'Semua Koleksi Busana', slug: 'all', desc: 'Tampilkan seluruh ragam katalog pakaian LifeWear' },
                { name: 'Kemeja & Flannel', slug: 'kemeja', desc: 'Katun halus double-brushed, overshirt, & kasual' },
                { name: 'Kaos & AIRism', slug: 'kaos', desc: 'Katun heavyweight 280 GSM & serat sejuk bernapas' },
                { name: 'Celana Chino & Ankle', slug: 'celana', desc: 'Ultra Stretch fleksibel & siluet santai harian' },
                { name: 'Jaket & Outerwear', slug: 'jaket', desc: 'Parka proteksi UV saku lipat & French Terry Hoodie' },
                { name: 'Limited Offer 🔥', slug: 'sale', desc: 'Penawaran potongan harga khusus minggu ini' },
              ].map((c) => {
                const isSelected = selectedCategory === c.slug;
                return (
                  <button
                    key={c.slug}
                    type="button"
                    onClick={() => {
                      if (c.slug === 'sale') {
                        setSelectedCategory('sale');
                      } else {
                        setSelectedCategory(c.slug);
                      }
                      setIsMobileCategoryDrawerOpen(false);
                      setTimeout(() => {
                        const el = document.getElementById('katalog');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }}
                    className={`w-full text-left p-3 border transition-colors flex items-center justify-between rounded-none cursor-pointer ${
                      isSelected
                        ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950'
                        : 'border-zinc-200 hover:border-zinc-400 bg-white'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-black uppercase tracking-tight ${c.slug === 'sale' ? 'text-[#E60012]' : 'text-zinc-950'}`}>
                          {c.name}
                        </span>
                        {isSelected && (
                          <span className="text-[9px] bg-zinc-950 text-white font-mono uppercase px-1.5 py-0.2">
                            AKTIF
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-500 font-medium">
                        {c.desc}
                      </p>
                    </div>
                    <ArrowRight size={14} className="text-zinc-400 shrink-0" />
                  </button>
                );
              })}
            </div>

            {/* Quick Actions Footer */}
            <div className="p-3 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedGender('all');
                  setIsMobileCategoryDrawerOpen(false);
                  const el = document.getElementById('katalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="text-[11px] font-bold text-zinc-600 hover:text-[#E60012] uppercase tracking-wider cursor-pointer"
              >
                Reset Filter
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileCategoryDrawerOpen(false);
                  const el = document.getElementById('katalog');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-zinc-950 text-white text-[11px] font-bold uppercase tracking-wider rounded-none cursor-pointer"
              >
                Lihat Hasil Katalog →
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <HomePageContent />
    </Suspense>
  );
}
