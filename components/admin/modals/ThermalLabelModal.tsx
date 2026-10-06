// components/admin/modals/ThermalLabelModal.tsx
// Cetak Label Pengiriman Thermal A6 / 100x150 mm (PRD V5.2 FR-20)

import React from 'react';
import { Printer } from 'lucide-react';
import { Order } from '@/lib/types';

interface ThermalLabelModalProps {
  order: Order | null;
  onClose: () => void;
}

export const ThermalLabelModal: React.FC<ThermalLabelModalProps> = ({
  order,
  onClose,
}) => {
  if (!order) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white border-2 border-black max-w-md w-full p-6 shadow-2xl space-y-4 font-mono text-zinc-950">
        
        {/* Header Thermal */}
        <div className="border-b-2 border-black pb-3 flex items-start justify-between">
          <div>
            <h3 className="text-base font-black tracking-tight uppercase leading-tight">
              URBANSTYLE STORE
            </h3>
            <p className="text-[10px] text-zinc-600">
              HUB LOGISTIK & PENGIRIMAN FASHION
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs font-black uppercase bg-black text-white px-2 py-0.5">
              {order.shipping_courier}
            </span>
            <p className="text-[10px] text-zinc-500 mt-1">STANDARD EXPRESS</p>
          </div>
        </div>

        {/* Simulated Barcode */}
        <div className="text-center py-2 border-b-2 border-black">
          <div className="h-12 bg-[repeating-linear-gradient(90deg,#000,#000_2px,transparent_2px,transparent_4px)] w-4/5 mx-auto" />
          <p className="text-xs font-bold tracking-widest mt-1">
            {order.tracking_number || order.order_number}
          </p>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-4 text-xs border-b-2 border-black pb-3">
          <div>
            <span className="text-[9px] uppercase font-bold text-zinc-500 block">PENGIRIM:</span>
            <p className="font-bold">UrbanStyle Store</p>
            <p className="text-[11px] text-zinc-600">Gedung UNPAM Kampus Pusat, Pamulang</p>
            <p className="text-[11px] text-zinc-600">Tangerang Selatan, 15417</p>
            <p className="text-[11px] text-zinc-600">0811-9988-7766</p>
          </div>

          <div>
            <span className="text-[9px] uppercase font-bold text-zinc-500 block">PENERIMA:</span>
            <p className="font-black">{order.customer_name}</p>
            <p className="text-[11px] text-zinc-700 leading-tight">{order.customer_address}</p>
            <p className="text-[11px] text-zinc-700 font-bold mt-1">{order.customer_phone}</p>
          </div>
        </div>

        {/* Items Summary */}
        <div className="text-xs space-y-1 border-b-2 border-black pb-3">
          <span className="text-[9px] uppercase font-bold text-zinc-500 block">ISI PAKET:</span>
          {order.items.map((it, idx) => (
            <p key={idx} className="text-[11px] truncate">
              • {it.product_name} (Ukuran: {it.selected_size}, {it.quantity}x)
            </p>
          ))}
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center pt-2 print:hidden font-sans">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-bold uppercase border border-zinc-300 text-zinc-700 cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-black hover:bg-[#E60012] text-white text-xs font-bold uppercase transition-colors cursor-pointer"
          >
            <Printer size={13} />
            <span>Cetak Label Thermal (A6 / 100x150)</span>
          </button>
        </div>

      </div>
    </div>
  );
};
