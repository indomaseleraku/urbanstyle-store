// app/account/login/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import GoogleSignInButton from '@/components/auth/GoogleSignInButton';
import EmailOtpAuthForm from '@/components/auth/EmailOtpAuthForm';

function MemberLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/account/profile';

  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  useEffect(() => {
    if (isAuthenticated) router.replace(redirectTarget);
  }, [isAuthenticated, redirectTarget, router]);

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 font-sans flex flex-col justify-between">
      <header className="bg-white border-b border-zinc-200 px-4 sm:px-8 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-zinc-500 hover:text-black flex items-center gap-1.5 text-xs font-semibold tracking-wide transition-colors"
        >
          <ArrowLeft size={15} /> <span>Kembali ke Beranda</span>
        </Link>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-black flex items-center justify-center text-white font-black text-xs">
            US
          </div>
          <span className="font-black text-sm uppercase tracking-tight text-zinc-900">
            UrbanStyle LifeWear
          </span>
        </div>
        <Link
          href="/admin/login"
          className="text-zinc-400 hover:text-black text-xs font-mono hidden sm:inline transition-colors"
        >
          Portal Staf →
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-8">
        <div className="w-full max-w-md bg-white border border-zinc-200 shadow-sm relative">
          <div className="p-6 sm:p-8 space-y-5">
            <div>
              <p className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase font-bold">
                AKUN PELANGGAN
              </p>
              <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-zinc-950 mt-1">
                {activeTab === 'login' ? 'Masuk ke Akun Anda' : 'Daftar Akun Baru'}
              </h1>
            </div>

            {/* Opsi A: Login dengan Google OAuth 2.0 */}
            <GoogleSignInButton onSuccess={() => router.push(redirectTarget)} />

            <div className="relative flex items-center justify-center">
              <div className="border-t border-zinc-200 w-full" />
              <span className="bg-white px-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400 shrink-0">
                ATAU DENGAN EMAIL & OTP
              </span>
              <div className="border-t border-zinc-200 w-full" />
            </div>

            {/* Opsi B: Login / Daftar Manual dengan Verifikasi OTP 6 Digit via Gmail */}
            <EmailOtpAuthForm
              onSuccess={() => router.push(redirectTarget)}
              onTabChange={(tab) => setActiveTab(tab)}
            />
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
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center text-xs font-mono text-zinc-500">
          Memuat...
        </div>
      }
    >
      <MemberLoginForm />
    </Suspense>
  );
}
