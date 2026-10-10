// components/pdp/ColorSelector.tsx
'use client';

import React from 'react';
import { ColorVariant } from '@/lib/types';

interface ColorSelectorProps {
  colors: ColorVariant[];
  selectedIndex: number;
  onSelectColor: (index: number) => void;
}

export default function ColorSelector({
  colors,
  selectedIndex,
  onSelectColor,
}: ColorSelectorProps) {
  const currentColor = colors[selectedIndex] || colors[0];

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-bold uppercase tracking-wider text-[#111111]">
          Warna:{' '}
          <span className="font-mono text-[#E60012]">
            {currentColor?.code || currentColor?.name}
          </span>
        </span>
        <span className="text-[11px] text-[#757575] font-mono">
          {colors.length} Pilihan
        </span>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {colors.map((c, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => onSelectColor(idx)}
              className="group p-1 transition-all flex items-center justify-center cursor-pointer"
              title={`Warna: ${c.code || c.name}`}
              aria-label={c.code || c.name}
            >
              <span
                className={`w-6 h-6 rounded-full border transition-all block ${
                  isSelected
                    ? 'ring-2 ring-[#111111] ring-offset-2 scale-110 border-zinc-400'
                    : 'border-zinc-300 opacity-80 group-hover:opacity-100 group-hover:scale-105'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
