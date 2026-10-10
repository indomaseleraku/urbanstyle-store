'use strict';
'use client';

import React, { useState } from 'react';
import { Radio, Save, Check, Wifi } from 'lucide-react';
import { realtimeSubscriptionSchema, RealtimeSubscriptionInput } from '@/src/lib/validations/supabase-realtime-for-inventory-updates.schema';

export const SupabaseRealtimeForInventoryUpdatesForm: React.FC<{
  onSuccess?: (data: RealtimeSubscriptionInput) => void;
  onCancel?: () => void;
}> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Partial<RealtimeSubscriptionInput>>({
    channelName: 'realtime:inventory-updates',
    event: '*',
    schema: 'public',
    table: 'product_variants',
    heartbeatIntervalMs: 30000,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const res = realtimeSubscriptionSchema.safeParse(formData);
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
          Formulir Konfigurasi Kanal Realtime Supabase
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Atur parameter kanal WebSocket untuk menerima mutasi tabel inventaris.
        </p>
      </div>

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" /> Kanal berhasil divalidasi dan tersambung ke WebSocket!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Nama Kanal (Channel) *
          </label>
          <input
            type="text"
            value={formData.channelName}
            onChange={(e) => setFormData({ ...formData, channelName: e.target.value })}
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono"
          />
          {errors.channelName && (
            <p className="text-[11px] text-[#E60012] font-mono">{errors.channelName}</p>
          )}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Tabel Target Database *
          </label>
          <select
            value={formData.table}
            onChange={(e) =>
              setFormData({
                ...formData,
                table: e.target.value as RealtimeSubscriptionInput['table'],
              })
            }
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono"
          >
            <option value="product_variants">product_variants</option>
            <option value="products">products</option>
            <option value="inventory_locks">inventory_locks</option>
            <option value="orders">orders</option>
          </select>
          {errors.table && <p className="text-[11px] text-[#E60012] font-mono">{errors.table}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Tipe Event Postgres *
          </label>
          <select
            value={formData.event}
            onChange={(e) =>
              setFormData({
                ...formData,
                event: e.target.value as RealtimeSubscriptionInput['event'],
              })
            }
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono"
          >
            <option value="*">* (Semua Mutasi)</option>
            <option value="INSERT">INSERT</option>
            <option value="UPDATE">UPDATE</option>
            <option value="DELETE">DELETE</option>
          </select>
          {errors.event && <p className="text-[11px] text-[#E60012] font-mono">{errors.event}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Interval Heartbeat (ms) *
          </label>
          <input
            type="number"
            value={formData.heartbeatIntervalMs}
            onChange={(e) =>
              setFormData({ ...formData, heartbeatIntervalMs: Number(e.target.value) })
            }
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono"
          />
          {errors.heartbeatIntervalMs && (
            <p className="text-[11px] text-[#E60012] font-mono">{errors.heartbeatIntervalMs}</p>
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
          <Wifi className="w-4 h-4 text-green-400" />
          {isSubmitting ? 'Memproses...' : 'Daftarkan Kanal Realtime'}
        </button>
      </div>
    </form>
  );
};
export default SupabaseRealtimeForInventoryUpdatesForm;
