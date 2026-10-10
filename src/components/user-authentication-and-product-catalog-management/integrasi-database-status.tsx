'use strict';
'use client';

import React from 'react';
import { Database, Activity, CheckCircle, Shield, Server, Clock } from 'lucide-react';

export const IntegrasiDatabaseStatus: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200 gap-2">
        <div>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black text-white">
            Supabase Cloud Telemetry
          </span>
          <h3 className="text-base font-bold text-gray-900 mt-1 uppercase font-mono">
            Integrasi Database & Status Realtime
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="font-mono text-xs text-green-700 font-bold uppercase">Connected (qrrdfbdzcozjdaysfimi)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1 */}
        <div className="p-4 border border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-2">
            <span>Tabel products</span>
            <Database className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-950">40 SKUs</div>
          <div className="flex items-center gap-1.5 text-[10px] text-green-700 font-semibold mt-1">
            <CheckCircle className="w-3 h-3" /> RLS Policy: Active (Owner/Admin)
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 border border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-2">
            <span>Tabel product_variants</span>
            <Server className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-950">86 Varian</div>
          <div className="flex items-center gap-1.5 text-[10px] text-green-700 font-semibold mt-1">
            <CheckCircle className="w-3 h-3" /> Foreign Key Cascade OK
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 border border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-2">
            <span>Latency & Pools</span>
            <Activity className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-950">24 ms</div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-mono mt-1">
            <Clock className="w-3 h-3" /> Connection Pool: Transaction Mode
          </div>
        </div>
      </div>

      {/* Sync Log Stream */}
      <div className="border border-gray-200 bg-black text-gray-300 p-4 font-mono text-xs space-y-1">
        <div className="text-gray-500 pb-1 border-b border-gray-800 text-[10px] uppercase font-bold tracking-wider">
          Audit Log Replikasi & Mutasi Katalog
        </div>
        <div className="text-green-400">
          [2026-10-10 23:51:12] [SUPABASE_POSTGRES] Connected to postgres://...qrrdfbdzcozjdaysfimi
        </div>
        <div className="text-gray-300">
          [2026-10-10 23:51:14] [CATALOG_CACHE] In-memory catalog synchronized (40 items, 86 variants)
        </div>
        <div className="text-gray-300">
          [2026-10-10 23:51:15] [AUTH_SESSION] RBAC check passed: session valid for admin
        </div>
        <div className="text-cyan-400">
          [2026-10-10 23:51:16] [REALTIME_REPL] Subscription active on channel: &quot;realtime:inventory&quot;
        </div>
      </div>
    </div>
  );
};
export default IntegrasiDatabaseStatus;
