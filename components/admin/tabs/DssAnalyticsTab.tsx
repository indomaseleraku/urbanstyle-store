// components/admin/tabs/DssAnalyticsTab.tsx
'use client';

import React from 'react';
import { Clock, Printer, Download, TrendingUp, ShoppingCart, Package, AlertTriangle, Lock } from 'lucide-react';
import { Order } from '@/lib/types';
import DssAbcMatrix from './dss/DssAbcMatrix';

export interface DSSData {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  criticalStockCount: number;
  topProducts: { 
    name: string; 
    sold: number; 
    revenue: number; 
    percentage: number; 
    cumulativePercentage: number;
    abcClass: 'A' | 'B' | 'C';
    actionRecommendation: string;
  }[];
}

interface DssAnalyticsTabProps {
  dssData: DSSData | null;
  dssPeriod: 'all' | 'today' | '7days' | '30days';
  setDssPeriod: (period: 'all' | 'today' | '7days' | '30days') => void;
  orders: Order[];
  isGudang: boolean;
  onNavigateToInventory: () => void;
}

export const DssAnalyticsTab: React.FC<DssAnalyticsTabProps> = ({
  dssData,
  dssPeriod,
  setDssPeriod,
  orders,
  isGudang,
  onNavigateToInventory,
}) => {
  if (isGudang) {
    return (
      <div className="bg-amber-50 border border-amber-300 p-4 text-xs text-amber-900 flex items-start gap-2.5 rounded-none font-sans">
        <Lock size={16} className="text-amber-700 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold uppercase tracking-tight">Wewenang Dibatasi (RBAC PRD V5.2 FR-23)</p>
          <p className="text-amber-800 text-[11px] mt-0.5">
            Akun Anda terdaftar sebagai <span className="font-bold">Staf Logistik & Gudang</span>. Modul analitik omzet keuangan dan Pareto DSS dikunci khusus untuk Owner Toko. Silakan beralih ke tab <button onClick={onNavigateToInventory} className="underline font-bold text-black cursor-pointer">Kontrol Inventaris</button>.
          </p>
        </div>
      </div>
    );
  }

  if (!dssData) {
    return (
      <div className="p-8 text-center text-xs text-zinc-500 bg-white border border-zinc-200 rounded-none font-sans">
        Memuat data Decision Support System...
      </div>
    );
  }

  const handleExportCSV = () => {
    const headers = ['No. Pesanan', 'Tanggal', 'Nama Pelanggan', 'No. WhatsApp', 'Kurir', 'Total Biaya (Rp)', 'Status', 'Nomor Resi'];
    const rows = orders.map((o) => [
      o.order_number,
      new Date(o.created_at).toLocaleDateString('id-ID'),
      `"${o.customer_name.replace(/"/g, '""')}"`,
      o.customer_phone,
      o.shipping_courier,
      o.total_amount,
      o.status,
      o.tracking_number || '-',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Transaksi_UrbanStyle_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Action Bar: Period Selector & Print / Export */}
      <div className="bg-white p-4 border border-zinc-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs print:hidden rounded-none">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-1">
            <Clock size={14} /> <span>Periode Analisis:</span>
          </span>
          <div className="inline-flex border border-zinc-300 text-xs font-bold uppercase overflow-hidden rounded-none">
            {(['all', 'today', '7days', '30days'] as const).map((p) => (
              <button
                key={p} onClick={() => setDssPeriod(p)}
                className={`px-3 py-1.5 cursor-pointer ${dssPeriod === p ? 'bg-zinc-950 text-white' : 'bg-white hover:bg-zinc-100 text-zinc-700'}`}
              >
                {p === 'all' ? 'Sepanjang Waktu' : p === 'today' ? 'Hari Ini' : p === '7days' ? '7 Hari Terakhir' : '30 Hari Terakhir'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="px-3 py-1.5 border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-bold uppercase flex items-center gap-1.5 rounded-none cursor-pointer">
            <Printer size={13} /> <span>Cetak Laporan</span>
          </button>
          <button onClick={handleExportCSV} className="px-3 py-1.5 bg-zinc-950 hover:bg-[#E60012] text-white text-xs font-bold uppercase flex items-center gap-1.5 rounded-none cursor-pointer">
            <Download size={13} /> <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 border border-zinc-200 shadow-2xs rounded-none">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Omzet Penjualan</span>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black font-mono text-zinc-950 mt-2 tabular-nums">
            Rp {dssData.totalRevenue.toLocaleString('id-ID')}
          </p>
        </div>
        <div className="bg-white p-5 border border-zinc-200 shadow-2xs rounded-none">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Transaksi</span>
            <ShoppingCart size={16} className="text-zinc-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black font-mono text-zinc-950 mt-2 tabular-nums">
            {dssData.totalOrders} Pesanan
          </p>
        </div>
        <div className="bg-white p-5 border border-zinc-200 shadow-2xs rounded-none">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total SKU Produk</span>
            <Package size={16} className="text-zinc-600" />
          </div>
          <p className="text-xl sm:text-2xl font-black font-mono text-zinc-950 mt-2 tabular-nums">
            {dssData.totalProducts} Model
          </p>
        </div>
        <div className="bg-white p-5 border border-zinc-200 shadow-2xs rounded-none">
          <div className="flex items-center justify-between text-zinc-400">
            <span className="text-[10px] font-bold uppercase tracking-wider">Stok Kritis (&le;5)</span>
            <AlertTriangle size={16} className="text-[#E60012]" />
          </div>
          <p className="text-xl sm:text-2xl font-black font-mono text-[#E60012] mt-2 tabular-nums">
            {dssData.criticalStockCount} Item
          </p>
        </div>
      </div>

      {/* Pareto ABC Analysis Table */}
      <DssAbcMatrix topProducts={dssData.topProducts} />
    </div>
  );
};
