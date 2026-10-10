// components/admin/tabs/dss/DssAbcMatrix.tsx
'use client';

import React from 'react';

interface TopProductItem {
  name: string;
  sold: number;
  revenue: number;
  percentage: number;
  cumulativePercentage: number;
  abcClass: 'A' | 'B' | 'C';
  actionRecommendation: string;
}

interface DssAbcMatrixProps {
  topProducts: TopProductItem[];
}

export default function DssAbcMatrix({ topProducts }: DssAbcMatrixProps) {
  return (
    <div className="bg-white border border-zinc-200 shadow-2xs space-y-3 rounded-none font-sans">
      <div className="p-4 sm:p-5 border-b border-zinc-200">
        <h4 className="text-sm font-extrabold uppercase text-zinc-950 flex items-center gap-2">
          <span>Klasifikasi Pareto 80/20 (ABC Matrix)</span>
          <span className="text-[10px] bg-zinc-100 text-zinc-700 px-2 py-0.5 font-mono">FR-23</span>
        </h4>
        <p className="text-xs text-zinc-500 mt-1">
          Kategori A menghasilkan 80% omzet (prioritas restok), B menghasilkan 15%, dan C menghasilkan 5%.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-100 border-y border-zinc-200 text-zinc-700 font-bold uppercase text-[11px]">
              <th className="p-3 text-center">Kelas</th>
              <th className="p-3">Nama Produk Busana</th>
              <th className="p-3 text-center">Terjual</th>
              <th className="p-3 text-right">Kontribusi Omzet</th>
              <th className="p-3 text-center">% Kumulatif</th>
              <th className="p-3">Rekomendasi Tindakan DSS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {topProducts.map((p, idx) => (
              <tr key={idx} className="hover:bg-zinc-50/50">
                <td className="p-3 text-center">
                  <span className={`w-6 h-6 inline-flex items-center justify-center font-black text-xs font-mono rounded-none ${
                    p.abcClass === 'A' ? 'bg-[#E60012] text-white' : p.abcClass === 'B' ? 'bg-amber-500 text-white' : 'bg-zinc-300 text-zinc-700'
                  }`}>
                    {p.abcClass}
                  </span>
                </td>
                <td className="p-3 font-semibold text-zinc-950">{p.name}</td>
                <td className="p-3 text-center font-mono font-bold tabular-nums">{p.sold} pcs</td>
                <td className="p-3 text-right font-mono font-bold tabular-nums">Rp {p.revenue.toLocaleString('id-ID')}</td>
                <td className="p-3 text-center font-mono tabular-nums">{p.cumulativePercentage.toFixed(1)}%</td>
                <td className="p-3 text-zinc-600 text-[11px] font-medium">{p.actionRecommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
