// src/components/responsive-mobile-first-layout-refinement/validasi-input-alur-data.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, CheckCircle, AlertTriangle, Monitor, Tablet } from 'lucide-react';
import { MobileLayoutConfigInput } from '@/lib/validations/responsive-mobile-first-layout-refinement.schema';

interface ValidasiMobileInputProps {
  config: MobileLayoutConfigInput;
  onChangeConfig: (newConfig: MobileLayoutConfigInput) => void;
}

export default function ValidasiInputAlurData({
  config,
  onChangeConfig,
}: ValidasiMobileInputProps) {
  const [viewportWidth, setViewportWidth] = useState<number>(390);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setViewportWidth(window.innerWidth);
      const handleResize = () => setViewportWidth(window.innerWidth);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const isMobileSize = viewportWidth < 768;
  const isTabletSize = viewportWidth >= 768 && viewportWidth < 1024;
  const isDesktopSize = viewportWidth >= 1024;

  return (
    <div className="p-4 bg-white border border-zinc-200 rounded-none space-y-3">
      <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
        <div className="flex items-center gap-2">
          <CheckCircle size={15} className="text-emerald-600" />
          <h4 className="text-xs font-black uppercase text-zinc-950">
            Validasi Alur Viewport & Ergonomi Layar
          </h4>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs">
          <span className="text-zinc-400">LEBAR:</span>
          <span className="font-bold text-[#E60012]">{viewportWidth}px</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
        {/* Deteksi Perangkat */}
        <div className={`p-3 border flex items-center gap-2.5 ${isMobileSize ? 'border-zinc-950 bg-zinc-50' : 'border-zinc-200 opacity-60'}`}>
          <Smartphone size={16} className={isMobileSize ? 'text-[#E60012]' : 'text-zinc-400'} />
          <div>
            <span className="text-[10px] font-bold uppercase text-zinc-400 block">Form-Factor</span>
            <span className="font-bold uppercase text-zinc-900">Mobile (&lt;768px)</span>
          </div>
        </div>

        <div className={`p-3 border flex items-center gap-2.5 ${isTabletSize ? 'border-zinc-950 bg-zinc-50' : 'border-zinc-200 opacity-60'}`}>
          <Tablet size={16} className={isTabletSize ? 'text-[#E60012]' : 'text-zinc-400'} />
          <div>
            <span className="text-[10px] font-bold uppercase text-zinc-400 block">Form-Factor</span>
            <span className="font-bold uppercase text-zinc-900">Tablet (768-1024px)</span>
          </div>
        </div>

        <div className={`p-3 border flex items-center gap-2.5 ${isDesktopSize ? 'border-zinc-950 bg-zinc-50' : 'border-zinc-200 opacity-60'}`}>
          <Monitor size={16} className={isDesktopSize ? 'text-[#E60012]' : 'text-zinc-400'} />
          <div>
            <span className="text-[10px] font-bold uppercase text-zinc-400 block">Form-Factor</span>
            <span className="font-bold uppercase text-zinc-900">Desktop (&gt;=1024px)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
