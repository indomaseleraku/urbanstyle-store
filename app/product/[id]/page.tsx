// app/product/[id]/page.tsx
'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { notFound, useRouter } from 'next/navigation';
import { Product, ColorVariant, Category } from '@/lib/types';
import { dataStore } from '@/lib/store';
import { getOptimizedImageUrl } from '@/lib/utils';
import Navbar from '@/components/Navbar';
import SizeChartModal from '@/components/SizeChartModal';
import WishlistDrawer from '@/components/WishlistDrawer';
import CartDrawer from '@/components/CartDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import InformationModals, { ModalType } from '@/components/InformationModals';
import { AuthModal } from '@/components/AuthModal';
import Footer from '@/components/Footer';
import { 
  ArrowLeft, 
  Star, 
  Heart, 
  ShoppingBag, 
  Ruler, 
  Check, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp,
  MessageSquarePlus,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = Number(resolvedParams.id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string | null>('desc');

  // Review Form state
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  // Cart & Wishlist state
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState('J&T Express (Reguler)');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<ModalType>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const [p, cats, allProds] = await Promise.all([
        dataStore.getProductById(productId),
        dataStore.getCategories(),
        dataStore.getProducts(),
      ]);
      setProduct(p);
      setCategories(cats);
      if (p && p.sizes.length > 0) {
        const availableSize = p.sizes.find(sz => !p.out_of_stock_sizes?.includes(sz)) || p.sizes[0];
        setSelectedSize(availableSize);
      }
      if (allProds) {
        setRelatedProducts(allProds.filter(it => it.id !== productId).slice(0, 4));
      }
      setIsLoading(false);
      setWishlist(dataStore.getWishlist());
    }
    load();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="space-y-3 text-center">
          <div className="w-8 h-8 border-2 border-[#E60012] border-t-transparent animate-spin mx-auto" />
          <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">Memuat Koleksi...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <h1 className="text-xl font-black uppercase text-zinc-950">Produk Tidak Ditemukan</h1>
          <p className="text-xs text-zinc-500">Busana yang Anda cari mungkin sudah habis atau tautan tidak valid.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E60012] transition-colors rounded-none"
          >
            <ArrowLeft size={14} /> Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const currentColor: ColorVariant = product.colors[selectedColorIndex] || {
    name: 'Standard',
    code: '09 BLACK',
    hex: '#000000',
    image_url: product.image_url,
  };

  const galleryList = product.gallery_images && product.gallery_images.length > 0
    ? [currentColor.image_url, ...product.gallery_images.filter(img => img !== currentColor.image_url)]
    : [currentColor.image_url];

  const mainDisplayImage = galleryList[activeImageIndex] || currentColor.image_url;

  const handleAddToCart = () => {
    if (product.stock <= 0) return;
    setCartItems(prev => {
      const idx = prev.findIndex(it => it.product.id === product.id && it.selected_size === selectedSize && it.selected_color === currentColor.name);
      if (idx !== -1) {
        const u = [...prev];
        u[idx].quantity += quantity;
        return u;
      }
      return [...prev, { product, selected_size: selectedSize, selected_color: currentColor.name, quantity }];
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
    setIsCartOpen(true);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    setCartItems([{ product, selected_size: selectedSize, selected_color: currentColor.name, quantity }]);
    setIsCheckoutOpen(true);
  };

  const handleToggleWishlist = () => {
    dataStore.toggleWishlist(product);
    setWishlist(dataStore.getWishlist());
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !newComment.trim()) return;

    const newRev = await dataStore.addReview(product.id, {
      reviewer_name: reviewerName,
      rating: newRating,
      size_purchased: selectedSize,
      fit_rating: 'Pas Sesuai Ukuran',
      comment: newComment,
    });

    if (!product.reviews) product.reviews = [];
    if (!product.reviews.some(r => r.id === newRev.id)) {
      product.reviews.unshift(newRev);
    }
    product.reviews_count = product.reviews.length;

    setReviewSubmitted(true);
    setTimeout(() => {
      setIsAddingReview(false);
      setReviewSubmitted(false);
      setReviewerName('');
      setNewComment('');
    }, 1500);
  };

  const isWishlisted = wishlist.some(w => w.id === product.id);
  const isOutOfStock = product.stock <= 0;
  const isCriticalStock = product.stock > 0 && product.stock <= 5;
  const isLowStock = product.stock > 5 && product.stock <= 15;
  const hasDiscount = Boolean(product.original_price && product.original_price > product.price);

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-[#E60012] selection:text-white font-sans">
      
      {/* Top Navbar */}
      <Navbar
        categories={categories}
        selectedCategory="all"
        onSelectCategory={(slug) => router.push(slug === 'all' ? '/' : `/?category=${slug}`)}
        selectedGender="all"
        onSelectGender={(g) => router.push(g === 'all' ? '/' : `/?gender=${g}`)}
        searchQuery=""
        onSearchChange={(q) => router.push(`/?search=${encodeURIComponent(q)}`)}
        cartCount={cartItems.reduce((s, it) => s + it.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenInfoModal={(t) => setActiveInfoModal(t)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 flex-1 pb-28 md:pb-12">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-zinc-950 flex items-center gap-1">
            <ArrowLeft size={13} /> Beranda
          </Link>
          <span>/</span>
          <span className="text-zinc-800">{product.category_name}</span>
          <span>/</span>
          <span className="text-[#E60012] line-clamp-1">{product.name}</span>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Gallery Column (UI-02: Sticky Split View) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="relative aspect-[3/4] bg-[#F6F6F6] border border-zinc-200 overflow-hidden rounded-none">
              <img
                src={getOptimizedImageUrl(mainDisplayImage, 900, 80)}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />

              <div className="absolute top-4 left-4 flex flex-col gap-1.5 items-start">
                {product.is_new && (
                  <span className="bg-[#111111] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-none shadow-xs">
                    NEW ARRIVAL
                  </span>
                )}
                {hasDiscount && (
                  <span className="bg-[#E60012] text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-none shadow-xs">
                    LIMITED OFFER
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`absolute top-4 right-4 p-3 border transition-all rounded-none ${
                  isWishlisted
                    ? 'bg-[#E60012] border-[#E60012] text-white'
                    : 'bg-white/95 border-zinc-300 text-zinc-700 hover:text-[#E60012]'
                }`}
                aria-label="Wishlist"
              >
                <Heart size={20} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Thumbnail Gallery Strip */}
            {galleryList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryList.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-28 shrink-0 bg-[#F6F6F6] border-2 overflow-hidden transition-all rounded-none ${
                      activeImageIndex === idx
                        ? 'border-black ring-1 ring-black'
                        : 'border-zinc-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={getOptimizedImageUrl(img, 160, 70)} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className="lg:col-span-5 space-y-5">
            
            <div className="space-y-1.5 border-b border-zinc-200 pb-4">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                {product.category_name || 'Koleksi'} // {(product.gender || 'unisex').toUpperCase()}
              </span>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-950 leading-tight">
                {product.name}
              </h1>

              {/* Rating Summary */}
              <div className="flex items-center gap-2 pt-1">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'}
                      className={i < Math.floor(product.rating || 5) ? '' : 'text-zinc-300'}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold font-mono text-zinc-800">{product.rating || 4.8}</span>
                <span className="text-xs text-zinc-400 font-mono">({product.reviews_count || 12} Ulasan)</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="space-y-1">
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className={`text-2xl sm:text-3xl font-black font-mono tracking-tight ${hasDiscount ? 'text-[#E60012]' : 'text-zinc-950'}`}>
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
                {hasDiscount && (
                  <span className="text-sm font-mono text-zinc-400 line-through">
                    Rp {product.original_price?.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold uppercase text-zinc-500 font-mono block">
                SKU: US-{product.id.toString().padStart(4, '0')} // LIFEWEAR ESSENTIAL
              </span>
            </div>

            {/* Stock alert */}
            <div>
              {isOutOfStock ? (
                <div className="p-2.5 bg-zinc-900 text-white text-xs font-bold uppercase text-center rounded-none">
                  Habis Terjual
                </div>
              ) : isCriticalStock ? (
                <div className="p-2.5 bg-red-50 border border-red-200 text-[#E60012] text-xs font-bold uppercase flex items-center justify-between animate-pulse rounded-none">
                  <span>⚡ Stok Terbatas!</span>
                  <span>Sisa {product.stock} Unit</span>
                </div>
              ) : isLowStock ? (
                <div className="p-2.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase flex items-center justify-between rounded-none">
                  <span>Stok Menipis</span>
                  <span>Tersedia {product.stock} Unit</span>
                </div>
              ) : (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase flex items-center justify-between rounded-none">
                  <span>Status: Ready Stock</span>
                  <span className="font-bold">{product.stock} Unit</span>
                </div>
              )}
            </div>

            {/* Color Swatches (TICKET-04) */}
            <div className="space-y-2 pt-2 border-t border-zinc-200">
              <div className="flex justify-between text-xs">
                <span className="font-bold uppercase text-zinc-700">Warna Terpilih:</span>
                <span className="font-mono font-bold text-zinc-950 uppercase">
                  {currentColor.code ? `Warna: ${currentColor.code}` : currentColor.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {product.colors.map((c, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSelectedColorIndex(idx);
                      setActiveImageIndex(0);
                    }}
                    className={`relative w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center min-w-[44px] min-h-[44px] ${
                      selectedColorIndex === idx ? 'border-zinc-950 scale-110 shadow-sm ring-1 ring-zinc-950' : 'border-zinc-300'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={`Warna: ${c.code || c.name}`}
                    aria-label={c.code || c.name}
                  >
                    {selectedColorIndex === idx && (
                      <Check size={14} className="text-white drop-shadow-md" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Matrix (UI-02 / TICKET-02: Kotak Ukuran Tegas 44px+ & Garis Coret Diagonal Habis) */}
            <div className="space-y-2 pt-2 border-t border-zinc-200">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold uppercase text-zinc-700">Pilih Ukuran:</span>
                <button
                  type="button"
                  onClick={() => setIsSizeChartOpen(true)}
                  className="text-[#E60012] hover:underline font-bold flex items-center gap-1 text-[11px] uppercase"
                >
                  <Ruler size={13} />
                  <span>Panduan Ukuran (cm)</span>
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((s) => {
                  const isSelected = selectedSize === s;
                  const isSizeDisabled = isOutOfStock || Boolean(product.out_of_stock_sizes?.includes(s));
                  return (
                    <button
                      key={s}
                      type="button"
                      disabled={isSizeDisabled}
                      onClick={() => {
                        if (!isSizeDisabled) setSelectedSize(s);
                      }}
                      className={`relative px-4 py-3 text-xs font-bold uppercase transition-all border rounded-none min-h-[44px] min-w-[44px] flex items-center justify-center ${
                        isSizeDisabled 
                          ? 'border-zinc-200 text-zinc-300 bg-zinc-50 cursor-not-allowed overflow-hidden after:content-[""] after:absolute after:inset-0 after:border-t after:border-zinc-300 after:rotate-45 after:translate-y-1/2'
                          : isSelected
                          ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs'
                          : 'border-zinc-300 bg-white text-zinc-800 hover:border-zinc-950'
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-xs">
              <span className="font-bold uppercase text-zinc-700">Kuantitas:</span>
              <div className="flex items-center border border-zinc-300 rounded-none bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 disabled:opacity-30 font-bold"
                  aria-label="Kurangi"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold font-mono text-zinc-950">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                  className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 disabled:opacity-30 font-bold"
                  aria-label="Tambah"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons (UI-02: Dual Action Uniqlo Style) */}
            <div className="space-y-2 pt-3">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full py-4 bg-[#111111] hover:bg-[#E60012] disabled:bg-zinc-300 text-white text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2 rounded-none min-h-[48px] shadow-sm"
              >
                {addedNotice ? (
                  <>
                    <Check size={16} className="text-emerald-400" />
                    <span>DIMASUKKAN KE TAS BELANJA!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>+ MASUKKAN KE TAS BELANJA</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 bg-white hover:bg-zinc-50 border border-zinc-950 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none min-h-[44px]"
              >
                <span>BELI SEKARANG (CHECKOUT LANGSUNG)</span>
                <ArrowRight size={14} />
              </button>
            </div>

            {/* Value Badges */}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-zinc-200 text-[10px] text-zinc-600 font-bold uppercase">
              <button
                type="button"
                onClick={() => setActiveInfoModal('shipping')}
                className="flex items-center gap-1.5 justify-center text-center hover:text-[#E60012] transition-colors cursor-pointer"
                title="Buka panduan pengiriman & gratis ongkir"
              >
                <Truck size={14} className="text-zinc-950 shrink-0" />
                <span>Bebas Ongkir &gt;400k</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveInfoModal('return')}
                className="flex items-center gap-1.5 justify-center text-center border-x border-zinc-200 hover:text-[#E60012] transition-colors cursor-pointer"
                title="Buka kebijakan retur garansi 30 hari"
              >
                <RotateCcw size={14} className="text-zinc-950 shrink-0" />
                <span>Garansi Retur 30 Hari</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveInfoModal('lifewear')}
                className="flex items-center gap-1.5 justify-center text-center hover:text-[#E60012] transition-colors cursor-pointer"
                title="Buka filosofi desain LifeWear"
              >
                <ShieldCheck size={14} className="text-zinc-950 shrink-0" />
                <span>100% Produk Original</span>
              </button>
            </div>

            {/* Accordions */}
            <div className="pt-2 divide-y divide-zinc-200 text-xs">
              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'desc' ? null : 'desc')}
                  className="w-full py-3 flex items-center justify-between text-left font-bold uppercase text-zinc-900"
                >
                  <span>Deskripsi & Siluet LifeWear</span>
                  {openAccordion === 'desc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'desc' && (
                  <div className="pb-4 text-zinc-600 space-y-2 leading-relaxed">
                    <p>{product.description}</p>
                    <p className="text-[11px] text-zinc-500">
                      Potongan presisi khas Japanese minimalism yang mengedepankan siluet bersih, fleksibel digunakan baik dalam suasana kasual kampus maupun profesional santai.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'fabric' ? null : 'fabric')}
                  className="w-full py-3 flex items-center justify-between text-left font-bold uppercase text-zinc-900"
                >
                  <span>Material & Spesifikasi Kain</span>
                  {openAccordion === 'fabric' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'fabric' && (
                  <div className="pb-4 text-zinc-600 space-y-2 leading-relaxed">
                    <p><strong className="text-zinc-900">Komposisi:</strong> {product.fabric_details || '100% Cotton Premium LifeWear Texture'}</p>
                    <p><strong className="text-zinc-900">Petunjuk Perawatan:</strong> {product.care_instructions || 'Cuci mesin dengan air dingin putaran lembut. Jangan gunakan pemutih klorin.'}</p>
                  </div>
                )}
              </div>

              {/* Reviews & Fit Rating Bar */}
              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'reviews' ? null : 'reviews')}
                  className="w-full py-3 flex items-center justify-between text-left font-bold uppercase text-zinc-900"
                >
                  <span>Ulasan Pembeli ({product.reviews?.length || 0})</span>
                  {openAccordion === 'reviews' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openAccordion === 'reviews' && (
                  <div className="pb-4 space-y-4">
                    
                    {/* Uniqlo Fit Rating Bar (UI-02: Tingkat Kecocokan Ukuran) */}
                    <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-2 rounded-none">
                      <div className="flex items-center justify-between text-xs flex-wrap gap-1">
                        <span className="font-bold uppercase text-zinc-900 flex items-center gap-1.5">
                          <Ruler size={14} className="text-zinc-700" />
                          <span>Tingkat Kecocokan Ukuran (Fit Rating)</span>
                        </span>
                        <span className="font-bold text-[#E60012] text-[11px] font-mono">
                          85% Pelanggan: Pas Sesuai Ukuran (True to Size)
                        </span>
                      </div>

                      {/* Visual Meter Bar */}
                      <div className="relative pt-3 pb-1">
                        <div className="h-2 w-full bg-zinc-200 rounded-none relative">
                          <div 
                            className="absolute top-0 bottom-0 bg-[#111111] rounded-none"
                            style={{ left: '35%', width: '30%' }}
                          />
                          {/* Indicator Mark */}
                          <div 
                            className="absolute -top-1 w-4 h-4 bg-[#E60012] border-2 border-white rounded-none shadow-sm -ml-2"
                            style={{ left: '50%' }}
                          />
                        </div>

                        <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-wider pt-2">
                          <span>Kekecilan (8%)</span>
                          <span className="text-zinc-900 font-black">Pas Sesuai Ukuran (85%)</span>
                          <span>Kebesaran (7%)</span>
                        </div>
                      </div>
                    </div>

                    {/* Review List */}
                    {product.reviews && product.reviews.length > 0 ? (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {product.reviews.map(r => (
                          <div key={r.id} className="p-3 bg-zinc-50 border border-zinc-200 space-y-1 rounded-none">
                            <div className="flex justify-between">
                              <span className="font-bold text-zinc-900 text-xs">{r.reviewer_name}</span>
                              <span className="text-[10px] text-zinc-400 font-mono">{r.created_at}</span>
                            </div>
                            <div className="flex items-center gap-1 text-amber-500">
                              {[...Array(r.rating)].map((_, i) => (
                                <Star key={i} size={11} fill="currentColor" />
                              ))}
                              <span className="text-[10px] text-zinc-500 ml-1">Ukuran {r.size_purchased} ({r.fit_rating})</span>
                            </div>
                            <p className="text-[11px] text-zinc-600">{r.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-[11px] text-zinc-400">Belum ada ulasan untuk busana ini.</p>
                    )}

                    {!isAddingReview ? (
                      <button
                        type="button"
                        onClick={() => setIsAddingReview(true)}
                        className="w-full py-2.5 border border-zinc-300 hover:border-zinc-950 text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5 rounded-none"
                      >
                        <MessageSquarePlus size={14} />
                        <span>Tulis Ulasan Pembeli</span>
                      </button>
                    ) : (
                      <form onSubmit={handleAddReview} className="p-3 bg-zinc-50 border border-zinc-300 space-y-2 rounded-none">
                        <p className="font-bold text-xs uppercase text-zinc-900">Ulasan Pembeli Baru</p>
                        <input
                          type="text"
                          required
                          placeholder="Nama Anda (contoh: Kimy Eka)"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          className="w-full p-2 border border-zinc-300 text-base md:text-xs bg-white focus:outline-none rounded-none"
                        />
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-bold">Bintang:</span>
                          <select
                            value={newRating}
                            onChange={(e) => setNewRating(Number(e.target.value))}
                            className="p-1 border border-zinc-300 bg-white rounded-none"
                          >
                            <option value={5}>5 Bintang (Sangat Puas)</option>
                            <option value={4}>4 Bintang (Puas)</option>
                            <option value={3}>3 Bintang (Cukup)</option>
                          </select>
                        </div>
                        <textarea
                          required
                          rows={2}
                          placeholder="Tulis ulasan Anda..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full p-2 border border-zinc-300 text-base md:text-xs bg-white focus:outline-none rounded-none"
                        />
                        <div className="flex gap-2">
                          <button
                            type="submit"
                            className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold uppercase hover:bg-[#E60012] rounded-none"
                          >
                            {reviewSubmitted ? 'Tersimpan!' : 'Kirim Ulasan'}
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsAddingReview(false)}
                            className="px-3 py-2 text-zinc-500 text-xs rounded-none"
                          >
                            Batal
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

        {/* ======================================================== */}
        {/* SECTION: INSPIRASI PADU PADAN GAYA LIFEWEAR (UI-03)      */}
        {/* ======================================================== */}
        {relatedProducts.length > 0 && (
          <section className="mt-14 pt-10 border-t border-zinc-200 space-y-6">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#E60012] text-white text-[9px] font-black uppercase tracking-widest rounded-none">
                <Sparkles size={11} />
                <span>STYLEHINT</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-950">
                Inspirasi Padu Padan Gaya LifeWear
              </h2>
              <p className="text-xs text-zinc-500">
                Koleksi busana pelengkap yang direkomendasikan untuk kombinasi outfit sehari-hari ini.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 md:gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/product/${rel.id}`}
                  className="group block bg-white border border-zinc-200 hover:border-zinc-950 transition-all rounded-none"
                >
                  <div className="aspect-[3/4] overflow-hidden bg-[#F6F6F6] relative">
                    <img
                      src={getOptimizedImageUrl(rel.image_url, 400, 75)}
                      alt={rel.name}
                      className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-300"
                      loading="lazy"
                    />
                    {rel.original_price && rel.original_price > rel.price && (
                      <span className="absolute top-2 left-2 bg-[#E60012] text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-none">
                        LIMITED
                      </span>
                    )}
                  </div>
                  <div className="p-3 space-y-1">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                      {rel.category_name}
                    </p>
                    <h4 className="text-xs font-bold uppercase text-zinc-900 line-clamp-1 group-hover:text-[#E60012] transition-colors leading-tight">
                      {rel.name}
                    </h4>
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="text-xs font-mono font-black text-zinc-950">
                        Rp {rel.price.toLocaleString('id-ID')}
                      </span>
                      {rel.original_price && rel.original_price > rel.price && (
                        <span className="text-[10px] font-mono text-zinc-400 line-through">
                          Rp {rel.original_price.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

      </main>

      {/* Sticky Bottom Buy Bar on Mobile Viewport (UI-08) */}
      <div className="fixed bottom-0 inset-x-0 z-40 bg-white border-t border-zinc-200 p-3 flex md:hidden items-center justify-between shadow-2xl rounded-none">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleToggleWishlist}
            className={`p-2.5 border rounded-none transition-colors ${
              isWishlisted
                ? 'bg-[#E60012] border-[#E60012] text-white'
                : 'bg-white border-zinc-300 text-zinc-700'
            }`}
            aria-label="Wishlist"
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>
          <div>
            <span className="text-[10px] text-zinc-400 font-bold uppercase block leading-none font-mono">
              {selectedSize} • {currentColor.name}
            </span>
            <span className="font-mono font-black text-sm text-zinc-950">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className="py-3 px-5 bg-zinc-950 hover:bg-[#E60012] disabled:bg-zinc-300 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors flex items-center gap-1.5"
        >
          {addedNotice ? (
            <>
              <Check size={14} className="text-emerald-400" />
              <span>Tersimpan!</span>
            </>
          ) : isOutOfStock ? (
            <span>Stok Habis</span>
          ) : (
            <>
              <ShoppingBag size={14} />
              <span>+ Masuk Tas</span>
            </>
          )}
        </button>
      </div>

      <Footer 
        onOpenInfoModal={(t) => setActiveInfoModal(t)}
        onOpenSizeChart={() => setIsSizeChartOpen(true)}
        onSelectCategory={(slug) => router.push(`/?category=${slug}`)}
      />

      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        productName={product.name}
        categoryName={product.category_name}
        measurements={product.size_measurements}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        onRemoveFromWishlist={(id) => {
          const p = wishlist.find(it => it.id === id);
          if (p) dataStore.toggleWishlist(p);
          setWishlist(dataStore.getWishlist());
        }}
        onMoveToCart={(p, sz) => {
          setCartItems(prev => [...prev, { product: p, selected_size: sz || p.sizes[0] || 'M', selected_color: p.colors[0]?.name || 'Standard', quantity: 1 }]);
          setIsWishlistOpen(false);
          setIsCartOpen(true);
        }}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={(idx: number, q: number) => {
          setCartItems(prev => {
            if (q <= 0) return prev.filter((_, i) => i !== idx);
            const u = [...prev];
            u[idx].quantity = q;
            return u;
          });
        }}
        onRemoveItem={(idx: number) => setCartItems(prev => prev.filter((_, i) => i !== idx))}
        selectedCourier={selectedCourier}
        onSelectCourier={setSelectedCourier}
        onOpenCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        selectedCourier={selectedCourier}
        onConfirmOrder={async (payload) => {
          const res = await dataStore.createOrder({ ...payload, cart_items: cartItems });
          if (res.success) {
            const updated = await dataStore.getProductById(productId);
            if (updated) setProduct(updated);
          }
          return res;
        }}
        onOrderSuccess={() => setCartItems([])}
      />

      <InformationModals
        type={activeInfoModal}
        onClose={() => setActiveInfoModal(null)}
      />

      <AuthModal />

    </div>
  );
}
