// components/checkout/OrderSuccessView.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Check, Printer, ArrowRight, Truck } from 'lucide-react';
import { Order, BANK_ACCOUNTS } from '@/lib/types';
import { DynamicQRISCard } from '../DynamicQRISCard';
import { RealtimePaymentStatus } from '../RealtimePaymentStatus';

interface OrderSuccessViewProps {
  order: Order;
  onClose: () => void;
}

export default function OrderSuccessView({ order, onClose }: OrderSuccessViewProps) {
  const [copiedRekening, setCopiedRekening] = useState(false);
  const [copiedNominal, setCopiedNominal] = useState(false);
  const selectedBank = order.bank_name ? BANK_ACCOUNTS[order.bank_name] : BANK_ACCOUNTS['BCA'];

  const copyText = (text: string, type: 'rekening' | 'nominal') => {
    navigator.clipboard.writeText(text);
    if (type === 'rekening') {
      setCopiedRekening(true);
      setTimeout(() => setCopiedRekening(false), 2000);
    } else {
      setCopiedNominal(true);
      setTimeout(() => setCopiedNominal(false), 2000);
    }
  };

  return (
    <div className="space-y-6 text-center py-2">
      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto rounded-none">
        <CheckCircle2 size={28} />
      </div>

      <div>
        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 font-mono">
          // TRANSAKSI BERHASIL DIBUAT
        </span>
        <h3 className="text-lg font-black uppercase text-[#111111]">
          Pesanan #{order.order_number}
        </h3>
        <p className="text-xs text-zinc-500 mt-1">
          Terima kasih, {order.customer_name}. Silakan selesaikan pembayaran.
        </p>
      </div>

      {/* QRIS Dynamic Option */}
      {order.payment_method === 'QRIS' && (
        <div className="max-w-xs mx-auto space-y-4">
          <DynamicQRISCard
            amount={order.total_amount}
            orderNumber={order.order_number}
            merchantName="UrbanStyle Official"
          />
          <RealtimePaymentStatus orderNumber={order.order_number} />
        </div>
      )}

      {/* Bank Transfer Option */}
      {order.payment_method === 'Bank Transfer' && selectedBank && (
        <div className="max-w-sm mx-auto p-4 bg-zinc-50 border border-zinc-200 text-left space-y-3 rounded-none">
          <div className="flex justify-between items-center pb-2 border-b border-zinc-200">
            <span className="text-xs font-bold uppercase text-zinc-800">
              Transfer Bank {order.bank_name}
            </span>
            <span className="text-[10px] text-zinc-500 font-mono">a.n {selectedBank.holderName}</span>
          </div>

          <div>
            <span className="text-[10px] text-zinc-500 font-bold uppercase block">Nomor Rekening:</span>
            <div className="flex items-center justify-between pt-1">
              <span className="font-mono font-black text-sm text-[#111111] tabular-nums">
                {selectedBank.accountNumber}
              </span>
              <button
                type="button"
                onClick={() => copyText(selectedBank.accountNumber, 'rekening')}
                className="text-[11px] font-bold text-[#E60012] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedRekening ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedRekening ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-zinc-200">
            <span className="text-[10px] text-zinc-500 font-bold uppercase block">
              Total Transfer (Termasuk Kode Unik):
            </span>
            <div className="flex items-center justify-between pt-1">
              <span className="font-mono font-black text-base text-[#E60012] tabular-nums">
                Rp {order.total_amount.toLocaleString('id-ID')}
              </span>
              <button
                type="button"
                onClick={() => copyText(order.total_amount.toString(), 'nominal')}
                className="text-[11px] font-bold text-[#E60012] hover:underline flex items-center gap-1 cursor-pointer"
              >
                {copiedNominal ? <Check size={12} /> : <Copy size={12} />}
                <span>{copiedNominal ? 'Tersalin' : 'Salin'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Links */}
      <div className="flex flex-col sm:flex-row gap-2 pt-2">
        <Link
          href={`/invoice/${order.order_number}`}
          className="flex-1 py-3 bg-[#111111] hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider rounded-none flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Printer size={14} />
          <span>Lihat Faktur & Struk</span>
        </Link>
        <Link
          href={`/track/${order.order_number}`}
          className="flex-1 py-3 border border-zinc-300 hover:border-zinc-950 text-zinc-800 text-xs font-bold uppercase tracking-wider rounded-none flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <Truck size={14} />
          <span>Lacak Pengiriman</span>
        </Link>
      </div>

      <motion.button
        whileTap={{ scale: 0.96 }}
        type="button"
        onClick={onClose}
        className="w-full py-2.5 text-xs text-zinc-500 hover:text-zinc-950 font-bold uppercase tracking-wider cursor-pointer"
      >
        Tutup & Kembali Belanja
      </motion.button>
    </div>
  );
}
