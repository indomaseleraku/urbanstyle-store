// components/admin/modals/ExactStockModal.tsx
// Dialog Input Stok Eksak (FR-24)

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Product } from '@/lib/types';

interface ExactStockModalProps {
  data: { product: Product; newStock: number } | null;
  onClose: () => void;
  onSave: (productId: number, stockQty: number) => Promise<void>;
}

export const ExactStockModal: React.FC<ExactStockModalProps> = ({
  data,
  onClose,
  onSave,
}) => {
  if (!data) return null;

  const [stockVal, setStockVal] = useState<number>(data.newStock);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(data.product.id, stockVal);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white border border-zinc-300 max-w-sm w-full p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
          <h3 className="text-xs font-black uppercase text-zinc-950">
            Setel Stok Fisik Eksak (FR-24)
          </h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-black cursor-pointer">
            <X size={16} />
          </button>
        </div>

        <p className="text-xs text-zinc-600">
          Produk: <span className="font-bold text-black">{data.product.name}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
              Kuantitas Stok Riil (Unit)
            </label>
            <input
              type="number"
              min="0"
              required
              value={stockVal}
              onChange={(e) => setStockVal(Number(e.target.value))}
              className="w-full px-3 py-2 text-base font-black font-mono border border-zinc-300 text-center"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 text-xs font-bold uppercase border border-zinc-300 text-zinc-700 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-bold uppercase bg-black text-white hover:bg-[#E60012] cursor-pointer"
            >
              Terapkan Stok
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
