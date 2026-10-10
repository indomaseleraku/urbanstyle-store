// components/footer/FooterNewsletter.tsx
'use client';

import React, { useState } from 'react';
import { Sparkles, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FooterNewsletter() {
  const [emailInput, setEmailInput] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) return;
    setNewsletterSubscribed(true);
  };

  const copyCouponCode = () => {
    navigator.clipboard.writeText('URBANWELCOME50');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  return (
    <div className="border-b border-zinc-800 bg-[#18181B] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#E60012] text-white text-[9px] font-black uppercase tracking-widest rounded-none">
            <Sparkles size={11} />
            <span>VOUCHER SAMBUTAN MEMBER</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
            Dapatkan Diskon Rp 50.000 untuk Pesanan Pertama
          </h3>
          <p className="text-xs text-zinc-400 max-w-lg">
            Daftarkan email Anda untuk buletin LifeWear dan gunakan kode voucher{' '}
            <strong className="text-white font-mono">URBANWELCOME50</strong> saat checkout.
          </p>
        </div>

        <div className="w-full md:w-auto min-w-[280px] sm:min-w-[360px]">
          {newsletterSubscribed ? (
            <div className="p-3 bg-zinc-900 border border-zinc-700 flex items-center justify-between gap-3 text-xs rounded-none">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <Check size={16} />
                <span>Kupon Aktif: <strong>URBANWELCOME50</strong></span>
              </div>
              <button
                type="button"
                onClick={copyCouponCode}
                className="px-3 py-1 bg-[#E60012] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-red-700 transition-colors rounded-none cursor-pointer"
              >
                {copiedCoupon ? 'Tersalin!' : 'Salin Kode'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex gap-0">
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="Alamat email Anda..."
                className="flex-1 px-4 py-3 bg-zinc-900 border border-zinc-700 text-white placeholder-zinc-500 text-xs focus:outline-none focus:border-[#E60012] rounded-none"
              />
              <motion.button
                whileTap={{ scale: 0.96 }}
                type="submit"
                className="px-6 py-3 bg-[#E60012] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none shrink-0 cursor-pointer"
              >
                Daftar
              </motion.button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
