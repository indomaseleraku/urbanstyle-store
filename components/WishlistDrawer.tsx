// components/WishlistDrawer.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '@/lib/types';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/utils';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveFromWishlist: (productId: number) => void;
  onMoveToCart: (product: Product, size?: string) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  items,
  onRemoveFromWishlist,
  onMoveToCart,
}: WishlistDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-white border-l border-zinc-300 shadow-2xl flex flex-col justify-between rounded-none z-10"
            >
              {/* Header */}
              <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-red-100 text-[#E60012] flex items-center justify-center rounded-none">
                    <Heart size={18} fill="#E60012" />
                  </div>
                  <div>
                    <h2 className="text-base font-black uppercase tracking-tight text-zinc-950">
                      Daftar Favorit ({items.length})
                    </h2>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                      // WISHLIST ESSENTIALS
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors rounded-none cursor-pointer"
                  aria-label="Tutup Wishlist"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-200">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16">
                    <div className="w-16 h-16 bg-zinc-100 flex items-center justify-center text-zinc-300 rounded-none">
                      <Heart size={32} />
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800">
                      Wishlist Anda Masih Kosong
                    </h3>
                    <p className="text-xs text-zinc-500 max-w-xs">
                      Simpan pakaian yang Anda sukai dengan menekan ikon hati pada kartu produk untuk membelinya nanti.
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-2 px-5 py-2.5 bg-zinc-900 hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer"
                    >
                      Jelajahi Koleksi
                    </button>
                  </div>
                ) : (
                  items.map((prod) => (
                    <div key={prod.id} className="py-4 flex gap-4 items-center group">
                      <div className="w-20 h-24 bg-[#F6F6F6] overflow-hidden shrink-0 border border-zinc-200 rounded-none aspect-[3/4]">
                        <img
                          src={getOptimizedImageUrl(prod.image_url, 160, 75)}
                          alt={prod.name}
                          className="w-full h-full object-cover object-center"
                        />
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          {prod.category_name}
                        </p>
                        <h4 className="text-xs font-bold text-zinc-900 line-clamp-1 uppercase">
                          {prod.name}
                        </h4>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs font-black text-zinc-950 font-mono tabular-nums">
                            Rp {prod.price.toLocaleString('id-ID')}
                          </span>
                          {prod.original_price && prod.original_price > prod.price && (
                            <span className="text-[10px] text-zinc-400 line-through font-mono tabular-nums">
                              Rp {prod.original_price.toLocaleString('id-ID')}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <motion.button
                            whileTap={{ scale: 0.96 }}
                            type="button"
                            onClick={() => onMoveToCart(prod, prod.sizes[0] || 'M')}
                            className="px-3 py-1.5 bg-zinc-900 hover:bg-[#E60012] text-white text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 rounded-none cursor-pointer"
                          >
                            <ShoppingBag size={12} />
                            <span>Pindah ke Tas</span>
                          </motion.button>
                          <button
                            type="button"
                            onClick={() => onRemoveFromWishlist(prod.id)}
                            className="p-1.5 text-zinc-400 hover:text-[#E60012] transition-colors rounded-none cursor-pointer"
                            title="Hapus"
                            aria-label="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-4 border-t border-zinc-200 bg-zinc-50">
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={onClose}
                    className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer"
                  >
                    Lanjut Belanja
                  </motion.button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
