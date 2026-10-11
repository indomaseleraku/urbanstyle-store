// components/admin/tabs/InventoryTab.tsx
// Kontrol Inventaris, Restok Cepat Satuan, dan Manajemen Katalog Busana (FR-24)

import React, { useState, useMemo } from 'react';
import { Search, Plus } from 'lucide-react';
import { Product } from '@/lib/types';
import { InventoryAddProductForm } from './InventoryAddProductForm';
import { InventoryTable } from './InventoryTable';

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
    <div className="bg-white border border-zinc-200 shadow-2xs space-y-4 animate-in fade-in duration-200">
      <div className="p-4 sm:p-5 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold uppercase tracking-tight text-zinc-950 flex items-center gap-2">
            <span>Kontrol Inventaris & Restok Fleksibel</span>
            <span className="text-[10px] bg-red-100 text-[#E60012] px-2 py-0.5 font-mono font-bold">FR-24</span>
          </h3>
          <p className="text-xs text-zinc-500">
            Input kuantitas bebas satuan, jalan pintas cepat (+1, +5, +10, +50), dan CRUD katalog penuh
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Stock Level Filter Pills */}
          <div className="inline-flex border border-zinc-300 text-xs font-bold uppercase overflow-hidden">
            <button
              onClick={() => setStockLevelFilter('all')}
              className={`px-2.5 py-1.5 cursor-pointer ${
                stockLevelFilter === 'all' ? 'bg-zinc-950 text-white' : 'bg-white hover:bg-zinc-100 text-zinc-700'
              }`}
            >
              Semua ({products.length})
            </button>
            <button
              onClick={() => setStockLevelFilter('critical')}
              className={`px-2.5 py-1.5 border-l border-zinc-300 cursor-pointer ${
                stockLevelFilter === 'critical' ? 'bg-[#E60012] text-white' : 'bg-white hover:bg-zinc-100 text-red-600'
              }`}
            >
              Kritis ≤5 ({products.filter((p) => p.stock <= 5).length})
            </button>
            <button
              onClick={() => setStockLevelFilter('low')}
              className={`px-2.5 py-1.5 border-l border-zinc-300 cursor-pointer ${
                stockLevelFilter === 'low' ? 'bg-amber-600 text-white' : 'bg-white hover:bg-zinc-100 text-amber-700'
              }`}
            >
              Menipis ({products.filter((p) => p.stock > 5 && p.stock <= 15).length})
            </button>
            <button
              onClick={() => setStockLevelFilter('safe')}
              className={`px-2.5 py-1.5 border-l border-zinc-300 cursor-pointer ${
                stockLevelFilter === 'safe' ? 'bg-emerald-700 text-white' : 'bg-white hover:bg-zinc-100 text-emerald-700'
              }`}
            >
              Aman &gt;15 ({products.filter((p) => p.stock > 15).length})
            </button>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari pakaian..."
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:border-zinc-900"
            />
          </div>

          <button
            onClick={() => setIsAddingProduct(!isAddingProduct)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E60012] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>Tambah SKU</span>
          </button>
        </div>
      </div>

      {/* Quick Add Product Form (FR-24) */}
      <InventoryAddProductForm
        isOpen={isAddingProduct}
        onClose={() => setIsAddingProduct(false)}
        onCreateProduct={onCreateProduct}
      />

      {/* Live Inventory Table */}
      <InventoryTable
        products={filteredProducts}
        isOwner={isOwner}
        onStockAdjust={onStockAdjust}
        onOpenExactStock={onOpenExactStock}
        onOpenEditProduct={onOpenEditProduct}
        onDeleteProduct={onDeleteProduct}
      />
    </div>
  );
};
