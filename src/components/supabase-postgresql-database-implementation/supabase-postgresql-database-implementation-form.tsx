'use strict';
'use client';

import React, { useState } from 'react';
import { Terminal, Play, Check, ShieldAlert } from 'lucide-react';
import { sqlQueryExecutionSchema, SqlQueryExecutionInput } from '@/src/lib/validations/supabase-postgresql-database-implementation.schema';

export const SupabasePostgresqlDatabaseImplementationForm: React.FC<{
  onSuccess?: (data: SqlQueryExecutionInput) => void;
  onCancel?: () => void;
}> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Partial<SqlQueryExecutionInput>>({
    query: 'SELECT id, title, price, category FROM products LIMIT 5;',
    environment: 'development',
    readOnly: true,
    timeoutMs: 5000,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const res = sqlQueryExecutionSchema.safeParse(formData);
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
          SQL Console & Query Execution Tool
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Jalankan kueri PostgreSQL secara aman dengan proteksi Read-Only dan timeout limiter.
        </p>
      </div>

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" /> Kueri SQL divalidasi dan berhasil dieksekusi!
        </div>
      )}

      <div className="space-y-4 font-mono text-xs">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase">
            PostgreSQL Query Statement *
          </label>
          <textarea
            rows={5}
            value={formData.query}
            onChange={(e) => setFormData({ ...formData, query: e.target.value })}
            className="w-full p-3 border border-gray-300 focus:outline-none focus:border-black font-mono text-xs bg-gray-50"
          />
          {errors.query && <p className="text-[11px] text-[#E60012] font-mono">{errors.query}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase">
              Target Environment
            </label>
            <select
              value={formData.environment}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  environment: e.target.value as SqlQueryExecutionInput['environment'],
                })
              }
              className="w-full p-2.5 border border-gray-300 focus:outline-none focus:border-black"
            >
              <option value="development">Development (Staging Sandbox)</option>
              <option value="staging">Staging Pre-release</option>
              <option value="production">Production (Restricted)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold text-gray-700 uppercase">
              Execution Timeout (ms)
            </label>
            <input
              type="number"
              value={formData.timeoutMs}
              onChange={(e) => setFormData({ ...formData, timeoutMs: Number(e.target.value) })}
              className="w-full p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 pt-1">
          <input
            type="checkbox"
            id="readonly-checkbox"
            checked={formData.readOnly}
            onChange={(e) => setFormData({ ...formData, readOnly: e.target.checked })}
            className="rounded-none border-gray-300 text-black focus:ring-0"
          />
          <label htmlFor="readonly-checkbox" className="text-gray-700 font-semibold cursor-pointer">
            Paksa mode Read-Only (Mencegah DROP/DELETE/TRUNCATE/ALTER)
          </label>
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
          <Play className="w-4 h-4 text-green-400 fill-current" />
          {isSubmitting ? 'Mengeksekusi...' : 'Jalankan Query'}
        </button>
      </div>
    </form>
  );
};
export default SupabasePostgresqlDatabaseImplementationForm;
