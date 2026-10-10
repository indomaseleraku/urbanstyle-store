// components/checkout/CouponInput.tsx
'use client';

import React from 'react';
import { Tag, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface CouponInputProps {
  couponCode: string;
  onChangeCouponCode: (code: string) => void;
  appliedCoupon: string | null;
  discountAmount: number;
  couponMsg: { text: string; isError: boolean } | null;
  isValidating: boolean;
  onApplyCoupon: () => void;
}

export default function CouponInput({
  couponCode,
  onChangeCouponCode,
  appliedCoupon,
  discountAmount,
  couponMsg,
  isValidating,
  onApplyCoupon,
}: CouponInputProps) {
  return (
    <div className="space-y-2 pt-2 border-t border-[#E5E5E5]">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
          <Tag size={12} className="text-[#E60012]" />
          <span>Kupon / Voucher Diskon</span>
        </label>
        <span className="text-[10px] text-zinc-400 font-mono">
          Coba: URBANWELCOME50
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={couponCode}
          onChange={(e) => onChangeCouponCode(e.target.value.toUpperCase())}
          placeholder="KODE KUPON"
          className="flex-1 p-2 text-xs border border-zinc-300 font-mono uppercase rounded-none focus:outline-none focus:border-zinc-950"
        />
        <motion.button
          whileTap={{ scale: 0.96 }}
          type="button"
          disabled={!couponCode.trim() || isValidating}
          onClick={onApplyCoupon}
          className="px-4 py-2 bg-zinc-900 hover:bg-[#E60012] disabled:bg-zinc-300 text-white text-xs font-bold uppercase tracking-wider rounded-none transition-colors cursor-pointer"
        >
          {isValidating ? 'Cek...' : 'Terapkan'}
        </motion.button>
      </div>

      {couponMsg && (
        <p
          className={`text-[11px] font-medium flex items-center gap-1 ${
            couponMsg.isError ? 'text-[#E60012]' : 'text-emerald-600'
          }`}
        >
          {!couponMsg.isError && <Check size={12} />}
          <span>{couponMsg.text}</span>
        </p>
      )}

      {appliedCoupon && discountAmount > 0 && (
        <div className="p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex justify-between items-center rounded-none font-medium">
          <span>Kupon {appliedCoupon} Aktif</span>
          <span className="font-mono font-bold tabular-nums">
            -Rp {discountAmount.toLocaleString('id-ID')}
          </span>
        </div>
      )}
    </div>
  );
}
