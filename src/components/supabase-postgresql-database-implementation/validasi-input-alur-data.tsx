'use strict';
'use client';

import React, { useState } from 'react';
import { CheckCircle2, XCircle, RefreshCw, Terminal, AlertTriangle } from 'lucide-react';
import { sqlQueryExecutionSchema } from '@/src/lib/validations/supabase-postgresql-database-implementation.schema';

export const ValidasiInputAlurData: React.FC = () => {
  const [queryPayload, setQueryPayload] = useState({
    query: 'SELECT id, title, price, in_stock FROM products WHERE category = \'pria\' LIMIT 10;',
    environment: 'development',
    readOnly: true,
    timeoutMs: 5000,
  });

  const [validationResult, setValidationResult] = useState<{
    success: boolean;
    errors?: Record<string, string>;
  } | null>(null);

  const testValidate = () => {
    const res = sqlQueryExecutionSchema.safeParse(queryPayload);
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
            SQL Query Safety Guard
          </span>
          <h3 className="text-base font-bold text-gray-900 mt-1 uppercase font-mono">
            Validasi Alur Eksekusi Query & Proteksi DDL Zod
          </h3>
        </div>
        <button
          onClick={testValidate}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-black text-white hover:bg-gray-800 transition-colors font-mono"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Uji Validasi Query
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-3 font-mono text-xs">
          <label className="block text-gray-500 uppercase tracking-wider font-semibold">
            Input Query SQL
          </label>
          <div className="p-3 bg-gray-50 border border-gray-200 space-y-2">
            <div>
              <span className="text-gray-500">Query SQL: </span>
              <textarea
                rows={4}
                value={queryPayload.query}
                onChange={(e) => setQueryPayload({ ...queryPayload, query: e.target.value })}
                className="w-full bg-white border border-gray-300 p-2 text-xs font-mono mt-0.5"
              />
            </div>
            <div className="flex items-center gap-4 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={queryPayload.readOnly}
                  onChange={(e) => setQueryPayload({ ...queryPayload, readOnly: e.target.checked })}
                  className="rounded-none border-gray-300 text-black focus:ring-0"
                />
                <span className="text-gray-700 font-semibold">Mode Read-Only Proteksi</span>
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <label className="block text-gray-500 uppercase tracking-wider font-semibold font-mono text-xs">
            Evaluasi Keamanan Eksekusi
          </label>
          {validationResult ? (
            validationResult.success ? (
              <div className="p-4 bg-green-50 border border-green-200 text-green-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs uppercase font-mono">
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> Query Aman Dieksekusi
                </div>
                <p className="text-xs text-green-800">
                  Query lolos dari pemeriksaan perintah berbahaya (DROP, TRUNCATE, ALTER) dan siap
                  dijalankan dengan batas timeout aman 5000ms.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-red-50 border border-red-200 text-red-900 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs uppercase font-mono">
                  <XCircle className="w-4 h-4 text-[#E60012]" /> Pelanggaran Keamanan Terdeteksi
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
              Klik &quot;Uji Validasi Query&quot; untuk mengevaluasi kepatuhan skema SQL safety guard.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default ValidasiInputAlurData;
