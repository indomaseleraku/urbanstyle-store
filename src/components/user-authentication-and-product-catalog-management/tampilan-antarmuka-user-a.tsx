'use strict';
'use client';

import React, { useState } from 'react';
import { ShieldCheck, Package, Tag, Layers, UserCheck, AlertCircle, Plus, Search, Filter } from 'lucide-react';

interface CatalogItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'ACTIVE' | 'DRAFT' | 'ARCHIVED';
  colors: string[];
}

const INITIAL_CATALOG: CatalogItem[] = [
  {
    id: 'prod-1',
    sku: 'UQ-AIRISM-TEE-01',
    name: 'T-Shirt AIRism Katun Kerah Bulat',
    category: 'pria',
    price: 199000,
    stock: 142,
    status: 'ACTIVE',
    colors: ['00 WHITE', '09 BLACK', '68 BLUE'],
  },
  {
    id: 'prod-2',
    sku: 'UQ-OXFORD-SHIRT-02',
    name: 'Kemeja Oxford Slim Fit Lengan Panjang',
    category: 'pria',
    price: 399000,
    stock: 58,
    status: 'ACTIVE',
    colors: ['01 OFF WHITE', '69 NAVY'],
  },
  {
    id: 'prod-3',
    sku: 'UQ-PLEATED-PANTS-03',
    name: 'Celana Lebar Lipit Pleated Wide Pants',
    category: 'wanita',
    price: 499000,
    stock: 89,
    status: 'ACTIVE',
    colors: ['32 BEIGE', '09 BLACK', '08 DARK GRAY'],
  },
  {
    id: 'prod-4',
    sku: 'UQ-HEATTECH-EXT-04',
    name: 'HEATTECH T-Shirt Lengan Panjang Extra Warm',
    category: 'wanita',
    price: 299000,
    stock: 12,
    status: 'ACTIVE',
    colors: ['00 WHITE', '09 BLACK'],
  },
];

export const TampilanAntarmukaUserA: React.FC<{
  onSelectProduct?: (product: CatalogItem) => void;
  onOpenNewForm?: () => void;
}> = ({ onSelectProduct, onOpenNewForm }) => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [catalog, setCatalog] = useState<CatalogItem[]>(INITIAL_CATALOG);

  const filteredCatalog = catalog.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Header & Role Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 border border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black text-white">
              LifeWear Catalog Engine
            </span>
            <span className="flex items-center gap-1 text-xs text-green-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> RBAC: Super Admin
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-950 uppercase font-mono">
            Katalog Produk & Hak Akses Autentikasi
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manajemen SKU master, varian warna/ukuran, kontrol inventaris, dan otorisasi sesi pengguna.
          </p>
        </div>
        <button
          onClick={onOpenNewForm}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E60012] hover:bg-[#CC0010] text-white font-medium text-xs uppercase tracking-wider transition-colors"
        >
          <Plus className="w-4 h-4" /> Tambah Produk Baru
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative md:col-span-2">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari SKU atau nama produk Uniqlo..."
            className="w-full pl-10 pr-4 py-2.5 text-xs border border-gray-200 bg-white focus:outline-none focus:border-black font-mono"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full py-2.5 px-3 text-xs border border-gray-200 bg-white focus:outline-none focus:border-black uppercase font-medium"
          >
            <option value="all">Semua Kategori</option>
            <option value="pria">Pria</option>
            <option value="wanita">Wanita</option>
            <option value="anak">Anak</option>
            <option value="bayi">Bayi</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 font-mono text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">SKU & Produk</th>
              <th className="py-3 px-4 font-semibold">Kategori</th>
              <th className="py-3 px-4 font-semibold">Harga Retail</th>
              <th className="py-3 px-4 font-semibold">Varian Warna</th>
              <th className="py-3 px-4 font-semibold">Stok Master</th>
              <th className="py-3 px-4 font-semibold">Status</th>
              <th className="py-3 px-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-sans">
            {filteredCatalog.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-mono text-[11px] text-gray-500">{item.sku}</div>
                  <div className="font-semibold text-gray-900 mt-0.5">{item.name}</div>
                </td>
                <td className="py-3.5 px-4 uppercase text-gray-700 font-medium">
                  {item.category}
                </td>
                <td className="py-3.5 px-4 font-mono font-medium text-gray-900">
                  Rp {item.price.toLocaleString('id-ID')}
                </td>
                <td className="py-3.5 px-4">
                  <div className="flex flex-wrap gap-1">
                    {item.colors.map((c, idx) => (
                      <span
                        key={idx}
                        className="px-1.5 py-0.5 text-[10px] bg-gray-100 text-gray-600 font-mono border border-gray-200"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`font-mono font-bold ${
                      item.stock < 20 ? 'text-amber-600' : 'text-gray-900'
                    }`}
                  >
                    {item.stock} pcs
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">
                    {item.status}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onSelectProduct?.(item)}
                    className="px-2.5 py-1 text-xs font-medium text-black hover:text-[#E60012] border border-gray-300 hover:border-[#E60012] transition-colors"
                  >
                    Detail / Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TampilanAntarmukaUserA;
