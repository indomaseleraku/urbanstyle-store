'use client';

// components/AuthModal.tsx
// Modal Autentikasi Pengguna & Keanggotaan Member Bergaya Uniqlo LifeWear

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import EmailOtpAuthForm from '@/components/auth/EmailOtpAuthForm';
import { X, Sparkles, Zap, ExternalLink } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginAsDemoMember } = useAuth();

  if (!isAuthModalOpen) return null;

  const handleQuickDemo = async () => {
    await loginAsDemoMember();
    setTimeout(() => closeAuthModal(), 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md bg-white border border-gray-200 shadow-2xl p-6 sm:p-7 animate-in fade-in zoom-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dual Red Box Logo */}
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-7 h-7 bg-[#E60012] flex items-center justify-center text-white font-black text-xs">US</div>
          <div className="w-7 h-7 bg-[#E60012] flex items-center justify-center text-white font-bold text-[9px] text-center leading-none">アーバン</div>
          <div>
            <h2 className="text-sm font-black tracking-tight text-black uppercase">UrbanStyle LifeWear</h2>
            <p className="text-[10px] text-gray-500 font-mono tracking-wider">PORTAL ANGGOTA RESMI</p>
          </div>
        </div>

        {/* Promo Voucher Banner */}
        <div className="mb-4 p-2.5 bg-red-50/80 border-l-4 border-[#E60012] text-xs text-gray-700">
          <div className="flex items-center space-x-1.5 font-bold text-[#E60012] uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kupon Sambutan Member Baru</span>
          </div>
          <p className="text-[11px] leading-relaxed">
            Daftar sekarang untuk diskon <span className="font-bold text-black">Rp 50.000</span> kode <span className="font-mono bg-white px-1 border border-red-200 text-[#E60012] font-black">URBANWELCOME50</span>.
          </p>
        </div>

        {/* Opsi A: Tombol Lanjutkan dengan Google */}
        <div className="mb-3.5">
          <GoogleSignInButton onSuccess={closeAuthModal} />
        </div>

        <div className="relative flex items-center justify-center mb-3.5">
          <div className="border-t border-gray-200 w-full" />
          <span className="bg-white px-2.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 shrink-0">
            ATAU DENGAN EMAIL + OTP 6 DIGIT
          </span>
          <div className="border-t border-gray-200 w-full" />
        </div>

        {/* Opsi B: Formulir Email + Verifikasi OTP 6 Digit */}
        <EmailOtpAuthForm onSuccess={closeAuthModal} />

        {/* 1-Click Quick Demo Login Simulator */}
        <div className="mt-3.5 pt-3 border-t border-gray-200 space-y-2">
          <p className="text-[10px] text-gray-500 font-mono text-center uppercase tracking-wider">
            Pengujian Cepat (Simulasi 1-Klik)
          </p>
          <button
            type="button"
            onClick={handleQuickDemo}
            className="w-full py-2 px-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-900 text-[11px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Zap size={13} className="text-amber-500 fill-amber-500" />
            <span>Masuk Cepat: Akun Demo Member</span>
          </button>

          <div className="flex items-center justify-between pt-1 text-[10px] text-gray-500">
            <Link href="/account/login" onClick={closeAuthModal} className="hover:text-black flex items-center gap-1 transition-colors">
              <span>Halaman Login Penuh</span>
              <ExternalLink size={10} />
            </Link>
            <Link href="/admin/login" onClick={closeAuthModal} className="hover:text-[#E60012] transition-colors">
              Portal Staf Admin →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
