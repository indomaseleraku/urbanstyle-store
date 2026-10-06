// components/admin/tabs/OrdersTab.tsx
// Daftar Transaksi Pesanan & Ekspedisi (Modul TPS & Thermal Shipping Label)

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ExternalLink, Truck, Printer, Check } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';

interface OrdersTabProps {
  orders: Order[];
  onUpdateOrderStatus: (orderNumber: string, status: OrderStatus) => Promise<void>;
  onSimulateInstantPaid: (orderNumber: string) => Promise<void>;
  onSaveResi: (orderNumber: string, resi: string) => Promise<void>;
  onOpenShippingLabel: (order: Order) => void;
}

export const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  onUpdateOrderStatus,
  onSimulateInstantPaid,
  onSaveResi,
  onOpenShippingLabel,
}) => {
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [searchOrder, setSearchOrder] = useState('');
  const [editingResi, setEditingResi] = useState<{ orderNumber: string; resi: string } | null>(null);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchSearch = o.order_number.toLowerCase().includes(searchOrder.toLowerCase()) ||
                          o.customer_name.toLowerCase().includes(searchOrder.toLowerCase());
      if (!matchSearch) return false;
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
      return true;
    });
  }, [orders, searchOrder, orderStatusFilter]);

  const handleSaveResiSubmit = async (orderNumber: string, resi: string) => {
    await onSaveResi(orderNumber, resi);
    setEditingResi(null);
  };

  return (
    <div className="bg-white border border-zinc-200 shadow-2xs space-y-4 animate-in fade-in duration-200">
      
      <div className="p-4 sm:p-5 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold uppercase tracking-tight text-zinc-950 flex items-center gap-2">
            <span>Daftar Transaksi Pesanan & Ekspedisi (Modul TPS)</span>
            <span className="text-[10px] bg-red-100 text-[#E60012] px-2 py-0.5 font-mono font-bold">FR-15 / FR-20</span>
          </h3>
          <p className="text-xs text-zinc-500">
            Filter tahapan order, verifikasi bukti slip bayar, cetak label pengiriman thermal, dan input nomor resi kurir
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder="Cari No. Order / Nama..."
              value={searchOrder}
              onChange={(e) => setSearchOrder(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:border-zinc-900"
            />
          </div>

          <span className="text-xs font-bold text-zinc-700 bg-zinc-100 px-3 py-1.5 font-mono">
            Total: {filteredOrders.length} Pesanan
          </span>
        </div>
      </div>

      {/* Order Status Filter Tabs */}
      <div className="px-4 sm:px-5 flex gap-1 border-b border-zinc-200 overflow-x-auto text-xs font-bold uppercase">
        {(['all', 'Menunggu Pembayaran', 'Dibayar', 'Dikemas', 'Dikirim', 'Selesai'] as const).map((st) => (
          <button
            key={st}
            onClick={() => setOrderStatusFilter(st)}
            className={`px-3 py-2 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              orderStatusFilter === st 
                ? 'border-[#E60012] text-[#E60012] bg-red-50/40' 
                : 'border-transparent text-zinc-500 hover:text-zinc-950 hover:bg-zinc-50'
            }`}
          >
            {st === 'all' ? 'Semua Status' : st}
            <span className="ml-1.5 text-[10px] font-mono opacity-70">
              ({st === 'all' ? orders.length : orders.filter(o => o.status === st).length})
            </span>
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 border-y border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">No. Pesanan & Dokumen</th>
              <th className="py-3 px-4">Pelanggan & Kontak</th>
              <th className="py-3 px-4">Item Busana</th>
              <th className="py-3 px-4">Total Biaya</th>
              <th className="py-3 px-4">Nomor Resi & Ekspedisi</th>
              <th className="py-3 px-4">Status & Verifikasi</th>
              <th className="py-3 px-4 text-center">Label Cetak</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {filteredOrders.map((o) => (
              <tr key={o.order_number} className="hover:bg-zinc-50/80 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-zinc-950">
                  <div className="space-y-1">
                    <Link
                      href={`/invoice/${o.order_number}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#E60012] hover:underline inline-flex items-center gap-1 group"
                      title="Buka Faktur Nota Digital"
                    >
                      <span>{o.order_number}</span>
                      <ExternalLink size={11} className="opacity-70 group-hover:opacity-100" />
                    </Link>
                    <Link
                      href={`/track/${o.order_number}`}
                      target="_blank"
                      className="text-[10px] text-zinc-500 hover:text-black flex items-center gap-1"
                    >
                      <Truck size={10} />
                      <span>Lacak Paket ↗</span>
                    </Link>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <p className="font-bold text-zinc-900">{o.customer_name}</p>
                  <p className="text-[10px] text-zinc-400 font-mono">{o.customer_phone}</p>
                  <p className="text-[10px] text-zinc-500 line-clamp-1 max-w-[200px]" title={o.customer_address}>
                    {o.customer_address}
                  </p>
                </td>
                <td className="py-3 px-4 max-w-xs">
                  {o.items.map((it, idx) => (
                    <p key={idx} className="truncate text-zinc-700">
                      • {it.product_name} ({it.quantity}x)
                    </p>
                  ))}
                </td>
                <td className="py-3 px-4 font-extrabold text-zinc-950 font-mono">
                  Rp {Number(o.total_amount).toLocaleString('id-ID')}
                  {o.payment_method === 'Bank Transfer' ? (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="inline-block text-[10px] font-semibold text-blue-700 bg-blue-50 px-1 border border-blue-200">
                        {o.bank_name || 'BCA'}
                      </span>
                      {o.unique_code ? (
                        <span className="text-[10px] font-mono font-bold text-red-600 bg-red-50 px-1 border border-red-200" title="Kode Unik 3 Digit">
                          #{o.unique_code}
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <span className="block text-[10px] font-normal text-zinc-400">
                      {o.payment_method}
                    </span>
                  )}
                </td>
                <td className="py-3 px-4">
                  {editingResi?.orderNumber === o.order_number ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="text"
                        value={editingResi.resi}
                        onChange={(e) => setEditingResi({ orderNumber: o.order_number, resi: e.target.value })}
                        placeholder="Contoh: JT88291049281"
                        className="w-32 px-2 py-1 text-xs border border-zinc-300 font-mono"
                      />
                      <button
                        onClick={() => handleSaveResiSubmit(o.order_number, editingResi.resi)}
                        className="px-2 py-1 bg-black text-white text-[10px] font-bold uppercase cursor-pointer"
                      >
                        Simpan
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono text-xs font-semibold text-zinc-800">
                        {o.tracking_number || '-'}
                      </span>
                      <button
                        onClick={() => setEditingResi({ orderNumber: o.order_number, resi: o.tracking_number || '' })}
                        className="text-[10px] text-zinc-500 hover:text-black underline cursor-pointer"
                      >
                        Edit
                      </button>
                    </div>
                  )}
                  <span className="text-[10px] text-zinc-400 block mt-0.5">{o.shipping_courier}</span>
                </td>
                <td className="py-3 px-4 space-y-1">
                  <select
                    value={o.status}
                    onChange={(e) => onUpdateOrderStatus(o.order_number, e.target.value as OrderStatus)}
                    className="px-2.5 py-1 text-xs border border-zinc-300 bg-white font-bold text-zinc-800 focus:outline-none focus:border-zinc-900 block cursor-pointer"
                  >
                    <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                    <option value="Dibayar">Dibayar</option>
                    <option value="Dikemas">Dikemas</option>
                    <option value="Dikirim">Dikirim</option>
                    <option value="Selesai">Selesai</option>
                    <option value="Dibatalkan">Dibatalkan</option>
                  </select>

                  {o.status === 'Menunggu Pembayaran' && (
                    <button
                      onClick={() => onSimulateInstantPaid(o.order_number)}
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold uppercase tracking-wider cursor-pointer"
                      title="Verifikasi pembayaran lunas"
                    >
                      <Check size={11} />
                      <span>Verifikasi Lunas</span>
                    </button>
                  )}
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onOpenShippingLabel(o)}
                    className="px-2.5 py-1 text-[11px] font-bold border border-zinc-300 hover:border-black bg-white text-zinc-800 flex items-center gap-1 mx-auto cursor-pointer"
                    title="Cetak Label Pengiriman Thermal Staf Gudang"
                  >
                    <Printer size={12} />
                    <span>Label Resi</span>
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
