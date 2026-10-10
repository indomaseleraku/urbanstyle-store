'use strict';
'use client';

import React from 'react';
import { Database, Server, ShieldCheck, Activity, CheckCircle2, Clock } from 'lucide-react';

export const IntegrasiDatabaseStatus: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-gray-200 gap-2">
        <div>
          <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black text-white">
            PostgreSQL Infrastructure Telemetry
          </span>
          <h3 className="text-base font-bold text-gray-900 mt-1 uppercase font-mono">
            Integrasi Database Supabase & Status Connection Pool
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="font-mono text-xs text-green-700 font-bold uppercase">
            Instance: qrrdfbdzcozjdaysfimi (Active)
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 border border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-2">
            <span>PgBouncer Pool Mode</span>
            <Server className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-950">TRANSACTION</div>
          <div className="flex items-center gap-1.5 text-[10px] text-green-700 font-semibold mt-1">
            <CheckCircle2 className="w-3 h-3" /> Max Connections: 15 / 100
          </div>
        </div>

        <div className="p-4 border border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-2">
            <span>Enkripsi Transport (TLS)</span>
            <ShieldCheck className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-green-700">TLSv1.3 (ECDHE)</div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-mono mt-1">
            End-to-End SSL Enforced
          </div>
        </div>

        <div className="p-4 border border-gray-200 bg-gray-50/50">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-2">
            <span>Eksekusi Query P95</span>
            <Activity className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-950">12 ms</div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-600 font-mono mt-1">
            <Clock className="w-3 h-3" /> Cache Hit Rate: 99.4%
          </div>
        </div>
      </div>

      <div className="border border-gray-200 bg-black text-gray-300 p-4 font-mono text-xs space-y-1">
        <div className="text-gray-500 pb-1 border-b border-gray-800 text-[10px] uppercase font-bold tracking-wider">
          Telemetry Sesi PostgreSQL (pg_stat_activity)
        </div>
        <div className="text-green-400">
          [2026-10-10 23:58:00] [PG_CONNECT] Client connected from Next.js serverless runtime
        </div>
        <div className="text-gray-300">
          [2026-10-10 23:58:01] [TRANSACTION] BEGIN; SELECT count(*) FROM products; COMMIT; (0.8ms)
        </div>
        <div className="text-cyan-400">
          [2026-10-10 23:58:04] [RLS_EVAL] Row-Level Security checks evaluated for public user
        </div>
      </div>
    </div>
  );
};
export default IntegrasiDatabaseStatus;
