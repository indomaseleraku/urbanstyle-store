'use strict';
'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Realtime updates error boundary:', error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-gray-200 p-8 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-50 text-[#E60012] mb-2">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-base font-bold text-gray-900 uppercase font-mono tracking-wider">
          Gagal Memuat Kanal Realtime Supabase
        </h2>
        <p className="text-xs text-gray-600 font-sans leading-relaxed">
          {error?.message ||
            'Terjadi kendala saat menyambungkan sesi WebSocket ke Supabase Realtime Gateway.'}
        </p>
        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black hover:bg-gray-800 text-white text-xs font-medium uppercase tracking-wider font-mono transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Sambungkan Ulang
        </button>
      </div>
    </div>
  );
}
