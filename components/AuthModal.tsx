'use client';

// components/AuthModal.tsx
// Modal Autentikasi Pengguna & Keanggotaan Member Bergaya Uniqlo LifeWear

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { X, User, Lock, Mail, Sparkles, CheckCircle2, Eye, EyeOff, Zap, ExternalLink } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, login, register, loginAsDemoMember } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    if (!email || !password) return setErrorMsg('Mohon isi alamat email dan kata sandi.');

    setIsSubmitting(true);
    if (activeTab === 'login') {
      const res = await login(email, password);
      setIsSubmitting(false);
      if (res.success) {
        setSuccessMsg('Masuk akun berhasil!');
        setTimeout(() => closeAuthModal(), 500);
      } else setErrorMsg(res.message || 'Gagal masuk akun.');
    } else {
      if (!fullName) {
        setIsSubmitting(false);
        return setErrorMsg('Mohon lengkapi nama Anda.');
      }
      const res = await register(email, password, fullName);
      setIsSubmitting(false);
      if (res.success) {
        setSuccessMsg('Pendaftaran berhasil! Selamat datang di UrbanStyle Member.');
        setTimeout(() => closeAuthModal(), 700);
      } else setErrorMsg(res.message || 'Gagal mendaftar akun.');
    }
  };

  const handleQuickDemo = async () => {
    setErrorMsg('');
    setSuccessMsg('Masuk sebagai Akun Demo Member...');
    await loginAsDemoMember();
    setTimeout(() => { setSuccessMsg(''); closeAuthModal(); }, 400);
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

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 mb-4">
          <button
            type="button"
            onClick={() => { setActiveTab('login'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px cursor-pointer ${
              activeTab === 'login' ? 'border-[#E60012] text-[#E60012]' : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Masuk Akun
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setErrorMsg(''); setSuccessMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px cursor-pointer ${
              activeTab === 'register' ? 'border-[#E60012] text-[#E60012]' : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Daftar Member
          </button>
        </div>

        {errorMsg && <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">{errorMsg}</div>}
        {successMsg && (
          <div className="mb-3 p-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium flex items-center space-x-1.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-green-600" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {activeTab === 'register' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">Nama Lengkap</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Kimy Eka Ardiansyah"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 text-xs focus:outline-hidden focus:border-black"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">Alamat Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 text-xs focus:outline-hidden focus:border-black font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-9 py-2 border border-gray-300 text-xs focus:outline-hidden focus:border-black font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 top-2 text-gray-400 hover:text-black cursor-pointer"
                title={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-black hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider transition-colors duration-150 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Memproses...' : activeTab === 'login' ? 'Masuk ke Akun' : 'Daftar Sebagai Member'}
          </button>
        </form>

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
