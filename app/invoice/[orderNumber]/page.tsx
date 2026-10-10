// app/invoice/[orderNumber]/page.tsx
import React from 'react';
import Link from 'next/link';
import { dataStore } from '@/lib/store';
import { ArrowLeft, CheckCircle2, Truck } from 'lucide-react';
import { InvoicePrintButton } from '@/components/InvoiceActions';
import InvoiceItemsTable from '@/components/invoice/InvoiceItemsTable';
import InvoicePaymentSection from '@/components/invoice/InvoicePaymentSection';

export default async function InvoicePage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const resolvedParams = await params;
  const orderNumber = resolvedParams.orderNumber;
  const order = await dataStore.getOrderByNumber(orderNumber);

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 border border-zinc-300 max-w-md w-full text-center space-y-4 rounded-none">
          <p className="text-xs uppercase font-bold tracking-widest text-[#E60012]">Faktur Tidak Ditemukan</p>
          <h1 className="text-lg font-black uppercase text-zinc-900">Pesanan #{orderNumber} Belum Terdaftar</h1>
          <p className="text-xs text-zinc-600">Silakan kembali ke katalog untuk membuat pesanan baru.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E60012] transition-colors rounded-none"
          >
            <ArrowLeft size={14} /> Kembali ke Toko
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((s, it) => s + it.price * it.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 py-6 px-3 sm:px-6 selection:bg-[#E60012] selection:text-white font-sans">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between no-print">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft size={16} /> Kembali ke Katalog
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/track/${order.order_number}`}
              className="text-xs font-bold uppercase tracking-wider bg-zinc-950 hover:bg-[#E60012] text-white flex items-center gap-1.5 px-3 py-1.5 transition-colors shadow-xs rounded-none"
            >
              <Truck size={14} />
              <span>Lacak Pengiriman 🚚</span>
            </Link>
            <InvoicePrintButton />
          </div>
        </div>

        {/* Invoice Card */}
        <div className="bg-white border border-zinc-300 shadow-md p-6 sm:p-10 space-y-8 rounded-none">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#E60012] text-white flex flex-col items-center justify-center font-black tracking-tighter leading-none shrink-0 shadow-xs rounded-none">
                <span className="text-xs">US</span>
                <span className="text-[10px]">TOKYO</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-zinc-950">
                  UrbanStyle Store
                </h1>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest font-mono">
                  LifeWear Essentials • Modul Transaksi (TPS)
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-wider rounded-none">
                <CheckCircle2 size={14} />
                <span>Status: {order.status}</span>
              </div>
              <p className="text-xs font-mono font-bold text-zinc-700 mt-1 tabular-nums">
                No: {order.order_number}
              </p>
              <p className="text-[11px] text-zinc-400">
                {new Date(order.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-zinc-50 border border-zinc-200 text-xs rounded-none">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Data Pemesan:</p>
              <p className="font-bold text-sm text-zinc-900">{order.customer_name}</p>
              <p className="text-zinc-600 font-mono">{order.customer_phone}</p>
              <p className="text-zinc-600 leading-relaxed pt-1">{order.customer_address}</p>
            </div>
            <div className="space-y-1 sm:border-l sm:border-zinc-200 sm:pl-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Ekspedisi & Pembayaran:</p>
              <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                <Truck size={14} className="text-[#E60012]" />
                <span>{order.shipping_courier}</span>
              </div>
              <p className="text-zinc-700 font-medium pt-1">
                Metode: {order.payment_method}{order.bank_name ? ` (${order.bank_name})` : ''}
              </p>
              <p className="text-[11px] text-zinc-500 pt-1 font-mono">
                // Verifikasi Transaksi Real-Time TPS
              </p>
            </div>
          </div>

          {/* Items Table */}
          <InvoiceItemsTable items={order.items} />

          {/* QRIS / Bank Transfer Display and Financial Total */}
          <InvoicePaymentSection order={order} subtotal={subtotal} />
        </div>
      </div>
    </div>
  );
}
