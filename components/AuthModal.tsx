'use client';

// components/AuthModal.tsx
// Modal Autentikasi Pengguna & Keanggotaan Member Bersih & Minimalis

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import EmailOtpAuthForm from '@/components/auth/EmailOtpAuthForm';
import { X, ExternalLink } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal } = useAuth();

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="relative w-full max-w-md bg-white border border-zinc-200 shadow-2xl p-6 sm:p-7 animate-in fade-in zoom-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-zinc-400 hover:text-black transition-colors cursor-pointer"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Minimalist Logo Header */}
        <div className="flex items-center space-x-2.5 mb-5">
          <div className="w-7 h-7 bg-black flex items-center justify-center text-white font-black text-xs">
            US
          </div>
          <div>
            <h2 className="text-sm font-black tracking-tight text-zinc-950 uppercase">
              UrbanStyle LifeWear
            </h2>
            <p className="text-[10px] text-zinc-400 font-mono tracking-wider">
              PORTAL AKUN RESMI
            </p>
          </div>
        </div>

        {/* Opsi A: Tombol Lanjutkan dengan Google */}
        <div className="mb-4">
          <GoogleSignInButton onSuccess={closeAuthModal} />
        </div>

        <div className="relative flex items-center justify-center mb-4">
          <div className="border-t border-zinc-200 w-full" />
          <span className="bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 shrink-0">
            ATAU DENGAN EMAIL & OTP
          </span>
          <div className="border-t border-zinc-200 w-full" />
        </div>

        {/* Opsi B: Formulir Email + Verifikasi OTP 6 Digit */}
        <EmailOtpAuthForm onSuccess={closeAuthModal} />

        <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
          <Link
            href="/account/login"
            onClick={closeAuthModal}
            className="hover:text-black flex items-center gap-1 transition-colors font-medium"
          >
            <span>Halaman Penuh</span>
            <ExternalLink size={11} />
          </Link>
          <Link
            href="/admin/login"
            onClick={closeAuthModal}
            className="hover:text-black transition-colors font-mono text-[10px]"
          >
            Portal Staf →
          </Link>
        </div>
      </div>
    </div>
  );
};
