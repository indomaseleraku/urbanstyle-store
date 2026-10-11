// app/account/login/page.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

function MemberLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get('redirect') || '/account/profile';

  const { isAuthenticated, login, register, loginAsDemoMember } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace(redirectTarget);
  }, [isAuthenticated, redirectTarget, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email.trim() || !password.trim()) return setErrorMsg('Mohon isi alamat email dan kata sandi.');

    setIsSubmitting(true);
    if (activeTab === 'login') {
      const res = await login(email.trim(), password.trim());
      setIsSubmitting(false);
      if (res.success) {
        setSuccessMsg('Masuk akun berhasil!');
        setTimeout(() => router.push(redirectTarget), 500);
      } else setErrorMsg(res.message || 'Gagal masuk akun.');
    } else {
      if (!fullName.trim()) {
        setIsSubmitting(false);
        return setErrorMsg('Mohon lengkapi nama Anda.');
      }
      const res = await register(email.trim(), password.trim(), fullName.trim());
      setIsSubmitting(false);
      if (res.success) {
        setSuccessMsg('Pendaftaran berhasil!');
        setTimeout(() => router.push(redirectTarget), 700);
      } else setErrorMsg(res.message || 'Gagal mendaftar akun.');
    }
  };

  const handleQuickDemo = async () => {
    setErrorMsg('');
    setSuccessMsg('Masuk sebagai Akun Demo Member...');
    await loginAsDemoMember();
    setTimeout(() => router.push(redirectTarget), 400);
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

            <div className="flex border-b border-zinc-200">
              <button
                type="button"
                onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border-b-2 -mb-px cursor-pointer ${
                  activeTab === 'login' ? 'border-[#E60012] text-[#E60012]' : 'border-transparent text-zinc-400 hover:text-black'
                }`}
              >
                Masuk Akun
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border-b-2 -mb-px cursor-pointer ${
                  activeTab === 'register' ? 'border-[#E60012] text-[#E60012]' : 'border-transparent text-zinc-400 hover:text-black'
                }`}
              >
                Daftar Member
              </button>
            </div>

            {errorMsg && <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">{errorMsg}</div>}
            {successMsg && (
              <div className="p-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {activeTab === 'register' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">Nama Lengkap</label>
                  <div className="relative">
                    <User size={15} className="absolute left-3 top-2.5 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Contoh: Kimy Eka Ardiansyah"
                      className="w-full pl-9 pr-3 py-2 border border-zinc-300 text-xs focus:outline-hidden focus:border-black"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">Alamat Email</label>
                <div className="relative">
                  <Mail size={15} className="absolute left-3 top-2.5 text-zinc-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="w-full pl-9 pr-3 py-2 border border-zinc-300 text-xs focus:outline-hidden focus:border-black font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-700 mb-1">Kata Sandi</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-2.5 text-zinc-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-9 py-2 border border-zinc-300 text-xs focus:outline-hidden focus:border-black font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2 text-zinc-400 hover:text-black cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 bg-black hover:bg-[#E60012] text-white text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? 'Memproses...' : activeTab === 'login' ? 'Masuk ke Akun' : 'Daftar Sebagai Member'}
              </button>
            </form>

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
