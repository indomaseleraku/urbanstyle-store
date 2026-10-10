// src/components/responsive-mobile-first-layout-refinement/responsive-mobile-first-layout-refinement-form.tsx
'use client';

import React, { useState } from 'react';
import { 
  mobileLayoutConfigSchema, 
  MobileLayoutConfigInput 
} from '@/lib/validations/responsive-mobile-first-layout-refinement.schema';
import { Sliders, Check, Smartphone } from 'lucide-react';

interface MobileLayoutFormProps {
  initialConfig: MobileLayoutConfigInput;
  onApplyConfig: (config: MobileLayoutConfigInput) => void;
}

export default function ResponsiveMobileFirstLayoutForm({
  initialConfig,
  onApplyConfig,
}: MobileLayoutFormProps) {
  const [config, setConfig] = useState<MobileLayoutConfigInput>(initialConfig);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successNotice, setSuccessNotice] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessNotice('');

    const res = mobileLayoutConfigSchema.safeParse(config);
    if (!res.success) {
      const formatted: Record<string, string> = {};
      res.error.issues.forEach((issue) => {
        formatted[issue.path.join('.')] = issue.message;
      });
      setErrors(formatted);
      return;
    }

    onApplyConfig(res.data);
    setSuccessNotice('Konfigurasi tata letak responsif ponsel berhasil disimpan!');
    setTimeout(() => setSuccessNotice(''), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 bg-white border border-zinc-200 rounded-none space-y-4">
      <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
        <div className="flex items-center gap-2">
          <Smartphone size={16} className="text-[#E60012]" />
          <h4 className="text-xs font-black uppercase text-zinc-950">
            Pengaturan Ergonomi Antarmuka Ponsel (Mobile Config)
          </h4>
        </div>
        <span className="text-[10px] font-mono text-zinc-400 uppercase">
          ZOD VALIDATED
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {/* Thumb Zone Height */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="font-bold uppercase text-zinc-700">Tinggi Bottom Bar (Zona Jempol):</label>
            <span className="font-mono font-bold text-zinc-950">{config.thumbZoneHeightPx}px</span>
          </div>
          <input
            type="range"
            min={48}
            max={80}
            value={config.thumbZoneHeightPx}
            onChange={(e) => setConfig({ ...config, thumbZoneHeightPx: Number(e.target.value) })}
            className="w-full accent-[#E60012] cursor-pointer"
          />
          {errors.thumbZoneHeightPx && (
            <p className="text-[#E60012] text-[10px]">{errors.thumbZoneHeightPx}</p>
          )}
        </div>

        {/* Touch Target Min Size */}
        <div className="space-y-1">
          <div className="flex justify-between">
            <label className="font-bold uppercase text-zinc-700">Ukuran Minimum Target Sentuh:</label>
            <span className="font-mono font-bold text-zinc-950">{config.touchTargetMinSizePx}px</span>
          </div>
          <input
            type="range"
            min={44}
            max={64}
            value={config.touchTargetMinSizePx}
            onChange={(e) => setConfig({ ...config, touchTargetMinSizePx: Number(e.target.value) })}
            className="w-full accent-[#E60012] cursor-pointer"
          />
          {errors.touchTargetMinSizePx && (
            <p className="text-[#E60012] text-[10px]">{errors.touchTargetMinSizePx}</p>
          )}
        </div>

        {/* Kurva Animasi Drawer */}
        <div className="space-y-1">
          <label className="font-bold uppercase text-zinc-700">Kurva Animasi Drawer Sheet:</label>
          <select
            value={config.categoryDrawerAnimation}
            onChange={(e) => setConfig({ ...config, categoryDrawerAnimation: e.target.value as any })}
            className="w-full p-2 border border-zinc-300 bg-white rounded-none focus:outline-none"
          >
            <option value="ease-out">Ease-Out (Standar Halus)</option>
            <option value="spring">Spring (Fisika Pegas Natural)</option>
            <option value="linear">Linear (Cepat Konstan)</option>
          </select>
        </div>

        {/* Toggle Checkboxes */}
        <div className="space-y-2 pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.bottomNavEnabled}
              onChange={(e) => setConfig({ ...config, bottomNavEnabled: e.target.checked })}
              className="rounded-none text-[#E60012] focus:ring-0 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-bold text-zinc-700 uppercase">Aktifkan 5-Tab Sticky Bottom Bar</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={config.stickyBuyBarEnabled}
              onChange={(e) => setConfig({ ...config, stickyBuyBarEnabled: e.target.checked })}
              className="rounded-none text-[#E60012] focus:ring-0 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-bold text-zinc-700 uppercase">Aktifkan Sticky Buy Bar di PDP Mobile</span>
          </label>
        </div>
      </div>

      {successNotice && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <Check size={14} className="text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-200">
        <button
          type="button"
          onClick={() => {
            setConfig(initialConfig);
            setErrors({});
          }}
          className="px-4 py-2 bg-white border border-zinc-300 text-zinc-700 text-xs font-bold uppercase rounded-none cursor-pointer"
        >
          Reset
        </button>
        <button
          type="submit"
          className="px-5 py-2 bg-zinc-950 hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer shadow-xs"
        >
          Simpan Konfigurasi Ponsel
        </button>
      </div>
    </form>
  );
}
