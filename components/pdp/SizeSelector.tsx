// components/pdp/SizeSelector.tsx
'use client';

import React from 'react';
import { Ruler, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface SizeSelectorProps {
  sizes: string[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  outOfStockSizes?: string[];
  onOpenSizeChart: () => void;
  quantity: number;
  onQuantityChange: (qty: number) => void;
  maxStock: number;
}

export default function SizeSelector({
  sizes,
  selectedSize,
  onSelectSize,
  outOfStockSizes = [],
  onOpenSizeChart,
  quantity,
  onQuantityChange,
  maxStock,
}: SizeSelectorProps) {
  return (
    <div className="space-y-4">
      {/* Size Header with Size Guide CTA */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold uppercase tracking-wider text-[#111111]">
          Pilih Ukuran: <strong className="font-mono text-[#111111]">{selectedSize}</strong>
        </span>
        <button
          type="button"
          onClick={onOpenSizeChart}
          className="text-[#111111] hover:text-[#E60012] font-bold uppercase tracking-wider text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
        >
          <Ruler size={13} />
          <span className="underline underline-offset-2">Panduan Ukuran</span>
        </button>
      </div>

      {/* Size Grid with Diagonal Slash for OOS (TICKET-06) */}
      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {sizes.map((sz) => {
          const isOos = outOfStockSizes.includes(sz);
          const isSelected = selectedSize === sz;

          return (
            <button
              key={sz}
              type="button"
              disabled={isOos}
              onClick={() => onSelectSize(sz)}
              className={`relative h-11 border text-xs font-bold uppercase tracking-wider transition-all rounded-none flex items-center justify-center cursor-pointer overflow-hidden ${
                isOos
                  ? 'border-zinc-200 text-zinc-300 bg-zinc-50 cursor-not-allowed opacity-60'
                  : isSelected
                  ? 'border-[#111111] bg-[#111111] text-white shadow-xs'
                  : 'border-zinc-300 bg-white text-[#111111] hover:border-zinc-950'
              }`}
            >
              <span>{sz}</span>
              {/* Diagonal Slash for Out of Stock */}
              {isOos && (
                <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <span className="w-full h-[1.5px] bg-zinc-300 rotate-45 transform" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center justify-between pt-2 border-t border-[#E5E5E5]">
        <span className="text-xs font-bold uppercase tracking-wider text-[#111111]">
          Jumlah:
        </span>
        <div className="flex items-center border border-zinc-300 bg-white rounded-none">
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            className="w-9 h-9 flex items-center justify-center hover:bg-zinc-100 text-zinc-700 disabled:opacity-30 cursor-pointer"
            aria-label="Kurangi kuantitas"
          >
            -
          </motion.button>
          <span className="w-10 text-center font-mono font-bold text-xs text-[#111111] tabular-nums">
            {quantity}
          </span>
          <motion.button
            whileTap={{ scale: 0.96 }}
            type="button"
            onClick={() => onQuantityChange(Math.min(maxStock, quantity + 1))}
            disabled={quantity >= maxStock}
            className="w-9 h-9 flex items-center justify-center hover:bg-zinc-100 text-zinc-700 disabled:opacity-30 cursor-pointer"
            aria-label="Tambah kuantitas"
          >
            +
          </motion.button>
        </div>
      </div>
    </div>
  );
}
