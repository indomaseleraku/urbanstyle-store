// components/ProductDetailModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product, ColorVariant } from '@/lib/types';
import SizeChartModal from './SizeChartModal';
import ProductGallery from './pdp/ProductGallery';
import ProductInfo from './pdp/ProductInfo';
import ColorSelector from './pdp/ColorSelector';
import SizeSelector from './pdp/SizeSelector';
import ProductAccordion from './pdp/ProductAccordion';
import { ModalType } from './InformationModals';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, colorName: string, quantity: number) => void;
  onInstantBuy: (product: Product, size: string, colorName: string, quantity: number) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
  onOpenInfoModal?: (type: ModalType) => void;
}

export default function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onInstantBuy,
  isWishlisted,
  onToggleWishlist,
  onOpenInfoModal: _onOpenInfoModal,
}: ProductDetailModalProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    if (product && product.sizes.length > 0) {
      const avail = product.sizes.find((sz) => !product.out_of_stock_sizes?.includes(sz)) || product.sizes[0];
      setSelectedSize(avail);
      setSelectedColorIndex(0);
      setActiveImageIndex(0);
      setQuantity(1);
    }
  }, [product]);

  if (!product) return null;

  const currentColor: ColorVariant = product.colors[selectedColorIndex] || {
    name: 'Standard',
    code: '09 BLACK',
    hex: '#000000',
    image_url: product.image_url,
  };

  const galleryList = product.gallery_images && product.gallery_images.length > 0
    ? [currentColor.image_url, ...product.gallery_images.filter((img) => img !== currentColor.image_url)]
    : [currentColor.image_url];

  const handleAdd = () => {
    if (product.stock <= 0) return;
    onAddToCart(product, selectedSize, currentColor.name, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            />

            {/* Modal Dialog */}
            <div className="min-h-full flex items-center justify-center p-3 sm:p-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                className="relative bg-white border border-[#E5E5E5] shadow-2xl max-w-4xl w-full p-4 sm:p-8 rounded-none z-10"
              >
                {/* Close Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-[#111111] hover:bg-zinc-100 transition-colors rounded-none cursor-pointer z-20"
                  aria-label="Tutup"
                >
                  <X size={22} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                  {/* Left Column: 3:4 Gallery */}
                  <div>
                    <ProductGallery
                      images={galleryList}
                      activeImageIndex={activeImageIndex}
                      onSelectImage={setActiveImageIndex}
                      productName={product.name}
                    />
                  </div>

                  {/* Right Column: Information & Actions */}
                  <div className="space-y-5">
                    <ProductInfo product={product} />

                    {product.colors && product.colors.length > 0 && (
                      <ColorSelector
                        colors={product.colors}
                        selectedIndex={selectedColorIndex}
                        onSelectColor={(idx) => {
                          setSelectedColorIndex(idx);
                          setActiveImageIndex(0);
                        }}
                      />
                    )}

                    <SizeSelector
                      sizes={product.sizes}
                      selectedSize={selectedSize}
                      onSelectSize={setSelectedSize}
                      outOfStockSizes={product.out_of_stock_sizes}
                      onOpenSizeChart={() => setIsSizeChartOpen(true)}
                      quantity={quantity}
                      onQuantityChange={setQuantity}
                      maxStock={product.stock}
                    />

                    {/* Action Buttons with Spring Tap */}
                    <div className="space-y-2 pt-2">
                      <div className="flex gap-2">
                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          type="button"
                          onClick={handleAdd}
                          disabled={product.stock <= 0}
                          className="flex-1 py-3.5 bg-[#111111] hover:bg-[#E60012] disabled:bg-zinc-300 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer"
                        >
                          <ShoppingBag size={16} />
                          <span>{addedNotice ? '✓ Masuk ke Tas' : 'Tambah ke Tas'}</span>
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.96 }}
                          type="button"
                          onClick={() => onToggleWishlist(product)}
                          className={`p-3.5 border transition-colors rounded-none flex items-center justify-center cursor-pointer ${
                            isWishlisted
                              ? 'border-[#E60012] text-[#E60012] bg-red-50'
                              : 'border-zinc-300 text-zinc-700 hover:border-zinc-950'
                          }`}
                          aria-label="Wishlist"
                        >
                          <Heart size={18} fill={isWishlisted ? '#E60012' : 'none'} />
                        </motion.button>
                      </div>

                      <motion.button
                        whileTap={{ scale: 0.96 }}
                        type="button"
                        onClick={() => onInstantBuy(product, selectedSize, currentColor.name, quantity)}
                        disabled={product.stock <= 0}
                        className="w-full py-3 border-2 border-[#111111] hover:border-[#E60012] hover:text-[#E60012] text-[#111111] text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none cursor-pointer"
                      >
                        <span>Beli Sekarang (Instant Checkout)</span>
                        <ArrowRight size={14} />
                      </motion.button>
                    </div>

                    <ProductAccordion product={product} />
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        productName={product.name}
        categoryName={product.category_name}
        categorySlug={product.category_slug}
        measurements={product.size_measurements}
      />
    </>
  );
}
