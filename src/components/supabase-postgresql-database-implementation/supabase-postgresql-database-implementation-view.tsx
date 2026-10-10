'use strict';
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Database, Table, CheckCircle2, Terminal, ShieldCheck } from 'lucide-react';
import { TampilanAntarmukaSupaba } from './tampilan-antarmuka-supaba';
import { ValidasiInputAlurData } from './validasi-input-alur-data';
import { IntegrasiDatabaseStatus } from './integrasi-database-status';
import { SupabasePostgresqlDatabaseImplementationForm } from './supabase-postgresql-database-implementation-form';
import { SupabasePostgresqlDatabaseImplementationModal } from './supabase-postgresql-database-implementation-modal';

export const SupabasePostgresqlDatabaseImplementationView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'schema' | 'validation' | 'database' | 'query'>('schema');
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

  const handleInspectTable = (table: { tableName: string; description: string }) => {
    setModalState({
      isOpen: true,
      title: `Inspeksi Tabel: public.${table.tableName}`,
      description: `${table.description} Struktur skema diproteksi oleh Row Level Security (RLS) dengan indeks B-Tree pada foreign keys dan audit timestamps.`,
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
              Database Core
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-semibold">Modul 1: PostgreSQL Implementation</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="bg-white p-6 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#E60012] text-white">
                Modul 1 — Relational Core
              </span>
              <span className="text-xs text-gray-500 font-mono">Backlog Task: [TASK-MOD-1-01]</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 uppercase font-mono">
              Supabase PostgreSQL Database Implementation
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-3xl">
              Arsitektur database relasional PostgreSQL komprehensif: skema multi-tabel, integritas foreign key cascade,
              kebijakan Row-Level Security (RLS), dan koneksi pooled transaction via PgBouncer.
            </p>
          </div>
        </div>

        <div className="flex border-b border-gray-200 bg-white px-6 gap-6 font-mono text-xs uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('schema')}
            className={`py-3.5 border-b-2 font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'schema'
                ? 'border-[#E60012] text-[#E60012]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Table className="w-4 h-4" /> Skema Tabel Relasional
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
            <Database className="w-4 h-4" /> PgBouncer Telemetry
          </button>
          <button
            onClick={() => setActiveTab('query')}
            className={`py-3.5 border-b-2 font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'query'
                ? 'border-[#E60012] text-[#E60012]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Terminal className="w-4 h-4" /> SQL Console Runner
          </button>
        </div>

        {activeTab === 'schema' && (
          <TampilanAntarmukaSupaba
            onInspectTable={handleInspectTable}
            onOpenQueryRunner={() => setActiveTab('query')}
          />
        )}

        {activeTab === 'validation' && <ValidasiInputAlurData />}

        {activeTab === 'database' && <IntegrasiDatabaseStatus />}

        {activeTab === 'query' && (
          <SupabasePostgresqlDatabaseImplementationForm
            onSuccess={() => setActiveTab('schema')}
            onCancel={() => setActiveTab('schema')}
          />
        )}
      </main>

      <SupabasePostgresqlDatabaseImplementationModal
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
export default SupabasePostgresqlDatabaseImplementationView;
