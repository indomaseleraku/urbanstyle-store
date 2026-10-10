// components/Footer.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import FooterNewsletter from './footer/FooterNewsletter';
import FooterValueProps from './footer/FooterValueProps';
import FooterLinks from './footer/FooterLinks';
import { ModalType } from './InformationModals';

interface FooterProps {
  onOpenInfoModal?: (type: ModalType) => void;
  onOpenSizeChart?: () => void;
  onSelectCategory?: (categorySlug: string) => void;
}

export default function Footer({ onOpenInfoModal, onOpenSizeChart, onSelectCategory }: FooterProps) {
  return (
    <footer className="bg-[#111111] text-white border-t border-zinc-800">
      {/* 1. Newsletter Voucher Banner */}
      <FooterNewsletter />

      {/* 2. Value Propositions */}
      <FooterValueProps onOpenInfoModal={onOpenInfoModal} />

      {/* 3. Structured 4-Column Directory */}
      <FooterLinks
        onOpenInfoModal={onOpenInfoModal}
        onOpenSizeChart={onOpenSizeChart}
        onSelectCategory={onSelectCategory}
      />

      {/* 4. Bottom Legal, Copyright & Brand Statement */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-6 h-6 bg-[#E60012] text-white font-black text-[10px] flex items-center justify-center rounded-none">
                US
              </div>
              <div className="w-6 h-6 bg-[#E60012] text-white font-black text-[8px] flex items-center justify-center rounded-none">
                アー
              </div>
            </div>
            <div>
              <p className="font-bold text-zinc-300 uppercase tracking-wider text-[11px]">
                UrbanStyle LifeWear Store
              </p>
              <p className="text-[10px] text-zinc-600">
                Pakaian fungsional berkualitas tinggi untuk kenyamanan gaya hidup harian.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-zinc-500">
            <span>© 2026 UrbanStyle Store. Hak Cipta Dilindungi.</span>
            <span className="hidden sm:inline">•</span>
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Kebijakan Privasi
            </Link>
            <span>•</span>
            <Link href="/" className="hover:text-zinc-300 transition-colors">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
