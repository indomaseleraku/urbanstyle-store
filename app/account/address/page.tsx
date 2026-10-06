'use client';

// app/account/address/page.tsx
// Halaman Buku Alamat Pengiriman Pengguna (Pre-fill Checkout)

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/store';
import { UserAddress } from '@/lib/types';
import { MapPin, Plus, Trash2, CheckCircle, Home, Building2, Check } from 'lucide-react';

export default function AddressBookPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  // Form State
  const [label, setLabel] = useState('Rumah');
  const [recipientName, setRecipientName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [addressLine, setAddressLine] = useState('');
  const [city, setCity] = useState('Tangerang Selatan');
  const [postalCode, setPostalCode] = useState('15417');
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    async function loadAddresses() {
      if (user) {
        const list = await dataStore.getUserAddresses(user.id);
        setAddresses(list);
      }
    }
    loadAddresses();
  }, [user]);

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    await dataStore.addUserAddress({
      user_id: user.id,
      label,
      recipient_name: recipientName,
      phone,
      address_line: addressLine,
      city,
      postal_code: postalCode,
      is_default: isDefault,
    });

    const updated = await dataStore.getUserAddresses(user.id);
    setAddresses(updated);
    setIsAdding(false);
    // Reset Form
    setAddressLine('');
    setIsDefault(false);
  };

  const handleDelete = async (id: string) => {
    if (!user) return;
    await dataStore.deleteUserAddress(id);
    const updated = await dataStore.getUserAddresses(user.id);
    setAddresses(updated);
  };

  const handleSetDefault = async (id: string) => {
    if (!user) return;
    await dataStore.setDefaultAddress(user.id, id);
    const updated = await dataStore.getUserAddresses(user.id);
    setAddresses(updated);
  };

  return (
    <div className="bg-white border border-zinc-200 p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black uppercase tracking-tight text-zinc-950">
            Buku Alamat Pengiriman
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Simpan alamat tujuan pengiriman untuk otomatis mengisi formulir saat checkout pesanan.
          </p>
        </div>

        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            <Plus size={14} />
            <span>Tambah Alamat</span>
          </button>
        )}
      </div>

      {/* Form Tambah Alamat */}
      {isAdding && (
        <form onSubmit={handleAddAddress} className="p-5 border border-zinc-300 bg-zinc-50 space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-950">
              Formulir Alamat Baru
            </h2>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-zinc-500 hover:text-black font-semibold"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Label Alamat
              </label>
              <select
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-300 bg-white text-xs focus:outline-none focus:border-black font-medium"
              >
                <option value="Rumah">Rumah</option>
                <option value="Kantor">Kantor</option>
                <option value="Kampus / Kos">Kampus / Kos</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Nama Penerima
              </label>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="Nama Lengkap"
                className="w-full px-3 py-2 border border-zinc-300 bg-white text-xs focus:outline-none focus:border-black font-medium"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Nomor Telepon
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="08xxxxxxxxxx"
                className="w-full px-3 py-2 border border-zinc-300 bg-white text-xs focus:outline-none focus:border-black font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Kota / Kabupaten
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Kota"
                className="w-full px-3 py-2 border border-zinc-300 bg-white text-xs focus:outline-none focus:border-black font-medium"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
              Alamat Lengkap & Patokan
            </label>
            <textarea
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder="Nama Jalan, Nomor Rumah, RT/RW, Kelurahan, Kecamatan"
              rows={2}
              className="w-full px-3 py-2 border border-zinc-300 bg-white text-xs focus:outline-none focus:border-black font-medium"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Kode Pos
              </label>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                placeholder="15417"
                className="w-full px-3 py-2 border border-zinc-300 bg-white text-xs focus:outline-none focus:border-black font-medium"
              />
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-zinc-700">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="rounded-none border-zinc-300 text-black focus:ring-0"
                />
                <span>Jadikan Alamat Pengiriman Utama</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-black hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Simpan Alamat Ini
          </button>
        </form>
      )}

      {/* Daftar Alamat Tersimpan */}
      <div className="space-y-4">
        {addresses.length === 0 ? (
          <div className="p-8 text-center border border-dashed border-zinc-300 text-zinc-500 text-xs">
            Belum ada alamat pengiriman tersimpan. Tambahkan alamat pertama Anda untuk mempercepat checkout.
          </div>
        ) : (
          addresses.map((addr) => (
            <div
              key={addr.id}
              className={`p-5 border transition-all ${
                addr.is_default
                  ? 'border-black bg-zinc-50/50'
                  : 'border-zinc-200 bg-white hover:border-zinc-400'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="text-xs font-black uppercase tracking-wider text-zinc-950">
                      {addr.label}
                    </span>
                    {addr.is_default && (
                      <span className="text-[9px] font-bold uppercase tracking-wider bg-black text-white px-1.5 py-0.5">
                        ALAMAT UTAMA
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-bold text-zinc-800">{addr.recipient_name} ({addr.phone})</p>
                  <p className="text-xs text-zinc-600 mt-1 font-medium">{addr.address_line}</p>
                  <p className="text-xs text-zinc-500">{addr.city}, {addr.postal_code}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {!addr.is_default && (
                    <button
                      onClick={() => handleSetDefault(addr.id)}
                      className="text-[11px] font-bold uppercase tracking-wider text-zinc-600 hover:text-black border border-zinc-300 px-2 py-1"
                    >
                      Pilih Utama
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(addr.id)}
                    className="p-1 text-zinc-400 hover:text-red-600 transition-colors"
                    title="Hapus alamat"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
