// app/account/address/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/store';
import { UserAddress } from '@/lib/types';
import { MapPin, Plus } from 'lucide-react';
import AddAddressForm from '@/components/account/AddAddressForm';
import AddressCard from '@/components/account/AddressCard';

export default function AddressBookPage() {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    async function loadAddresses() {
      if (user) {
        const list = await dataStore.getUserAddresses(user.id);
        setAddresses(list);
      }
    }
    loadAddresses();
  }, [user]);

  const handleAddAddress = async (data: {
    label: string; recipientName: string; phone: string;
    addressLine: string; city: string; postalCode: string; isDefault: boolean;
  }) => {
    if (!user) return;
    await dataStore.addUserAddress({
      user_id: user.id,
      label: data.label,
      recipient_name: data.recipientName,
      phone: data.phone,
      address_line: data.addressLine,
      city: data.city,
      postal_code: data.postalCode,
      is_default: data.isDefault,
    });
    const updated = await dataStore.getUserAddresses(user.id);
    setAddresses(updated);
    setIsAdding(false);
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
    <div className="bg-white border border-zinc-200 p-6 sm:p-8 space-y-6 rounded-none font-sans">
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
            className="flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none cursor-pointer"
          >
            <Plus size={14} /> <span>Tambah Alamat</span>
          </button>
        )}
      </div>

      {isAdding && (
        <AddAddressForm
          onClose={() => setIsAdding(false)}
          onSubmit={handleAddAddress}
          defaultName={user?.full_name || ''}
          defaultPhone={user?.phone || ''}
        />
      )}

      {addresses.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-zinc-300 p-6 space-y-3 rounded-none">
          <MapPin size={32} className="mx-auto text-zinc-300" />
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-700">Belum Ada Alamat Tersimpan</p>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">Tambahkan alamat pengiriman rumah atau kantor Anda untuk mempermudah proses checkout.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <AddressCard
              key={addr.id}
              address={addr}
              onSetDefault={handleSetDefault}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
