// components/footer/FooterValueProps.tsx
'use client';

import React from 'react';
import { Truck, Award, RotateCcw, ShieldCheck } from 'lucide-react';
import { ModalType } from '../InformationModals';

interface FooterValuePropsProps {
  onOpenInfoModal?: (type: ModalType) => void;
}

export default function FooterValueProps({ onOpenInfoModal }: FooterValuePropsProps) {
  const valueProps = [
    {
      icon: <Truck size={22} className="text-[#E60012]" />,
      title: 'Bebas Ongkir Nasional',
      desc: 'Gratis ongkir untuk transaksi min. Rp 400.000 ke seluruh Indonesia.',
      modal: 'shipping' as ModalType,
    },
    {
      icon: <Award size={22} className="text-[#E60012]" />,
      title: 'Bahan Premium Berkualitas',
      desc: 'Katun double-brushed, serat AIRism sejuk, dan standar jahitan Jepang.',
      modal: 'material' as ModalType,
    },
    {
      icon: <RotateCcw size={22} className="text-[#E60012]" />,
      title: 'Retur Mudah 14 Hari',
      desc: 'Jaminan penukaran ukuran fleksibel jika pakaian belum cocok.',
      modal: 'return' as ModalType,
    },
    {
      icon: <ShieldCheck size={22} className="text-[#E60012]" />,
      title: 'Jaminan Keaslian 100%',
      desc: 'Produk asli berkualitas langsung dari pabrikan bersertifikasi.',
      modal: 'faq' as ModalType,
    },
  ];

  return (
    <div className="border-b border-zinc-800 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {valueProps.map((item, idx) => (
          <div
            key={idx}
            onClick={() => onOpenInfoModal && onOpenInfoModal(item.modal)}
            className="flex items-start gap-3.5 p-3 hover:bg-zinc-900/60 transition-colors cursor-pointer rounded-none group"
          >
            <div className="p-2 bg-zinc-900 border border-zinc-800 group-hover:border-[#E60012] transition-colors rounded-none shrink-0">
              {item.icon}
            </div>
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#E60012] transition-colors">
                {item.title}
              </h4>
              <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
