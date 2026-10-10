'use strict';
'use client';

import React, { useState } from 'react';
import { LogIn, UserPlus, Check, Key } from 'lucide-react';
import { authSignUpSchema, AuthSignUpInput } from '@/src/lib/validations/supabase-auth-integration.schema';

export const SupabaseAuthIntegrationForm: React.FC<{
  onSuccess?: (data: AuthSignUpInput) => void;
  onCancel?: () => void;
}> = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Partial<AuthSignUpInput>>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'customer',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    const res = authSignUpSchema.safeParse(formData);
    if (!res.success) {
      const errs: Record<string, string> = {};
      res.error.issues.forEach((err) => {
        errs[err.path.join('.')] = err.message;
      });
      setErrors(errs);
      setIsSubmitting(false);
      return;
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setSuccess(true);
      onSuccess?.(res.data);
      setTimeout(() => setSuccess(false), 2500);
    }, 400);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 p-6 space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-base font-bold text-gray-950 uppercase font-mono">
          Registrasi Akun Baru (Supabase GoTrue)
        </h3>
        <p className="text-xs text-gray-500 mt-0.5">
          Daftarkan anggota tim atau pelanggan ke sistem autentikasi dengan role-based authorization.
        </p>
      </div>

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-800 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-green-600" /> Akun berhasil didaftarkan dan profil tersinkronisasi!
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Nama Lengkap *
          </label>
          <input
            type="text"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="Contoh: Kimy Eka Ardiansyah"
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-sans"
          />
          {errors.fullName && <p className="text-[11px] text-[#E60012] font-mono">{errors.fullName}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Alamat Email *
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="nama@domain.com"
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono"
          />
          {errors.email && <p className="text-[11px] text-[#E60012] font-mono">{errors.email}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Nomor Telepon (WhatsApp) *
          </label>
          <input
            type="text"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="081234567890"
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono"
          />
          {errors.phone && <p className="text-[11px] text-[#E60012] font-mono">{errors.phone}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Peran Akun (Role) *
          </label>
          <select
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value as AuthSignUpInput['role'] })
            }
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono"
          >
            <option value="customer">Customer (Pelanggan)</option>
            <option value="admin">Admin Console</option>
            <option value="warehouse">Gudang & Inventaris</option>
            <option value="cashier">Kasir POS</option>
          </select>
          {errors.role && <p className="text-[11px] text-[#E60012] font-mono">{errors.role}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Kata Sandi (Min. 8 Karakter) *
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono"
          />
          {errors.password && <p className="text-[11px] text-[#E60012] font-mono">{errors.password}</p>}
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-semibold text-gray-700 uppercase font-mono">
            Konfirmasi Sandi *
          </label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full text-xs p-2.5 border border-gray-300 focus:outline-none focus:border-black font-mono"
          />
          {errors.confirmPassword && (
            <p className="text-[11px] text-[#E60012] font-mono">{errors.confirmPassword}</p>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-xs font-medium text-gray-700 hover:bg-gray-50 uppercase tracking-wider font-mono"
          >
            Batal
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-medium uppercase tracking-wider font-mono transition-colors disabled:opacity-50"
        >
          <UserPlus className="w-4 h-4 text-[#E60012]" />
          {isSubmitting ? 'Memproses...' : 'Buat Akun'}
        </button>
      </div>
    </form>
  );
};
export default SupabaseAuthIntegrationForm;
