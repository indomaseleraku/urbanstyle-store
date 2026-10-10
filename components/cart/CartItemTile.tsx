// components/cart/CartItemTile.tsx
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem } from '@/lib/types';
import { getOptimizedImageUrl } from '@/lib/utils';

interface CartItemTileProps {
  item: CartItem;
  index: number;
  onUpdateQty: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
}

export default function CartItemTile({
  item,
  index,
  onUpdateQty,
  onRemoveItem,
}: CartItemTileProps) {
  return (
    <div className="pt-4 first:pt-0 flex gap-3.5 items-start">
      <img
        src={getOptimizedImageUrl(item.product.image_url, 160, 75)}
        alt={item.product.name}
        className="w-16 h-20 sm:w-20 sm:h-24 object-cover bg-[#F6F6F6] border border-zinc-200 shrink-0 rounded-none"
      />
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
        <p className="text-xs sm:text-sm font-mono font-black text-zinc-950 tabular-nums pt-1">
          Rp {item.product.price.toLocaleString('id-ID')}
        </p>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center border border-zinc-300 bg-white rounded-none">
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => onUpdateQty(index, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 text-zinc-700 cursor-pointer"
              aria-label="Kurangi"
            >
              <Minus size={12} />
            </motion.button>
            <span className="w-8 text-center text-xs font-mono font-bold text-zinc-950 tabular-nums">
              {item.quantity}
            </span>
            <motion.button
              whileTap={{ scale: 0.96 }}
              type="button"
              onClick={() => onUpdateQty(index, item.quantity + 1)}
              disabled={item.quantity >= item.product.stock}
              className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 text-zinc-700 disabled:opacity-30 cursor-pointer"
              aria-label="Tambah"
            >
              <Plus size={12} />
            </motion.button>
          </div>
          <button
            type="button"
            onClick={() => onRemoveItem(index)}
            className="text-zinc-400 hover:text-[#E60012] text-xs flex items-center gap-1 transition-colors p-2 cursor-pointer"
            aria-label="Hapus"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </div>
  );
}
