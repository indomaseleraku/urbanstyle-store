// components/account/AddAddressForm.tsx
'use client';

import React, { useState } from 'react';
import { Home, Building2, MapPin } from 'lucide-react';

interface AddAddressFormProps {
  onClose: () => void;
  onSubmit: (data: {
    label: string;
    recipientName: string;
    phone: string;
    addressLine: string;
    city: string;
    postalCode: string;
    isDefault: boolean;
  }) => Promise<void>;
  defaultName?: string;
  defaultPhone?: string;
}

export default function AddAddressForm({
  onClose,
  onSubmit,
  defaultName = '',
  defaultPhone = '',
}: AddAddressFormProps) {
  const [label, setLabel] = useState('Rumah');
  const [recipientName, setRecipientName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Tangerang Selatan');
  const [postalCode, setPostalCode] = useState('15417');
  const [isDefault, setIsDefault] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      label,
      recipientName,
      phone,
      addressLine,
      city,
      postalCode,
      isDefault,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 border border-zinc-300 bg-zinc-50 space-y-4 rounded-none font-sans">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950">
          Formulir Alamat Baru
        </h2>
        <button type="button" onClick={onClose} className="text-xs text-zinc-500 hover:text-black">
          ✕ Batal
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div>
          <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">Label Alamat</label>
          <div className="flex gap-1.5">
            {['Rumah', 'Kantor', 'Toko'].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLabel(l)}
                className={`flex-1 py-1.5 text-xs font-bold uppercase border rounded-none ${
                  label === l ? 'bg-zinc-950 text-white border-zinc-950' : 'bg-white text-zinc-700 border-zinc-300'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">Nama Penerima</label>
          <input required type="text" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} className="w-full p-2 border border-zinc-300 bg-white text-xs rounded-none" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">Nomor Telepon</label>
          <input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full p-2 border border-zinc-300 bg-white text-xs rounded-none font-mono" />
        </div>
      </div>

      <div>
        <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">Alamat Lengkap</label>
        <textarea required rows={2} value={addressLine} onChange={(e) => setAddressLine(e.target.value)} className="w-full p-2 border border-zinc-300 bg-white text-xs rounded-none" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">Kota / Kabupaten</label>
          <input required type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full p-2 border border-zinc-300 bg-white text-xs rounded-none" />
        </div>
        <div>
          <label className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">Kode Pos</label>
          <input required type="text" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className="w-full p-2 border border-zinc-300 bg-white text-xs rounded-none font-mono" />
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 cursor-pointer">
          <input type="checkbox" checked={isDefault} onChange={(e) => setIsDefault(e.target.checked)} className="rounded-none text-[#E60012]" />
          <span>Jadikan Alamat Utama</span>
        </label>
        <div className="flex gap-2">
          <button type="button" onClick={onClose} className="px-3 py-1.5 border border-zinc-300 text-xs font-bold uppercase rounded-none">Batal</button>
          <button type="submit" className="px-4 py-1.5 bg-[#E60012] text-white text-xs font-bold uppercase rounded-none">Simpan</button>
        </div>
      </div>
    </form>
  );
}
