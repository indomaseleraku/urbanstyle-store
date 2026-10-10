// components/RealtimePaymentStatus.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, Loader2, Sparkles, ShieldCheck } from 'lucide-react';
import { OrderStatus } from '@/lib/types';

interface RealtimePaymentStatusProps {
  orderNumber: string;
  initialStatus?: OrderStatus;
  paymentMethod?: string;
  amount?: number;
  onStatusChanged?: (newStatus: OrderStatus) => void;
  showDetails?: boolean;
}

// Chime suara sukses menggunakan Web Audio API murni (tanpa file audio eksternal)
function playSuccessChime() {
  try {
    if (typeof window === 'undefined') return;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // 2 nada harmonis (E6 -> A6)
    const notes = [1318.51, 1760.0];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);

      gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + idx * 0.12 + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime + idx * 0.12);
      osc.stop(ctx.currentTime + idx * 0.12 + 0.45);
    });
  } catch {
    // Abaikan jika browser memblokir autoplay audio
  }
}

export function RealtimePaymentStatus({
  orderNumber,
  initialStatus = 'Menunggu Pembayaran',
  paymentMethod = 'QRIS',
  amount,
  onStatusChanged,
  showDetails = true,
}: RealtimePaymentStatusProps) {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);
  const [justSettled, setJustSettled] = useState(false);
  const [pollCount, setPollCount] = useState(0);
  const audioPlayedRef = useRef(false);

  useEffect(() => {
    setStatus(initialStatus);
  }, [initialStatus]);

  // Real-time Polling Engine
  useEffect(() => {
    if (status !== 'Menunggu Pembayaran') {
      return;
    }

    let isMounted = true;
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}/status`, {
          cache: 'no-store',
        });
        if (!res.ok) return;

        const data = await res.json();
        if (!isMounted) return;

        setPollCount((prev) => prev + 1);

        if (data.success && (data.settled || data.status === 'Dibayar' || data.status === 'Selesai' || data.status === 'Dikemas')) {
          const newStatus = data.status || 'Dibayar';
          setStatus(newStatus);
          setJustSettled(true);

          if (!audioPlayedRef.current) {
            audioPlayedRef.current = true;
            playSuccessChime();
          }

          if (onStatusChanged) {
            onStatusChanged(newStatus);
          }

          // Otomatis refresh window agar nota ter-update total jika berada di invoice
          setTimeout(() => {
            if (typeof window !== 'undefined' && window.location.pathname.includes('/invoice/')) {
              window.location.reload();
            }
          }, 1800);
        }
      } catch (err) {
        // Silent catch agar polling tidak terputus
      }
    }, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [orderNumber, status, onStatusChanged]);

  if (status === 'Dibayar' || status === 'Selesai' || status === 'Dikemas' || status === 'Dikirim') {
    return (
      <div className={`p-4 bg-emerald-50 border-2 border-emerald-500 text-left space-y-2 animate-in fade-in duration-300 ${justSettled ? 'ring-4 ring-emerald-300' : ''}`}>
        <div className="flex items-center gap-2 text-emerald-800">
          <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
          <div>
            <p className="text-xs font-black uppercase tracking-wider">
              Pembayaran Berhasil Diverifikasi Otomatis!
            </p>
            <p className="text-[11px] text-emerald-700 font-medium">
              Sistem backend telah memvalidasi pelunasan tagihan #{orderNumber}.
            </p>
          </div>
        </div>
        {showDetails && (
          <div className="pt-2 border-t border-emerald-200/60 flex items-center justify-between text-[10px] text-emerald-800 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck size={12} /> Terverifikasi: Sistem UrbanStyle TPS
            </span>
            <span className="bg-emerald-600 text-white px-2 py-0.5 font-bold uppercase">
              STATUS: LUNAS
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-3.5 bg-zinc-50 border border-zinc-300 text-left space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-[11px] font-bold text-zinc-900 uppercase tracking-wider">
            Sistem Memantau Pembayaran (Real-Time)
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-400">
          <Loader2 size={12} className="animate-spin text-zinc-500" />
          <span>Sync #{pollCount}</span>
        </div>
      </div>

      <p className="text-[11px] text-zinc-600 leading-relaxed">
        Silakan lakukan pembayaran lewat <strong>{paymentMethod}</strong>. Setelah berhasil dibayar, layar ini akan <strong>otomatis berganti lunas dari sistem</strong> tanpa perlu menekan tombol apapun.
      </p>

      <div className="p-2 bg-white border border-zinc-200 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
        <span className="flex items-center gap-1">
          <Sparkles size={11} className="text-[#E60012]" /> Auto-Settlement Daemon Aktif
        </span>
        <span className="text-zinc-600 font-semibold">Terkoneksi ke Server</span>
      </div>
    </div>
  );
}
