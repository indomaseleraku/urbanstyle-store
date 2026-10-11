// components/admin/AdminQuickDemoRoles.tsx
'use client';

import React from 'react';
import { ShieldCheck, Package, CreditCard, UserCheck } from 'lucide-react';
import { StaffRole } from '@/lib/types';

interface AdminQuickDemoRolesProps {
  onSelectRole: (role: StaffRole) => void;
}

export default function AdminQuickDemoRoles({ onSelectRole }: AdminQuickDemoRolesProps) {
  return (
    <div className="pt-4 border-t border-zinc-800 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
          <UserCheck size={12} className="text-[#E60012]" />
          <span>Akses Cepat Penguji (1-Klik):</span>
        </span>
        <span className="text-[9px] font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5">
          UAS & Sidang Ready
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onSelectRole('owner')}
          className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 hover:border-[#E60012] transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-zinc-300 group-hover:text-white mb-1">
            <ShieldCheck size={13} className="text-[#E60012]" />
            <span className="font-bold text-[10px] uppercase font-mono">Owner</span>
          </div>
          <p className="text-[9px] text-zinc-500 line-clamp-2 leading-tight">
            Hak mutlak omzet, DSS Pareto, staf & kupon.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onSelectRole('gudang')}
          className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 hover:border-amber-500 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-zinc-300 group-hover:text-white mb-1">
            <Package size={13} className="text-amber-500" />
            <span className="font-bold text-[10px] uppercase font-mono">Gudang</span>
          </div>
          <p className="text-[9px] text-zinc-500 line-clamp-2 leading-tight">
            Kontrol inventaris, restok & resi kurir.
          </p>
        </button>

        <button
          type="button"
          onClick={() => onSelectRole('kasir')}
          className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 hover:border-cyan-500 transition-all text-left group cursor-pointer"
        >
          <div className="flex items-center gap-1.5 text-zinc-300 group-hover:text-white mb-1">
            <CreditCard size={13} className="text-cyan-400" />
            <span className="font-bold text-[10px] uppercase font-mono">Kasir</span>
          </div>
          <p className="text-[9px] text-zinc-500 line-clamp-2 leading-tight">
            Verifikasi slip bayar & status pesanan.
          </p>
        </button>
      </div>
    </div>
  );
}
