// components/admin/tabs/inventory/AddProductForm.tsx
'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface AddProductFormProps {
  onClose: () => void;
  onSubmit: (payload: any) => Promise<void>;
}

export default function AddProductForm({ onClose, onSubmit }: AddProductFormProps) {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [price, setPrice] = useState(199000);
  const [stock, setStock] = useState(15);
  const [gender, setGender] = useState<'unisex' | 'pria' | 'wanita'>('unisex');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?auto=format&fit=crop&w=1000&q=80');
  const [fabric, setFabric] = useState('100% Katun Combed 280 GSM');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      category_id: categoryId,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      gender,
      price: Number(price),
      stock: Number(stock),
      description: `Busana LifeWear ${name} esensial dengan potongan minimalis dan kenyamanan maksimal.`,
      fabric_details: fabric,
      care_instructions: 'Cuci dengan mesin siklus lembut. Jangan gunakan pemutih.',
      colors: [{ name: 'Black', code: '09 BLACK', hex: '#111111', image_url: image }],
      sizes: ['S', 'M', 'L', 'XL'],
      image_url: image,
      gallery_images: [image],
      is_new: true,
      is_featured: true,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-zinc-50 border border-zinc-200 space-y-3 text-xs rounded-none">
      <div className="flex justify-between items-center border-b border-zinc-200 pb-2">
        <h4 className="font-bold uppercase text-zinc-900">Form Tambah Produk Baru</h4>
        <button type="button" onClick={onClose} className="text-zinc-500 hover:text-black">✕ Batal</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] font-bold text-zinc-500 block">Nama Produk</label>
          <input required type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Contoh: Kaos Boxy Oversize" className="w-full p-2 border border-zinc-300 rounded-none bg-white" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 block">Kategori</label>
          <select value={categoryId} onChange={(e) => setCategoryId(Number(e.target.value))} className="w-full p-2 border border-zinc-300 rounded-none bg-white">
            <option value={1}>Kemeja</option>
            <option value={2}>Kaos</option>
            <option value={3}>Celana</option>
            <option value={4}>Jaket</option>
          </select>
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 block">Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value as any)} className="w-full p-2 border border-zinc-300 rounded-none bg-white">
            <option value="unisex">Unisex</option>
            <option value="pria">Pria</option>
            <option value="wanita">Wanita</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold text-zinc-500 block">Harga (Rp)</label>
          <input required type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full p-2 border border-zinc-300 rounded-none bg-white font-mono" />
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 block">Stok Awal</label>
          <input required type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="w-full p-2 border border-zinc-300 rounded-none bg-white font-mono" />
        </div>
      </div>
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" onClick={onClose} className="px-4 py-2 border border-zinc-300 rounded-none">Batal</button>
        <button type="submit" className="px-4 py-2 bg-[#E60012] text-white font-bold uppercase rounded-none">Simpan Produk</button>
      </div>
    </form>
  );
}
