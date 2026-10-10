// src/components/responsive-mobile-first-layout-refinement/integrasi-database-status.tsx
'use client';

import React from 'react';
import { Database, ShieldCheck, Smartphone, Check } from 'lucide-react';

interface IntegrasiMobileDatabaseStatusProps {
  isPersisted: boolean;
  cachedLayoutVersion: string;
  pwaReady?: boolean;
}

export default function IntegrasiDatabaseStatus({
  isPersisted = true,
  cachedLayoutVersion = 'v5.1-mobile',
  pwaReady = true,
}: IntegrasiMobileDatabaseStatusProps) {
  return (
    <div className="p-4 bg-zinc-900 text-white rounded-none space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Smartphone size={15} className="text-[#E60012]" />
          <h4 className="text-xs font-black uppercase tracking-wider text-white">
            Status Persistensi Layout Mobile (Supabase Settings Cache)
          </h4>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span className="text-[10px] font-mono uppercase font-bold text-zinc-300">
            SYNCED
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
        <div>
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Versi Desain Token</span>
          <span className="text-sm font-black font-mono text-white">{cachedLayoutVersion}</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">Status Persistensi Sesi</span>
          <span className="text-sm font-black font-mono text-emerald-400">
            {isPersisted ? 'TERSALIN DI SUPABASE' : 'LOKAL MEMORY'}
          </span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-400 uppercase font-mono block">PWA Standalone Cache</span>
          <span className="text-sm font-black font-mono text-white flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald-400" />
            <span>{pwaReady ? 'SIAP OFFLINE' : 'STANDARD'}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
