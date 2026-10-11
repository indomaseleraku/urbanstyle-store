'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface InventoryAddProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProduct: (productPayload: any) => Promise<void>;
}

export const InventoryAddProductForm: React.FC<InventoryAddProductFormProps> = ({
  isOpen,
  onClose,
  onCreateProduct,
}) => {
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState(1);
  const [newProductPrice, setNewProductPrice] = useState(199000);
  const [newProductStock, setNewProductStock] = useState(15);
  const [newProductGender, setNewProductGender] = useState<'unisex' | 'pria' | 'wanita'>('unisex');
  const [newProductImage, setNewProductImage] = useState(
    'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80'
  );
  const [newProductFabric, setNewProductFabric] = useState('100% Katun Combed 280 GSM');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
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
    onClose();
    setNewProductName('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-5 bg-zinc-50 border-b border-zinc-200 space-y-3 animate-in fade-in">
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
          onClick={onClose}
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
  );
};
