// components/admin/tabs/InventoryTab.tsx
// Kontrol Inventaris, Restok Cepat Satuan, dan Manajemen Katalog Busana (FR-24)

import React, { useState, useMemo } from 'react';
import { 
  Search, Plus, Sparkles, AlertTriangle, Edit2, Trash2 
} from 'lucide-react';
import { Product } from '@/lib/types';

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

  // New Product Form state
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState(1);
  const [newProductPrice, setNewProductPrice] = useState(199000);
  const [newProductStock, setNewProductStock] = useState(15);
  const [newProductGender, setNewProductGender] = useState<'unisex' | 'pria' | 'wanita' | 'anak'>('unisex');
  const [newProductImage, setNewProductImage] = useState('https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80');
  const [newProductFabric, setNewProductFabric] = useState('100% Katun Combed 280 GSM');

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(searchProduct.toLowerCase()) || 
                          p.category_name?.toLowerCase().includes(searchProduct.toLowerCase());
      if (!matchSearch) return false;
      if (stockLevelFilter === 'critical') return p.stock <= 5;
      if (stockLevelFilter === 'low') return p.stock > 5 && p.stock <= 15;
      if (stockLevelFilter === 'safe') return p.stock > 15;
      return true;
    });
  }, [products, searchProduct, stockLevelFilter]);

  const handleSubmitNewProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateProduct({
      category_id: newProductCategory,
      name: newProductName,
      slug: newProductName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      gender: newProductGender,
      price: Number(newProductPrice),
      stock: Number(newProductStock),
      description: `Busana LifeWear ${newProductName} esensial dengan potongan minimalis dan kenyamanan maksimal.`,
      fabric_details: newProductFabric,
      care_instructions: 'Cuci dengan mesin siklus lembut. Jangan gunakan pemutih.',
      colors: [{ name: 'Black', code: '09 BLACK', hex: '#111111', image_url: newProductImage }],
      sizes: ['S', 'M', 'L', 'XL'],
      image_url: newProductImage,
      gallery_images: [newProductImage],
      is_new: true,
      is_featured: true,
    });
    setIsAddingProduct(false);
    setNewProductName('');
  };

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
              className={`px-2.5 py-1.5 cursor-pointer ${stockLevelFilter === 'all' ? 'bg-zinc-950 text-white' : 'bg-white hover:bg-zinc-100 text-zinc-700'}`}
            >
              Semua ({products.length})
            </button>
            <button
              onClick={() => setStockLevelFilter('critical')}
              className={`px-2.5 py-1.5 border-l border-zinc-300 cursor-pointer ${stockLevelFilter === 'critical' ? 'bg-[#E60012] text-white' : 'bg-white hover:bg-zinc-100 text-red-600'}`}
            >
              Kritis ≤5 ({products.filter(p => p.stock <= 5).length})
            </button>
            <button
              onClick={() => setStockLevelFilter('low')}
              className={`px-2.5 py-1.5 border-l border-zinc-300 cursor-pointer ${stockLevelFilter === 'low' ? 'bg-amber-600 text-white' : 'bg-white hover:bg-zinc-100 text-amber-700'}`}
            >
              Menipis ({products.filter(p => p.stock > 5 && p.stock <= 15).length})
            </button>
            <button
              onClick={() => setStockLevelFilter('safe')}
              className={`px-2.5 py-1.5 border-l border-zinc-300 cursor-pointer ${stockLevelFilter === 'safe' ? 'bg-emerald-700 text-white' : 'bg-white hover:bg-zinc-100 text-emerald-700'}`}
            >
              Aman &gt;15 ({products.filter(p => p.stock > 15).length})
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
      {isAddingProduct && (
        <form onSubmit={handleSubmitNewProduct} className="p-4 sm:p-5 bg-zinc-50 border-b border-zinc-200 space-y-3 animate-in fade-in">
          <h4 className="text-xs font-black uppercase text-zinc-900 flex items-center gap-2">
            <Sparkles size={14} className="text-[#E60012]" />
            <span>Formulir Tambah SKU Produk Baru (Multi-Atribut)</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="sm:col-span-2">
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Nama Pakaian</label>
              <input
                type="text"
                required
                placeholder="Contoh: Kaos Katun Supima Crew Neck"
                value={newProductName}
                onChange={(e) => setNewProductName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Kategori</label>
              <select
                value={newProductCategory}
                onChange={(e) => setNewProductCategory(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 bg-white"
              >
                <option value={1}>Kemeja & Flannel</option>
                <option value={2}>Kaos & AIRism</option>
                <option value={3}>Jaket & Outer</option>
                <option value={4}>Celana & Chino</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Target Gender</label>
              <select
                value={newProductGender}
                onChange={(e) => setNewProductGender(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 bg-white"
              >
                <option value="unisex">Unisex</option>
                <option value="pria">Pria</option>
                <option value="wanita">Wanita</option>
                <option value="anak">Anak</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Harga (Rp)</label>
              <input
                type="number"
                required
                value={newProductPrice}
                onChange={(e) => setNewProductPrice(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Stok Awal</label>
              <input
                type="number"
                required
                value={newProductStock}
                onChange={(e) => setNewProductStock(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 bg-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">URL Foto Produk</label>
              <input
                type="text"
                required
                value={newProductImage}
                onChange={(e) => setNewProductImage(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 bg-white font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Detail Teknologi Kain / Bahan</label>
              <input
                type="text"
                required
                value={newProductFabric}
                onChange={(e) => setNewProductFabric(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
            <button
              type="button"
              onClick={() => setIsAddingProduct(false)}
              className="px-3 py-1.5 text-xs font-bold uppercase border border-zinc-300 text-zinc-700 bg-white cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-zinc-950 text-white text-xs font-bold uppercase hover:bg-[#E60012] transition-colors cursor-pointer"
            >
              Simpan SKU ke Database
            </button>
          </div>
        </form>
      )}

      {/* Live Inventory Table */}
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
            {filteredProducts.map((p) => {
              const isCrit = p.stock <= 5;
              const isLow = p.stock > 5 && p.stock <= 15;
              const isSafe = p.stock > 15;

              return (
                <tr key={p.id} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img src={p.image_url} alt={p.name} className="w-10 h-12 object-cover bg-zinc-100 border border-zinc-200 shrink-0" />
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
                      {/* Hapus Produk: Hanya Owner */}
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

    </div>
  );
};
