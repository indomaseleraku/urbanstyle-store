// components/pdp/ProductAccordion.tsx
'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductAccordionProps {
  product: Product;
}

export default function ProductAccordion({ product }: ProductAccordionProps) {
  const [openSection, setOpenSection] = useState<string | null>('desc');

  const toggle = (sec: string) => {
    setOpenSection(openSection === sec ? null : sec);
  };

  return (
    <div className="border-t border-[#E5E5E5] divide-y divide-[#E5E5E5] text-xs">
      {/* Deskripsi & Filosofi */}
      <div>
        <button
          type="button"
          onClick={() => toggle('desc')}
          className="w-full py-3.5 flex items-center justify-between font-bold uppercase tracking-wider text-[#111111] hover:text-[#E60012] transition-colors cursor-pointer text-left"
        >
          <span>Uraian & Filosofi Desain</span>
          {openSection === 'desc' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {openSection === 'desc' && (
          <div className="pb-4 text-[#757575] leading-relaxed space-y-2">
            <p>{product.description}</p>
          </div>
        )}
      </div>

      {/* Rincian Material & Perawatan */}
      <div>
        <button
          type="button"
          onClick={() => toggle('material')}
          className="w-full py-3.5 flex items-center justify-between font-bold uppercase tracking-wider text-[#111111] hover:text-[#E60012] transition-colors cursor-pointer text-left"
        >
          <span>Spesifikasi Bahan & Instruksi Cuci</span>
          {openSection === 'material' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
        </button>
        {openSection === 'material' && (
          <div className="pb-4 text-[#757575] leading-relaxed space-y-2">
            <p>
              <strong className="text-[#111111]">Komposisi Bahan:</strong>{' '}
              {product.fabric_details || '100% Katun Organik Pilihan'}
            </p>
            <p>
              <strong className="text-[#111111]">Perawatan:</strong>{' '}
              {product.care_instructions || 'Dapat dicuci dengan mesin pada air dingin, putaran lembut. Jangan gunakan pemutih klorin.'}
            </p>
          </div>
        )}
      </div>

      {/* Dimensi & Ukuran Riil */}
      {product.size_measurements && (
        <div>
          <button
            type="button"
            onClick={() => toggle('size_chart')}
            className="w-full py-3.5 flex items-center justify-between font-bold uppercase tracking-wider text-[#111111] hover:text-[#E60012] transition-colors cursor-pointer text-left"
          >
            <span>Tabel Ukuran Presisi (cm)</span>
            {openSection === 'size_chart' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          {openSection === 'size_chart' && (
            <div className="pb-4 overflow-x-auto">
              <table className="w-full text-left border-collapse border border-zinc-200">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200">
                    <th className="p-2 font-bold uppercase text-zinc-900">Ukuran</th>
                    <th className="p-2 font-bold uppercase text-zinc-900">Panjang</th>
                    <th className="p-2 font-bold uppercase text-zinc-900">Lebar Dada</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 font-mono">
                  {Object.entries(product.size_measurements).map(([sz, meas]: [string, any]) => (
                    <tr key={sz}>
                      <td className="p-2 font-bold">{sz}</td>
                      <td className="p-2">{meas.length || meas.panjang || '-'} cm</td>
                      <td className="p-2">{meas.chest || meas.lebar_dada || '-'} cm</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
