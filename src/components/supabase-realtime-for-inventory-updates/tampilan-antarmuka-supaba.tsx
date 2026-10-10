'use strict';
'use client';

import React, { useState } from 'react';
import { Wifi, Radio, Zap, Activity, RefreshCw, Send, CheckCircle2 } from 'lucide-react';

interface RealtimeEventLog {
  id: string;
  table: string;
  eventType: 'UPDATE' | 'INSERT' | 'DELETE';
  record: { sku: string; variant: string; oldStock?: number; newStock?: number };
  timestamp: string;
}

const INITIAL_EVENTS: RealtimeEventLog[] = [
  {
    id: 'evt-101',
    table: 'product_variants',
    eventType: 'UPDATE',
    record: { sku: 'UQ-AIRISM-TEE-01', variant: 'WHITE-L', oldStock: 142, newStock: 140 },
    timestamp: '23:54:12',
  },
  {
    id: 'evt-102',
    table: 'inventory_locks',
    eventType: 'INSERT',
    record: { sku: 'UQ-PLEATED-PANTS-03', variant: 'BEIGE-M', newStock: 1 },
    timestamp: '23:54:30',
  },
  {
    id: 'evt-103',
    table: 'product_variants',
    eventType: 'UPDATE',
    record: { sku: 'UQ-HEATTECH-EXT-04', variant: 'BLACK-XL', oldStock: 12, newStock: 11 },
    timestamp: '23:54:55',
  },
];

export const TampilanAntarmukaSupaba: React.FC<{
  onInspectEvent?: (evt: RealtimeEventLog) => void;
  onSimulateBroadcast?: () => void;
}> = ({ onInspectEvent, onSimulateBroadcast }) => {
  const [events, setEvents] = useState<RealtimeEventLog[]>(INITIAL_EVENTS);
  const [connectionStatus, setConnectionStatus] = useState<'SUBSCRIBED' | 'CONNECTING' | 'CLOSED'>('SUBSCRIBED');

  return (
    <div className="space-y-6">
      {/* Realtime Stream Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 border border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#E60012] text-white">
              Supabase Realtime Engine
            </span>
            <span className="flex items-center gap-1.5 text-xs text-green-700 font-mono font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Channel:
              realtime:inventory-updates
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-950 uppercase font-mono">
            Pembaruan Stok Realtime & Replikasi WebSocket
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Mengalirkan delta inventaris seketika ke seluruh tab browser pembeli tanpa perlu reload halaman.
          </p>
        </div>
        <button
          onClick={onSimulateBroadcast}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-medium text-xs uppercase tracking-wider font-mono transition-colors"
        >
          <Radio className="w-4 h-4 text-[#E60012]" /> Broadcast Event Uji
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-1">
            <span>Status Koneksi WebSocket</span>
            <Wifi className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-green-700">SUBSCRIBED</div>
          <p className="text-[10px] text-gray-500 font-mono mt-1">Heartbeat ACK: 30 detik interval</p>
        </div>

        <div className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-1">
            <span>Latency Sinkronisasi</span>
            <Activity className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">18 ms</div>
          <p className="text-[10px] text-gray-500 font-mono mt-1">Direct Phoenix channel framing</p>
        </div>

        <div className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-1">
            <span>Event Replikasi Diterima</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">{events.length} Mutasi</div>
          <p className="text-[10px] text-green-700 font-mono mt-1 font-semibold">0 drop frame / zero desync</p>
        </div>
      </div>

      {/* Stream Event Table */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-gray-900">
            Log Replikasi Postgres Changes (postgres_changes: public)
          </h3>
          <span className="text-[10px] text-gray-500 font-mono">Realtime Live Stream</span>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 font-mono text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">Waktu</th>
              <th className="py-3 px-4 font-semibold">Tabel Target</th>
              <th className="py-3 px-4 font-semibold">Tipe Event</th>
              <th className="py-3 px-4 font-semibold">Payload Mutasi</th>
              <th className="py-3 px-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-sans">
            {events.map((evt) => (
              <tr key={evt.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono text-gray-500">{evt.timestamp}</td>
                <td className="py-3.5 px-4 font-mono font-medium text-gray-900">{evt.table}</td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold font-mono uppercase tracking-wider border ${
                      evt.eventType === 'UPDATE'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : evt.eventType === 'INSERT'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    }`}
                  >
                    {evt.eventType}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs">
                  <span className="font-semibold text-gray-900">{evt.record.sku}</span> (
                  {evt.record.variant})
                  {evt.record.oldStock !== undefined && (
                    <span className="ml-2 text-gray-500">
                      Stok: {evt.record.oldStock} &rarr;{' '}
                      <span className="font-bold text-[#E60012]">{evt.record.newStock}</span>
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onInspectEvent?.(evt)}
                    className="px-2.5 py-1 text-xs font-mono font-medium text-gray-700 hover:text-black border border-gray-300 hover:border-black transition-colors"
                  >
                    Inspeksi Frame
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TampilanAntarmukaSupaba;
