// src/components/e-commerce-product-display-optimization/e-commerce-product-display-optimization-modal.tsx
'use client';

import React from 'react';
import { X, AlertCircle, CheckCircle2, ShieldAlert, Sparkles } from 'lucide-react';
import { Product } from '@/lib/types';

interface ProductDisplayModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  type?: 'confirm' | 'drawer' | 'alert';
  selectedProduct?: Product | null;
  onConfirm?: () => void;
  confirmLabel?: string;
  children?: React.ReactNode;
}

export default function ProductDisplayOptimizationModal({
  isOpen,
  onClose,
  title,
  type = 'confirm',
  selectedProduct,
  onConfirm,
  confirmLabel = 'Konfirmasi',
  children,
}: ProductDisplayModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <div
        className={`bg-white border border-zinc-300 w-full overflow-hidden shadow-2xl relative my-auto rounded-none ${
          type === 'drawer' ? 'max-w-2xl' : 'max-w-md'
        }`}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#E60012] text-white rounded-none">
              <Sparkles size={15} />
            </span>
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-tight text-zinc-950">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-200 transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4 text-xs text-zinc-600">
          {selectedProduct && (
            <div className="flex items-center gap-3 p-3 bg-zinc-50 border border-zinc-200">
              <img
                src={selectedProduct.image_url}
                alt={selectedProduct.name}
                className="w-12 h-16 object-cover bg-zinc-200"
              />
              <div className="space-y-0.5">
                <span className="text-[10px] text-zinc-400 font-mono uppercase block">
                  {selectedProduct.category_name}
                </span>
                <h4 className="font-bold text-zinc-900 uppercase line-clamp-1">
                  {selectedProduct.name}
                </h4>
                <p className="font-mono font-bold text-[#E60012]">
                  Rp {selectedProduct.price.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
          )}

          {children}
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-zinc-50 border-t border-zinc-200 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white border border-zinc-300 text-zinc-700 hover:bg-zinc-100 text-xs font-bold uppercase rounded-none cursor-pointer"
          >
            Tutup
          </button>
          {onConfirm && (
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="px-5 py-2 bg-[#E60012] hover:bg-[#c80010] text-white text-xs font-bold uppercase tracking-wider rounded-none cursor-pointer shadow-xs"
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
