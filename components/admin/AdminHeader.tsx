// components/admin/AdminHeader.tsx
// Top Bar Header untuk Konsol Manajemen Staf SIM UrbanStyle Store

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { UserProfile } from '@/lib/types';
import { isSupabaseConfigured } from '@/lib/store';

interface AdminHeaderProps {
  user: UserProfile | null;
  isOwner: boolean;
  isGudang: boolean;
  isKasir: boolean;
  onRefresh: () => void;
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  user,
  isOwner,
  isGudang,
  isKasir,
  onRefresh,
  onLogout,
}) => {
  return (
    <header className="bg-[#111111] text-white border-b border-zinc-800 sticky top-0 z-30 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-[#E60012] text-white font-black text-xs px-2 py-0.5">
              SIM
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm sm:text-base font-black tracking-tight uppercase leading-none">
                  Dashboard Manajemen UrbanStyle
                </h1>
                {isOwner && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-[#E60012]/30 text-red-400 border border-[#E60012]/60 uppercase">
                    OWNER (SUPER ADMIN)
                  </span>
                )}
                {isGudang && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/50 uppercase">
                    STAF GUDANG (LOGISTIK)
                  </span>
                )}
                {isKasir && (
                  <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 uppercase">
                    STAF KASIR (FINANCE)
                  </span>
                )}
              </div>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                KURO-COMMERCE V5.2 • Petugas: {user?.full_name || 'Staf Internal'} ({user?.email})
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className={`hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono border ${
            isSupabaseConfigured 
              ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800' 
              : 'bg-amber-950/60 text-amber-400 border-amber-800'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isSupabaseConfigured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span>{isSupabaseConfigured ? 'Supabase PostgreSQL Cloud' : 'Local Fallback Mode'}</span>
          </span>

          <button
            onClick={onRefresh}
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw size={15} />
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 bg-[#E60012] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-xs"
            title="Keluar dari konsol staf administrator"
          >
            Keluar Konsol
          </button>
        </div>

      </div>
    </header>
  );
};
