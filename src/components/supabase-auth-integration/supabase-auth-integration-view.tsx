'use strict';
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, ShieldCheck, UserCheck, Database, CheckCircle2, UserPlus } from 'lucide-react';
import { TampilanAntarmukaSupaba } from './tampilan-antarmuka-supaba';
import { ValidasiInputAlurData } from './validasi-input-alur-data';
import { IntegrasiDatabaseStatus } from './integrasi-database-status';
import { SupabaseAuthIntegrationForm } from './supabase-auth-integration-form';
import { SupabaseAuthIntegrationModal } from './supabase-auth-integration-modal';

export const SupabaseAuthIntegrationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'validation' | 'database' | 'form'>('users');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    isDestructive: boolean;
    confirmLabel: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
    isDestructive: false,
    confirmLabel: 'Tutup',
  });

  const handleInspectUser = (user: { name: string; email: string; role: string }) => {
    setModalState({
      isOpen: true,
      title: `Detail Sesi: ${user.name}`,
      description: `Akun ${user.email} memiliki peran otentikasi [${user.role.toUpperCase()}]. Token sesi aktif diverifikasi dengan algoritma RS256 dan dilindungi RLS policy pada tabel public.profiles.`,
      isDestructive: false,
      confirmLabel: 'Tutup Detail',
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-gray-900 pb-16">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center space-x-2 text-xs font-mono text-gray-500 uppercase tracking-wider">
            <Link href="/" className="hover:text-black transition-colors">
              UrbanStyle Store
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/admin" className="hover:text-black transition-colors">
              Keamanan & RBAC
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-semibold">Modul 2: Supabase Auth Integration</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="bg-white p-6 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#E60012] text-white">
                Modul 2 — Identity & Security
              </span>
              <span className="text-xs text-gray-500 font-mono">Backlog Task: [TASK-MOD-2-01]</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 uppercase font-mono">
              Supabase Auth Integration & RBAC Profiles
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-3xl">
              Autentikasi tingkat industri berbasis Supabase GoTrue dengan integrasi tabel profiles 1:1,
              verifikasi HMAC anti-tampering, dan otorisasi bertingkat (Owner, Gudang, Kasir, Customer).
            </p>
          </div>
        </div>

        <div className="flex border-b border-gray-200 bg-white px-6 gap-6 font-mono text-xs uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('users')}
            className={`py-3.5 border-b-2 font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-[#E60012] text-[#E60012]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Daftar Pengguna & Peran
          </button>
          <button
            onClick={() => setActiveTab('validation')}
            className={`py-3.5 border-b-2 font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'validation'
                ? 'border-[#E60012] text-[#E60012]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" /> Validasi Alur Zod
          </button>
          <button
            onClick={() => setActiveTab('database')}
            className={`py-3.5 border-b-2 font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'database'
                ? 'border-[#E60012] text-[#E60012]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Database className="w-4 h-4" /> GoTrue Telemetry
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`py-3.5 border-b-2 font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'form'
                ? 'border-[#E60012] text-[#E60012]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <UserPlus className="w-4 h-4" /> Registrasi Akun Baru
          </button>
        </div>

        {activeTab === 'users' && (
          <TampilanAntarmukaSupaba
            onInspectUser={handleInspectUser}
            onOpenNewAuth={() => setActiveTab('form')}
          />
        )}

        {activeTab === 'validation' && <ValidasiInputAlurData />}

        {activeTab === 'database' && <IntegrasiDatabaseStatus />}

        {activeTab === 'form' && (
          <SupabaseAuthIntegrationForm
            onSuccess={() => setActiveTab('users')}
            onCancel={() => setActiveTab('users')}
          />
        )}
      </main>

      <SupabaseAuthIntegrationModal
        isOpen={modalState.isOpen}
        title={modalState.title}
        description={modalState.description}
        isDestructive={modalState.isDestructive}
        confirmLabel={modalState.confirmLabel}
        onConfirm={() => setModalState({ ...modalState, isOpen: false })}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      />
    </div>
  );
};
export default SupabaseAuthIntegrationView;
