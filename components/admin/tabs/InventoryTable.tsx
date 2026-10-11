'use client';

import React from 'react';
import { AlertTriangle, Edit2, Trash2 } from 'lucide-react';
import { Product } from '@/lib/types';

interface InventoryTableProps {
  products: Product[];
  isOwner: boolean;
  onStockAdjust: (productId: number, delta: number) => void;
  onOpenExactStock: (product: Product) => void;
  onOpenEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: number, productName: string) => void;
}

export const InventoryTable: React.FC<InventoryTableProps> = ({
  products,
  isOwner,
  onStockAdjust,
  onOpenExactStock,
  onOpenEditProduct,
  onDeleteProduct,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-xs">
        <thead className="bg-zinc-50 border-y border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[11px]">
          <tr>
            <th className="py-3 px-4">Produk Busana</th>
            <th className="py-3 px-4">Kategori & Gender</th>
            <th className="py-3 px-4">Harga Satuan</th>
            <th className="py-3 px-4">Stok Fisik</th>
            <th className="py-3 px-4">Status SIM</th>
            <th className="py-3 px-4 text-center">Jalan Pintas Restok (FR-24)</th>
            <th className="py-3 px-4 text-center">Aksi Katalog</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-200">
          {products.map((p) => {
            const isCrit = p.stock <= 5;
            const isLow = p.stock > 5 && p.stock <= 15;
            const isSafe = p.stock > 15;

            return (
              <tr key={p.id} className="hover:bg-zinc-50/80 transition-colors">
                <td className="py-3 px-4 flex items-center gap-3">
                  <img
                    src={p.image_url}
                    alt={p.name}
                    className="w-10 h-12 object-cover bg-zinc-100 border border-zinc-200 shrink-0"
                  />
                  <div>
                    <p className="font-bold text-zinc-950 uppercase">{p.name}</p>
                    <p className="text-[10px] text-zinc-400 italic line-clamp-1">{p.fabric_details}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="text-zinc-700 font-semibold">{p.category_name}</p>
                  <span className="text-[10px] uppercase font-mono text-zinc-400 bg-zinc-100 px-1 py-0.5 border border-zinc-200">
                    {p.gender}
                  </span>
                </td>
                <td className="py-3 px-4 font-bold text-zinc-900 font-mono">
                  Rp {p.price.toLocaleString('id-ID')}
                </td>
                <td className="py-3 px-4 font-black text-sm">
                  <span className={isCrit ? 'text-[#E60012]' : 'text-zinc-900'}>
                    {p.stock} Unit
                  </span>
                </td>
                <td className="py-3 px-4">
                  {isCrit && (
                    <span className="bg-red-100 text-red-800 border border-red-300 px-2 py-0.5 font-bold uppercase text-[10px] flex items-center gap-1 w-max animate-pulse">
                      <AlertTriangle size={12} />
                      <span>KRITIS (≤ 5)</span>
                    </span>
                  )}
                  {isLow && (
                    <span className="bg-amber-100 text-amber-800 border border-amber-300 px-2 py-0.5 font-semibold uppercase text-[10px] w-max block">
                      MENIPIS (6-15)
                    </span>
                  )}
                  {isSafe && (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-2 py-0.5 font-semibold uppercase text-[10px] w-max block">
                      AMAN (&gt; 15)
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  {/* FR-24 Shortcut Buttons: -5, +1, +5, +10, +50, & Set Stok */}
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => onStockAdjust(p.id, -5)}
                      className="px-2 py-1 text-[10px] font-bold border border-zinc-300 hover:bg-zinc-100 text-zinc-700 cursor-pointer"
                      title="Kurangi 5 stok"
                    >
                      -5
                    </button>
                    <button
                      onClick={() => onStockAdjust(p.id, 1)}
                      className="px-2 py-1 text-[10px] font-bold bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-800 cursor-pointer"
                      title="Tambah 1 stok"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => onStockAdjust(p.id, 5)}
                      className="px-2 py-1 text-[10px] font-bold bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-800 cursor-pointer"
                      title="Tambah 5 stok"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => onStockAdjust(p.id, 10)}
                      className="px-2.5 py-1 text-[10px] font-bold bg-zinc-900 hover:bg-[#E60012] text-white cursor-pointer"
                      title="Tambah 10 stok"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => onStockAdjust(p.id, 50)}
                      className="px-2 py-1 text-[10px] font-bold bg-zinc-800 hover:bg-[#E60012] text-white cursor-pointer"
                      title="Tambah 50 stok (Bulk Restock)"
                    >
                      +50
                    </button>
                    <button
                      onClick={() => onOpenExactStock(p)}
                      className="px-2 py-1 text-[10px] font-bold border border-zinc-400 bg-white hover:bg-zinc-100 text-zinc-900 cursor-pointer"
                      title="Atur angka stok bebas eksak"
                    >
                      Set...
                    </button>
                  </div>
                </td>
                <td className="py-3 px-4 text-center">
                  <div className="inline-flex items-center gap-1.5">
                    <button
                      onClick={() => onOpenEditProduct(p)}
                      className="p-1.5 text-zinc-600 hover:text-black border border-zinc-200 hover:border-zinc-400 cursor-pointer"
                      title="Edit Data Produk"
                    >
                      <Edit2 size={13} />
                    </button>
                    {isOwner && (
                      <button
                        onClick={() => onDeleteProduct(p.id, p.name)}
                        className="p-1.5 text-red-600 hover:text-white hover:bg-[#E60012] border border-red-200 hover:border-red-600 transition-colors cursor-pointer"
                        title="Hapus Produk dari Database"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
