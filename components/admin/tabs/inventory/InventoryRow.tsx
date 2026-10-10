// components/admin/tabs/inventory/InventoryRow.tsx
'use client';

import React from 'react';
import { Product } from '@/lib/types';
import { AlertTriangle, Edit2, Trash2 } from 'lucide-react';

interface InventoryRowProps {
  product: Product;
  isOwner: boolean;
  onStockAdjust: (productId: number, delta: number) => void;
  onOpenExactStock: (product: Product) => void;
  onOpenEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: number, productName: string) => void;
}

export default function InventoryRow({
  product: p,
  isOwner,
  onStockAdjust,
  onOpenExactStock,
  onOpenEditProduct,
  onDeleteProduct,
}: InventoryRowProps) {
  const isCritical = p.stock <= 5;
  const isLow = p.stock > 5 && p.stock <= 15;

  return (
    <tr className="hover:bg-zinc-50/50">
      <td className="p-3 text-center font-mono font-bold text-zinc-500">#{p.id}</td>
      <td className="p-3 font-semibold text-zinc-950 flex items-center gap-2">
        <img src={p.image_url} alt={p.name} className="w-8 h-10 object-cover bg-zinc-100 border border-zinc-200 shrink-0 rounded-none" />
        <div>
          <span className="block">{p.name}</span>
          <span className="text-[10px] text-zinc-400 font-mono">Kode SKU: US-{p.id}</span>
        </div>
      </td>
      <td className="p-3 text-center uppercase text-[11px] text-zinc-600 font-medium">{p.category_name}</td>
      <td className="p-3 text-right font-mono font-semibold tabular-nums">Rp {p.price.toLocaleString('id-ID')}</td>
      <td className="p-3 text-center">
        <span className={`inline-flex items-center gap-1 font-mono font-black text-xs px-2 py-0.5 rounded-none ${
          isCritical ? 'bg-red-100 text-red-800 border border-red-300' : isLow ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
        }`}>
          {isCritical && <AlertTriangle size={11} />}
          <span>{p.stock} pcs</span>
        </span>
      </td>
      <td className="p-3">
        <div className="flex items-center justify-center gap-1 font-mono">
          <button onClick={() => onStockAdjust(p.id, -1)} className="w-6 h-6 border border-zinc-300 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center rounded-none">-1</button>
          <button onClick={() => onStockAdjust(p.id, 1)} className="w-6 h-6 border border-zinc-300 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center rounded-none">+1</button>
          <button onClick={() => onStockAdjust(p.id, 5)} className="w-6 h-6 border border-zinc-300 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center rounded-none">+5</button>
          <button onClick={() => onStockAdjust(p.id, 10)} className="w-7 h-6 border border-zinc-300 hover:bg-zinc-200 text-zinc-700 flex items-center justify-center rounded-none">+10</button>
          <button onClick={() => onOpenExactStock(p)} className="px-2 h-6 bg-zinc-950 text-white hover:bg-zinc-800 text-[10px] font-bold uppercase rounded-none ml-1">Input Bebas</button>
        </div>
      </td>
      <td className="p-3 text-center">
        <div className="flex items-center justify-center gap-1.5">
          <button onClick={() => onOpenEditProduct(p)} className="p-1.5 text-zinc-600 hover:text-black hover:bg-zinc-100 transition-colors rounded-none" title="Edit Katalog"><Edit2 size={14} /></button>
          {isOwner && (
            <button onClick={() => onDeleteProduct(p.id, p.name)} className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors rounded-none" title="Hapus Produk"><Trash2 size={14} /></button>
          )}
        </div>
      </td>
    </tr>
  );
}
