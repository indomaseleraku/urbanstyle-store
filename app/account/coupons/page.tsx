'use client';

// app/account/coupons/page.tsx
// Dompet Kupon Diskon Member UrbanStyle Store

import React, { useState, useEffect } from 'react';
import { dataStore } from '@/lib/store';
import { Coupon } from '@/lib/types';
import { Tag, Copy, Check, Sparkles } from 'lucide-react';

export default function MemberCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function loadCoupons() {
      const list = await dataStore.getCoupons();
      setCoupons(list);
    }
    loadCoupons();
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="bg-white border border-zinc-200 p-6 sm:p-8 space-y-6">
      <div>
        <h1 className="text-lg font-black uppercase tracking-tight text-zinc-950">
          Dompet Kupon & Promo Member
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Koleksi voucher potongan harga resmi. Salin kode kupon dan masukkan pada slide-over keranjang atau saat checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {coupons.map((c) => (
          <div
            key={c.id}
            className="border-2 border-dashed border-zinc-300 p-5 bg-zinc-50 hover:bg-white hover:border-[#E60012] transition-colors relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-black px-2.5 py-1 bg-black text-white tracking-wider">
                  {c.code}
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-red-100 text-[#E60012] px-2 py-0.5">
                  {c.type === 'fixed' 
                    ? `Potongan Rp ${new Intl.NumberFormat('id-ID').format(c.discount_amount)}`
                    : `Diskon ${c.discount_amount}%`
                  }
                </span>
              </div>
              <p className="text-xs font-bold text-zinc-950 mt-1">{c.description}</p>
              <p className="text-[11px] text-zinc-500">
                Minimal Belanja: Rp {new Intl.NumberFormat('id-ID').format(c.min_purchase)} • Sisa Kuota: {c.usage_limit - c.used_count} voucher
              </p>
            </div>

            <button
              onClick={() => handleCopy(c.code)}
              className="flex items-center gap-1.5 px-4 py-2 border border-zinc-300 hover:border-black bg-white text-xs font-bold uppercase tracking-wider text-zinc-900 transition-colors shrink-0"
            >
              {copiedCode === c.code ? (
                <>
                  <Check size={14} className="text-green-600" />
                  <span className="text-green-600">Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Salin Kode</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
