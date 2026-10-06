'use client';

// components/AuthModal.tsx
// Modal Autentikasi Pengguna & Keanggotaan Member Bergaya Uniqlo LifeWear

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { X, User, Lock, Mail, Sparkles, CheckCircle2 } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    closeAuthModal, 
    login, 
    register, 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email || !password) {
      setErrorMsg('Mohon isi email dan kata sandi.');
      return;
    }

    if (activeTab === 'login') {
      const res = await login(email, password);
      if (res.success) {
        closeAuthModal();
      } else {
        setErrorMsg(res.message || 'Gagal masuk akun.');
      }
    } else {
      if (!fullName) {
        setErrorMsg('Mohon lengkapi nama Anda.');
        return;
      }
      const res = await register(email, password, fullName);
      if (res.success) {
        setSuccessMsg('Pendaftaran berhasil! Selamat datang di UrbanStyle Member.');
        setTimeout(() => closeAuthModal(), 1000);
      } else {
        setErrorMsg(res.message || 'Gagal mendaftar akun.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="relative w-full max-w-md bg-white border border-gray-200 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Tombol Tutup */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Logo Uniqlo Dual Box */}
        <div className="flex items-center space-x-2 mb-6">
          <div className="w-8 h-8 bg-[#E60012] flex items-center justify-center text-white font-bold text-xs tracking-wider">
            US
          </div>
          <div className="w-8 h-8 bg-[#E60012] flex items-center justify-center text-white font-bold text-[10px] leading-tight text-center">
            アーバン
          </div>
          <div>
            <h2 className="text-base font-bold tracking-tight text-black uppercase">
              UrbanStyle LifeWear
            </h2>
            <p className="text-[11px] text-gray-500 font-mono">PORTAL ANGGOTA RESMI</p>
          </div>
        </div>

        {/* Promo Voucher Banner */}
        <div className="mb-6 p-3 bg-red-50 border-l-4 border-[#E60012] text-xs text-gray-700">
          <div className="flex items-center space-x-1.5 font-bold text-[#E60012] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kupon Sambutan Member Baru</span>
          </div>
          <p>
            Daftar sekarang dan nikmati potongan belanja <span className="font-semibold text-black">Rp 50.000</span> dengan kode kupon <span className="font-mono bg-white px-1 py-0.5 border border-red-200 text-[#E60012] font-bold">URBANWELCOME50</span>.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => { setActiveTab('login'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              activeTab === 'login'
                ? 'border-[#E60012] text-[#E60012]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Masuk Akun
          </button>
          <button
            onClick={() => { setActiveTab('register'); setErrorMsg(''); }}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider transition-colors border-b-2 -mb-px ${
              activeTab === 'register'
                ? 'border-[#E60012] text-[#E60012]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            Daftar Member
          </button>
        </div>

        {/* Feedback Pesan */}
        {errorMsg && (
          <div className="mb-4 p-2.5 bg-red-100 border border-red-200 text-red-700 text-xs font-medium">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-2.5 bg-green-100 border border-green-200 text-green-700 text-xs font-medium flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form Input */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'register' && (
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Contoh: Kimy Eka Ardiansyah"
                  className="w-full pl-9 pr-3 py-2 border border-gray-300 text-xs focus:outline-hidden focus:border-black"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 text-xs focus:outline-hidden focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 border border-gray-300 text-xs focus:outline-hidden focus:border-black"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-black hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider transition-colors duration-150"
          >
            {activeTab === 'login' ? 'Masuk ke Akun' : 'Daftar Sebagai Member'}
          </button>
        </form>
      </div>
    </div>
  );
};
