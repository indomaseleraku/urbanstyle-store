'use client';

// components/auth/EmailOtpAuthForm.tsx
// Formulir Login & Registrasi Manual dengan Verifikasi Sandi & OTP 6 Digit via Gmail

import React, { useState } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { validateUserPassword } from '@/lib/services/authStorageService';
import OtpVerificationStep from './OtpVerificationStep';
import ForgotPasswordForm from './ForgotPasswordForm';
import AuthInputFields from './AuthInputFields';

interface EmailOtpAuthFormProps {
  onSuccess: () => void;
  onTabChange?: (tab: 'login' | 'register') => void;
}

export default function EmailOtpAuthForm({ onSuccess, onTabChange }: EmailOtpAuthFormProps) {
  const { login, register, loginWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpToken, setOtpToken] = useState<string | null>(null);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const switchTab = (tab: 'login' | 'register') => {
    setActiveTab(tab);
    setErrorMsg('');
    setSuccessMsg('');
    setOtpToken(null);
    setIsForgotPassword(false);
    onTabChange?.(tab);
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanEmail.includes('@')) {
      return setErrorMsg('Masukkan alamat email yang valid.');
    }
    if (!cleanPass || cleanPass.length < 4) {
      return setErrorMsg('Kata sandi minimal 4 karakter.');
    }
    if (activeTab === 'register' && !fullName.trim()) {
      return setErrorMsg('Mohon lengkapi nama Anda.');
    }

    if (activeTab === 'login') {
      const passCheck = validateUserPassword(cleanEmail, cleanPass);
      if (!passCheck.valid) {
        return setErrorMsg(passCheck.message || 'Kata sandi tidak cocok.');
      }
    }

    setIsSendingOtp(true);
    try {
      const res = await fetch('/api/auth/otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'send',
          email: cleanEmail,
          purpose: activeTab,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.otpToken) {
        setErrorMsg(data.message || 'Gagal mengirim kode verifikasi.');
        setIsSendingOtp(false);
        return;
      }
      setOtpToken(data.otpToken);
    } catch {
      setErrorMsg('Gagal menghubungi layanan pengiriman email OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleOtpVerified = async () => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (activeTab === 'register') {
      const res = await register(cleanEmail, cleanPass, fullName.trim());
      if (res.success) {
        setSuccessMsg('Pendaftaran akun berhasil!');
        setTimeout(() => onSuccess(), 400);
      } else {
        setErrorMsg(res.message || 'Gagal mendaftar akun.');
      }
      return;
    }

    const res = await login(cleanEmail, cleanPass);
    if (res.success) {
      setSuccessMsg('Verifikasi berhasil! Mengalihkan ke akun Anda...');
      setTimeout(() => onSuccess(), 400);
      return;
    }

    const fallbackName = cleanEmail.split('@')[0].replace(/[._]/g, ' ').toUpperCase();
    await loginWithGoogle(cleanEmail, fallbackName);
    setSuccessMsg('Verifikasi berhasil! Mengalihkan ke akun Anda...');
    setTimeout(() => onSuccess(), 400);
  };

  if (isForgotPassword) {
    return (
      <ForgotPasswordForm
        onBackToLogin={() => setIsForgotPassword(false)}
        onSuccess={() => setSuccessMsg('Kata sandi berhasil diperbarui! Silakan masuk kembali.')}
      />
    );
  }

  if (otpToken) {
    return (
      <OtpVerificationStep
        email={email.trim().toLowerCase()}
        otpToken={otpToken}
        purpose={activeTab}
        onVerified={handleOtpVerified}
        onResendSuccess={(newToken) => setOtpToken(newToken)}
        onCancel={() => setOtpToken(null)}
      />
    );
  }

  return (
    <div className="space-y-3.5">
      <div className="flex border-b border-zinc-200">
        <button
          type="button"
          onClick={() => switchTab('login')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border-b-2 -mb-px cursor-pointer ${
            activeTab === 'login' ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-black'
          }`}
        >
          Masuk Akun
        </button>
        <button
          type="button"
          onClick={() => switchTab('register')}
          className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border-b-2 -mb-px cursor-pointer ${
            activeTab === 'register' ? 'border-black text-black' : 'border-transparent text-zinc-400 hover:text-black'
          }`}
        >
          Daftar Akun
        </button>
      </div>

      {errorMsg && <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">{errorMsg}</div>}
      {successMsg && (
        <div className="p-2 bg-green-50 border border-green-200 text-green-700 text-xs font-medium flex items-center gap-1.5">
          <CheckCircle2 size={15} className="text-green-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      <form onSubmit={handleRequestOtp} className="space-y-3">
        <AuthInputFields
          activeTab={activeTab}
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onForgotPassword={() => {
            setIsForgotPassword(true);
            setErrorMsg('');
            setSuccessMsg('');
          }}
        />

        <button
          type="submit"
          disabled={isSendingOtp}
          className="w-full py-2.5 bg-black hover:bg-zinc-800 text-white text-xs font-black uppercase tracking-wider transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isSendingOtp
            ? 'Memverifikasi...'
            : activeTab === 'login'
            ? 'Masuk'
            : 'Daftar Akun'}
        </button>
      </form>
    </div>
  );
}
