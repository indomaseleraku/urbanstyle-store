'use strict';
'use client';

import React, { useState } from 'react';
import { Lock, Save, Check, RefreshCw } from 'lucide-react';
import { inventoryLockSchema, InventoryLockInput } from '@/src/lib/validations/inventory-tracking-with-time-bound-locking.schema';

export const InventoryTrackingWithTimeBoundLockingForm: React.FC<{
  onSuccess?: (data: InventoryLockInput) => void;
  onCancel?: () => void;
}> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Partial<InventoryLockInput>>({
    sku: 'UQ-OXFORD-SHIRT-02',
    variantId: 'var-oxford-white-l',
    quantity: 1,
    sessionId: `sess_manual_${Math.floor(100000 + Math.random() * 900000)}`,
    lockDurationMinutes: 10,
    reason: 'cart_reservation',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const res = inventoryLockSchema.safeParse(formData);
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((err) => {
        errs[err.path.join('.')] = err.message;
      });
      setErrors(errs);
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      onSuccess?.(res.data);
      setTimeout(() => setSuccess(false), 2500);
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-base font-bold text-gray-950 uppercase font-mono">
          Formulir Reservasi Kunci Stok Sementara
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Menguji reservasi stok time-bound dengan perlindungan batas waktu 1-30 menit.
        </p>
      </div>

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" /> Kunci inventaris berhasil didaftarkan dengan TTL 10 menit!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Kode SKU Produk *
          </label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono"
          />
          {errors.sku && <p className="text-[11px] text-[#E60012] font-mono">{errors.sku}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            ID Varian Item *
          </label>
          <input
            type="text"
            value={formData.variantId}
            onChange={(e) => setFormData({ ...formData, variantId: e.target.value })}
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono"
          />
          {errors.variantId && (
            <p className="text-[11px] text-[#E60012] font-mono">{errors.variantId}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Jumlah Unit yang Dikunci *
          </label>
          <input
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono"
          />
          {errors.quantity && (
            <p className="text-[11px] text-[#E60012] font-mono">{errors.quantity}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Durasi Kunci (Menit) *
          </label>
          <input
            type="number"
            value={formData.lockDurationMinutes}
            onChange={(e) =>
              setFormData({ ...formData, lockDurationMinutes: Number(e.target.value) })
            }
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono"
          />
          {errors.lockDurationMinutes && (
            <p className="text-[11px] text-[#E60012] font-mono">{errors.lockDurationMinutes}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 uppercase tracking-wider font-mono"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-medium uppercase tracking-wider font-mono transition-colors disabled:opacity-50"
        >
          <Lock className="w-4 h-4" />
          {isSubmitting ? 'Memproses...' : 'Aktifkan Kunci Stok'}
        </button>
      </div>
    </form>
  );
};
export default InventoryTrackingWithTimeBoundLockingForm;
