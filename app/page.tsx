// app/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import LookbookSlider from '@/components/LookbookSlider';
import CategoryBubbles from '@/components/CategoryBubbles';
import Footer from '@/components/Footer';
import CatalogHeader from '@/components/home/CatalogHeader';
import FilterSortBar from '@/components/home/FilterSortBar';
import ProductGrid from '@/components/home/ProductGrid';
import FloatingCartToast from '@/components/home/FloatingCartToast';
import MobileBottomNav from '@/components/home/MobileBottomNav';
import MobileCategorySheet from '@/components/home/MobileCategorySheet';
import EditorialSections from '@/components/home/EditorialSections';
import HomeModals from '@/components/home/HomeModals';
import { Product, Category, CartItem } from '@/lib/types';
import { dataStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { ModalType } from '@/components/InformationModals';

function HomePageContent() {
  const { openAuthModal } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGender, setSelectedGender] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(8);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedCourier, setSelectedCourier] = useState('J&T Express (Reguler)');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [isGlobalSizeChartOpen, setIsGlobalSizeChartOpen] = useState(false);
  const [activeInfoModal, setActiveInfoModal] = useState<ModalType>(null);
  const [isMobileCategoryDrawerOpen, setIsMobileCategoryDrawerOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, productName: '', colorName: '', size: '' });

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 250);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => { setVisibleCount(8); }, [selectedCategory, selectedGender, debouncedSearchQuery, sortBy, inStockOnly]);

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const [cats, prods] = await Promise.all([
        dataStore.getCategories(),
        dataStore.getProducts(selectedCategory, debouncedSearchQuery, selectedGender, sortBy),
      ]);
      setCategories(cats);
      setProducts(prods);
      setWishlist(dataStore.getWishlist());
      setIsLoading(false);
    }
    init();
  }, [selectedCategory, debouncedSearchQuery, selectedGender, sortBy]);

  const handleAddToCart = (product: Product, size: string, color: string, qty = 1, showToast = true) => {
    setCartItems((prev) => {
      const idx = prev.findIndex((i) => i.product.id === product.id && i.selected_size === size && i.selected_color === color);
      if (idx > -1) { const next = [...prev]; next[idx].quantity += qty; return next; }
      return [...prev, { product, selected_size: size, selected_color: color, quantity: qty }];
    });
    if (showToast) setToast({ visible: true, productName: product.name, colorName: color, size });
  };

  const handleToggleWishlist = (product: Product) => {
    dataStore.toggleWishlist(product);
    setWishlist(dataStore.getWishlist());
  };
  const filteredProducts = products.filter((p) => !inStockOnly || p.stock > 0);
  const totalCartCount = cartItems.reduce((acc, it) => acc + it.quantity, 0);
  const categoryDisplayName = selectedCategory === 'sale' ? 'Limited Offer 🔥' : categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory;
  const scrollToCatalog = () => document.getElementById('katalog')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <div className="min-h-screen bg-white text-[#111111] flex flex-col font-sans selection:bg-[#E60012] selection:text-white">
      <Navbar
        categories={categories} selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory}
        selectedGender={selectedGender} onSelectGender={setSelectedGender} searchQuery={searchQuery}
        onSearchChange={setSearchQuery} cartCount={totalCartCount} onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length} onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenInfoModal={setActiveInfoModal} onSelectSort={setSortBy}
      />
      <main className="flex-1 pb-16 md:pb-0">
        <LookbookSlider onShopNow={scrollToCatalog} />
        <CategoryBubbles selectedCategory={selectedCategory} onSelectCategory={setSelectedCategory} onScrollToCatalog={scrollToCatalog} />
        <EditorialSections
          limitedOfferProducts={products.filter((p) => p.original_price && p.original_price > p.price).slice(0, 4)}
          bestOfLifeWearProducts={products.filter((p) => (p.rating || 0) >= 4.8).slice(0, 4)}
          wishlist={wishlist} onOpenDetail={setSelectedProductForDetail}
          onAddToCart={(p, s, c) => handleAddToCart(p, s, c, 1, false)}
          onToggleWishlist={handleToggleWishlist} onSelectCategory={setSelectedCategory}
          onSortPopular={() => setSortBy('popular')}
        />
        <section id="katalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
          <CatalogHeader selectedGender={selectedGender} selectedCategory={selectedCategory} categoryDisplayName={categoryDisplayName} />
          <FilterSortBar
            totalCount={filteredProducts.length} inStockOnly={inStockOnly} onToggleInStock={setInStockOnly}
            sortBy={sortBy} onSortChange={setSortBy} selectedGender={selectedGender}
            onClearGender={() => setSelectedGender('all')} selectedCategory={selectedCategory}
            categoryDisplayName={categoryDisplayName} onClearCategory={() => setSelectedCategory('all')}
            searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')}
            onResetAllFilters={() => { setSelectedCategory('all'); setSelectedGender('all'); setSearchQuery(''); setInStockOnly(false); setSortBy('featured'); }}
          />
          {/* Uniqlo LifeWear Catalog Whitespace Grid: gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-12 */}
          <ProductGrid
            products={filteredProducts} visibleCount={visibleCount} isLoading={isLoading} wishlist={wishlist}
            onOpenDetail={setSelectedProductForDetail} onAddToCart={(p, s, c) => handleAddToCart(p, s, c, 1, true)}
            onToggleWishlist={handleToggleWishlist} onLoadMore={() => setVisibleCount((v) => v + 8)}
            onResetFilters={() => { setSelectedCategory('all'); setSelectedGender('all'); setSearchQuery(''); setInStockOnly(false); }}
          />
        </section>
      </main>
      <FloatingCartToast toast={toast} onClose={() => setToast((t) => ({ ...t, visible: false }))} onOpenCart={() => setIsCartOpen(true)} />
      <MobileBottomNav
        isHomeActive={selectedCategory === 'all' && selectedGender === 'all'} isCategoryActive={isMobileCategoryDrawerOpen}
        isWishlistActive={isWishlistOpen} isCartActive={isCartOpen} wishlistCount={wishlist.length} totalCartCount={totalCartCount}
        onGoHome={() => { setSelectedCategory('all'); setSelectedGender('all'); setSearchQuery(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        onOpenCategories={() => setIsMobileCategoryDrawerOpen(true)} onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenCart={() => setIsCartOpen(true)} onOpenAccount={openAuthModal}
      />
      <MobileCategorySheet
        isOpen={isMobileCategoryDrawerOpen} onClose={() => setIsMobileCategoryDrawerOpen(false)} selectedGender={selectedGender}
        onSelectGender={(g) => { setSelectedGender(g); setIsMobileCategoryDrawerOpen(false); scrollToCatalog(); }}
        selectedCategory={selectedCategory} onSelectCategory={(c) => { setSelectedCategory(c); setIsMobileCategoryDrawerOpen(false); scrollToCatalog(); }}
        onReset={() => { setSelectedCategory('all'); setSelectedGender('all'); setIsMobileCategoryDrawerOpen(false); }}
      />
      <HomeModals
        selectedProductForDetail={selectedProductForDetail} onCloseDetail={() => setSelectedProductForDetail(null)}
        onAddToCart={handleAddToCart} wishlist={wishlist} onToggleWishlist={handleToggleWishlist}
        activeInfoModal={activeInfoModal} setActiveInfoModal={setActiveInfoModal} isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen} cartItems={cartItems} setCartItems={setCartItems} isWishlistOpen={isWishlistOpen}
        setIsWishlistOpen={setIsWishlistOpen} isCheckoutOpen={isCheckoutOpen} setIsCheckoutOpen={setIsCheckoutOpen}
        selectedCourier={selectedCourier} setSelectedCourier={setSelectedCourier} isGlobalSizeChartOpen={isGlobalSizeChartOpen}
        setIsGlobalSizeChartOpen={setIsGlobalSizeChartOpen} selectedCategory={selectedCategory} products={products}
      />
      <Footer onOpenInfoModal={setActiveInfoModal} onOpenSizeChart={() => setIsGlobalSizeChartOpen(true)} onSelectCategory={setSelectedCategory} />
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
