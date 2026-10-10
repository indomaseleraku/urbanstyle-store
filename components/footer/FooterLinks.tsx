// components/footer/FooterLinks.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { ModalType } from '../InformationModals';

interface FooterLinksProps {
  onOpenInfoModal?: (type: ModalType) => void;
  onOpenSizeChart?: () => void;
  onSelectCategory?: (categorySlug: string) => void;
}

export default function FooterLinks({
  onOpenInfoModal,
  onOpenSizeChart,
  onSelectCategory,
}: FooterLinksProps) {
  const handleCat = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
      const el = document.getElementById('katalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 border-b border-zinc-800">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Kolom 1 */}
        <div className="space-y-3">
          <h5 className="text-xs font-black uppercase tracking-widest text-[#E60012]">
            Tentang LifeWear
          </h5>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li>
              <button
                type="button"
                onClick={() => onOpenInfoModal && onOpenInfoModal('faq')}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Filosofi LifeWear Tokyo
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onOpenInfoModal && onOpenInfoModal('material')}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Inovasi Serat AIRism
              </button>
            </li>
            <li>
              <Link href="/admin" className="hover:text-white transition-colors">
                Portal Internal Toko
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 2 */}
        <div className="space-y-3">
          <h5 className="text-xs font-black uppercase tracking-widest text-white">
            Bantuan Pelanggan
          </h5>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li>
              <button
                type="button"
                onClick={() => onOpenInfoModal && onOpenInfoModal('shipping')}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Informasi & Tarif Pengiriman
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onOpenInfoModal && onOpenInfoModal('return')}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Kebijakan Pengembalian 14 Hari
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => onOpenSizeChart && onOpenSizeChart()}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Panduan Ukuran (Size Chart)
              </button>
            </li>
            <li>
              <Link href="/account/orders" className="hover:text-white transition-colors">
                Lacak Status Pesanan
              </Link>
            </li>
          </ul>
        </div>

        {/* Kolom 3 */}
        <div className="space-y-3">
          <h5 className="text-xs font-black uppercase tracking-widest text-white">
            Katalog Busana
          </h5>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li>
              <button
                type="button"
                onClick={() => handleCat('kemeja')}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Kemeja Flannel & Katun
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleCat('kaos')}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Kaos Heavyweight & AIRism
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleCat('celana')}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Celana Chino & Ankle Pants
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => handleCat('jaket')}
                className="hover:text-white transition-colors cursor-pointer text-left"
              >
                Jaket Parka Proteksi UV
              </button>
            </li>
          </ul>
        </div>

        {/* Kolom 4 */}
        <div className="space-y-3">
          <h5 className="text-xs font-black uppercase tracking-widest text-white">
            Akun & Keanggotaan
          </h5>
          <ul className="space-y-2 text-xs text-zinc-400">
            <li>
              <Link href="/account/profile" className="hover:text-white transition-colors">
                Profil Member UrbanStyle
              </Link>
            </li>
            <li>
              <Link href="/account/address" className="hover:text-white transition-colors">
                Buku Alamat Pengiriman
              </Link>
            </li>
            <li>
              <Link href="/account/coupons" className="hover:text-white transition-colors">
                Voucher & Kupon Saya
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
