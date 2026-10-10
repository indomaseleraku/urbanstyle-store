// components/admin/modals/EditProductModal.tsx
// Modal Edit Data SKU Produk (Full CRUD Modal)

import React, { useState } from 'react';
import { Edit2, X } from 'lucide-react';
import { Product } from '@/lib/types';

interface EditProductModalProps {
  product: Product | null;
  onClose: () => void;
  onSave: (updatedProduct: Product) => Promise<void>;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
  product,
  onClose,
  onSave,
}) => {
  if (!product) return null;

  const [formData, setFormData] = useState<Product>({ ...product });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white border border-zinc-300 max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
          <h3 className="text-sm font-black uppercase text-zinc-950 flex items-center gap-2">
            <Edit2 size={15} className="text-[#E60012]" />
            <span>Edit Data SKU Produk</span>
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-black cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Nama Produk</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-1.5 border border-zinc-300"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Harga (Rp)</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border border-zinc-300 font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Stok Fisik</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border border-zinc-300 font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Target Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              className="w-full px-3 py-1.5 border border-zinc-300"
            >
              <option value="unisex">Unisex</option>
              <option value="pria">Pria</option>
              <option value="wanita">Wanita</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">URL Foto Produk</label>
            <input
              type="text"
              required
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              className="w-full px-3 py-1.5 border border-zinc-300 font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Teknologi Bahan / Kain</label>
            <input
              type="text"
              required
              value={formData.fabric_details}
              onChange={(e) => setFormData({ ...formData, fabric_details: e.target.value })}
              className="w-full px-3 py-1.5 border border-zinc-300"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 font-bold uppercase border border-zinc-300 text-zinc-700 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-[#E60012] hover:bg-red-700 text-white font-bold uppercase cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
