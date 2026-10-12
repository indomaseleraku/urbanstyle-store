// app/account/login/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Sparkles, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import EmailOtpAuthForm from '@/components/auth/EmailOtpAuthForm';

function MemberLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/account/profile';

  const { isAuthenticated, loginAsDemoMember } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (isAuthenticated) router.replace(redirectTarget);
  }, [isAuthenticated, redirectTarget, router]);

  const handleQuickDemo = async () => {
    await loginAsDemoMember();
    setTimeout(() => router.push(redirectTarget), 300);
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col justify-between">
      <header className="bg-white border-b border-zinc-200 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <Link href="/" className="text-zinc-500 hover:text-black flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider">
          <ArrowLeft size={15} /> <span>Ke Etalase Toko</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#E60012] flex items-center justify-center text-white font-black text-xs">US</div>
          <div className="w-7 h-7 bg-[#E60012] flex items-center justify-center text-white font-bold text-[9px] text-center leading-none">アーバン</div>
          <span className="font-black text-sm uppercase tracking-tight ml-1">UrbanStyle LifeWear</span>
        </div>
        <Link href="/admin/login" className="text-zinc-400 hover:text-[#E60012] text-xs font-mono hidden sm:inline">
          Portal Staf →
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-white border border-zinc-200 shadow-xl relative overflow-hidden">
          <div className="h-1 bg-[#E60012]" />
          <div className="p-6 sm:p-8 space-y-4">
            <div>
              <p className="text-[10px] font-mono tracking-widest text-[#E60012] uppercase font-bold">PORTAL MEMBER</p>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-950 mt-1">
                {activeTab === 'login' ? 'Masuk ke Akun Anda' : 'Daftar Member Baru'}
              </h1>
            </div>

            <div className="p-2.5 bg-red-50/80 border-l-4 border-[#E60012] text-xs text-zinc-700">
              <div className="flex items-center gap-1 font-bold text-[#E60012] uppercase tracking-wider mb-0.5">
                <Sparkles size={13} /> <span>Voucher Member Baru</span>
              </div>
              <p className="text-[11px]">
                Kode <span className="font-mono font-bold bg-white px-1 border border-red-200 text-[#E60012]">URBANWELCOME50</span> diskon Rp 50.000 belanja pertama.
              </p>
            </div>

            {/* Opsi A: Login dengan Google OAuth 2.0 */}
            <GoogleSignInButton onSuccess={() => router.push(redirectTarget)} />

            <div className="relative flex items-center justify-center">
              <div className="border-t border-zinc-200 w-full" />
              <span className="bg-white px-2.5 text-[10px] font-bold uppercase tracking-widest text-zinc-400 shrink-0">
                ATAU DENGAN EMAIL + OTP 6 DIGIT
              </span>
              <div className="border-t border-zinc-200 w-full" />
            </div>

            {/* Opsi B: Login / Daftar Manual dengan Verifikasi OTP 6 Digit via Gmail */}
            <EmailOtpAuthForm
              onSuccess={() => router.push(redirectTarget)}
              onTabChange={(tab) => setActiveTab(tab)}
            />

            <div className="pt-3 border-t border-zinc-200 space-y-2">
              <p className="text-[10px] text-zinc-400 font-mono text-center uppercase tracking-wider">Simulasi Sekali Klik</p>
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full py-2 px-3 bg-zinc-100 hover:bg-zinc-200 border border-zinc-300 text-zinc-900 text-[11px] font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap size={13} className="text-amber-500 fill-amber-500" />
                <span>Masuk Cepat: Akun Demo Member</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 bg-white px-4 py-3 text-center text-[10px] font-mono text-zinc-500">
        UrbanStyle LifeWear Tokyo • Hak Cipta © 2026. All rights reserved.
      </footer>
    </div>
  );
}

export default function MemberLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50 flex items-center justify-center text-xs font-mono text-zinc-500">Memuat...</div>}>
      <MemberLoginForm />
    </Suspense>
  );
}
