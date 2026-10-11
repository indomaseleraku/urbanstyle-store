// components/admin/tabs/DssAnalyticsTab.tsx
// Executive Decision Support System (DSS) & Pareto 80/20 ABC Analysis Tab Component

import React from 'react';
import { 
  Clock, Printer, Download, Lock 
} from 'lucide-react';
import { Order } from '@/lib/types';
import DssKpiCards from './DssKpiCards';

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
      <div className="bg-amber-50 border border-amber-300 p-4 text-xs text-amber-900 flex items-start gap-2.5">
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
      <div className="p-8 text-center text-xs text-zinc-500 bg-white border border-zinc-200">
        Memuat data Decision Support System...
      </div>
    );
  }

  const handleExportCSV = () => {
    const headers = ['No. Pesanan', 'Tanggal', 'Nama Pelanggan', 'No. WhatsApp', 'Kurir', 'Total Biaya (Rp)', 'Status', 'Nomor Resi'];
    const rows = orders.map(o => [
      o.order_number,
      new Date(o.created_at).toLocaleDateString('id-ID'),
      `"${o.customer_name.replace(/"/g, '""')}"`,
      o.customer_phone,
      o.shipping_courier,
      o.total_amount,
      o.status,
      o.tracking_number || '-',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Laporan_Transaksi_UrbanStyle_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Action Bar: Period Selector & Print / Export */}
      <div className="bg-white p-4 border border-zinc-200 flex flex-wrap items-center justify-between gap-3 shadow-2xs print:hidden">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase text-zinc-500 flex items-center gap-1">
            <Clock size={14} />
            <span>Periode Analisis:</span>
          </span>
          <div className="inline-flex border border-zinc-300 text-xs font-bold uppercase overflow-hidden">
            <button
              onClick={() => setDssPeriod('all')}
              className={`px-3 py-1.5 transition-colors cursor-pointer ${dssPeriod === 'all' ? 'bg-zinc-950 text-white' : 'bg-white hover:bg-zinc-100 text-zinc-700'}`}
            >
              Semua Waktu
            </button>
            <button
              onClick={() => setDssPeriod('30days')}
              className={`px-3 py-1.5 border-l border-zinc-300 transition-colors cursor-pointer ${dssPeriod === '30days' ? 'bg-zinc-950 text-white' : 'bg-white hover:bg-zinc-100 text-zinc-700'}`}
            >
              30 Hari Terakhir
            </button>
            <button
              onClick={() => setDssPeriod('7days')}
              className={`px-3 py-1.5 border-l border-zinc-300 transition-colors cursor-pointer ${dssPeriod === '7days' ? 'bg-zinc-950 text-white' : 'bg-white hover:bg-zinc-100 text-zinc-700'}`}
            >
              7 Hari Terakhir
            </button>
            <button
              onClick={() => setDssPeriod('today')}
              className={`px-3 py-1.5 border-l border-zinc-300 transition-colors cursor-pointer ${dssPeriod === 'today' ? 'bg-zinc-950 text-white' : 'bg-white hover:bg-zinc-100 text-zinc-700'}`}
            >
              Hari Ini
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-zinc-300 bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Printer size={14} />
            <span>Cetak Laporan DSS (A4)</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-950 hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <Download size={14} />
            <span>Ekspor CSV Transaksi</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <DssKpiCards dssData={dssData} />

      {/* Pareto 80/20 & ABC Analysis Matrix Card */}
      <div className="bg-white p-6 border border-zinc-200 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between border-b border-zinc-200 pb-4 gap-2">
          <div>
            <h3 className="text-base font-extrabold uppercase tracking-tight text-zinc-950 flex items-center gap-2">
              <span>Analisis Pareto 80/20 & Klasifikasi ABC (DSS Decision Engine)</span>
              <span className="text-[10px] bg-red-100 text-[#E60012] px-2 py-0.5 font-mono font-bold">PRD V5.2 FR-25</span>
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Metode klasifikasi persediaan: Kelas A menyumbang 80% omzet kumulatif, Kelas B 15%, dan Kelas C 5%
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-mono">
            <span className="px-2 py-0.5 bg-red-100 text-[#E60012] font-bold border border-red-200">Kelas A: Omzet 80%</span>
            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 font-bold border border-amber-200">Kelas B: Omzet 15%</span>
            <span className="px-2 py-0.5 bg-zinc-100 text-zinc-700 font-bold border border-zinc-200">Kelas C: Omzet 5%</span>
          </div>
        </div>

        {/* Table Pareto ABC */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-50 border-y border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-3 w-12 text-center">Rank</th>
                <th className="py-3 px-4">Nama Produk Unggulan</th>
                <th className="py-3 px-4 text-center">Terjual</th>
                <th className="py-3 px-4">Total Omzet</th>
                <th className="py-3 px-4 text-center">Kontribusi (%)</th>
                <th className="py-3 px-4 text-center">Kumulatif (%)</th>
                <th className="py-3 px-4 text-center">Kelas ABC</th>
                <th className="py-3 px-4">Rekomendasi Keputusan SIM</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {dssData.topProducts.map((p, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/80 transition-colors">
                  <td className="py-3 px-3 text-center font-mono font-bold">
                    <span className={`w-6 h-6 inline-flex items-center justify-center text-xs ${
                      p.abcClass === 'A' ? 'bg-[#E60012] text-white' : 'bg-zinc-200 text-zinc-800'
                    }`}>
                      {idx + 1}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-zinc-950 uppercase">
                    {p.name}
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-semibold">
                    {p.sold} Unit
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-zinc-900">
                    Rp {p.revenue.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3 px-4 text-center font-mono">
                    {p.percentage.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-zinc-800">
                    {p.cumulativePercentage}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-0.5 text-xs font-black font-mono border ${
                      p.abcClass === 'A' 
                        ? 'bg-red-50 text-[#E60012] border-red-300' 
                        : p.abcClass === 'B' 
                          ? 'bg-amber-50 text-amber-800 border-amber-300' 
                          : 'bg-zinc-100 text-zinc-600 border-zinc-300'
                    }`}>
                      KELAS {p.abcClass}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-[11px] text-zinc-700">
                    {p.actionRecommendation}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>

    </div>
  );
};
