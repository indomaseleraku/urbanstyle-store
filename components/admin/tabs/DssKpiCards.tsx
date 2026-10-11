// components/admin/tabs/DssKpiCards.tsx
'use client';

import React from 'react';
import { TrendingUp, ShoppingCart, Package, AlertTriangle } from 'lucide-react';
import { DSSData } from './DssAnalyticsTab';

interface DssKpiCardsProps {
  dssData: DSSData;
}

export default function DssKpiCards({ dssData }: DssKpiCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white p-5 border border-zinc-200 shadow-2xs">
        <div className="flex items-center justify-between text-zinc-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Total Omzet Bersih</span>
          <TrendingUp size={16} className="text-[#E60012]" />
        </div>
        <p className="text-xl sm:text-2xl font-black text-zinc-950 font-mono">
          Rp {dssData.totalRevenue.toLocaleString('id-ID')}
        </p>
        <p className="text-[11px] text-zinc-400 mt-1">Status pesanan Dibayar s/d Selesai</p>
      </div>

      <div className="bg-white p-5 border border-zinc-200 shadow-2xs">
        <div className="flex items-center justify-between text-zinc-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">Volume Transaksi (TPS)</span>
          <ShoppingCart size={16} className="text-zinc-700" />
        </div>
        <p className="text-xl sm:text-2xl font-black text-zinc-950 font-mono">
          {dssData.totalOrders} Pesanan
        </p>
        <p className="text-[11px] text-zinc-400 mt-1">Total order tercatat dalam periode</p>
      </div>

      <div className="bg-white p-5 border border-zinc-200 shadow-2xs">
        <div className="flex items-center justify-between text-zinc-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">SKU Katalog Aktif</span>
          <Package size={16} className="text-zinc-700" />
        </div>
        <p className="text-xl sm:text-2xl font-black text-zinc-950 font-mono">
          {dssData.totalProducts} Model
        </p>
        <p className="text-[11px] text-zinc-400 mt-1">Siap dipasarkan di etalase</p>
      </div>

      <div className="bg-white p-5 border border-zinc-200 shadow-2xs">
        <div className="flex items-center justify-between text-zinc-500 mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider">SKU Stok Kritis</span>
          <AlertTriangle size={16} className="text-[#E60012]" />
        </div>
        <p className="text-xl sm:text-2xl font-black text-[#E60012] font-mono">
          {dssData.criticalStockCount} Item
        </p>
        <p className="text-[11px] text-red-500 mt-1 font-semibold">Stok gudang tersisa ≤ 5 unit</p>
      </div>
    </div>
  );
}
