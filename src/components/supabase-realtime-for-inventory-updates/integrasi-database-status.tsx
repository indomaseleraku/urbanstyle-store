'use strict';
'use client';

import React from 'react';
import { Database, Wifi, Activity, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const IntegrasiDatabaseStatus: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200 gap-2">
        <div>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black text-white">
            Supabase Realtime Telemetry
          </span>
          <h3 className="text-base font-bold text-gray-900 mt-1 uppercase font-mono">
            Status Publikasi Replikasi Database
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="font-mono text-xs text-green-700 font-bold uppercase">
            Publication: supabase_realtime (ACTIVE)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-2">
            <span>Tabel Terpublikasi</span>
            <Database className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-950">3 Tabel</div>
          <div className="flex items-center gap-1.5 text-[10px] text-green-700 font-semibold mt-1">
            <CheckCircle2 className="w-3 h-3" /> product_variants, locks, orders
          </div>
        </div>

        <div className="p-4 border border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-2">
            <span>WebSocket Ping Latency</span>
            <Activity className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-950">16 ms</div>
          <div className="flex items-center gap-1.5 text-[10px] text-green-700 font-semibold mt-1">
            <Wifi className="w-3 h-3" /> wss://...supabase.co/realtime/v1
          </div>
        </div>

        <div className="p-4 border border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-2">
            <span>Client Sesi Terkoneksi</span>
            <Zap className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-950">28 Sesi</div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-mono mt-1">
            Presence Tracking Aktif
          </div>
        </div>
      </div>

      <div className="border border-gray-200 bg-black text-gray-300 p-4 font-mono text-xs space-y-1">
        <div className="text-gray-500 pb-1 border-b border-gray-800 text-[10px] uppercase font-bold tracking-wider">
          Telemetry Frame Replikasi Realtime (WAL Level: Logical)
        </div>
        <div className="text-green-400">
          [2026-10-10 23:55:01] [WAL_STREAM] LSN 0/1A982C0 commit payload: table product_variants
        </div>
        <div className="text-gray-300">
          [2026-10-10 23:55:02] [BROADCAST] Message dispatched to 28 subscribers on channel &quot;realtime:inventory&quot;
        </div>
        <div className="text-cyan-400">
          [2026-10-10 23:55:05] [HEARTBEAT] Ping ACK from wss gateway: 16ms RTT
        </div>
      </div>
    </div>
  );
};
export default IntegrasiDatabaseStatus;
