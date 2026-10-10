// app/track/[orderNumber]/page.tsx
'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { dataStore } from '@/lib/store';
import { Order, TrackingEvent } from '@/lib/types';
import { Truck, Package, ArrowLeft, FileText, RotateCw, Copy, Check } from 'lucide-react';
import TrackingTimeline from '@/components/tracking/TrackingTimeline';

export default function OrderTrackingPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const resolvedParams = use(params);
  const orderNumber = resolvedParams.orderNumber;

  const [order, setOrder] = useState<Order | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [events, setEvents] = useState<TrackingEvent[]>([]);
  const [courier, setCourier] = useState('J&T Express');
  const [trackingNumber, setTrackingNumber] = useState('-');
  const [isLoading, setIsLoading] = useState(true);
  const [copiedResi, setCopiedResi] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const result = await dataStore.getOrderTracking(orderNumber);
    if (result.order) {
      setOrder(result.order);
      setCurrentStep(result.currentStep);
      setEvents(result.events);
      setCourier(result.courier);
      setTrackingNumber(result.trackingNumber);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [orderNumber]);

  const handleCopyResi = () => {
    if (trackingNumber && trackingNumber !== '-') {
      navigator.clipboard.writeText(trackingNumber);
      setCopiedResi(true);
      setTimeout(() => setCopiedResi(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans">
        <div className="text-center space-y-2">
          <RotateCw className="w-8 h-8 animate-spin mx-auto text-zinc-400" />
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-600">
            Memuat Data Pelacakan Paket...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full bg-white border border-zinc-200 p-8 text-center space-y-4 rounded-none">
          <Package className="w-12 h-12 mx-auto text-zinc-400" />
          <h1 className="text-base font-bold uppercase tracking-tight text-zinc-950">
            Pesanan Tidak Ditemukan
          </h1>
          <p className="text-xs text-zinc-500">
            Nomor pesanan <span className="font-mono font-bold text-black">{orderNumber}</span> tidak terdaftar dalam basis data sistem.
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-none"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-black transition-colors"
          >
            <ArrowLeft size={16} /> Kembali ke Beranda
          </Link>
          <Link
            href={`/invoice/${order.order_number}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider bg-zinc-950 hover:bg-[#E60012] text-white px-3 py-1.5 transition-colors rounded-none"
          >
            <FileText size={14} /> Faktur Pesanan
          </Link>
        </div>

        {/* Courier Summary Card */}
        <div className="p-4 sm:p-6 bg-white border border-zinc-200 shadow-xs space-y-3 rounded-none">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-zinc-100">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 font-mono">
                // STATUS PENGIRIMAN LOGISTIK
              </span>
              <h1 className="text-base font-black uppercase tracking-tight text-zinc-950">
                Pesanan #{order.order_number}
              </h1>
            </div>
            <span className="px-2.5 py-1 bg-[#E60012] text-white text-[10px] font-black uppercase tracking-wider rounded-none">
              {order.status}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Kurir Logistik:</span>
              <span className="font-bold text-zinc-900 flex items-center gap-1 mt-0.5">
                <Truck size={13} className="text-[#E60012]" /> {courier}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Nomor Resi Pengiriman:</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono font-bold text-zinc-900">{trackingNumber}</span>
                {trackingNumber && trackingNumber !== '-' && (
                  <button
                    type="button"
                    onClick={handleCopyResi}
                    className="text-zinc-500 hover:text-[#E60012] p-0.5 cursor-pointer"
                    title="Salin Resi"
                  >
                    {copiedResi ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  </button>
                )}
              </div>
            </div>
            <div>
              <span className="text-[10px] text-zinc-500 font-bold uppercase block">Penerima & Alamat:</span>
              <span className="text-zinc-700 truncate block mt-0.5" title={order.customer_address}>
                {order.customer_name} ({order.customer_address})
              </span>
            </div>
          </div>
        </div>

        {/* Modular Stepper & Timeline Events */}
        <TrackingTimeline currentStep={currentStep} events={events} />
      </div>
    </div>
  );
}
