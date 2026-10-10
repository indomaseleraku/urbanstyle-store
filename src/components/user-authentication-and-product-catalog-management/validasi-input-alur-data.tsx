'use strict';
'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, ArrowRight, Shield, Database, Lock, RefreshCw } from 'lucide-react';
import { productCatalogSchema } from '@/src/lib/validations/user-authentication-and-product-catalog-management.schema';

export const ValidasiInputAlurData: React.FC = () => {
  const [testPayload, setTestPayload] = useState({
    title: 'Kemeja Flannel Kotak Lengan Panjang',
    sku: 'UQ-FLANNEL-09',
    category: 'pria',
    price: 399000,
    material: '100% Katun Pilihan',
    fit: 'Regular Fit',
    careInstructions: 'Cuci dengan mesin air dingin, siklus lembut',
    colors: ['18 WINE', '69 NAVY'],
    sizes: ['S', 'M', 'L', 'XL'],
    initialStock: 45,
    userRole: 'admin',
    isActive: true,
  });

  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    errors?: Record<string, string>;
  } | null>(null);

  const runValidation = () => {
    const result = productCatalogSchema.safeParse(testPayload);
    if (result.success) {
      setValidationResult({ success: true });
    } else {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        fieldErrors[err.path.join('.')] = err.message;
      });
      setValidationResult({ success: false, errors: fieldErrors });
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200 gap-2">
        <div>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black text-white">
            Data Stream & Zod Validator
          </span>
          <h3 className="text-base font-bold text-gray-900 mt-1 uppercase font-mono">
            Validasi Input & Alur Data Skema Katalog
          </h3>
        </div>
        <button
          onClick={runValidation}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-black text-white hover:bg-gray-800 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Uji Validasi Realtime
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Parameters Live Editor */}
        <div className="space-y-3 font-mono text-xs">
          <label className="block text-gray-500 uppercase tracking-wider font-semibold">
            Payload Simulasi (JSON Draft)
          </label>
          <div className="p-3 bg-gray-50 border border-gray-200 space-y-2">
            <div>
              <span className="text-gray-500">Nama Produk: </span>
              <input
                type="text"
                value={testPayload.title}
                onChange={(e) => setTestPayload({ ...testPayload, title: e.target.value })}
                className="w-full bg-white border border-gray-300 px-2 py-1 text-xs font-sans mt-0.5"
              />
            </div>
            <div>
              <span className="text-gray-500">SKU Uniqlo: </span>
              <input
                type="text"
                value={testPayload.sku}
                onChange={(e) => setTestPayload({ ...testPayload, sku: e.target.value })}
                className="w-full bg-white border border-gray-300 px-2 py-1 text-xs font-mono uppercase mt-0.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-500">Harga (Rp): </span>
                <input
                  type="number"
                  value={testPayload.price}
                  onChange={(e) =>
                    setTestPayload({ ...testPayload, price: Number(e.target.value) })
                  }
                  className="w-full bg-white border border-gray-300 px-2 py-1 text-xs font-mono mt-0.5"
                />
              </div>
              <div>
                <span className="text-gray-500">Stok Awal: </span>
                <input
                  type="number"
                  value={testPayload.initialStock}
                  onChange={(e) =>
                    setTestPayload({ ...testPayload, initialStock: Number(e.target.value) })
                  }
                  className="w-full bg-white border border-gray-300 px-2 py-1 text-xs font-mono mt-0.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Validation Output */}
        <div className="space-y-3">
          <label className="block text-gray-500 uppercase tracking-wider font-semibold font-mono text-xs">
            Hasil Verifikasi Skema Zod
          </label>
          {validationResult ? (
            validationResult.success ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs uppercase font-mono">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> Skema 100% Valid
                </div>
                <p className="text-xs text-green-800">
                  Data payload memenuhi seluruh konstrain tipe katalog LifeWear, SKU regex, dan
                  aturan batas minimum harga.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 text-red-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs uppercase font-mono">
                  <XCircle className="w-4 h-4 text-[#E60012]" /> Terdapat Pelanggaran Validasi
                </div>
                <ul className="text-xs space-y-1 list-disc pl-5 font-mono">
                  {Object.entries(validationResult.errors || {}).map(([f, msg]) => (
                    <li key={f}>
                      <span className="font-semibold text-gray-900">{f}:</span> {msg}
                    </li>
                  ))}
                </ul>
              </div>
            )
          ) : (
            <div className="p-4 bg-gray-50 border border-dashed border-gray-300 text-gray-500 text-xs">
              Klik &quot;Uji Validasi Realtime&quot; untuk mengevaluasi data terhadap Zod schema
              katalog v5.
            </div>
          )}

          {/* RBAC Permission Matrix Preview */}
          <div className="pt-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-2 font-mono flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-black" /> Matriks Izin RBAC:
            </div>
            <div className="grid grid-cols-4 gap-1 text-[10px] font-mono text-center">
              <div className="p-1.5 bg-black text-white font-bold">Admin: Full</div>
              <div className="p-1.5 bg-gray-100 text-gray-800 border">Gudang: Stock</div>
              <div className="p-1.5 bg-gray-100 text-gray-800 border">Kasir: Read/POS</div>
              <div className="p-1.5 bg-gray-100 text-gray-500 border">User: Read</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ValidasiInputAlurData;
