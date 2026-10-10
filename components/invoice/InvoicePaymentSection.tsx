// components/invoice/InvoicePaymentSection.tsx
import React from 'react';
import Link from 'next/link';
import { CheckCircle2, Truck, AlertCircle } from 'lucide-react';
import { Order, BANK_ACCOUNTS } from '@/lib/types';
import { DynamicQRISCard } from '@/components/DynamicQRISCard';
import { RealtimePaymentStatus } from '@/components/RealtimePaymentStatus';
import { CopyButton, InvoicePaymentButton } from '@/components/InvoiceActions';

interface InvoicePaymentSectionProps {
  order: Order;
  subtotal: number;
}

export default function InvoicePaymentSection({ order, subtotal }: InvoicePaymentSectionProps) {
  const selectedBank = order.bank_name ? BANK_ACCOUNTS[order.bank_name] : BANK_ACCOUNTS['BCA'];
  const isPaid = order.status === 'Dibayar' || order.status === 'Selesai' || order.status === 'Dikemas' || order.status === 'Dikirim';

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-200 items-start">
      {isPaid ? (
        <div className="p-5 border-2 border-emerald-600 bg-emerald-50/60 text-left space-y-4 rounded-none">
          <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={20} className="text-emerald-700" />
              <span className="text-xs font-black uppercase text-emerald-900 tracking-wider">
                Bukti Pembayaran Sah (Lunas)
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 uppercase rounded-none">
              {order.status}
            </span>
          </div>

          <div className="p-3.5 bg-white border border-emerald-200 space-y-2 text-xs rounded-none">
            <div className="flex justify-between text-zinc-600">
              <span>Metode Pembayaran:</span>
              <span className="font-bold text-zinc-950 font-mono">
                {order.payment_method}{order.bank_name ? ` (${order.bank_name})` : ''}
              </span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Total Terverifikasi:</span>
              <span className="font-black text-emerald-700 font-mono tabular-nums">
                Rp {Number(order.total_amount).toLocaleString('id-ID')}
              </span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Verifikasi Sistem:</span>
              <span className="font-semibold text-emerald-700">Otomatis / Real-Time TPS</span>
            </div>
          </div>

          <Link
            href={`/track/${order.order_number}`}
            className="w-full py-2.5 bg-zinc-950 hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors rounded-none"
          >
            <Truck size={14} />
            <span>Lacak Pengiriman Pesanan</span>
          </Link>
        </div>
      ) : order.payment_method === 'Bank Transfer' ? (
        <div className="p-4 border border-zinc-200 bg-zinc-50/70 text-left space-y-3 rounded-none">
          <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
            <span className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
              Instruksi Transfer Bank Manual
            </span>
            <span className="text-[10px] font-bold text-[#E60012] uppercase font-mono">
              Bank {order.bank_name || 'BCA'}
            </span>
          </div>
          <div className="p-3 bg-white border border-zinc-200 space-y-3 rounded-none">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] text-zinc-500 font-semibold uppercase">Nomor Rekening Tujuan</p>
                <p className="font-mono font-black text-sm tracking-wider text-zinc-900 tabular-nums">
                  {selectedBank?.accountNumber || '8830192844'}
                </p>
                <p className="text-[10px] text-zinc-500 font-bold">
                  a/n {selectedBank?.holderName || 'KIMY EKA ARDIANSYAH / URBANSTYLE'}
                </p>
              </div>
              <CopyButton textToCopy={selectedBank?.accountNumber || '8830192844'} label="Salin No. Rek" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-zinc-200">
              <div>
                <p className="text-[10px] text-zinc-500 font-semibold uppercase">Nominal Tepat Transfer</p>
                <p className="font-mono font-black text-base text-[#E60012] tabular-nums">
                  Rp {order.total_amount.toLocaleString('id-ID')}
                </p>
              </div>
              <CopyButton textToCopy={order.total_amount.toString()} label="Salin Nominal" />
            </div>
          </div>
          <InvoicePaymentButton orderNumber={order.order_number} currentStatus={order.status} />
        </div>
      ) : (
        <div className="space-y-4">
          <DynamicQRISCard amount={order.total_amount} orderNumber={order.order_number} merchantName="UrbanStyle Official" />
          <RealtimePaymentStatus orderNumber={order.order_number} />
        </div>
      )}

      {/* Financial Summary */}
      <div className="p-5 border border-zinc-200 bg-zinc-50/70 text-xs space-y-2.5 rounded-none">
        <h3 className="font-black uppercase text-zinc-800 tracking-wider pb-2 border-b border-zinc-200">
          Ringkasan Finansial:
        </h3>
        <div className="flex justify-between text-zinc-600">
          <span>Subtotal Item Busana:</span>
          <span className="font-mono font-bold text-zinc-950 tabular-nums">Rp {subtotal.toLocaleString('id-ID')}</span>
        </div>
        {order.discount_amount && order.discount_amount > 0 ? (
          <div className="flex justify-between text-[#E60012] font-semibold">
            <span>Diskon Kupon Promo:</span>
            <span className="font-mono tabular-nums">-Rp {order.discount_amount.toLocaleString('id-ID')}</span>
          </div>
        ) : null}
        <div className="flex justify-between text-zinc-600">
          <span>Biaya Pengiriman Ekspedisi:</span>
          <span className="font-mono font-bold text-zinc-950 tabular-nums">
            {order.shipping_cost === 0 ? 'GRATIS' : `Rp ${order.shipping_cost.toLocaleString('id-ID')}`}
          </span>
        </div>
        {order.unique_code && order.unique_code > 0 ? (
          <div className="flex justify-between text-zinc-600">
            <span>Kode Unik Verifikasi:</span>
            <span className="font-mono font-bold text-zinc-950 tabular-nums">+{order.unique_code}</span>
          </div>
        ) : null}
        <div className="flex justify-between text-base font-black text-zinc-950 pt-2.5 border-t border-zinc-300">
          <span className="uppercase">Total Akhir:</span>
          <span className="text-[#E60012] font-mono tabular-nums">Rp {order.total_amount.toLocaleString('id-ID')}</span>
        </div>
      </div>
    </div>
  );
}
