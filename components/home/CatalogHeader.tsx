// components/home/CatalogHeader.tsx
'use client';

import React from 'react';

interface CatalogHeaderProps {
  selectedGender: string;
  selectedCategory: string;
  categoryDisplayName: string;
}

export default function CatalogHeader({
  selectedGender,
  selectedCategory,
  categoryDisplayName,
}: CatalogHeaderProps) {
  const genderLabel = selectedGender === 'all' ? 'SEMUA KOLEKSI' : selectedGender.toUpperCase();

  return (
    <div className="space-y-1">
      {/* Uniqlo LifeWear Minimalist Breadcrumbs */}
      <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
        <span>BERANDA</span>
        <span>/</span>
        <span className="text-[#E60012]">{genderLabel}</span>
        {selectedCategory !== 'all' && (
          <>
            <span>/</span>
            <span className="text-zinc-800">{categoryDisplayName}</span>
          </>
        )}
      </div>

      <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-zinc-950">
        {selectedCategory === 'all'
          ? selectedGender === 'all'
            ? 'Semua Koleksi Busana LifeWear'
            : `Koleksi ${selectedGender.toUpperCase()}`
          : categoryDisplayName}
      </h2>

      <p className="text-xs text-zinc-500">
        Koleksi pakaian fungsional berdesain sederhana dan berkualitas tinggi untuk kenyamanan keseharian.
      </p>
    </div>
  );
}
