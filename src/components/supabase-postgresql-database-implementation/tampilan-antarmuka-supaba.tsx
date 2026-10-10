'use strict';
'use client';

import React, { useState } from 'react';
import { Database, Table, ShieldCheck, Key, FileCode, CheckCircle2, RefreshCw, Terminal } from 'lucide-react';

interface DatabaseTableMetadata {
  tableName: string;
  rowCount: number;
  columnsCount: number;
  rlsEnabled: boolean;
  foreignKeys: string[];
  description: string;
}

const DATABASE_TABLES: DatabaseTableMetadata[] = [
  {
    tableName: 'products',
    rowCount: 40,
    columnsCount: 14,
    rlsEnabled: true,
    foreignKeys: [],
    description: 'Master katalog LifeWear Uniqlo dengan SKU master dan spesifikasi bahan.',
  },
  {
    tableName: 'product_variants',
    rowCount: 86,
    columnsCount: 10,
    rlsEnabled: true,
    foreignKeys: ['product_id -> products.id'],
    description: 'Varian SKU spesifik (kombinasi warna resmi Uniqlo dan ukuran individual).',
  },
  {
    tableName: 'profiles',
    rowCount: 4,
    columnsCount: 8,
    rlsEnabled: true,
    foreignKeys: ['id -> auth.users.id'],
    description: 'Profil RBAC pengguna terhubung 1:1 dengan auth.users.',
  },
  {
    tableName: 'orders',
    rowCount: 128,
    columnsCount: 16,
    rlsEnabled: true,
    foreignKeys: ['user_id -> profiles.id'],
    description: 'Header transaksi pesanan, status pembayaran, dan data resi ekspedisi.',
  },
  {
    tableName: 'inventory_locks',
    rowCount: 3,
    columnsCount: 7,
    rlsEnabled: true,
    foreignKeys: ['variant_id -> product_variants.id'],
    description: 'Kunci inventaris time-bound 10 menit perlindungan anti-overselling.',
  },
  {
    tableName: 'coupons',
    rowCount: 3,
    columnsCount: 8,
    rlsEnabled: true,
    foreignKeys: [],
    description: 'Kupon promosi diskon nominal/persentase dengan batas minimum belanja.',
  },
];

export const TampilanAntarmukaSupaba: React.FC<{
  onInspectTable?: (table: DatabaseTableMetadata) => void;
  onOpenQueryRunner?: () => void;
}> = ({ onInspectTable, onOpenQueryRunner }) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 border border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black text-white">
              Supabase PostgreSQL Engine
            </span>
            <span className="flex items-center gap-1 text-xs text-green-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> PostgreSQL 15.8 (Cloud)
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-950 uppercase font-mono">
            Implementasi Skema Relasional Database Supabase
          </h2>
        </div>
        <button
          onClick={onOpenQueryRunner}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E60012] hover:bg-[#CC0010] text-white font-medium text-xs uppercase tracking-wider font-mono transition-colors"
        >
          <Terminal className="w-4 h-4" /> Buka SQL Console
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-1">
            <span>Tabel Relasional</span>
            <Table className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">
            {DATABASE_TABLES.length} Tabel
          </div>
          <p className="text-[10px] text-green-700 font-mono mt-1 font-semibold">100% RLS Enabled</p>
        </div>

        <div className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-1">
            <span>B-Tree Indeks Terdaftar</span>
            <Key className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">18 Indeks</div>
          <p className="text-[10px] text-gray-500 font-mono mt-1">FK & Search Indexing Teroptimasi</p>
        </div>

        <div className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-1">
            <span>Status Replikasi</span>
            <Database className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-green-700">SYNCHRONIZED</div>
          <p className="text-[10px] text-gray-500 font-mono mt-1">Multi-AZ High Availability</p>
        </div>
      </div>

      {/* Tables Grid */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-gray-900">
            Daftar Skema Entitas Relasional (public schema)
          </h3>
          <span className="text-[10px] text-gray-500 font-mono">Row-Level Security Active</span>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 font-mono text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">Nama Tabel</th>
              <th className="py-3 px-4 font-semibold">Estimasi Baris</th>
              <th className="py-3 px-4 font-semibold">Kolom</th>
              <th className="py-3 px-4 font-semibold">RLS Status</th>
              <th className="py-3 px-4 font-semibold">Relasi Foreign Key</th>
              <th className="py-3 px-4 font-semibold text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-sans">
            {DATABASE_TABLES.map((t) => (
              <tr key={t.tableName} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="font-mono font-bold text-gray-950 flex items-center gap-1.5">
                    <Table className="w-3.5 h-3.5 text-gray-500" />
                    {t.tableName}
                  </div>
                  <div className="text-[11px] text-gray-500 mt-0.5">{t.description}</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-gray-900 font-semibold">
                  {t.rowCount} baris
                </td>
                <td className="py-3.5 px-4 font-mono text-gray-600">{t.columnsCount} kolom</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold font-mono uppercase bg-green-50 text-green-700 border border-green-200">
                    <ShieldCheck className="w-3 h-3" /> ENABLED
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono text-[10px] text-gray-600">
                  {t.foreignKeys.length > 0 ? (
                    t.foreignKeys.map((fk, idx) => (
                      <span key={idx} className="block">
                        {fk}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">Root Entity</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => onInspectTable?.(t)}
                    className="px-2.5 py-1 text-xs font-mono font-medium text-black hover:text-[#E60012] border border-gray-300 hover:border-[#E60012] transition-colors"
                  >
                    Inspeksi DDL
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
