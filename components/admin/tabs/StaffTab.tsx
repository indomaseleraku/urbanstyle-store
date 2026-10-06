// components/admin/tabs/StaffTab.tsx
// Manajemen Karyawan Toko & Otorisasi Peran Bertingkat (RBAC - Owner Only)

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { StaffUser, StaffRole } from '@/lib/types';

interface StaffTabProps {
  staffList: StaffUser[];
  onToggleStatus: (staffId: string) => Promise<void>;
  onCreateStaff: (staffPayload: any) => Promise<void>;
}

export const StaffTab: React.FC<StaffTabProps> = ({
  staffList,
  onToggleStatus,
  onCreateStaff,
}) => {
  const [isAddingStaff, setIsAddingStaff] = useState(false);
  const [newStaffName, setNewStaffName] = useState('');
  const [newStaffEmail, setNewStaffEmail] = useState('');
  const [newStaffPhone, setNewStaffPhone] = useState('0812');
  const [newStaffRole, setNewStaffRole] = useState<StaffRole>('gudang');

  const handleSubmitNewStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateStaff({
      full_name: newStaffName,
      email: newStaffEmail,
      phone: newStaffPhone,
      role: newStaffRole,
      is_active: true,
    });
    setIsAddingStaff(false);
    setNewStaffName('');
    setNewStaffEmail('');
  };

  return (
    <div className="bg-white border border-zinc-200 shadow-2xs space-y-4 animate-in fade-in duration-200">
      <div className="p-4 sm:p-5 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold uppercase tracking-tight text-zinc-950 flex items-center gap-2">
            <span>Manajemen Karyawan Toko & Otorisasi Peran (RBAC)</span>
            <span className="text-[10px] bg-red-100 text-[#E60012] px-2 py-0.5 font-mono font-bold">FR-23</span>
          </h3>
          <p className="text-xs text-zinc-500">
            Daftarkan karyawan baru bertingkat (Owner, Staf Gudang Logistik, Staf Kasir Finance) dan kontrol status akses
          </p>
        </div>

        <button
          onClick={() => setIsAddingStaff(!isAddingStaff)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E60012] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <Plus size={14} />
          <span>+ Tambah Staf Baru</span>
        </button>
      </div>

      {/* Form Tambah Staf Baru */}
      {isAddingStaff && (
        <form onSubmit={handleSubmitNewStaff} className="p-4 sm:p-5 bg-zinc-50 border-b border-zinc-200 space-y-3 animate-in fade-in">
          <h4 className="text-xs font-black uppercase text-zinc-900">Formulir Pendaftaran Karyawan Baru</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                placeholder="Contoh: Rian Pratama"
                value={newStaffName}
                onChange={(e) => setNewStaffName(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 bg-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Email Staf</label>
              <input
                type="email"
                required
                placeholder="rian@urbanstyle.com"
                value={newStaffEmail}
                onChange={(e) => setNewStaffEmail(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Nomor WhatsApp</label>
              <input
                type="text"
                required
                value={newStaffPhone}
                onChange={(e) => setNewStaffPhone(e.target.value)}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 bg-white font-mono"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Penugasan Peran (Role)</label>
              <select
                value={newStaffRole}
                onChange={(e) => setNewStaffRole(e.target.value as StaffRole)}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 bg-white font-bold"
              >
                <option value="gudang">Staf Gudang (Logistik & Restok)</option>
                <option value="kasir">Staf Kasir (Transaksi & Keuangan)</option>
                <option value="owner">Owner (Super Admin Akses Penuh)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
            <button
              type="button"
              onClick={() => setIsAddingStaff(false)}
              className="px-3 py-1.5 text-xs font-bold uppercase border border-zinc-300 text-zinc-700 bg-white cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-black text-white text-xs font-bold uppercase hover:bg-[#E60012] cursor-pointer"
            >
              Simpan Data Staf
            </button>
          </div>
        </form>
      )}

      {/* Tabel Staf */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 border-y border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Nama Staf & Identitas</th>
              <th className="py-3 px-4">Email Login</th>
              <th className="py-3 px-4">Kontak WhatsApp</th>
              <th className="py-3 px-4">Peran (Role)</th>
              <th className="py-3 px-4">Wewenang Modul</th>
              <th className="py-3 px-4 text-center">Status Akses</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {staffList.map((st) => (
              <tr key={st.id} className="hover:bg-zinc-50/80 transition-colors">
                <td className="py-3 px-4">
                  <p className="font-bold text-zinc-950 uppercase">{st.full_name}</p>
                  <p className="text-[10px] text-zinc-400 font-mono">ID: {st.id}</p>
                </td>
                <td className="py-3 px-4 font-mono font-semibold text-zinc-800">
                  {st.email}
                </td>
                <td className="py-3 px-4 font-mono text-zinc-700">
                  {st.phone}
                </td>
                <td className="py-3 px-4">
                  {st.role === 'owner' && (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#E60012]/10 text-[#E60012] border border-[#E60012]/30 uppercase">
                      Owner (Super Admin)
                    </span>
                  )}
                  {st.role === 'gudang' && (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-amber-100 text-amber-800 border border-amber-300 uppercase">
                      Staf Gudang
                    </span>
                  )}
                  {st.role === 'kasir' && (
                    <span className="px-2 py-0.5 text-[10px] font-mono font-bold bg-cyan-100 text-cyan-800 border border-cyan-300 uppercase">
                      Staf Kasir
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-[11px] text-zinc-600">
                  {st.role === 'owner' && 'Akses Penuh Seluruh Modul SIM & Keuangan'}
                  {st.role === 'gudang' && 'Katalog, Restok, Cetak Label & Input Resi'}
                  {st.role === 'kasir' && 'Transaksi, Verifikasi Slip & Kelola Kupon'}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onToggleStatus(st.id)}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                      st.is_active 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
                        : 'bg-zinc-100 text-zinc-600 border-zinc-300 hover:bg-zinc-200'
                    }`}
                  >
                    {st.is_active ? '✓ Aktif' : '✕ Dinonaktifkan'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
