// components/CartDrawer.tsx
'use client';

import React from 'react';
import { CartItem } from '@/lib/types';
import { getOptimizedImageUrl } from '@/lib/utils';
import { X, Trash2, Plus, Minus, ArrowRight, Truck, ShoppingBag } from 'lucide-react';

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
  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const courierObj = COURIERS.find(c => c.name === selectedCourier) || COURIERS[0];
  const shippingCost = isFreeShipping ? 0 : courierObj.price;
  const grandTotal = subtotal + shippingCost;
  const missingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const totalCount = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200" 
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white border-l border-zinc-200 flex flex-col shadow-2xl animate-in slide-in-from-right duration-300 rounded-none">
          
          {/* Header (Official LifeWear Naming) */}
          <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#E60012] text-white flex items-center justify-center font-black text-xs">
                US
              </div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-zinc-950">
                Tas Belanja ({totalCount})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-zinc-950 transition-colors"
              aria-label="Tutup Tas Belanja"
            >
              <X size={20} />
            </button>
          </div>

          {/* Sharp Free Shipping Progress Bar (Industrial Style) */}
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
                    Tambah <strong className="text-zinc-950 font-mono">Rp {missingForFreeShipping.toLocaleString('id-ID')}</strong> untuk Bebas Ongkir
                  </span>
                )}
              </span>
            </div>
            {/* Sharp block progress bar (rounded-none) */}
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
                  onClick={onClose}
                  className="mt-3 px-6 py-3 bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E60012] transition-colors rounded-none"
                >
                  Mulai Eksplorasi
                </button>
              </div>
            ) : (
              items.map((item, idx) => (
                <div key={idx} className="pt-4 first:pt-0 flex gap-3.5 items-start">
                  {/* Thumbnail with studio bg and sharp border */}
                  <img
                    src={getOptimizedImageUrl(item.product.image_url, 160, 75)}
                    alt={item.product.name}
                    className="w-16 h-20 sm:w-20 sm:h-24 object-cover bg-[#F6F6F6] border border-zinc-200 shrink-0 rounded-none"
                  />

                  {/* Info */}
                  <div className="flex-1 space-y-1">
                    <h3 className="text-xs sm:text-sm font-bold text-zinc-950 leading-snug uppercase line-clamp-2">
                      {item.product.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-zinc-600 font-medium pt-0.5">
                      <span className="px-1.5 py-0.5 bg-zinc-100 border border-zinc-200 text-zinc-800 font-bold uppercase rounded-none">
                        {item.selected_color}
                      </span>
                      <span className="px-1.5 py-0.5 bg-zinc-950 text-white font-bold uppercase rounded-none">
                        Ukuran {item.selected_size}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm font-mono font-black text-zinc-950 pt-1">
                      Rp {item.product.price.toLocaleString('id-ID')}
                    </p>

                    {/* Quantity Controls - Sharp Stepper */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-zinc-300 bg-white rounded-none">
                        <button
                          onClick={() => onUpdateQty(idx, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 text-zinc-700 transition-colors"
                          title="Kurangi kuantitas"
                          aria-label="Kurangi"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold text-zinc-950">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQty(idx, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 text-zinc-700 transition-colors disabled:opacity-30"
                          disabled={item.quantity >= item.product.stock}
                          title="Tambah kuantitas"
                          aria-label="Tambah"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <button
                        onClick={() => onRemoveItem(idx)}
                        className="text-zinc-400 hover:text-[#E60012] text-xs flex items-center gap-1 transition-colors p-2"
                        title="Hapus dari tas belanja"
                        aria-label="Hapus"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-zinc-200 bg-zinc-50/70 space-y-3.5">
              
              {/* Courier Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest block">
                  Kurir Ekspedisi:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {COURIERS.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => onSelectCourier(c.name)}
                      className={`p-2 text-left border rounded-none text-[11px] transition-all ${
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

              {/* Price Details */}
              <div className="space-y-1.5 text-xs text-zinc-600 pt-2 border-t border-zinc-200">
                <div className="flex justify-between">
                  <span>Subtotal Produk</span>
                  <span className="font-mono font-bold text-zinc-950">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Biaya Pengiriman</span>
                  <span className="font-mono font-bold text-zinc-950">
                    {isFreeShipping ? (
                      <span className="text-emerald-700 font-bold uppercase">GRATIS</span>
                    ) : (
                      `Rp ${shippingCost.toLocaleString('id-ID')}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-zinc-950 pt-1.5 border-t border-zinc-200">
                  <span className="uppercase">Total Tagihan</span>
                  <span className="text-[#E60012] font-mono">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Proceed to Checkout CTA */}
              <button
                onClick={onOpenCheckout}
                className="w-full py-4 bg-[#111111] hover:bg-[#E60012] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none shadow-sm min-h-[48px]"
              >
                <span>LANJUT KE PEMBAYARAN →</span>
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
