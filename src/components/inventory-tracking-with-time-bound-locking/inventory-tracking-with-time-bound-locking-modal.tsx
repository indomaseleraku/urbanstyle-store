'use strict';
'use client';

import React from 'react';
import { X, Unlock, AlertTriangle } from 'lucide-react';

export const InventoryTrackingWithTimeBoundLockingModal: React.FC<{
  isOpen: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
  confirmLabel?: string;
  isDestructive?: boolean;
}> = ({
  isOpen,
  title,
  description,
  onConfirm,
  onClose,
  confirmLabel = 'Konfirmasi',
  isDestructive = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-md border border-gray-200 shadow-2xl p-6 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {isDestructive ? (
              <AlertTriangle className="w-5 h-5 text-[#E60012]" />
            ) : (
              <Unlock className="w-5 h-5 text-black" />
            )}
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900 font-mono">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-black transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-gray-600 leading-relaxed font-sans">{description}</p>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100 font-mono text-xs">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 uppercase tracking-wider transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-5 py-2 uppercase tracking-wider text-white transition-colors font-semibold ${
              isDestructive
                ? 'bg-[#E60012] hover:bg-[#CC0010]'
                : 'bg-black hover:bg-gray-800'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
export default InventoryTrackingWithTimeBoundLockingModal;
