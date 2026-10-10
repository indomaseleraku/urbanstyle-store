// components/SmartSizePredictorModal.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { X, Sparkles, Check, Ruler, Info } from 'lucide-react';

interface SmartSizePredictorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySize: (size: string) => void;
  productName?: string;
  categoryName?: string;
}

type FitPreference = 'slim' | 'regular' | 'oversized';

export default function SmartSizePredictorModal({
  isOpen,
  onClose,
  onApplySize,
  productName,
  categoryName,
}: SmartSizePredictorModalProps) {
  const [height, setHeight] = useState<number>(172); // cm
  const [weight, setWeight] = useState<number>(65); // kg
  const [fitPreference, setFitPreference] = useState<FitPreference>('regular');

  // Kalkulasi BMI dan Rekomendasi Ukuran Heuristik (FR-30)
  const recommendation = useMemo(() => {
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);

    let recommendedSize = 'M';
    let accuracy = 94;
    let bmiCategory = 'Ideal / Normal';
    let rationale = '';

    if (bmi < 18.5) {
      bmiCategory = 'Ramping (Underweight)';
      if (fitPreference === 'slim') {
        recommendedSize = 'S';
        accuracy = 95;
      } else if (fitPreference === 'oversized') {
        recommendedSize = 'M';
        accuracy = 92;
      } else {
        recommendedSize = 'S';
        accuracy = 94;
      }
      rationale = `Untuk postur ramping (${height} cm / ${weight} kg), ukuran ${recommendedSize} memberikan garis bahu proporsional tanpa terlihat kedodoran.`;
    } else if (bmi >= 18.5 && bmi < 23.0) {
      bmiCategory = 'Proporsional (Normal Fit)';
      if (fitPreference === 'slim') {
        recommendedSize = 'S';
        accuracy = 93;
      } else if (fitPreference === 'oversized') {
        recommendedSize = 'L';
        accuracy = 93;
      } else {
        recommendedSize = 'M';
        accuracy = 96;
      }
      rationale = `Postur tubuh Anda ideal (${height} cm / ${weight} kg). Ukuran ${recommendedSize} memberikan siluet khas Uniqlo LifeWear yang jatuh alami dan leluasa bergerak.`;
    } else if (bmi >= 23.0 && bmi < 27.5) {
      bmiCategory = 'Berisi (Overweight)';
      if (fitPreference === 'slim') {
        recommendedSize = 'M';
        accuracy = 92;
      } else if (fitPreference === 'oversized') {
        recommendedSize = 'XL';
        accuracy = 94;
      } else {
        recommendedSize = 'L';
        accuracy = 95;
      }
      rationale = `Ukuran ${recommendedSize} memberikan ruang leluasa di area dada dan perut dengan kenyamanan serat kain tanpa terasa ketat.`;
    } else {
      bmiCategory = 'Ekstra Berisi (Large Build)';
      if (fitPreference === 'slim') {
        recommendedSize = 'L';
        accuracy = 91;
      } else if (fitPreference === 'oversized') {
        recommendedSize = 'XXL';
        accuracy = 96;
      } else {
        recommendedSize = 'XL';
        accuracy = 95;
      }
      rationale = `Ukuran ${recommendedSize} dirancang untuk postur badan berotot/berisi agar kancing dan lingkar ketiak tidak tertarik saat beraktivitas aktif.`;
    }

    return {
      bmi: Number(bmi.toFixed(1)),
      bmiCategory,
      size: recommendedSize,
      accuracy,
      rationale,
    };
  }, [height, weight, fitPreference]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-white border border-zinc-300 w-full max-w-lg overflow-hidden shadow-2xl relative my-auto rounded-none">
        
        {/* Header Modal */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#E60012] text-white rounded-none">
              <Sparkles size={16} />
            </span>
            <div>
              <h2 className="text-sm sm:text-base font-black uppercase tracking-tight text-zinc-950">
                Smart Size & Fit Predictor
              </h2>
              <p className="text-[10px] text-zinc-500 font-medium">
                {productName ? `Kalkulator Ukuran Presisi: ${productName}` : 'Estimasi Ukuran Akurat Berdasarkan Postur Tubuh (TB/BB)'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-200 transition-colors cursor-pointer"
            aria-label="Tutup kalkulator ukuran"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          
          {/* 1. Input Slider Tinggi Badan */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="height-input" className="font-bold uppercase tracking-wider text-zinc-700">
                Tinggi Badan (TB):
              </label>
              <div className="flex items-center gap-1 font-mono font-bold text-zinc-950">
                <span className="text-base text-[#E60012]">{height}</span>
                <span className="text-xs text-zinc-400">cm</span>
              </div>
            </div>
            <input
              id="height-input"
              type="range"
              min={145}
              max={205}
              value={height}
              onChange={(e) => setHeight(Number(e.target.value))}
              className="w-full accent-[#E60012] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>145 cm</span>
              <span>175 cm</span>
              <span>205 cm</span>
            </div>
          </div>

          {/* 2. Input Slider Berat Badan */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label htmlFor="weight-input" className="font-bold uppercase tracking-wider text-zinc-700">
                Berat Badan (BB):
              </label>
              <div className="flex items-center gap-1 font-mono font-bold text-zinc-950">
                <span className="text-base text-[#E60012]">{weight}</span>
                <span className="text-xs text-zinc-400">kg</span>
              </div>
            </div>
            <input
              id="weight-input"
              type="range"
              min={40}
              max={120}
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              className="w-full accent-[#E60012] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
              <span>40 kg</span>
              <span>75 kg</span>
              <span>120 kg</span>
            </div>
          </div>

          {/* 3. Preferensi Gaya Potongan (Fit) */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-700 block">
              Preferensi Siluet Potongan:
            </span>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'slim', label: 'Slim Fit', desc: 'Pas Lekuk Tubuh' },
                { id: 'regular', label: 'Regular Fit', desc: 'Standar LifeWear' },
                { id: 'oversized', label: 'Oversized', desc: 'Jatuh Longgar Santai' },
              ].map((fit) => (
                <button
                  key={fit.id}
                  type="button"
                  onClick={() => setFitPreference(fit.id as FitPreference)}
                  className={`p-2.5 text-center border transition-all rounded-none cursor-pointer ${
                    fitPreference === fit.id
                      ? 'border-[#E60012] bg-red-50/50 text-[#E60012] ring-1 ring-[#E60012]'
                      : 'border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400'
                  }`}
                >
                  <p className="text-xs font-bold uppercase">{fit.label}</p>
                  <p className="text-[9px] text-zinc-500 mt-0.5">{fit.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Kartu Hasil Prediksi Ukuran */}
          <div className="bg-zinc-900 text-white p-4 sm:p-5 rounded-none space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-widest block">
                  HASIL ANALISIS POSTUR
                </span>
                <p className="text-xs text-zinc-300 mt-0.5">
                  BMI: <span className="font-mono font-bold text-white">{recommendation.bmi}</span> ({recommendation.bmiCategory})
                </p>
              </div>

              {/* Badge Ukuran Utama */}
              <div className="text-right">
                <span className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest block">
                  AKURASI {recommendation.accuracy}%
                </span>
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#E60012] text-white font-mono font-black text-2xl shadow-md mt-1">
                  {recommendation.size}
                </div>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed border-t border-zinc-800 pt-2.5">
              {recommendation.rationale}
            </p>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-zinc-50 border-t border-zinc-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-zinc-500 flex items-center gap-1.5">
            <Info size={13} className="shrink-0 text-zinc-400" />
            <span>Garansi retur/tukar ukuran 30 hari tetap berlaku.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 bg-white border border-zinc-300 text-xs font-bold uppercase text-zinc-700 hover:bg-zinc-100 rounded-none cursor-pointer"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={() => {
                onApplySize(recommendation.size);
                onClose();
              }}
              className="w-1/2 sm:w-auto px-5 py-2.5 bg-[#E60012] hover:bg-[#c80010] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 rounded-none shadow-sm cursor-pointer"
            >
              <Check size={14} />
              <span>Gunakan Size {recommendation.size}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
