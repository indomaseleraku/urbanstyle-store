// components/admin/tabs/InventoryTab.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { Product } from '@/lib/types';
import AddProductForm from './inventory/AddProductForm';
import InventoryRow from './inventory/InventoryRow';

interface InventoryTabProps {
  products: Product[];
  isOwner: boolean;
  onStockAdjust: (productId: number, delta: number) => void;
  onOpenExactStock: (product: Product) => void;
  onOpenEditProduct: (product: Product) => void;
  onDeleteProduct: (productId: number, productName: string) => void;
  onCreateProduct: (productPayload: any) => Promise<void>;
}

export const InventoryTab: React.FC<InventoryTabProps> = ({
  products,
  isOwner,
  onStockAdjust,
  onOpenExactStock,
  onOpenEditProduct,
  onDeleteProduct,
  onCreateProduct,
}) => {
  const [searchProduct, setSearchProduct] = useState('');
  const [stockLevelFilter, setStockLevelFilter] = useState<'all' | 'critical' | 'low' | 'safe'>('all');
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(searchProduct.toLowerCase()) ||
        p.category_name?.toLowerCase().includes(searchProduct.toLowerCase());
      if (!matchSearch) return false;
      if (stockLevelFilter === 'critical') return p.stock <= 5;
      if (stockLevelFilter === 'low') return p.stock > 5 && p.stock <= 15;
      if (stockLevelFilter === 'safe') return p.stock > 15;
      return true;
    });
  }, [products, searchProduct, stockLevelFilter]);

  return (
    <div className="bg-white border border-zinc-200 shadow-2xs space-y-4 rounded-none font-sans">
      <div className="p-4 sm:p-5 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold uppercase tracking-tight text-zinc-950 flex items-center gap-2">
            <span>Kontrol Inventaris & Restok Fleksibel</span>
            <span className="text-[10px] bg-red-100 text-[#E60012] px-2 py-0.5 font-mono font-bold">FR-24</span>
          </h3>
          <p className="text-xs text-zinc-500">
            Input kuantitas bebas satuan, jalan pintas cepat (+1, +5, +10), dan CRUD katalog penuh
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="inline-flex border border-zinc-300 text-xs font-bold uppercase overflow-hidden rounded-none">
            <button onClick={() => setStockLevelFilter('all')} className={`px-2.5 py-1.5 cursor-pointer ${stockLevelFilter === 'all' ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-700'}`}>Semua ({products.length})</button>
            <button onClick={() => setStockLevelFilter('critical')} className={`px-2.5 py-1.5 cursor-pointer ${stockLevelFilter === 'critical' ? 'bg-red-700 text-white' : 'bg-white text-red-600'}`}>Kritis (&le;5)</button>
            <button onClick={() => setStockLevelFilter('low')} className={`px-2.5 py-1.5 cursor-pointer ${stockLevelFilter === 'low' ? 'bg-amber-600 text-white' : 'bg-white text-amber-700'}`}>Menipis (6-15)</button>
            <button onClick={() => setStockLevelFilter('safe')} className={`px-2.5 py-1.5 cursor-pointer ${stockLevelFilter === 'safe' ? 'bg-emerald-700 text-white' : 'bg-white text-emerald-700'}`}>Aman (&gt;15)</button>
          </div>
          {isOwner && (
            <button onClick={() => setIsAddingProduct(!isAddingProduct)} className="px-3.5 py-2 bg-zinc-950 hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 rounded-none cursor-pointer">
              <Plus size={14} /> <span>Tambah Produk</span>
            </button>
          )}
        </div>
      </div>

      <div className="px-4 sm:px-5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
          <input type="text" placeholder="Cari nama busana atau kategori katalog..." value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} className="w-full pl-9 pr-4 py-2 border border-zinc-200 text-xs rounded-none bg-zinc-50" />
        </div>
      </div>

      {isAddingProduct && (
        <div className="px-4 sm:px-5">
          <AddProductForm onClose={() => setIsAddingProduct(false)} onSubmit={onCreateProduct} />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-100 border-y border-zinc-200 text-zinc-700 font-bold uppercase text-[11px]">
              <th className="p-3 text-center">ID</th>
              <th className="p-3">Nama Produk & SKU</th>
              <th className="p-3 text-center">Kategori</th>
              <th className="p-3 text-right">Harga</th>
              <th className="p-3 text-center">Sisa Stok Fisik</th>
              <th className="p-3 text-center">Restok Cepat</th>
              <th className="p-3 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {filteredProducts.map((p) => (
              <InventoryRow
                key={p.id} product={p} isOwner={isOwner}
                onStockAdjust={onStockAdjust} onOpenExactStock={onOpenExactStock}
                onOpenEditProduct={onOpenEditProduct} onDeleteProduct={onDeleteProduct}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
