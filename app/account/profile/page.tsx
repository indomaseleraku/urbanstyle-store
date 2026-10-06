'use client';

// app/account/profile/page.tsx
// Halaman Pengaturan Profil & Kartu Digital Member Barcode Uniqlo LifeWear

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { User, Phone, Mail, CheckCircle2, Ruler, Sparkles, QrCode } from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [preferredSize, setPreferredSize] = useState<'S' | 'M' | 'L' | 'XL'>(user?.preferred_size || 'L');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.full_name || '');
      setPhone(user.phone || '');
      if (user.preferred_size) setPreferredSize(user.preferred_size);
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      full_name: fullName,
      phone,
      preferred_size: preferredSize,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const memberIdSuffix = user?.id ? user.id.replace(/-/g, '').slice(0, 6).toUpperCase() : '8829';
  const fullMemberCode = `US-MEMBER-${memberIdSuffix}-2026`;

  // Visual Barcode Bars generator (Alternating widths pattern for high-fidelity Uniqlo barcode)
  const barcodePattern = [
    3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1, 3, 1, 2, 4, 3, 1, 2, 1, 4, 2, 3, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 3, 2, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2
  ];

  return (
    <div className="space-y-6">
      
      {/* ======================================================== */}
      {/* 1. DIGITAL MEMBERSHIP CARD (UNIQLO LIFEWEAR STYLE)       */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#0a0a0a] text-white border-2 border-zinc-900 p-5 sm:p-7 relative overflow-hidden shadow-xl rounded-none">
        
        {/* Decorative Watermark Katakana Background */}
        <div className="absolute -right-6 -bottom-6 text-zinc-800/40 font-black text-7xl select-none pointer-events-none tracking-widest font-mono">
          ライフウェア
        </div>

        <div className="relative z-10 space-y-5">
          {/* Top Bar: Dual Red Logo & Membership Level */}
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <div className="w-8 h-8 bg-[#E60012] text-white font-black text-sm flex items-center justify-center leading-none">
                  US
                </div>
                <div className="w-8 h-8 bg-[#E60012] text-white font-black text-[10px] flex items-center justify-center leading-none text-center">
                  ユニ
                </div>
              </div>
              <div>
                <p className="text-[11px] font-black tracking-widest uppercase text-white">
                  URBANSTYLE LIFEWEAR
                </p>
                <p className="text-[9px] text-zinc-400 font-mono tracking-wider">
                  MEMBER PASS // ID KEANGGOTAAN
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-white/10 border border-white/15 text-[10px] font-black uppercase tracking-widest text-[#E60012]">
              <Sparkles size={11} className="text-amber-400" />
              <span className="text-white">{user?.role === 'admin' ? 'ADMIN // VIP' : 'ACTIVE MEMBER'}</span>
            </div>
          </div>

          {/* Member Name & Points */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                NAMA ANGGOTA
              </p>
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wide text-white font-sans mt-0.5">
                {user?.full_name || 'KIMY EKA ARDIANSYAH'}
              </h2>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                POIN LIFEWEAR
              </p>
              <p className="text-base font-black font-mono text-amber-400">
                1.250 PTS
              </p>
            </div>
          </div>

          {/* Barcode Visual Module (High-Precision Simulation) */}
          <div className="bg-white p-3.5 sm:p-4 text-zinc-950 flex flex-col items-center justify-center space-y-2 border border-zinc-300 rounded-none shadow-inner">
            <div className="flex items-center justify-center gap-[2.5px] sm:gap-[3px] h-12 sm:h-14 w-full max-w-sm overflow-hidden py-1">
              {barcodePattern.map((w, idx) => (
                <div
                  key={idx}
                  className="bg-black h-full shrink-0"
                  style={{ width: `${w * 1.5}px` }}
                />
              ))}
            </div>
            <p className="font-mono text-xs sm:text-sm font-bold tracking-[0.25em] text-zinc-900 text-center uppercase">
              {fullMemberCode}
            </p>
          </div>

          {/* Micro Helper Text */}
          <p className="text-[10px] text-zinc-400 tracking-wide text-center sm:text-left flex items-center justify-center sm:justify-start gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#E60012] inline-block" />
            <span>Scan barcode ini saat bertransaksi di kasir atau gunakan untuk klaim kupon online eksklusif.</span>
          </p>

        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. FORM PROFIL & PREFERENSI UKURAN                        */}
      {/* ======================================================== */}
      <div className="bg-white border border-zinc-200 p-6 sm:p-8 space-y-6 rounded-none">
        <div>
          <h1 className="text-base sm:text-lg font-black uppercase tracking-tight text-zinc-950">
            Profil Member & Preferensi Busana
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Kelola informasi identitas akun keanggotaan Anda dan ukuran pakaian esensial LifeWear pilihan.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-xs font-semibold flex items-center gap-2 rounded-none">
            <CheckCircle2 size={16} />
            <span>Profil berhasil diperbarui dan tersimpan di database!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Nama Lengkap
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Contoh: Kimy Eka Ardiansyah"
                className="w-full pl-9 pr-3 py-2.5 border border-zinc-300 text-base md:text-xs focus:outline-none focus:border-black font-medium rounded-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Alamat Email (Akun Terdaftar)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full pl-9 pr-3 py-2.5 border border-zinc-200 bg-zinc-50 text-base md:text-xs text-zinc-500 cursor-not-allowed font-medium rounded-none"
              />
            </div>
            <span className="text-[10px] text-zinc-400 mt-1 block">Email tidak dapat diubah karena terikat ke ID Keanggotaan.</span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5">
              Nomor WhatsApp Aktif
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="081234567890"
                className="w-full pl-9 pr-3 py-2.5 border border-zinc-300 text-base md:text-xs focus:outline-none focus:border-black font-medium rounded-none"
              />
            </div>
          </div>

          {/* Preferensi Ukuran Pakaian LifeWear */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1.5 flex items-center gap-1.5">
              <Ruler size={14} />
              <span>Ukuran Pakaian Pilihan (Default Recommendation)</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['S', 'M', 'L', 'XL'] as const).map((sz) => (
                <button
                  type="button"
                  key={sz}
                  onClick={() => setPreferredSize(sz)}
                  className={`py-3 text-xs font-bold uppercase border transition-colors rounded-none min-h-[44px] ${
                    preferredSize === sz
                      ? 'bg-zinc-950 text-white border-zinc-950'
                      : 'border-zinc-300 text-zinc-700 hover:border-black bg-white'
                  }`}
                >
                  Ukuran {sz}
                </button>
              ))}
            </div>
            <span className="text-[10px] text-zinc-500 mt-1.5 block">
              Ukuran ini akan diprioritaskan otomatis saat Anda membuka halaman katalog dan detail produk.
            </span>
          </div>

          <div className="pt-4 border-t border-zinc-200">
            <button
              type="submit"
              className="px-6 py-3 bg-black hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider transition-colors rounded-none min-h-[44px]"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
