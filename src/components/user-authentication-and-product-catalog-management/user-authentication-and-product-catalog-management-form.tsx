'use strict';
'use client';

import React, { useState } from 'react';
import { Save, AlertCircle, Check } from 'lucide-react';
import { productCatalogSchema, ProductCatalogInput } from '@/src/lib/validations/user-authentication-and-product-catalog-management.schema';

export const UserAuthenticationAndProductCatalogManagementForm: React.FC<{
  onSuccess?: (data: ProductCatalogInput) => void;
  onCancel?: () => void;
}> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Partial<ProductCatalogInput>>({
    title: '',
    sku: '',
    category: 'pria',
    price: 299000,
    material: '100% Katun Pima',
    fit: 'Regular Fit',
    careInstructions: 'Cuci dengan mesin air dingin, jemur teduh',
    colors: ['00 WHITE', '09 BLACK'],
    sizes: ['S', 'M', 'L', 'XL'],
    initialStock: 50,
    userRole: 'admin',
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const result = productCatalogSchema.safeParse(formData);
    if (!result.success) {
      const errMap: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        errMap[err.path.join('.')] = err.message;
      });
      setErrors(errMap);
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(true);
      onSuccess?.(result.data);
      setTimeout(() => setSuccessMessage(false), 3000);
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-base font-bold text-gray-950 uppercase font-mono">
          Formulir Registrasi SKU & Katalog LifeWear
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Pastikan kode warna mengikuti format standar Uniqlo (contoh: 09 BLACK, 00 WHITE, 69 NAVY).
        </p>
      </div>

      {successMessage && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" /> Produk berhasil divalidasi dan disimpan ke katalog master!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Title */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Nama Produk *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Contoh: Kemeja Flannel Kotak Lengan Panjang"
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-sans"
          />
          {errors.title && <p className="text-[11px] text-[#E60012] font-mono">{errors.title}</p>}
        </div>

        {/* SKU */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Kode SKU Uniqlo *
          </label>
          <input
            type="text"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value.toUpperCase() })}
            placeholder="Contoh: UQ-FLANNEL-09"
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono uppercase"
          />
          {errors.sku && <p className="text-[11px] text-[#E60012] font-mono">{errors.sku}</p>}
        </div>

        {/* Category */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Kategori *
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value as ProductCatalogInput['category'] })
            }
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black uppercase font-medium"
          >
            <option value="pria">Pria</option>
            <option value="wanita">Wanita</option>
            <option value="anak">Anak</option>
            <option value="bayi">Bayi</option>
          </select>
          {errors.category && <p className="text-[11px] text-[#E60012] font-mono">{errors.category}</p>}
        </div>

        {/* Price */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Harga Retail (IDR) *
          </label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono"
          />
          {errors.price && <p className="text-[11px] text-[#E60012] font-mono">{errors.price}</p>}
        </div>

        {/* Material */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Material Tekstil *
          </label>
          <input
            type="text"
            value={formData.material}
            onChange={(e) => setFormData({ ...formData, material: e.target.value })}
            placeholder="Contoh: 100% Katun Supima"
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black"
          />
          {errors.material && <p className="text-[11px] text-[#E60012] font-mono">{errors.material}</p>}
        </div>

        {/* Initial Stock */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Stok Awal Alokasi *
          </label>
          <input
            type="number"
            value={formData.initialStock}
            onChange={(e) => setFormData({ ...formData, initialStock: Number(e.target.value) })}
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono"
          />
          {errors.initialStock && (
            <p className="text-[11px] text-[#E60012] font-mono">{errors.initialStock}</p>
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
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Memproses...' : 'Simpan Produk'}
        </button>
      </div>
    </form>
  );
};
export default UserAuthenticationAndProductCatalogManagementForm;
