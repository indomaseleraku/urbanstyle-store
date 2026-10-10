// components/account/AddressCard.tsx
'use client';

import React from 'react';
import { UserAddress } from '@/lib/types';
import { MapPin, Trash2, CheckCircle, Home, Building2 } from 'lucide-react';

interface AddressCardProps {
  address: UserAddress;
  onSetDefault: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function AddressCard({
  address: addr,
  onSetDefault,
  onDelete,
}: AddressCardProps) {
  return (
    <div
      className={`p-4 border rounded-none transition-all flex flex-col justify-between ${
        addr.is_default
          ? 'border-zinc-950 bg-zinc-50/50 ring-1 ring-zinc-950'
          : 'border-zinc-200 bg-white hover:border-zinc-300'
      }`}
    >
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-bold uppercase text-xs text-zinc-900">
            {addr.label === 'Rumah' ? <Home size={14} className="text-[#E60012]" /> : <Building2 size={14} className="text-[#E60012]" />}
            <span>{addr.label}</span>
          </div>
          {addr.is_default && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#E60012] text-white text-[9px] font-bold uppercase tracking-wider rounded-none">
              <CheckCircle size={10} /> Utama
            </span>
          )}
        </div>
        <div>
          <p className="font-bold text-sm text-zinc-900">{addr.recipient_name}</p>
          <p className="text-xs text-zinc-500 font-mono">{addr.phone}</p>
        </div>
        <p className="text-xs text-zinc-600 leading-relaxed pt-1">
          {addr.address_line}, {addr.city} {addr.postal_code}
        </p>
      </div>

      <div className="pt-4 border-t border-zinc-200 flex items-center justify-between text-xs mt-3">
        {!addr.is_default ? (
          <button
            type="button"
            onClick={() => onSetDefault(addr.id)}
            className="text-zinc-600 hover:text-[#E60012] font-bold uppercase text-[11px] cursor-pointer"
          >
            Jadikan Utama
          </button>
        ) : <span className="text-[11px] text-zinc-400 font-bold uppercase">Alamat Default</span>}
        <button
          type="button"
          onClick={() => onDelete(addr.id)}
          className="text-zinc-400 hover:text-red-600 p-1 cursor-pointer transition-colors"
          title="Hapus Alamat"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
