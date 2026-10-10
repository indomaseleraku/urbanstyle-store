// components/checkout/ShippingForm.tsx
'use client';

import React from 'react';
import { MapPin } from 'lucide-react';
import { UserAddress } from '@/lib/types';

interface ShippingFormProps {
  name: string;
  onChangeName: (val: string) => void;
  phone: string;
  onChangePhone: (val: string) => void;
  address: string;
  onChangeAddress: (val: string) => void;
  savedAddresses: UserAddress[];
  onSelectSavedAddress: (addr: UserAddress) => void;
}

export default function ShippingForm({
  name,
  onChangeName,
  phone,
  onChangePhone,
  address,
  onChangeAddress,
  savedAddresses,
  onSelectSavedAddress,
}: ShippingFormProps) {
  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-black uppercase tracking-wider text-[#111111] flex items-center gap-1.5">
          <MapPin size={14} className="text-[#E60012]" />
          <span>Informasi Pengiriman</span>
        </h4>
        {savedAddresses.length > 0 && (
          <span className="text-[10px] text-[#757575] font-mono">
            {savedAddresses.length} Alamat Tersimpan
          </span>
        )}
      </div>

      {savedAddresses.length > 0 && (
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">
            Pilih dari Buku Alamat:
          </label>
          <select
            onChange={(e) => {
              const selected = savedAddresses.find((a) => a.id === e.target.value);
              if (selected) onSelectSavedAddress(selected);
            }}
            className="w-full p-2 text-xs border border-zinc-300 bg-zinc-50 rounded-none focus:outline-none focus:border-zinc-950 font-medium cursor-pointer"
          >
            <option value="">-- Gunakan Alamat Tersimpan --</option>
            {savedAddresses.map((addr) => (
              <option key={addr.id} value={addr.id}>
                {addr.label} ({addr.recipient_name}) - {addr.city}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">
            Nama Penerima *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            placeholder="Nama lengkap"
            className="w-full p-2.5 text-xs border border-zinc-300 rounded-none focus:outline-none focus:border-zinc-950"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">
            Nomor Telepon / WhatsApp *
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => onChangePhone(e.target.value)}
            placeholder="0812xxxxxxxx"
            className="w-full p-2.5 text-xs border border-zinc-300 rounded-none focus:outline-none focus:border-zinc-950 font-mono"
          />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">
          Alamat Lengkap (Jalan, RT/RW, Kelurahan, Kecamatan, Kota, Kode Pos) *
        </label>
        <textarea
          required
          rows={2}
          value={address}
          onChange={(e) => onChangeAddress(e.target.value)}
          placeholder="Jl. Thamrin No. 1, Jakarta Pusat 10310"
          className="w-full p-2.5 text-xs border border-zinc-300 rounded-none focus:outline-none focus:border-zinc-950"
        />
      </div>
    </div>
  );
}
