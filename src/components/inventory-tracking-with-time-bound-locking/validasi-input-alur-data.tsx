'use strict';
'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Lock, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { inventoryLockSchema, inventoryAdjustmentSchema } from '@/src/lib/validations/inventory-tracking-with-time-bound-locking.schema';

export const ValidasiInputAlurData: React.FC = () => {
  const [lockPayload, setLockPayload] = useState({
    sku: 'UQ-AIRISM-TEE-01',
    variantId: 'var-902',
    quantity: 2,
    sessionId: 'sess_live_198273',
    lockDurationMinutes: 10,
    reason: 'checkout_in_progress',
  });

  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    errors?: Record<string, string>;
  } | null>(null);

  const testValidate = () => {
    const res = inventoryLockSchema.safeParse(lockPayload);
    if (res.success) {
      setValidationResult({ success: true });
    } else {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((e) => {
        errs[e.path.join('.')] = e.message;
      });
      setValidationResult({ success: false, errors: errs });
    }
  };

  return (
    <div className="bg-white border border-gray-200 p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200 gap-2">
        <div>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black text-white">
            Lock Validator Engine
          </span>
          <h3 className="text-base font-bold text-gray-900 mt-1 uppercase font-mono">
            Validasi Alur Kunci Stok & TTL Zod
          </h3>
        </div>
        <button
          onClick={testValidate}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-black text-white hover:bg-gray-800 transition-colors font-mono"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Uji Validasi Parameter
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3 font-mono text-xs">
          <label className="block text-gray-500 uppercase tracking-wider font-semibold">
            Parameter Reservasi Stok
          </label>
          <div className="p-3 bg-gray-50 border border-gray-200 space-y-2">
            <div>
              <span className="text-gray-500">SKU: </span>
              <input
                type="text"
                value={lockPayload.sku}
                onChange={(e) => setLockPayload({ ...lockPayload, sku: e.target.value })}
                className="w-full bg-white border border-gray-300 px-2 py-1 text-xs font-mono uppercase mt-0.5"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-gray-500">Kuantitas Kunci: </span>
                <input
                  type="number"
                  value={lockPayload.quantity}
                  onChange={(e) =>
                    setLockPayload({ ...lockPayload, quantity: Number(e.target.value) })
                  }
                  className="w-full bg-white border border-gray-300 px-2 py-1 text-xs font-mono mt-0.5"
                />
              </div>
              <div>
                <span className="text-gray-500">Durasi (Menit): </span>
                <input
                  type="number"
                  value={lockPayload.lockDurationMinutes}
                  onChange={(e) =>
                    setLockPayload({ ...lockPayload, lockDurationMinutes: Number(e.target.value) })
                  }
                  className="w-full bg-white border border-gray-300 px-2 py-1 text-xs font-mono mt-0.5"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-gray-500 uppercase tracking-wider font-semibold font-mono text-xs">
            Evaluasi Integritas Kunci Stok
          </label>
          {validationResult ? (
            validationResult.success ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs uppercase font-mono">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> Parameter Reservasi Sah
                </div>
                <p className="text-xs text-green-800">
                  Kuantitas berada di bawah ambang batas anti-hoarding (&le;10 unit) dan durasi TTL
                  kunci berada dalam rentang aman 1-30 menit.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 text-red-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs uppercase font-mono">
                  <XCircle className="w-4 h-4 text-[#E60012]" /> Parameter Tidak Memenuhi Konstrain
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
              Klik &quot;Uji Validasi Parameter&quot; untuk menguji Zod schema alur time-bound lock.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ValidasiInputAlurData;
