// src/components/responsive-mobile-first-layout-refinement/responsive-mobile-first-layout-refinement-modal.tsx
'use client';

import React from 'react';
import { X, Smartphone, Check, ArrowRight } from 'lucide-react';

interface MobileLayoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type?: 'bottom-sheet' | 'dialog';
  children: React.ReactNode;
}

export default function ResponsiveMobileFirstLayoutModal({
  isOpen,
  onClose,
  title,
  type = 'bottom-sheet',
  children,
}: MobileLayoutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`bg-white border border-zinc-300 w-full overflow-hidden shadow-2xl relative rounded-none ${
          type === 'bottom-sheet'
            ? 'animate-in slide-in-from-bottom duration-300 max-h-[85vh] flex flex-col'
            : 'max-w-md my-auto'
        }`}
      >
        {/* Header */}
        <div className="p-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#E60012] text-white rounded-none">
              <Smartphone size={15} />
            </span>
            <h3 className="text-xs sm:text-sm font-black uppercase text-zinc-950">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-200 transition-colors cursor-pointer"
            aria-label="Tutup sheet"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3 overflow-y-auto text-xs text-zinc-600">
          {children}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-zinc-950 text-white text-xs font-bold uppercase rounded-none cursor-pointer hover:bg-[#E60012] transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
