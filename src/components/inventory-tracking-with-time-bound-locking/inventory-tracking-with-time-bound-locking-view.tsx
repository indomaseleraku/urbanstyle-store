'use strict';
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Timer, Lock, Database, CheckCircle2, FileText } from 'lucide-react';
import { TampilanAntarmukaInvent } from './tampilan-antarmuka-invent';
import { ValidasiInputAlurData } from './validasi-input-alur-data';
import { IntegrasiDatabaseStatus } from './integrasi-database-status';
import { InventoryTrackingWithTimeBoundLockingForm } from './inventory-tracking-with-time-bound-locking-form';
import { InventoryTrackingWithTimeBoundLockingModal } from './inventory-tracking-with-time-bound-locking-modal';

export const InventoryTrackingWithTimeBoundLockingView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'locks' | 'validation' | 'database' | 'form'>('locks');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    isDestructive: boolean;
    confirmLabel: string;
    actionType?: 'release' | 'lock';
  }>({
    isOpen: false,
    title: '',
    description: '',
    isDestructive: false,
    confirmLabel: 'Konfirmasi',
  });

  const handleReleaseLock = (lockId: string) => {
    setModalState({
      isOpen: true,
      title: `Konfirmasi Pembebasan: ${lockId}`,
      description: `Kunci reservasi ${lockId} akan dihapus manual dari PostgreSQL dan kuantitas produk dikembalikan instan ke stok publik.`,
      isDestructive: true,
      confirmLabel: 'Bebaskan Stok',
      actionType: 'release',
    });
  };

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-gray-900 pb-16">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center space-x-2 text-xs font-mono text-gray-500 uppercase tracking-wider">
            <Link href="/" className="hover:text-black transition-colors">
              UrbanStyle Store
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link href="/admin" className="hover:text-black transition-colors">
              Gudang & Inventaris
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-gray-900 font-semibold">Modul 5: Time-Bound Inventory Locking</span>
          </nav>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Module Title Banner */}
        <div className="bg-white p-6 border border-gray-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#E60012] text-white">
                Modul 5 — Anti-Overselling Guard
              </span>
              <span className="text-xs text-gray-500 font-mono">Backlog Task: [TASK-MOD-5-01]</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-950 uppercase font-mono">
              Inventory Tracking with Time-Bound Locking
            </h1>
            <p className="text-xs text-gray-600 mt-1 max-w-3xl">
              Sistem penguncian stok sementara (10 menit TTL) dengan pembebasan otomatis berbasis pg_cron,
              menjamin zero-overselling saat flash sale atau checkout concurrent berlangsung.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 bg-white px-6 gap-6 font-mono text-xs uppercase tracking-wider">
          <button
            onClick={() => setActiveTab('locks')}
            className={`py-3.5 border-b-2 font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'locks'
                ? 'border-[#E60012] text-[#E60012]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <Lock className="w-4 h-4" /> Monitor Kunci Aktif
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
            <Database className="w-4 h-4" /> pg_cron Scheduler Status
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`py-3.5 border-b-2 font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'form'
                ? 'border-[#E60012] text-[#E60012]'
                : 'border-transparent text-gray-500 hover:text-black'
            }`}
          >
            <FileText className="w-4 h-4" /> Simulasi Kunci Baru
          </button>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'locks' && (
          <TampilanAntarmukaInvent
            onReleaseLock={handleReleaseLock}
            onOpenLockModal={() => setActiveTab('form')}
          />
        )}

        {activeTab === 'validation' && <ValidasiInputAlurData />}

        {activeTab === 'database' && <IntegrasiDatabaseStatus />}

        {activeTab === 'form' && (
          <InventoryTrackingWithTimeBoundLockingForm
            onSuccess={() => setActiveTab('locks')}
            onCancel={() => setActiveTab('locks')}
          />
        )}
      </main>

      <InventoryTrackingWithTimeBoundLockingModal
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
export default InventoryTrackingWithTimeBoundLockingView;
