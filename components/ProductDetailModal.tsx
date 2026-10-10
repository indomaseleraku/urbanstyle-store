// components/ProductDetailModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, ColorVariant } from '@/lib/types';
import { 
  X, 
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
  Sparkles,
  ArrowRight,
  MessageSquarePlus
} from 'lucide-react';
import SizeChartModal from './SizeChartModal';
import SmartSizePredictorModal from './SmartSizePredictorModal';
import { WeatherTechBadge } from './FabricMacroZoom';
import { getOptimizedImageUrl } from '@/lib/utils';
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
  onOpenInfoModal,
}: ProductDetailModalProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [isSizeChartOpen, setIsSizeChartOpen] = useState(false);
  const [isSmartPredictorOpen, setIsSmartPredictorOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    if (product && product.sizes.length > 0) {
      const avail = product.sizes.find(sz => !product.out_of_stock_sizes?.includes(sz)) || product.sizes[0];
      setSelectedSize(avail);
      setSelectedColorIndex(0);
      setActiveImageIndex(0);
      setQuantity(1);
    }
  }, [product]);

  // Accordion open states
  const [openAccordion, setOpenAccordion] = useState<string | null>('desc');

  // Review Form state
  const [isAddingReview, setIsAddingReview] = useState(false);
  const [reviewerName, setReviewerName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!isOpen || !product) return null;

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

  const handleColorChange = (idx: number) => {
    setSelectedColorIndex(idx);
    setActiveImageIndex(0);
  };

  const handleAdd = () => {
    if (product.stock <= 0) return;
    onAddToCart(product, selectedSize, currentColor.name, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    if (product.stock <= 0) return;
    onInstantBuy(product, selectedSize, currentColor.name, quantity);
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !newComment.trim()) return;

    if (!product.reviews) product.reviews = [];
    product.reviews.unshift({
      id: Date.now(),
      reviewer_name: reviewerName,
      rating: newRating,
      size_purchased: selectedSize,
      fit_rating: 'Pas Sesuai Ukuran',
      comment: newComment,
      created_at: new Date().toISOString().split('T')[0],
    });
    product.reviews_count = product.reviews.length;

    setReviewSubmitted(true);
    setTimeout(() => {
      setIsAddingReview(false);
      setReviewSubmitted(false);
      setReviewerName('');
      setNewComment('');
    }, 1500);
  };

  // Stock status
  const isOutOfStock = product.stock <= 0;
  const isCriticalStock = product.stock > 0 && product.stock <= 5;
  const isLowStock = product.stock > 5 && product.stock <= 15;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      
      {/* Container */}
      <div className="bg-white border border-zinc-300 w-full max-w-5xl overflow-hidden shadow-2xl relative my-auto">
        
        {/* Close Button Top Right */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-5 sm:right-5 z-20 p-2 bg-white/90 hover:bg-zinc-950 hover:text-white border border-zinc-200 transition-colors"
          aria-label="Tutup detail produk"
        >
          <X size={20} />
        </button>

        {/* Modal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 max-h-[90vh] overflow-y-auto">
          
          {/* ======================================================== */}
          {/* LEFT: Multi-Angle Gallery */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 p-4 sm:p-6 lg:p-8 bg-zinc-50 border-b lg:border-b-0 lg:border-r border-zinc-200 space-y-4">
            
            {/* Main Picture */}
            <div className="relative aspect-3/4 w-full bg-white border border-zinc-200 overflow-hidden">
              <img
                src={getOptimizedImageUrl(mainDisplayImage, 900, 80)}
                alt={product.name}
                className="w-full h-full object-cover object-center transition-all duration-300"
              />

              {/* Tag Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 items-start">
                {product.is_new && (
                  <span className="bg-[#111111] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1">
                    NEW ARRIVAL
                  </span>
                )}
                {product.original_price && product.original_price > product.price && (
                  <span className="bg-[#E60012] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1">
                    LIMITED OFFER
                  </span>
                )}
              </div>

              {/* Wishlist Floating Button */}
              <button
                onClick={() => onToggleWishlist(product)}
                className={`absolute top-3 right-3 p-2.5 border transition-all ${
                  isWishlisted 
                    ? 'bg-[#E60012] border-[#E60012] text-white' 
                    : 'bg-white/90 border-zinc-300 text-zinc-700 hover:text-[#E60012]'
                }`}
                title={isWishlisted ? 'Hapus dari Favorit' : 'Simpan ke Favorit'}
              >
                <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Thumbnail Gallery Strip */}
            {galleryList.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {galleryList.map((imgUrl, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-18 h-24 shrink-0 bg-white border-2 overflow-hidden transition-all ${
                      activeImageIndex === idx 
                        ? 'border-[#E60012] ring-1 ring-[#E60012]' 
                        : 'border-zinc-200 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={getOptimizedImageUrl(imgUrl, 160, 70)} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Value Highlights */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-zinc-200 text-center">
              <button
                type="button"
                onClick={() => onOpenInfoModal?.('shipping')}
                className="p-2.5 bg-white border border-zinc-200 space-y-1 hover:border-zinc-400 hover:bg-zinc-50 transition-colors cursor-pointer text-center"
                title="Buka panduan pengiriman & gratis ongkir"
              >
                <Truck size={16} className="mx-auto text-zinc-800" />
                <p className="text-[10px] font-bold uppercase text-zinc-900">Bebas Ongkir</p>
                <p className="text-[9px] text-zinc-500">Min. Rp 400.000</p>
              </button>
              <button
                type="button"
                onClick={() => onOpenInfoModal?.('return')}
                className="p-2.5 bg-white border border-zinc-200 space-y-1 hover:border-zinc-400 hover:bg-zinc-50 transition-colors cursor-pointer text-center"
                title="Buka kebijakan retur garansi 30 hari"
              >
                <RotateCcw size={16} className="mx-auto text-zinc-800" />
                <p className="text-[10px] font-bold uppercase text-zinc-900">Garansi 30 Hari</p>
                <p className="text-[9px] text-zinc-500">Tukar Ukuran Bebas</p>
              </button>
              <button
                type="button"
                onClick={() => onOpenInfoModal?.('lifewear')}
                className="p-2.5 bg-white border border-zinc-200 space-y-1 hover:border-zinc-400 hover:bg-zinc-50 transition-colors cursor-pointer text-center"
                title="Buka filosofi desain LifeWear"
              >
                <ShieldCheck size={16} className="mx-auto text-zinc-800" />
                <p className="text-[10px] font-bold uppercase text-zinc-900">100% Otentik</p>
                <p className="text-[9px] text-zinc-500">Standar LifeWear</p>
              </button>
            </div>

          </div>

          {/* ======================================================== */}
          {/* RIGHT: Product Purchase & Information Panel */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 p-5 sm:p-7 space-y-5 flex flex-col justify-between">
            
            <div className="space-y-5">
              
              {/* Category & Rating */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                  <span>{product.category_name || 'Koleksi'} // {(product.gender || 'unisex').toUpperCase()}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono">SKU: US-{product.id.toString().padStart(4, '0')}</span>
                    <Link
                      href={`/product/${product.id}`}
                      className="text-zinc-500 hover:text-[#E60012] transition-colors underline uppercase text-[10px] font-bold"
                      title="Buka Halaman Mandiri Produk"
                    >
                      Buka Halaman Produk Penuh ↗
                    </Link>
                  </div>
                </div>

                <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-zinc-950 leading-snug">
                  {product.name}
                </h1>

                {/* Rating Stars */}
                <div className="flex items-center gap-2 pt-1">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'} />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-zinc-800 font-mono">
                    {product.rating || 4.8} / 5.0
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    ({product.reviews_count || 24} Ulasan)
                  </span>
                </div>
              </div>

              {/* Price Block */}
              <div className="p-3.5 bg-zinc-50 border border-zinc-200 flex items-baseline justify-between">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-xl sm:text-2xl font-black text-[#E60012] font-mono">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                  {product.original_price && product.original_price > product.price && (
                    <span className="text-xs text-zinc-400 line-through font-mono">
                      Rp {product.original_price.toLocaleString('id-ID')}
                    </span>
                  )}
                </div>

                {product.original_price && product.original_price > product.price && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-red-100 text-[#E60012]">
                    HEMAT {Math.round(((product.original_price - product.price) / product.original_price) * 100)}%
                  </span>
                )}
              </div>

              {/* Stock Status Indicator */}
              <div>
                {isOutOfStock ? (
                  <div className="p-2 bg-zinc-900 text-white text-xs font-bold uppercase text-center">
                    Habis Terjual
                  </div>
                ) : isCriticalStock ? (
                  <div className="p-2 bg-red-50 border border-red-200 text-[#E60012] text-xs font-bold uppercase flex items-center justify-between animate-pulse">
                    <span>⚡ Stok Darurat Terbatas!</span>
                    <span>Tersisa {product.stock} Unit di Gudang</span>
                  </div>
                ) : isLowStock ? (
                  <div className="p-2 bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold uppercase flex items-center justify-between">
                    <span>Stok Menipis</span>
                    <span>Tersedia {product.stock} Unit</span>
                  </div>
                ) : (
                  <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold uppercase flex items-center justify-between">
                    <span>Ketersediaan: Ready Stock</span>
                    <span className="font-bold">{product.stock} Unit</span>
                  </div>
                )}
              </div>

              {/* Color Swatch Selector */}
              <div className="space-y-2 pt-1 border-t border-zinc-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-wider text-zinc-700">Warna Terpilih:</span>
                  <span className="font-mono font-bold text-zinc-950 uppercase">
                    {currentColor.code ? `Warna: ${currentColor.code}` : currentColor.name}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {product.colors.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleColorChange(idx)}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColorIndex === idx 
                          ? 'border-zinc-950 scale-110 shadow-sm' 
                          : 'border-zinc-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={`Warna: ${c.code || c.name}`}
                      aria-label={c.code || c.name}
                    >
                      {selectedColorIndex === idx && (
                        <Check 
                          size={14} 
                          className={`absolute inset-0 m-auto ${
                            c.hex.toLowerCase() === '#ffffff' || c.hex.toLowerCase() === '#f8fafc' 
                              ? 'text-zinc-950' 
                              : 'text-white'
                          }`} 
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector & Size Guide Link */}
              <div className="space-y-2 pt-2 border-t border-zinc-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold uppercase tracking-wider text-zinc-700">Pilih Ukuran:</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsSmartPredictorOpen(true)}
                      className="text-zinc-900 hover:text-[#E60012] font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider cursor-pointer"
                      title="Hitung ukuran ideal berdasarkan TB & BB"
                    >
                      <Sparkles size={13} className="text-[#E60012]" />
                      <span>Kalkulator TB/BB</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsSizeChartOpen(true)}
                      className="text-[#E60012] hover:underline font-bold flex items-center gap-1 text-[11px] uppercase tracking-wider cursor-pointer"
                    >
                      <Ruler size={13} />
                      <span>Panduan (cm)</span>
                    </button>
                  </div>
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
                            ? 'bg-zinc-950 text-white border-zinc-950 shadow-xs'
                            : 'bg-white text-zinc-800 border-zinc-300 hover:border-zinc-950'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-xs">
                <span className="font-bold uppercase tracking-wider text-zinc-700">Kuantitas:</span>
                <div className="flex items-center border border-zinc-300 rounded-none bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 disabled:opacity-40 text-sm font-bold"
                    aria-label="Kurangi"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-bold font-mono text-zinc-950">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="w-10 h-10 flex items-center justify-center hover:bg-zinc-100 disabled:opacity-40 text-sm font-bold"
                    aria-label="Tambah"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleAdd}
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
                  onClick={handleBuyNow}
                  disabled={isOutOfStock}
                  className="w-full py-3.5 bg-white hover:bg-zinc-50 border border-zinc-950 text-zinc-950 text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none min-h-[44px]"
                >
                  <span>BELI SEKARANG (LANGSUNG CHECKOUT)</span>
                  <ArrowRight size={14} />
                </button>
              </div>

              {/* Accordions (Deskripsi, Bahan, Perawatan) */}
              <div className="pt-3 border-t border-zinc-200 divide-y divide-zinc-200 text-xs">
                
                {/* Accordion 1: Deskripsi */}
                <div>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'desc' ? null : 'desc')}
                    className="w-full py-2.5 flex items-center justify-between text-left font-bold uppercase text-zinc-900"
                  >
                    <span>Deskripsi & Siluet LifeWear</span>
                    {openAccordion === 'desc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openAccordion === 'desc' && (
                    <div className="pb-3 text-zinc-600 leading-relaxed text-[11px] space-y-2">
                      <p>{product.description}</p>
                    </div>
                  )}
                </div>

                {/* Accordion 2: Bahan & Spesifikasi Tekstil */}
                <div>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'fabric' ? null : 'fabric')}
                    className="w-full py-2.5 flex items-center justify-between text-left font-bold uppercase text-zinc-900"
                  >
                    <span>Spesifikasi Bahan & Teknologi</span>
                    {openAccordion === 'fabric' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openAccordion === 'fabric' && (
                    <div className="pb-3 text-zinc-600 leading-relaxed text-[11px] space-y-1">
                      <p><strong>Komposisi:</strong> {product.fabric_details}</p>
                    </div>
                  )}
                </div>

                {/* Accordion 3: Petunjuk Perawatan */}
                <div>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'care' ? null : 'care')}
                    className="w-full py-2.5 flex items-center justify-between text-left font-bold uppercase text-zinc-900"
                  >
                    <span>Petunjuk Pencucian & Perawatan</span>
                    {openAccordion === 'care' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openAccordion === 'care' && (
                    <div className="pb-3 text-zinc-600 leading-relaxed text-[11px]">
                      <p>{product.care_instructions}</p>
                    </div>
                  )}
                </div>

                {/* Accordion 4: Customer Reviews */}
                <div>
                  <button
                    onClick={() => setOpenAccordion(openAccordion === 'reviews' ? null : 'reviews')}
                    className="w-full py-2.5 flex items-center justify-between text-left font-bold uppercase text-zinc-900"
                  >
                    <span>Ulasan Konsumen ({product.reviews?.length || 0})</span>
                    {openAccordion === 'reviews' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  {openAccordion === 'reviews' && (
                    <div className="pb-3 space-y-3">
                      
                      {/* Review Items */}
                      {product.reviews && product.reviews.length > 0 ? (
                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {product.reviews.map((rev) => (
                            <div key={rev.id} className="p-2.5 bg-zinc-50 border border-zinc-200 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-zinc-900 text-[11px]">{rev.reviewer_name}</span>
                                <span className="text-[10px] text-zinc-400">{rev.created_at}</span>
                              </div>
                              <div className="flex items-center gap-1 text-amber-500">
                                {[...Array(rev.rating)].map((_, i) => (
                                  <Star key={i} size={11} fill="currentColor" />
                                ))}
                                <span className="text-[10px] text-zinc-500 ml-1">Ukuran {rev.size_purchased} ({rev.fit_rating})</span>
                              </div>
                              <p className="text-[11px] text-zinc-600">{rev.comment}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-zinc-400">Belum ada ulasan untuk produk ini.</p>
                      )}

                      {/* Add Review Form */}
                      {!isAddingReview ? (
                        <button
                          onClick={() => setIsAddingReview(true)}
                          className="w-full py-2 border border-zinc-300 hover:border-zinc-950 text-xs font-bold uppercase transition-colors flex items-center justify-center gap-1.5"
                        >
                          <MessageSquarePlus size={14} />
                          <span>Tulis Ulasan Produk</span>
                        </button>
                      ) : (
                        <form onSubmit={handleAddReview} className="p-3 bg-zinc-50 border border-zinc-300 space-y-2">
                          <p className="font-bold text-xs uppercase text-zinc-900">Ulasan Pembeli Baru</p>
                          <input
                            type="text"
                            required
                            placeholder="Nama Anda (contoh: Kimy Eka)"
                            value={reviewerName}
                            onChange={(e) => setReviewerName(e.target.value)}
                            className="w-full p-2 border border-zinc-300 text-xs bg-white focus:outline-none"
                          />
                          <div className="flex items-center gap-2 text-xs">
                            <span className="font-bold">Bintang:</span>
                            <select
                              value={newRating}
                              onChange={(e) => setNewRating(Number(e.target.value))}
                              className="p-1 border border-zinc-300 bg-white"
                            >
                              <option value={5}>5 Bintang (Sangat Puas)</option>
                              <option value={4}>4 Bintang (Puas)</option>
                              <option value={3}>3 Bintang (Cukup)</option>
                            </select>
                          </div>
                          <textarea
                            required
                            rows={2}
                            placeholder="Tulis ulasan tentang bahan, kenyamanan, atau ukuran..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-2 border border-zinc-300 text-xs bg-white focus:outline-none"
                          />
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="px-4 py-1.5 bg-zinc-900 text-white text-xs font-bold uppercase hover:bg-[#E60012]"
                            >
                              {reviewSubmitted ? 'Tersimpan!' : 'Kirim Ulasan'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setIsAddingReview(false)}
                              className="px-3 py-1.5 text-zinc-500 text-xs hover:text-zinc-900"
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

        </div>

      </div>

      {/* Nested Size Chart Modal */}
      <SizeChartModal
        isOpen={isSizeChartOpen}
        onClose={() => setIsSizeChartOpen(false)}
        productName={product.name}
        categoryName={product.category_name}
        measurements={product.size_measurements}
      />

      {/* Smart Size & Fit Predictor Modal (FR-30) */}
      <SmartSizePredictorModal
        isOpen={isSmartPredictorOpen}
        onClose={() => setIsSmartPredictorOpen(false)}
        productName={product.name}
        categoryName={product.category_name}
        onApplySize={(sz) => setSelectedSize(sz)}
      />

    </div>
  );
}
