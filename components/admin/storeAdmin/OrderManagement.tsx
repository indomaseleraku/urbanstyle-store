import React, { useState } from 'react';
import { useAdminSuite } from '@/lib/admin-suite/AdminSuiteContext';
import { Send, Printer } from 'lucide-react';
import { OrderStatus } from '@/lib/admin-suite/types';
import { OrderManagementFilter } from './OrderManagementFilter';
import { OrderManagementMobileCards } from './OrderManagementMobileCards';

export const OrderManagement: React.FC = () => {
  const { orders, updateOrderStatus, formatRupiah, setSelectedInvoiceOrder } = useAdminSuite();

  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all');
  const [search, setSearch] = useState('');

  const filteredOrders = orders.filter((o) => {
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.city.toLowerCase().includes(search.toLowerCase()) ||
      o.paymentMethod.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending_payment':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            Menunggu Bayar
          </span>
        );
      case 'processing':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            Perlu Diproses
          </span>
        );
      case 'packing':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            Dikemas Gudang
          </span>
        );
      case 'shipped':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            Diserahkan Kurir
          </span>
        );
      case 'delivered':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            Selesai
          </span>
        );
      case 'cancelled':
        return (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            Dibatalkan
          </span>
        );
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5 w-full max-w-full">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            Manajemen Pesanan Toko Online
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Verifikasi pembayaran, konfirmasi pesanan, dan koordinasikan pengiriman dengan bagian gudang.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-mono">
            Total {orders.length} Pesanan Terdaftar
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <OrderManagementFilter
        orders={orders}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        search={search}
        setSearch={setSearch}
      />

      {/* Orders Container: Mobile Cards & Desktop Table */}
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        {/* Mobile View */}
        <OrderManagementMobileCards orders={filteredOrders} getStatusBadge={getStatusBadge} />

        {/* Desktop View: Table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">No. Pesanan & Waktu</th>
                <th className="px-4 py-3 font-semibold">Pelanggan & Tujuan</th>
                <th className="px-4 py-3 font-semibold">Produk Dipesan</th>
                <th className="px-4 py-3 font-semibold">Metode & Status Bayar</th>
                <th className="px-4 py-3 font-semibold text-right">Total Transaksi</th>
                <th className="px-4 py-3 font-semibold text-center">Status Alur</th>
                <th className="px-4 py-3 font-semibold text-right">Aksi Operasional</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                    Tidak ditemukan pesanan dengan kriteria filter ini.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-mono font-bold text-slate-900 dark:text-white">{o.orderNumber}</p>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono mt-0.5">{o.createdAt}</p>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">{o.courier}</p>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-900 dark:text-white">{o.customerName}</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{o.customerPhone}</p>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 truncate max-w-xs">
                        {o.shippingAddress}, {o.city}
                      </p>
                    </td>

                    <td className="px-4 py-3">
                      <div className="space-y-1 max-w-xs">
                        {o.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-[11px]">
                            <span className="font-semibold text-slate-800 dark:text-slate-200">{item.quantity}x</span>
                            <span className="text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <p className="font-semibold text-slate-800 dark:text-slate-200">{o.paymentMethod}</p>
                      <span
                        className={`inline-block text-[10px] font-semibold px-1.5 py-0.5 rounded mt-0.5 ${
                          o.paymentStatus === 'paid'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                            : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                        }`}
                      >
                        {o.paymentStatus === 'paid' ? 'LUNAS' : 'BELUM DIBAYAR'}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <p className="font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                        {formatRupiah(o.total)}
                      </p>
                      {o.discount > 0 && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                          Diskon -{formatRupiah(o.discount)}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      {getStatusBadge(o.status)}
                      {o.trackingNumber && (
                        <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">
                          Resi: {o.trackingNumber}
                        </p>
                      )}
                    </td>

                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {o.status === 'processing' && (
                          <button
                            onClick={() => updateOrderStatus(o.id, 'packing')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded text-[11px] shadow-xs flex items-center gap-1"
                            title="Konfirmasi & Teruskan ke Gudang untuk dipacking"
                          >
                            <Send className="w-3 h-3" />
                            Kirim ke Gudang
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedInvoiceOrder(o)}
                          className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded border border-slate-200 dark:border-slate-700 transition-colors"
                          title="Cetak Faktur / Invoice Pelanggan"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
