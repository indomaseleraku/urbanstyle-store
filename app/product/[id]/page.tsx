// app/product/[id]/page.tsx
'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Product, ColorVariant, Category } from '@/lib/types';
import { dataStore } from '@/lib/store';
import Navbar from '@/components/Navbar';
import SizeChartModal from '@/components/SizeChartModal';
import CartDrawer from '@/components/CartDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import InformationModals, { ModalType } from '@/components/InformationModals';
import { AuthModal } from '@/components/AuthModal';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import ProductGallery from '@/components/pdp/ProductGallery';
import ProductInfo from '@/components/pdp/ProductInfo';
import ColorSelector from '@/components/pdp/ColorSelector';
import SizeSelector from '@/components/pdp/SizeSelector';
import ProductAccordion from '@/components/pdp/ProductAccordion';
import { ArrowLeft, ShoppingBag, Heart, ArrowRight } from 'lucide-react';

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
        const availableSize = p.sizes.find((sz) => !p.out_of_stock_sizes?.includes(sz)) || p.sizes[0];
        setSelectedSize(availableSize);
      }
      if (allProds) {
        setRelatedProducts(allProds.filter((it) => it.id !== productId).slice(0, 4));
      }
      setWishlist(dataStore.getWishlist());
      setIsLoading(false);
    }
    load();
  }, [productId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="space-y-4 max-w-sm w-full p-4">
          <div className="aspect-[3/4] w-full animate-shimmer rounded-none border border-zinc-100" />
          <div className="h-4 w-3/4 animate-shimmer rounded-none" />
          <div className="h-6 w-1/2 animate-shimmer rounded-none" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-xl font-black uppercase">Produk Tidak Ditemukan</h1>
          <Link href="/" className="px-5 py-2.5 bg-zinc-950 text-white text-xs font-bold uppercase rounded-none inline-block">
            Kembali ke Toko
          </Link>
        </div>
      </div>
    );
  }

  const currentColor: ColorVariant = product.colors[selectedColorIndex] || {
    name: 'Standard', code: '09 BLACK', hex: '#000000', image_url: product.image_url,
  };

  const galleryList = product.gallery_images && product.gallery_images.length > 0
    ? [currentColor.image_url, ...product.gallery_images.filter((img) => img !== currentColor.image_url)]
    : [currentColor.image_url];

  const isWishlisted = wishlist.some((w) => w.id === product.id);

  const handleAddToCart = (qty = 1, showBag = false) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id && i.selected_size === selectedSize && i.selected_color === currentColor.name);
      if (idx > -1) {
        const next = [...prev]; next[idx].quantity += qty; return next;
      }
      return [...prev, { product, selected_size: selectedSize, selected_color: currentColor.name, quantity: qty }];
    });
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
    if (showBag) setIsCartOpen(true);
  };

  const toggleWishlist = (target: Product) => {
    dataStore.toggleWishlist(target);
    setWishlist(dataStore.getWishlist());
  };

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans selection:bg-[#E60012] selection:text-white">
      <Navbar
        categories={categories} selectedCategory={product.category_slug || 'all'}
        onSelectCategory={() => router.push('/')} selectedGender={product.gender || 'all'}
        onSelectGender={() => router.push('/')} searchQuery="" onSearchChange={() => {}}
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)} onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length} onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenInfoModal={setActiveInfoModal}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-12">
        <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
          <Link href="/" className="hover:text-black flex items-center gap-1">
            <ArrowLeft size={13} /> Beranda
          </Link>
          <span>/</span>
          <span className="uppercase">{product.category_name}</span>
          <span>/</span>
          <span className="text-zinc-950 font-bold truncate max-w-xs">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14">
          <ProductGallery
            images={galleryList} activeImageIndex={activeImageIndex}
            onSelectImage={setActiveImageIndex} productName={product.name}
          />

          <div className="space-y-6">
            <ProductInfo product={product} />

            {product.colors && product.colors.length > 0 && (
              <ColorSelector
                colors={product.colors} selectedIndex={selectedColorIndex}
                onSelectColor={(idx) => { setSelectedColorIndex(idx); setActiveImageIndex(0); }}
              />
            )}

            <SizeSelector
              sizes={product.sizes} selectedSize={selectedSize} onSelectSize={setSelectedSize}
              outOfStockSizes={product.out_of_stock_sizes} onOpenSizeChart={() => setIsSizeChartOpen(true)}
              quantity={quantity} onQuantityChange={setQuantity} maxStock={product.stock}
            />

            <div className="space-y-2.5 pt-2">
              <div className="flex gap-2">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => handleAddToCart(quantity, true)}
                  disabled={product.stock <= 0}
                  className="flex-1 py-4 bg-[#111111] hover:bg-[#E60012] disabled:bg-zinc-300 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer"
                >
                  <ShoppingBag size={16} />
                  <span>{addedNotice ? '✓ Masuk ke Tas Belanja' : 'Tambah ke Tas Belanja'}</span>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 border transition-colors rounded-none flex items-center justify-center cursor-pointer ${
                    isWishlisted ? 'border-[#E60012] text-[#E60012] bg-red-50' : 'border-zinc-300 text-zinc-700 hover:border-zinc-950'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart size={20} fill={isWishlisted ? '#E60012' : 'none'} />
                </motion.button>
              </div>

              <motion.button
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={() => { handleAddToCart(quantity, false); setIsCheckoutOpen(true); }}
                disabled={product.stock <= 0}
                className="w-full py-3.5 border-2 border-[#111111] hover:border-[#E60012] hover:text-[#E60012] text-[#111111] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer"
              >
                <span>Beli Sekarang (Instant Checkout)</span>
                <ArrowRight size={14} />
              </motion.button>
            </div>

            <ProductAccordion product={product} />
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="pt-8 border-t border-zinc-200 space-y-6">
            <h2 className="text-xl font-black uppercase tracking-tight text-zinc-950">
              Koleksi Terkait Lainnya
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id} product={p}
                  isWishlisted={wishlist.some((w) => w.id === p.id)}
                  onToggleWishlist={() => toggleWishlist(p)}
                />
              ))}
            </div>
          </section>
        )}
      </main>

      <CartDrawer
        isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems}
        onUpdateQty={(idx, q) => setCartItems((prev) => q <= 0 ? prev.filter((_, i) => i !== idx) : prev.map((it, i) => i === idx ? { ...it, quantity: q } : it))}
        onRemoveItem={(idx) => setCartItems((prev) => prev.filter((_, i) => i !== idx))}
        onOpenCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
        selectedCourier={selectedCourier} onSelectCourier={setSelectedCourier}
      />
      <WishlistDrawer
        isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} items={wishlist}
        onRemoveFromWishlist={(id) => { const p = relatedProducts.find((it) => it.id === id); if (p) toggleWishlist(p); }}
        onMoveToCart={(p, s) => { handleAddToCart(1, true); toggleWishlist(p); }}
      />
      <CheckoutModal
        isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} items={cartItems}
        selectedCourier={selectedCourier} onConfirmOrder={(payload) => dataStore.createOrder({ ...payload, cart_items: cartItems })}
        onOrderSuccess={() => setCartItems([])}
      />
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        productName={product.name}
        categoryName={product.category_name}
        categorySlug={product.category_slug}
        measurements={product.size_measurements}
      />
      <InformationModals activeModal={activeInfoModal} onClose={() => setActiveInfoModal(null)} onOpenSizeChart={() => setIsSizeChartOpen(true)} />
      <AuthModal />
      <Footer onOpenInfoModal={setActiveInfoModal} onOpenSizeChart={() => setIsSizeChartOpen(true)} />
    </div>
  );
}
