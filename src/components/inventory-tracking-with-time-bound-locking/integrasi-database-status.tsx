'use strict';
'use client';

import React from 'react';
import { Database, Clock, RefreshCw, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';

export const IntegrasiDatabaseStatus: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200 gap-2">
        <div>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black text-white">
            PostgreSQL pg_cron & Locks Engine
          </span>
          <h3 className="text-base font-bold text-gray-900 mt-1 uppercase font-mono">
            Integrasi Database & Status Scheduler Pembebasan Stok
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="font-mono text-xs text-green-700 font-bold uppercase">pg_cron: Running (1m interval)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-2">
            <span>Tabel inventory_locks</span>
            <Database className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-950">3 Baris Aktif</div>
          <div className="flex items-center gap-1.5 text-[10px] text-green-700 font-semibold mt-1">
            <CheckCircle2 className="w-3 h-3" /> Row-Level Lock: FOR UPDATE NOWAIT
          </div>
        </div>

        <div className="p-4 border border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-2">
            <span>Pembersih Otomatis (Cron)</span>
            <Clock className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-950">Tiap 60 Detik</div>
          <div className="flex items-center gap-1.5 text-[10px] text-green-700 font-semibold mt-1">
            <Zap className="w-3 h-3" /> Eksekusi Terakhir: 18 detik lalu
          </div>
        </div>

        <div className="p-4 border border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-2">
            <span>Safety Isolation</span>
            <ShieldCheck className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-950">SERIALIZABLE</div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-mono mt-1">
            Zero-Ghost Read & Anti-Double Lock
          </div>
        </div>
      </div>

      <div className="border border-gray-200 bg-black text-gray-300 p-4 font-mono text-xs space-y-1">
        <div className="text-gray-500 pb-1 border-b border-gray-800 text-[10px] uppercase font-bold tracking-wider">
          Telemetry Mutasi Kunci Stok & Pembebasan Otomatis
        </div>
        <div className="text-green-400">
          [2026-10-10 23:53:01] [CRON_SWEEP] SELECT release_expired_inventory_locks(); -&gt; 0 expired
        </div>
        <div className="text-gray-300">
          [2026-10-10 23:53:15] [LOCK_ACQUIRE] SKU: UQ-AIRISM-TEE-01 (var-902) locked 2 pcs for 10m
        </div>
        <div className="text-amber-400">
          [2026-10-10 23:53:40] [STOCK_RESERVE] Available stock temporarily decremented: 142 -&gt; 140
        </div>
      </div>
    </div>
  );
};
export default IntegrasiDatabaseStatus;
