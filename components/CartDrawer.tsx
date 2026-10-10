// components/CartDrawer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CartItem } from '@/lib/types';
import { X, Truck, ShoppingBag, Clock } from 'lucide-react';
import CartItemTile from './cart/CartItemTile';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQty: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onOpenCheckout: () => void;
  selectedCourier: string;
  onSelectCourier: (courier: string) => void;
}

export const COURIERS = [
  { name: 'J&T Express (Reguler)', price: 15000, eta: '1-2 Hari' },
  { name: 'JNE Reguler', price: 18000, eta: '1-3 Hari' },
  { name: 'SiCepat Halu', price: 16000, eta: '1-2 Hari' },
];

export const FREE_SHIPPING_THRESHOLD = 400000;

export default function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQty,
  onRemoveItem,
  onOpenCheckout,
  selectedCourier,
  onSelectCourier,
}: CartDrawerProps) {
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (!isOpen || items.length === 0) {
      setTimeLeft(600);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, items.length]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const courierObj = COURIERS.find((c) => c.name === selectedCourier) || COURIERS[0];
  const shippingCost = isFreeShipping ? 0 : courierObj.price;
  const grandTotal = subtotal + shippingCost;
  const missingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const totalCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="w-screen max-w-md bg-white border-l border-zinc-200 flex flex-col shadow-2xl rounded-none z-10"
            >
              {/* Header */}
              <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 bg-[#E60012] text-white flex items-center justify-center font-black text-xs rounded-none">
                    US
                  </div>
                  <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-zinc-950">
                    Tas Belanja ({totalCount})
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-zinc-400 hover:text-zinc-950 transition-colors rounded-none cursor-pointer"
                  aria-label="Tutup Tas Belanja"
                >
                  <X size={20} />
                </button>
              </div>

              {/* 10-Minute Reservation Timer Banner */}
              {items.length > 0 && (
                <div className="px-5 py-2 bg-red-50 border-b border-red-200 flex items-center justify-between text-xs text-[#E60012]">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
                    <Clock size={13} />
                    <span>Reservasi Stok 10 Menit:</span>
                  </span>
                  <span className="font-mono font-black text-xs tabular-nums">
                    {timeFormatted}
                  </span>
                </div>
              )}

              {/* Free Shipping Progress */}
              <div className="px-5 py-3 bg-zinc-100 border-b border-zinc-200 text-xs">
                <div className="flex items-center justify-between font-semibold mb-2">
                  <span className="flex items-center gap-2 text-zinc-800">
                    <Truck size={15} className="text-zinc-950 shrink-0" />
                    {isFreeShipping ? (
                      <span className="text-emerald-700 font-bold uppercase tracking-wider text-[11px]">
                        ✓ Bebas Ongkir LifeWear Aktif!
                      </span>
                    ) : (
                      <span className="text-[11px]">
                        Tambah <strong className="text-zinc-950 font-mono tabular-nums">Rp {missingForFreeShipping.toLocaleString('id-ID')}</strong> untuk Bebas Ongkir
                      </span>
                    )}
                  </span>
                </div>
                <div className="w-full h-1 bg-zinc-300 rounded-none overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 rounded-none ${isFreeShipping ? 'bg-emerald-600' : 'bg-[#E60012]'}`}
                    style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 divide-y divide-zinc-100">
                {items.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-16 text-zinc-400">
                    <ShoppingBag size={48} className="stroke-[1.2] text-zinc-300" />
                    <p className="text-sm font-bold text-zinc-800 uppercase tracking-wide">
                      Tas Belanja Masih Kosong
                    </p>
                    <p className="text-xs text-zinc-500 max-w-xs">
                      Temukan koleksi kemeja flannel, kaos heavyweight, dan outerwear esensial di katalog LifeWear kami.
                    </p>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 px-6 py-3 bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E60012] transition-colors rounded-none cursor-pointer"
                    >
                      Mulai Eksplorasi
                    </button>
                  </div>
                ) : (
                  items.map((item, idx) => (
                    <CartItemTile
                      key={idx}
                      item={item}
                      index={idx}
                      onUpdateQty={onUpdateQty}
                      onRemoveItem={onRemoveItem}
                    />
                  ))
                )}
              </div>

              {/* Checkout Footer */}
              {items.length > 0 && (
                <div className="p-4 sm:p-5 border-t border-zinc-200 bg-zinc-50/70 space-y-3.5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
                      Kurir Ekspedisi:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {COURIERS.map((c) => (
                        <button
                          key={c.name}
                          type="button"
                          onClick={() => onSelectCourier(c.name)}
                          className={`p-2 text-left border rounded-none text-[11px] transition-all cursor-pointer ${
                            selectedCourier === c.name
                              ? 'border-zinc-950 bg-white font-bold ring-1 ring-zinc-950 shadow-xs'
                              : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300'
                          }`}
                        >
                          <p className="truncate font-bold">{c.name.split(' ')[0]}</p>
                          <p className="text-[10px] text-zinc-400 font-normal">{c.eta}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-600 pt-2 border-t border-zinc-200">
                    <div className="flex justify-between">
                      <span>Subtotal Produk</span>
                      <span className="font-mono font-bold text-zinc-950 tabular-nums">
                        Rp {subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Biaya Pengiriman</span>
                      <span className="font-mono font-bold text-zinc-950 tabular-nums">
                        {isFreeShipping ? 'GRATIS' : `Rp ${shippingCost.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm sm:text-base font-black text-zinc-950 pt-1.5 border-t border-zinc-200">
                      <span className="uppercase">Total Tagihan</span>
                      <span className="text-[#E60012] font-mono tabular-nums">
                        Rp {grandTotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={onOpenCheckout}
                    className="w-full py-4 bg-[#111111] hover:bg-[#E60012] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none shadow-sm min-h-[48px] cursor-pointer"
                  >
                    <span>LANJUT KE PEMBAYARAN →</span>
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
