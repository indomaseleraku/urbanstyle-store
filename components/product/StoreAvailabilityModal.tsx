'use client';

import React, { useState } from 'react';
import { X, MapPin, Store, Check, AlertTriangle, Clock } from 'lucide-react';
import { STORES } from '@/lib/constants/stores';

interface StoreAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  selectedSize?: string;
  selectedColor?: string;
}

export default function StoreAvailabilityModal({
  isOpen,
  onClose,
  productName,
  selectedSize,
  selectedColor,
}: StoreAvailabilityModalProps) {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredStores = STORES.filter((s) => {
    if (selectedCity === 'all') return true;
    return s.city.toLowerCase().includes(selectedCity.toLowerCase());
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200 font-sans">
      <div className="bg-white border border-zinc-300 w-full max-w-xl overflow-hidden shadow-2xl rounded-none">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#E60012] text-white flex items-center justify-center font-black text-xs rounded-none">
              <Store size={16} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-[#E60012] uppercase tracking-widest">
                CLICK & COLLECT // TOKO OFFLINE
              </span>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-zinc-950">
                Cek Ketersediaan Gerai Fisik
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Selected Variant Summary */}
        <div className="px-5 py-3 bg-zinc-100 border-b border-zinc-200 text-xs flex items-center justify-between">
          <div>
            <p className="font-bold text-zinc-900 uppercase truncate max-w-xs">
              {productName || 'Direktori Gerai Resmi UrbanStyle'}
            </p>
            <p className="text-[11px] text-zinc-500 font-mono">
              {productName
                ? `Varian: ${selectedColor || 'Semua Varian'} • Ukuran ${selectedSize || 'Semua Ukuran'}`
                : 'Click & Collect gratis biaya ambil • Pengambilan siap dalam 2 jam'}
            </p>
          </div>
          <span className="px-2 py-0.5 bg-white border border-zinc-300 text-[10px] font-mono font-bold text-zinc-800 shrink-0 ml-2">
            Gratis Biaya Ambil
          </span>
        </div>

        {/* City Filter Pills */}
        <div className="px-5 pt-3 flex gap-1.5 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: 'Semua Kota' },
            { id: 'jakarta', label: 'Jabodetabek' },
            { id: 'bandung', label: 'Bandung' },
            { id: 'surabaya', label: 'Surabaya' },
          ].map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCity(c.id)}
              className={`px-3 py-1 font-bold text-[11px] uppercase transition-all rounded-none cursor-pointer ${
                selectedCity === c.id
                  ? 'bg-zinc-950 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Store List */}
        <div className="p-5 space-y-3 max-h-80 overflow-y-auto divide-y divide-zinc-100">
          {filteredStores.map((st) => {
            const isAvailable = st.stock > 0;
            const isSelected = selectedStoreId === st.id;
            return (
              <div
                key={st.id}
                onClick={() => isAvailable && setSelectedStoreId(st.id)}
                className={`pt-3 first:pt-0 p-3 border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-zinc-950 bg-zinc-50 ring-1 ring-zinc-950'
                    : isAvailable
                    ? 'border-zinc-200 hover:border-zinc-300 bg-white'
                    : 'border-zinc-200 bg-zinc-50/60 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-zinc-900">
                      <MapPin size={13} className="text-[#E60012] shrink-0" />
                      <span>{st.name}</span>
                    </div>
                    <p className="text-[11px] text-zinc-500 pl-4">{st.city} • Jarak perkiraan {st.distance}</p>
                    <div className="flex items-center gap-2 pl-4 pt-1">
                      <span className="text-[10px] flex items-center gap-1 text-zinc-600">
                        <Clock size={11} /> {st.pickupEta}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    {isAvailable ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-bold uppercase font-mono">
                        <Check size={11} />
                        <span>Sisa {st.stock}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-100 text-zinc-500 text-[10px] font-bold uppercase font-mono">
                        <AlertTriangle size={11} />
                        <span>Habis</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center justify-between text-xs">
          <span className="text-[11px] text-zinc-500">
            Jam Buka Gerai: 10:00 - 22:00 WIB setiap hari
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-zinc-950 hover:bg-[#E60012] text-white font-bold uppercase text-[11px] tracking-wider transition-colors rounded-none cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
}
