// components/navbar/AnnouncementTicker.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Truck, RotateCcw, Copy } from 'lucide-react';
import { ModalType } from '../InformationModals';

interface AnnouncementTickerProps {
  onOpenInfoModal: (type: ModalType) => void;
  isAdmin?: boolean;
}

export default function AnnouncementTicker({
  onOpenInfoModal,
  isAdmin = false,
}: AnnouncementTickerProps) {
  const [copiedVoucher, setCopiedVoucher] = useState(false);

  const handleCopyVoucher = () => {
    navigator.clipboard.writeText('URBANWELCOME50');
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2500);
  };

  return (
    <div className="bg-[#111111] text-white text-[10px] sm:text-xs py-2 px-4 text-center font-bold tracking-wider flex items-center justify-between">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
        <div className="hidden sm:flex items-center gap-4 text-zinc-400">
          <button 
            type="button"
            onClick={() => onOpenInfoModal('shipping')} 
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Truck size={13} />
            <span>GRATIS ONGKIR MIN. RP 400.000</span>
          </button>
          <span>•</span>
          <button 
            type="button"
            onClick={() => onOpenInfoModal('return')} 
            className="hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>GARANSI RETUR 30 HARI</span>
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopyVoucher}
          className="mx-auto sm:mx-0 flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer group"
          title="Klik untuk salin kode voucher Rp 50.000"
        >
          <span className="text-[#E60012] font-black bg-black/40 px-1.5 py-0.5 group-hover:bg-[#E60012] group-hover:text-white transition-colors">
            MEMBER VOUCHER
          </span>
          <span className="text-zinc-200 uppercase flex items-center gap-1.5 text-[10px] sm:text-xs">
            <span>{copiedVoucher ? '✓ KODE TERSALIN: URBANWELCOME50' : 'Gunakan URBANWELCOME50 Potongan Rp 50.000'}</span>
            <Copy size={11} className="text-zinc-400 group-hover:text-white" />
          </span>
        </button>

        <div className="hidden md:flex items-center gap-3">
          <button
            type="button"
            onClick={() => onOpenInfoModal('lifewear')}
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Tentang LifeWear
          </button>
          {isAdmin && (
            <Link
              href="/admin"
              className="text-white font-mono text-[10px] bg-[#E60012] px-2 py-0.5 font-bold uppercase tracking-wider"
            >
              Dasbor SIM ↗
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
