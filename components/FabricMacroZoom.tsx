// components/FabricMacroZoom.tsx
'use client';

import React, { useState, useRef, MouseEvent } from 'react';
import { ZoomIn, Sun, CloudSnow, Wind, Sparkles } from 'lucide-react';
import { getOptimizedImageUrl } from '@/lib/utils';

interface FabricMacroZoomProps {
  imageUrl: string;
  altText: string;
  fabricDetails?: string;
  categoryName?: string;
}

export function WeatherTechBadge({ categoryName, fabricDetails }: { categoryName?: string; fabricDetails?: string }) {
  const isTropical = 
    categoryName?.toLowerCase().includes('kaos') || 
    fabricDetails?.toLowerCase().includes('airism') ||
    fabricDetails?.toLowerCase().includes('katun');

  const isColdAC = 
    categoryName?.toLowerCase().includes('jaket') || 
    categoryName?.toLowerCase().includes('outer') || 
    categoryName?.toLowerCase().includes('flannel') ||
    fabricDetails?.toLowerCase().includes('flannel');

  if (isColdAC) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50/80 border border-blue-200 text-blue-900 text-[10px] font-bold uppercase tracking-wider rounded-none shadow-2xs">
        <CloudSnow size={13} className="text-blue-600 shrink-0" />
        <span>Optimal untuk Ruangan Ber-AC & Hawa Dingin (Thermal Insulation)</span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50/80 border border-amber-200 text-amber-900 text-[10px] font-bold uppercase tracking-wider rounded-none shadow-2xs">
      <Sun size={13} className="text-amber-600 shrink-0" />
      <span>Optimal untuk Cuaca Tropis 28°C - 35°C (Breathable & Quick-Dry)</span>
    </div>
  );
}

export default function FabricMacroZoom({
  imageUrl,
  altText,
  fabricDetails,
  categoryName,
}: FabricMacroZoomProps) {
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({
      x: Math.max(0, Math.min(100, x)),
      y: Math.max(0, Math.min(100, y)),
    });
  };

  return (
    <div className="space-y-2">
      {/* Container Gambar Portrait 3:4 */}
      <div
        ref={containerRef}
        onMouseEnter={() => setIsZooming(true)}
        onMouseLeave={() => setIsZooming(false)}
        onMouseMove={handleMouseMove}
        className="relative aspect-[3/4] bg-[#F6F6F6] border border-zinc-200 overflow-hidden rounded-none cursor-crosshair group select-none"
      >
        {/* Gambar Dasar */}
        <img
          src={getOptimizedImageUrl(imageUrl, 900, 80)}
          alt={altText}
          className={`w-full h-full object-cover object-center transition-opacity duration-200 ${
            isZooming ? 'opacity-30' : 'opacity-100'
          }`}
        />

        {/* Layer Makro Zoom 2.5x Saat Hover */}
        {isZooming && (
          <div
            className="absolute inset-0 pointer-events-none bg-no-repeat transition-all duration-75"
            style={{
              backgroundImage: `url(${getOptimizedImageUrl(imageUrl, 1800, 95)})`,
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundSize: '280%',
            }}
          />
        )}

        {/* Lensa Indikator Focus Pin */}
        {isZooming && (
          <div
            className="absolute w-28 h-28 border-2 border-white/90 shadow-2xl pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-none backdrop-brightness-110"
            style={{
              left: `${zoomPos.x}%`,
              top: `${zoomPos.y}%`,
            }}
          >
            <div className="absolute inset-0 border border-black/30" />
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[9px] font-mono px-2 py-0.5 whitespace-nowrap">
              MAKRO ZOOM 2.8X
            </div>
          </div>
        )}

        {/* Badge Instruksi Kaca Pembesar (Kiri Bawah) */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-xs text-zinc-800 text-[10px] font-bold uppercase tracking-wider border border-zinc-200 shadow-xs">
          <ZoomIn size={12} className="text-[#E60012]" />
          <span>Arahkan kursor untuk inspeksi serat kain 4K</span>
        </div>
      </div>

      {/* Weather Technology Badge di Bawah Gambar */}
      <div className="pt-1 flex flex-wrap items-center justify-between gap-2">
        <WeatherTechBadge categoryName={categoryName} fabricDetails={fabricDetails} />
      </div>
    </div>
  );
}
