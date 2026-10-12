'use client';

// app/auth/callback/page.tsx
// Penangan Callback OAuth Google dari Supabase Auth

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/services/supabaseClient';
import { useAuth } from '@/lib/auth-context';

export default function AuthCallbackPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    async function handleOAuthSession() {
      if (supabase) {
        try {
          const { data } = await supabase.auth.getSession();
          if (data?.session?.user) {
            const u = data.session.user;
            const email = u.email || 'member@gmail.com';
            const fullName =
              u.user_metadata?.full_name ||
              u.user_metadata?.name ||
              email.split('@')[0].toUpperCase();
            await loginWithGoogle(email, fullName);
            router.replace('/account/profile');
            return;
          }
        } catch (err) {
          console.error('OAuth callback error:', err);
        }
      }
      router.replace('/account/login');
    }

    handleOAuthSession();
  }, [loginWithGoogle, router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-3">
      <div className="w-8 h-8 bg-[#E60012] text-white font-black text-xs flex items-center justify-center animate-pulse">
        US
      </div>
      <p className="text-xs font-mono uppercase tracking-widest text-zinc-600">
        Memverifikasi Akun Google Anda...
      </p>
    </div>
  );
}
