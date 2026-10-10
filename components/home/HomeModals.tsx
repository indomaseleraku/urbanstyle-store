// components/home/HomeModals.tsx
'use client';

import React from 'react';
import ProductDetailModal from '@/components/ProductDetailModal';
import CartDrawer from '@/components/CartDrawer';
import WishlistDrawer from '@/components/WishlistDrawer';
import CheckoutModal from '@/components/CheckoutModal';
import SizeChartModal from '@/components/SizeChartModal';
import InformationModals, { ModalType } from '@/components/InformationModals';
import { AuthModal } from '@/components/AuthModal';
import { Product, CartItem } from '@/lib/types';
import { dataStore } from '@/lib/store';

interface HomeModalsProps {
  selectedProductForDetail: Product | null;
  onCloseDetail: () => void;
  onAddToCart: (p: Product, size: string, color: string, qty: number, showToast?: boolean) => void;
  wishlist: Product[];
  onToggleWishlist: (p: Product) => void;
  activeInfoModal: ModalType;
  setActiveInfoModal: (m: ModalType) => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  selectedCourier: string;
  setSelectedCourier: (c: string) => void;
  isGlobalSizeChartOpen: boolean;
  setIsGlobalSizeChartOpen: (open: boolean) => void;
  selectedCategory: string;
  products: Product[];
}

export default function HomeModals({
  selectedProductForDetail,
  onCloseDetail,
  onAddToCart,
  wishlist,
  onToggleWishlist,
  activeInfoModal,
  setActiveInfoModal,
  isCartOpen,
  setIsCartOpen,
  cartItems,
  setCartItems,
  isWishlistOpen,
  setIsWishlistOpen,
  isCheckoutOpen,
  setIsCheckoutOpen,
  selectedCourier,
  setSelectedCourier,
  isGlobalSizeChartOpen,
  setIsGlobalSizeChartOpen,
  selectedCategory,
  products,
}: HomeModalsProps) {
  return (
    <>
      <ProductDetailModal
        product={selectedProductForDetail}
        isOpen={Boolean(selectedProductForDetail)}
        onClose={onCloseDetail}
        onAddToCart={(p, s, c, q) => onAddToCart(p, s, c, q, true)}
        onInstantBuy={(p, s, c, q) => { onAddToCart(p, s, c, q, false); setIsCheckoutOpen(true); }}
        isWishlisted={Boolean(selectedProductForDetail && wishlist.some((w) => w.id === selectedProductForDetail.id))}
        onToggleWishlist={onToggleWishlist}
        onOpenInfoModal={setActiveInfoModal}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={(idx, q) => setCartItems((prev) => q <= 0 ? prev.filter((_, i) => i !== idx) : prev.map((it, i) => i === idx ? { ...it, quantity: q } : it))}
        onRemoveItem={(idx) => setCartItems((prev) => prev.filter((_, i) => i !== idx))}
        onOpenCheckout={() => { setIsCartOpen(false); setIsCheckoutOpen(true); }}
        selectedCourier={selectedCourier}
        onSelectCourier={setSelectedCourier}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        onRemoveFromWishlist={(id) => { const p = products.find((it) => it.id === id); if (p) onToggleWishlist(p); }}
        onMoveToCart={(p, s) => { onAddToCart(p, s || p.sizes[0] || 'M', p.colors[0]?.name || 'Standard', 1, true); onToggleWishlist(p); }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        selectedCourier={selectedCourier}
        onConfirmOrder={(payload) => dataStore.createOrder({ ...payload, cart_items: cartItems })}
        onOrderSuccess={() => setCartItems([])}
      />

      <SizeChartModal isOpen={isGlobalSizeChartOpen} onClose={() => setIsGlobalSizeChartOpen(false)} categorySlug={selectedCategory} />
      <InformationModals activeModal={activeInfoModal} onClose={() => setActiveInfoModal(null)} onOpenSizeChart={() => setIsGlobalSizeChartOpen(true)} />
      <AuthModal />
    </>
  );
}
