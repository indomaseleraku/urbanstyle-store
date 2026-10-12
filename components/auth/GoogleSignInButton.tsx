'use client';

// components/auth/GoogleSignInButton.tsx
// Tombol Resmi "Lanjutkan dengan Google" + Google Account Picker Modal

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/services/supabaseClient';
import { X, CheckCircle2 } from 'lucide-react';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  label?: string;
}

const SUGGESTED_GOOGLE_ACCOUNTS = [
  { email: 'thn071205@gmail.com', name: 'Kimy Eka Ardiansyah', badge: 'Akun Utama' },
  { email: 'member.lifewear@gmail.com', name: 'Member UrbanStyle', badge: 'Akun Member' },
];

export default function GoogleSignInButton({
  onSuccess,
  label = 'Lanjutkan dengan Google',
}: GoogleSignInButtonProps) {
  const { loginWithGoogle } = useAuth();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [customGmail, setCustomGmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [useCustom, setUseCustom] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleButtonClick = async () => {
    setError('');
    if (supabase && process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED !== 'false') {
      try {
        setIsLoading(true);
        const currentParams = new URLSearchParams(window.location.search);
        const redirectTarget = currentParams.get('redirect') || '/account/profile';
        sessionStorage.setItem('urbanstyle_oauth_redirect', redirectTarget);

        const { error: oauthErr } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              prompt: 'select_account',
            },
          },
        });
        if (!oauthErr) return;
      } catch {
        // Fallback ke modal pemilih akun jika jaringan terputus
      } finally {
        setIsLoading(false);
      }
    }
    setIsPickerOpen(true);
  };

  const handleSelectAccount = async (email: string, name: string) => {
    setError('');
    setIsLoading(true);
    const res = await loginWithGoogle(email, name);
    setIsLoading(false);
    if (res.success) {
      setIsPickerOpen(false);
      onSuccess?.();
    } else {
      setError(res.message || 'Gagal autentikasi Google.');
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customGmail.trim().toLowerCase();
    if (!clean.endsWith('@gmail.com') && !clean.includes('@')) {
      setError('Masukkan alamat email Google (@gmail.com) yang valid.');
      return;
    }
    const finalName = customName.trim() || clean.split('@')[0].replace(/[._]/g, ' ').toUpperCase();
    await handleSelectAccount(clean, finalName);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleGoogleButtonClick}
        disabled={isLoading}
        className="w-full py-2.5 px-4 bg-white hover:bg-zinc-50 border border-zinc-300 hover:border-zinc-900 text-zinc-800 text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2.5 cursor-pointer shadow-2xs"
      >
        {/* Official 4-Color Google G SVG */}
        <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span>{isLoading ? 'Menghubungkan ke Google...' : label}</span>
      </button>

      {/* Google Account Chooser Modal */}
      {isPickerOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
          onClick={() => setIsPickerOpen(false)}
        >
          <div
            className="w-full max-w-sm bg-white border border-zinc-200 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5 mb-4">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900">
                    Pilih Akun Google
                  </h3>
                  <p className="text-[10px] text-zinc-500">Untuk melanjutkan ke UrbanStyle LifeWear</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsPickerOpen(false)}
                className="text-zinc-400 hover:text-black cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {error && (
              <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 text-[11px]">
                {error}
              </div>
            )}

            {!useCustom ? (
              <div className="space-y-2">
                {SUGGESTED_GOOGLE_ACCOUNTS.map((acc) => (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => handleSelectAccount(acc.email, acc.name)}
                    className="w-full p-2.5 border border-zinc-200 hover:border-black hover:bg-zinc-50 flex items-center justify-between transition-colors text-left cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-[#E60012] text-white font-black text-xs flex items-center justify-center shrink-0">
                        {acc.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-900 truncate">{acc.name}</p>
                        <p className="text-[11px] text-zinc-500 font-mono truncate">{acc.email}</p>
                      </div>
                    </div>
                    <CheckCircle2 size={14} className="text-zinc-300 group-hover:text-black shrink-0" />
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setUseCustom(true)}
                  className="w-full py-2 px-3 text-xs font-bold text-zinc-700 hover:text-black border border-dashed border-zinc-300 hover:border-zinc-900 transition-colors cursor-pointer mt-2"
                >
                  + Gunakan Akun Gmail Lainnya
                </button>
              </div>
            ) : (
              <form onSubmit={handleCustomSubmit} className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Nama Pengguna Google
                  </label>
                  <input
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full px-3 py-2 border border-zinc-300 text-xs focus:outline-hidden focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-600 mb-1">
                    Alamat Gmail
                  </label>
                  <input
                    type="email"
                    required
                    value={customGmail}
                    onChange={(e) => setCustomGmail(e.target.value)}
                    placeholder="nama@gmail.com"
                    className="w-full px-3 py-2 border border-zinc-300 text-xs font-mono focus:outline-hidden focus:border-black"
                  />
                </div>
                <div className="flex gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setUseCustom(false)}
                    className="flex-1 py-2 border border-zinc-300 text-xs font-bold text-zinc-600 hover:text-black cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-black hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                  >
                    Lanjutkan
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
