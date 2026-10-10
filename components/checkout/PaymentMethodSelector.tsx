// components/checkout/PaymentMethodSelector.tsx
'use client';

import React from 'react';
import { QrCode, Building2 } from 'lucide-react';
import { BANK_ACCOUNTS } from '@/lib/types';

interface PaymentMethodSelectorProps {
  paymentMethod: 'QRIS' | 'Bank Transfer';
  onSelectPaymentMethod: (method: 'QRIS' | 'Bank Transfer') => void;
  selectedBank: keyof typeof BANK_ACCOUNTS;
  onSelectBank: (bank: keyof typeof BANK_ACCOUNTS) => void;
}

export default function PaymentMethodSelector({
  paymentMethod,
  onSelectPaymentMethod,
  selectedBank,
  onSelectBank,
}: PaymentMethodSelectorProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-black uppercase tracking-wider text-[#111111]">
        Metode Pembayaran
      </h4>

      <div className="grid grid-cols-2 gap-2.5">
        <button
          type="button"
          onClick={() => onSelectPaymentMethod('QRIS')}
          className={`p-3 text-left border rounded-none flex items-center gap-2.5 transition-all cursor-pointer ${
            paymentMethod === 'QRIS'
              ? 'border-[#111111] bg-zinc-50 font-bold ring-1 ring-[#111111]'
              : 'border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400'
          }`}
        >
          <QrCode size={18} className={paymentMethod === 'QRIS' ? 'text-[#E60012]' : 'text-zinc-500'} />
          <div>
            <p className="text-xs font-bold uppercase text-[#111111]">QRIS Dinamis</p>
            <p className="text-[10px] text-zinc-500">GoPay, OVO, Dana, BCA, dll</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectPaymentMethod('Bank Transfer')}
          className={`p-3 text-left border rounded-none flex items-center gap-2.5 transition-all cursor-pointer ${
            paymentMethod === 'Bank Transfer'
              ? 'border-[#111111] bg-zinc-50 font-bold ring-1 ring-[#111111]'
              : 'border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400'
          }`}
        >
          <Building2 size={18} className={paymentMethod === 'Bank Transfer' ? 'text-[#E60012]' : 'text-zinc-500'} />
          <div>
            <p className="text-xs font-bold uppercase text-[#111111]">Transfer Bank</p>
            <p className="text-[10px] text-zinc-500">BCA, Mandiri, BNI, BRI</p>
          </div>
        </button>
      </div>

      {paymentMethod === 'Bank Transfer' && (
        <div className="pt-2">
          <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">
            Pilih Bank Tujuan:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(Object.keys(BANK_ACCOUNTS) as Array<keyof typeof BANK_ACCOUNTS>).map((bankKey) => (
              <button
                key={bankKey}
                type="button"
                onClick={() => onSelectBank(bankKey)}
                className={`py-2 px-3 border text-xs font-bold uppercase rounded-none transition-all cursor-pointer text-center ${
                  selectedBank === bankKey
                    ? 'border-zinc-950 bg-zinc-950 text-white shadow-xs'
                    : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500'
                }`}
              >
                {bankKey}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
