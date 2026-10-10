'use strict';
'use client';

import React, { useState, useEffect } from 'react';
import { Timer, Lock, Unlock, AlertTriangle, ShieldAlert, RefreshCw, Warehouse, PlusCircle } from 'lucide-react';

interface ActiveLock {
  id: string;
  sku: string;
  name: string;
  size: string;
  color: string;
  qty: number;
  expiresInSeconds: number;
  sessionId: string;
}

const INITIAL_LOCKS: ActiveLock[] = [
  {
    id: 'lock-881',
    sku: 'UQ-AIRISM-TEE-01',
    name: 'T-Shirt AIRism Katun Kerah Bulat',
    size: 'L',
    color: '00 WHITE',
    qty: 2,
    expiresInSeconds: 480, // 8 mins left
    sessionId: 'sess_991823',
  },
  {
    id: 'lock-882',
    sku: 'UQ-PLEATED-PANTS-03',
    name: 'Celana Lebar Lipit Pleated Wide Pants',
    size: 'M',
    color: '32 BEIGE',
    qty: 1,
    expiresInSeconds: 210, // 3.5 mins left
    sessionId: 'sess_441209',
  },
  {
    id: 'lock-883',
    sku: 'UQ-HEATTECH-EXT-04',
    name: 'HEATTECH T-Shirt Lengan Panjang Extra Warm',
    size: 'XL',
    color: '09 BLACK',
    qty: 1,
    expiresInSeconds: 50, // 50s left
    sessionId: 'sess_112048',
  },
];

export const TampilanAntarmukaInvent: React.FC<{
  onReleaseLock?: (lockId: string) => void;
  onOpenLockModal?: () => void;
}> = ({ onReleaseLock, onOpenLockModal }) => {
  const [locks, setLocks] = useState<ActiveLock[]>(INITIAL_LOCKS);

  // Countdown timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setLocks((prev) =>
        prev
          .map((l) => ({ ...l, expiresInSeconds: Math.max(0, l.expiresInSeconds - 1) }))
          .filter((l) => l.expiresInSeconds > 0)
      );
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleManualRelease = (id: string) => {
    setLocks((prev) => prev.filter((l) => l.id !== id));
    onReleaseLock?.(id);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 border border-gray-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#E60012] text-white">
              Inventory Guard Engine
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500 font-mono">
              <Timer className="w-3.5 h-3.5 text-[#E60012]" /> 10-Minute Lock TTL
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-gray-950 uppercase font-mono">
            Pelacakan Inventaris & Kunci Waktu Nyata (Time-Bound Locking)
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Mencegah overselling secara instan saat sesi checkout berlangsung dengan pembebasan stok otomatis.
          </p>
        </div>
        <button
          onClick={onOpenLockModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white font-medium text-xs uppercase tracking-wider font-mono transition-colors"
        >
          <Lock className="w-4 h-4" /> Simulasi Kunci Stok
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-1">
            <span>Stok Terkunci Aktif</span>
            <Lock className="w-4 h-4 text-[#E60012]" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">
            {locks.reduce((acc, curr) => acc + curr.qty, 0)} Pcs
          </div>
          <p className="text-[10px] text-gray-500 font-mono mt-1">
            {locks.length} sesi checkout aktif
          </p>
        </div>

        <div className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-1">
            <span>Rata-rata Durasi Selesai</span>
            <Timer className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">3.8 Menit</div>
          <p className="text-[10px] text-green-700 font-mono mt-1 font-semibold">
            92% konversi sukses tanpa timeout
          </p>
        </div>

        <div className="p-4 bg-white border border-gray-200">
          <div className="flex items-center justify-between text-gray-500 text-xs font-mono mb-1">
            <span>Auto-Release Expired</span>
            <Unlock className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-gray-900">14 Unit</div>
          <p className="text-[10px] text-gray-500 font-mono mt-1">
            Dikembalikan ke rak gudang hari ini
          </p>
        </div>
      </div>

      {/* Active Locks Table */}
      <div className="bg-white border border-gray-200 overflow-x-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider font-mono text-gray-900">
            Daftar Reservasi & Sisa Waktu Kunci (Live Countdown)
          </h3>
          <span className="text-[10px] text-gray-500 font-mono">
            Pembaruan tiap detik via client timer
          </span>
        </div>
        <table className="w-full text-left text-xs">
          <thead className="bg-gray-50 border-b border-gray-200 font-mono text-gray-500 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 font-semibold">ID Reservasi</th>
              <th className="py-3 px-4 font-semibold">Item & SKU</th>
              <th className="py-3 px-4 font-semibold">Varian (Warna / Ukuran)</th>
              <th className="py-3 px-4 font-semibold">Qty</th>
              <th className="py-3 px-4 font-semibold">Sisa Waktu Kunci</th>
              <th className="py-3 px-4 font-semibold text-right">Aksi Darurat</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 font-sans">
            {locks.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                <td className="py-3.5 px-4 font-mono font-semibold text-gray-800">
                  {item.id}
                  <div className="text-[10px] text-gray-400 font-normal">{item.sessionId}</div>
                </td>
                <td className="py-3.5 px-4">
                  <div className="font-semibold text-gray-900">{item.name}</div>
                  <div className="font-mono text-[10px] text-gray-500">{item.sku}</div>
                </td>
                <td className="py-3.5 px-4 font-mono text-xs">
                  <span className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 mr-1.5">
                    {item.color}
                  </span>
                  <span className="px-1.5 py-0.5 bg-black text-white font-bold">{item.size}</span>
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-gray-950">{item.qty} unit</td>
                <td className="py-3.5 px-4">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-50 text-[#E60012] border border-red-200 font-mono font-bold text-xs">
                    <Timer className="w-3.5 h-3.5 animate-spin" />
                    {formatTimer(item.expiresInSeconds)}
                  </div>
                </td>
                <td className="py-3.5 px-4 text-right">
                  <button
                    onClick={() => handleManualRelease(item.id)}
                    className="px-2.5 py-1 text-xs font-mono font-medium text-gray-700 hover:text-[#E60012] border border-gray-300 hover:border-[#E60012] transition-colors"
                  >
                    Release Manual
                  </button>
                </td>
              </tr>
            ))}
            {locks.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400 font-mono text-xs">
                  Tidak ada stok yang sedang terkunci. Semua unit tersedia bebas di etalase.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TampilanAntarmukaInvent;
