'use strict';
'use client';

import React, { useState } from 'react';
import { ShieldCheck, User, Key, Lock, CheckCircle2, AlertCircle, Plus, LogOut } from 'lucide-react';

interface AuthSessionUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'owner' | 'gudang' | 'kasir' | 'customer';
  lastSignIn: string;
  authProvider: 'email' | 'google' | 'magic_link';
  mfaEnabled: boolean;
}

const INITIAL_USERS: AuthSessionUser[] = [
  {
    id: 'usr_admin_01',
    email: 'admin@urbanstyle.store',
    name: 'Kimy Eka (Store Owner)',
    role: 'super_admin',
    lastSignIn: '2026-10-10 23:55:00',
    authProvider: 'email',
    mfaEnabled: true,
  },
  {
    id: 'usr_wh_02',
    email: 'gudang.pamulang@urbanstyle.store',
    name: 'Budi Santoso',
    role: 'gudang',
    lastSignIn: '2026-10-10 21:12:44',
    authProvider: 'email',
    mfaEnabled: false,
  },
  {
    id: 'usr_cash_03',
    email: 'kasir.citra@urbanstyle.store',
    name: 'Siti Rahmawati',
    role: 'kasir',
    lastSignIn: '2026-10-10 22:40:19',
    authProvider: 'email',
    mfaEnabled: false,
  },
  {
    id: 'usr_cust_04',
    email: 'pelanggan.setia@gmail.com',
    name: 'Ahmad Faisal',
    role: 'customer',
    lastSignIn: '2026-10-10 23:10:02',
    authProvider: 'google',
    mfaEnabled: false,
  },
];

export const TampilanAntarmukaSupaba: React.FC<{
  onInspectUser?: (user: AuthSessionUser) => void;
  onOpenNewAuth?: () => void;
}> = ({ onInspectUser, onOpenNewAuth }) => {
  const [users, setUsers] = useState<AuthSessionUser[]>(INITIAL_USERS);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 border border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black text-white">
              Supabase Auth & GoTrue Engine
            </span>
            <span className="flex items-center gap-1 text-xs text-green-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> JWT RS256 Validated
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-950 uppercase font-mono">
            Integrasi Supabase Auth & Sesi Pengguna
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Manajemen otentikasi identitas, sign-in token, sesi aktif JWT, dan sinkronisasi profil RBAC.
          </p>
        </div>
        <button
          onClick={onOpenNewAuth}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E60012] hover:bg-[#CC0010] text-white font-medium text-xs uppercase tracking-wider font-mono transition-colors"
        >
          <Plus className="w-4 h-4" /> Registrasi Akun Baru
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-1">
            <span>Pengguna Terverifikasi</span>
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">{users.length} Akun</div>
          <p className="text-[10px] text-green-700 font-mono mt-1 font-semibold">100% email verified</p>
        </div>

        <div className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-1">
            <span>Sesi JWT Aktif</span>
            <Key className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">4 Sesi</div>
          <p className="text-[10px] text-gray-500 font-mono mt-1">Refresh token expiry: 30 hari</p>
        </div>

        <div className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-1">
            <span>Proteksi Sandi & Hash</span>
            <Lock className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-green-700">BCRYPT 10x</div>
          <p className="text-[10px] text-gray-500 font-mono mt-1">Standar keamanan enkripsi cloud</p>
        </div>
      </div>

      {/* User Session Table */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-gray-900">
            Daftar Identitas & Peran RBAC (Tabel auth.users & public.profiles)
          </h3>
          <span className="text-[10px] text-gray-500 font-mono">Row Level Security Active</span>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 font-mono text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">Nama & Email</th>
              <th className="py-3 px-4 font-semibold">Peran (Role)</th>
              <th className="py-3 px-4 font-semibold">Auth Provider</th>
              <th className="py-3 px-4 font-semibold">MFA Status</th>
              <th className="py-3 px-4 font-semibold">Sign-in Terakhir</th>
              <th className="py-3 px-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-sans">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-gray-900">{u.name}</div>
                  <div className="font-mono text-[11px] text-gray-500">{u.email}</div>
                </td>
                <td className="py-3.5 px-4">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-[10px] font-bold font-mono uppercase tracking-wider border ${
                      u.role === 'super_admin'
                        ? 'bg-black text-white border-black'
                        : u.role === 'gudang'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : u.role === 'kasir'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono uppercase text-gray-700">{u.authProvider}</td>
                <td className="py-3.5 px-4">
                  {u.mfaEnabled ? (
                    <span className="text-green-700 font-mono font-semibold flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Aktif
                    </span>
                  ) : (
                    <span className="text-gray-400 font-mono text-[11px]">Non-aktif</span>
                  )}
                </td>
                <td className="py-3.5 px-4 font-mono text-gray-600 text-[11px]">{u.lastSignIn}</td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onInspectUser?.(u)}
                    className="px-2.5 py-1 text-xs font-mono font-medium text-black hover:text-[#E60012] border border-gray-300 hover:border-[#E60012] transition-colors"
                  >
                    Kelola Sesi
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
export default TampilanAntarmukaSupaba;
