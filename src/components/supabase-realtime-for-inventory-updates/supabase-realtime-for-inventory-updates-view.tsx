'use strict';
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Wifi, Radio, Database, CheckCircle2, FileText } from 'lucide-react';
import { TampilanAntarmukaSupaba } from './tampilan-antarmuka-supaba';
import { ValidasiInputAlurData } from './validasi-input-alur-data';
import { IntegrasiDatabaseStatus } from './integrasi-database-status';
import { SupabaseRealtimeForInventoryUpdatesForm } from './supabase-realtime-for-inventory-updates-form';
import { SupabaseRealtimeForInventoryUpdatesModal } from './supabase-realtime-for-inventory-updates-modal';

export const SupabaseRealtimeForInventoryUpdatesView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stream' | 'validation' | 'database' | 'form'>('stream');
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

  const handleInspectEvent = (evt: { id: string; table: string; timestamp: string }) => {
    setModalState({
      isOpen: true,
      title: `Frame Inspeksi: ${evt.id}`,
      description: `Menampilkan frame perubahan baris database ${evt.table} pada ${evt.timestamp}. Data direplikasi dengan logika CDC (Change Data Capture) via PostgreSQL logical replication stream.`,
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
              Sistem & Replikasi
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-semibold">Modul 3: Supabase Realtime Updates</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        <div className="bg-white p-6 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#E60012] text-white">
                Modul 3 — Realtime Synchronization
              </span>
              <span className="text-xs text-gray-500 font-mono">Backlog Task: [TASK-MOD-3-01]</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 uppercase font-mono">
              Supabase Realtime for Inventory Updates
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-3xl">
              Sinkronisasi stok dua arah instan via WebSockets (Phoenix channels), memungkinkan update stok live
              pada halaman PDP dan grid katalog secara seamless tanpa refresh.
            </p>
          </div>
        </div>

        <div className="flex border-b border-gray-200 bg-white px-6 gap-6 font-mono text-xs uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('stream')}
            className={`py-3.5 border-b-2 font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'stream'
                ? 'border-[#E60012] text-[#E60012]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Radio className="w-4 h-4" /> Live Replikasi Stream
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
            <Database className="w-4 h-4" /> Telemetry Publikasi
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`py-3.5 border-b-2 font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'form'
                ? 'border-[#E60012] text-[#E60012]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <FileText className="w-4 h-4" /> Konfigurasi Kanal Baru
          </button>
        </div>

        {activeTab === 'stream' && (
          <TampilanAntarmukaSupaba
            onInspectEvent={handleInspectEvent}
            onSimulateBroadcast={() => setActiveTab('form')}
          />
        )}

        {activeTab === 'validation' && <ValidasiInputAlurData />}

        {activeTab === 'database' && <IntegrasiDatabaseStatus />}

        {activeTab === 'form' && (
          <SupabaseRealtimeForInventoryUpdatesForm
            onSuccess={() => setActiveTab('stream')}
            onCancel={() => setActiveTab('stream')}
          />
        )}
      </main>

      <SupabaseRealtimeForInventoryUpdatesModal
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
export default SupabaseRealtimeForInventoryUpdatesView;
