// components/invoice/InvoiceItemsTable.tsx
import React from 'react';
import { OrderItem } from '@/lib/types';

interface InvoiceItemsTableProps {
  items: OrderItem[];
}

export default function InvoiceItemsTable({ items }: InvoiceItemsTableProps) {
  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
        Rincian Item Busana Dipesan:
      </h2>
      <div className="border border-zinc-200 overflow-x-auto rounded-none">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-zinc-100 border-b border-zinc-200 text-zinc-700 font-bold uppercase text-[11px]">
              <th className="p-3">Item Busana</th>
              <th className="p-3 text-center">Ukuran</th>
              <th className="p-3 text-center">Warna</th>
              <th className="p-3 text-right">Harga Satuan</th>
              <th className="p-3 text-center">Qty</th>
              <th className="p-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {items.map((it, idx) => (
              <tr key={idx} className="hover:bg-zinc-50/50">
                <td className="p-3 font-semibold text-zinc-950">{it.product_name}</td>
                <td className="p-3 text-center font-mono font-bold">{it.selected_size}</td>
                <td className="p-3 text-center text-zinc-600">{it.selected_color}</td>
                <td className="p-3 text-right font-mono tabular-nums">Rp {it.price.toLocaleString('id-ID')}</td>
                <td className="p-3 text-center font-bold tabular-nums">{it.quantity}</td>
                <td className="p-3 text-right font-mono font-bold tabular-nums">Rp {it.subtotal.toLocaleString('id-ID')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
