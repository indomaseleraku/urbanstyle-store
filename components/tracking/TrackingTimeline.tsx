// components/tracking/TrackingTimeline.tsx
'use client';

import React from 'react';
import { TrackingEvent } from '@/lib/types';
import { Clock, MapPin, CheckCircle2 } from 'lucide-react';

interface TrackingTimelineProps {
  currentStep: number;
  events: TrackingEvent[];
}

export const STEPS_LIST = [
  { step: 1, title: 'Pesanan Dibuat' },
  { step: 2, title: 'Dibayar' },
  { step: 3, title: 'Dikemas' },
  { step: 4, title: 'Dikirim' },
  { step: 5, title: 'Selesai' },
];

export default function TrackingTimeline({ currentStep, events }: TrackingTimelineProps) {
  return (
    <div className="space-y-6">
      {/* 5-Step Stepper */}
      <div className="p-4 sm:p-6 bg-white border border-zinc-200 rounded-none shadow-xs">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-zinc-200 z-0" />
          {STEPS_LIST.map((s) => {
            const isPassed = currentStep >= s.step;
            const isCurrent = currentStep === s.step;
            return (
              <div key={s.step} className="flex flex-col items-center relative z-10">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-bold text-xs rounded-none transition-colors ${
                    isCurrent
                      ? 'bg-[#E60012] text-white ring-4 ring-red-100'
                      : isPassed
                      ? 'bg-zinc-950 text-white'
                      : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  {isPassed && !isCurrent ? <CheckCircle2 size={14} /> : s.step}
                </div>
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-zinc-800 mt-2 text-center">
                  {s.title}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Timeline Events */}
      <div className="p-4 sm:p-6 bg-white border border-zinc-200 rounded-none shadow-xs space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-zinc-900 border-b border-zinc-100 pb-3">
          Riwayat Perjalanan Paket (Tracking Logs):
        </h3>
        <div className="space-y-4">
          {events.map((ev, i) => (
            <div key={i} className="flex gap-3 text-xs">
              <div className="flex flex-col items-center">
                <div className={`w-2 h-2 rounded-none ${i === 0 ? 'bg-[#E60012]' : 'bg-zinc-300'}`} />
                {i < events.length - 1 && <div className="w-0.5 flex-1 bg-zinc-200 my-1" />}
              </div>
              <div className="space-y-1 pb-3">
                <p className="font-bold text-zinc-900">{ev.description}</p>
                <div className="flex items-center gap-3 text-[11px] text-zinc-500 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock size={11} /> {ev.timestamp}
                  </span>
                  {ev.location && (
                    <span className="flex items-center gap-1">
                      <MapPin size={11} /> {ev.location}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
