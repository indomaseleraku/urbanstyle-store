// components/Footer.tsx
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Award, 
  Mail, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Sparkles,
  CreditCard
} from 'lucide-react';
import { ModalType } from './InformationModals';

interface FooterProps {
  onOpenInfoModal?: (type: ModalType) => void;
  onOpenSizeChart?: () => void;
  onSelectCategory?: (categorySlug: string) => void;
}

export default function Footer({ onOpenInfoModal, onOpenSizeChart, onSelectCategory }: FooterProps) {
  const [emailInput, setEmailInput] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [copiedCoupon, setCopiedCoupon] = useState(false);

  // Mobile Accordion state
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    about: false,
    help: false,
    categories: false,
    developer: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleCategoryNav = (slug: string) => {
    if (onSelectCategory) {
      onSelectCategory(slug);
      const el = document.getElementById('katalog');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) return;
    setNewsletterSubscribed(true);
  };

  const copyCouponCode = () => {
    navigator.clipboard.writeText('URBANWELCOME50');
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  return (
    <footer className="bg-[#111111] text-white border-t border-zinc-800">
      
      {/* ======================================================== */}
      {/* LAYER 1: Newsletter Voucher Rp 50.000 Banner             */}
      {/* ======================================================== */}
      <div className="border-b border-zinc-800 bg-[#18181B] py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#E60012] text-white text-[9px] font-black uppercase tracking-widest">
              <Sparkles size={11} />
              <span>VOUCHER SAMBUTAN MEMBER</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight text-white">
              Dapatkan Diskon Rp 50.000 untuk Pesanan Pertama
            </h3>
            <p className="text-xs text-zinc-400 max-w-lg">
              Daftarkan email Anda untuk buletin LifeWear dan gunakan kode voucher <strong className="text-white font-mono">URBANWELCOME50</strong> saat checkout.
            </p>
          </div>

          <div className="w-full md:w-auto min-w-[280px] sm:min-w-[360px]">
            {newsletterSubscribed ? (
              <div className="p-3 bg-zinc-900 border border-zinc-700 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <Check size={16} />
                  <span>Kupon Aktif: <strong>URBANWELCOME50</strong></span>
                </div>
                <button
                  type="button"
                  onClick={copyCouponCode}
                  className="px-3 py-1 bg-[#E60012] text-white text-[10px] font-bold uppercase tracking-wider hover:bg-red-700 transition-colors"
                >
                  {copiedCoupon ? 'Tersalin!' : 'Salin Kode'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex items-stretch gap-0">
                <div className="relative flex-1">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Masukkan alamat email Anda..."
                    className="w-full pl-10 pr-3 py-3 bg-zinc-900 border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#E60012] rounded-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-3 bg-[#E60012] hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-colors shrink-0 rounded-none shadow-xs"
                >
                  Klaim
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* LAYER 2: 4 Kartu Value Garansi & Layanan Konsumen       */}
      {/* ======================================================== */}
      <div className="border-b border-zinc-800 bg-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          
          <button
            type="button"
            onClick={() => onOpenInfoModal && onOpenInfoModal('shipping')}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-2.5 -m-2 hover:bg-zinc-900/80 transition-colors text-left group cursor-pointer border border-transparent hover:border-zinc-800"
          >
            <Truck className="text-[#E60012] shrink-0 group-hover:scale-110 transition-transform" size={24} />
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#E60012] transition-colors">Bebas Biaya Kirim</h4>
              <p className="text-[11px] text-zinc-400">Gratis ongkir belanja min. Rp 400.000 se-Indonesia</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenInfoModal && onOpenInfoModal('return')}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-2.5 -m-2 hover:bg-zinc-900/80 transition-colors text-left group cursor-pointer border border-transparent hover:border-zinc-800"
          >
            <RotateCcw className="text-[#E60012] shrink-0 group-hover:scale-110 transition-transform" size={24} />
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#E60012] transition-colors">Garansi 30 Hari</h4>
              <p className="text-[11px] text-zinc-400">Bebas tukar ukuran jika tidak pas di badan</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenInfoModal && onOpenInfoModal('lifewear')}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-2.5 -m-2 hover:bg-zinc-900/80 transition-colors text-left group cursor-pointer border border-transparent hover:border-zinc-800"
          >
            <Award className="text-[#E60012] shrink-0 group-hover:scale-110 transition-transform" size={24} />
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#E60012] transition-colors">100% Standar LifeWear</h4>
              <p className="text-[11px] text-zinc-400">Material katun murni & jahitan garment presisi</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => onOpenInfoModal && onOpenInfoModal('help')}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-3 p-2.5 -m-2 hover:bg-zinc-900/80 transition-colors text-left group cursor-pointer border border-transparent hover:border-zinc-800"
          >
            <ShieldCheck className="text-[#E60012] shrink-0 group-hover:scale-110 transition-transform" size={24} />
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-white group-hover:text-[#E60012] transition-colors">Pembayaran Aman QRIS</h4>
              <p className="text-[11px] text-zinc-400">Verifikasi instan standar Bank Indonesia & transfer</p>
            </div>
          </button>

        </div>
      </div>

      {/* ======================================================== */}
      {/* LAYER 3: Main Footer Links / Mobile Accordion Sitemap    */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Info & Mission Statement */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#E60012] text-white font-black text-sm flex items-center justify-center">
                US
              </div>
              <div className="w-8 h-8 bg-[#E60012] text-white font-black text-[9px] flex items-center justify-center text-center leading-none">
                アー<br/>バン
              </div>
              <span className="font-black text-xl tracking-tight uppercase ml-1">
                URBANSTYLE STORE
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Sistem Informasi Manajemen Retail Fashion terinspirasi filosofi Uniqlo LifeWear. Mengintegrasikan Transaction Processing System (TPS) stok atomik, modul DSS penjualan, serta teknologi tekstil modern.
            </p>
            <div className="pt-1 flex items-center gap-3 text-xs text-zinc-400">
              <span className="font-mono text-[10px] bg-zinc-900 border border-zinc-800 px-2 py-1 text-zinc-300">
                PROYEK SIM V4.0
              </span>
              <span className="font-mono text-[10px] text-zinc-500">
                // UNIVERSITAS PAMULANG
              </span>
            </div>
          </div>

          {/* Kolom 2: Bantuan & Panduan */}
          <div className="md:col-span-3 border-t md:border-t-0 border-zinc-800 pt-3 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('help')}
              className="w-full flex items-center justify-between text-left md:pointer-events-none pb-2 md:pb-0"
            >
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-200">
                Bantuan & Panduan
              </h4>
              <span className="md:hidden text-zinc-400">
                {openSections.help ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>
            <ul className={`space-y-2.5 text-xs text-zinc-400 pt-2 ${openSections.help ? 'block' : 'hidden md:block'}`}>
              <li>
                <button 
                  onClick={() => onOpenSizeChart && onOpenSizeChart()}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Panduan Ukuran (Size Chart cm)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenInfoModal && onOpenInfoModal('return')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Kebijakan Pengembalian & Retur 30 Hari
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenInfoModal && onOpenInfoModal('shipping')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Panduan Bebas Ongkir & Ekspedisi
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onOpenInfoModal && onOpenInfoModal('help')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Layanan Bantuan Konsumen & FAQ
                </button>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Filosofi & Koleksi */}
          <div className="md:col-span-2 border-t md:border-t-0 border-zinc-800 pt-3 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('categories')}
              className="w-full flex items-center justify-between text-left md:pointer-events-none pb-2 md:pb-0"
            >
              <h4 className="text-xs font-black uppercase tracking-widest text-zinc-200">
                Filosofi & Toko
              </h4>
              <span className="md:hidden text-zinc-400">
                {openSections.categories ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>
            <ul className={`space-y-2.5 text-xs text-zinc-400 pt-2 ${openSections.categories ? 'block' : 'hidden md:block'}`}>
              <li>
                <button 
                  onClick={() => onOpenInfoModal && onOpenInfoModal('lifewear')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Tentang Filosofi LifeWear
                </button>
              </li>
              <li>
                {onSelectCategory ? (
                  <button 
                    type="button"
                    onClick={() => handleCategoryNav('kemeja')} 
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Koleksi Kemeja & Flannel
                  </button>
                ) : (
                  <Link href="/?category=kemeja#katalog" className="hover:text-white transition-colors">
                    Koleksi Kemeja & Flannel
                  </Link>
                )}
              </li>
              <li>
                {onSelectCategory ? (
                  <button 
                    type="button"
                    onClick={() => handleCategoryNav('kaos')} 
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Kaos Katun & AIRism
                  </button>
                ) : (
                  <Link href="/?category=kaos#katalog" className="hover:text-white transition-colors">
                    Kaos Katun & AIRism
                  </Link>
                )}
              </li>
              <li>
                {onSelectCategory ? (
                  <button 
                    type="button"
                    onClick={() => handleCategoryNav('celana')} 
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Celana Chino & Ankle
                  </button>
                ) : (
                  <Link href="/?category=celana#katalog" className="hover:text-white transition-colors">
                    Celana Chino & Ankle
                  </Link>
                )}
              </li>
              <li>
                {onSelectCategory ? (
                  <button 
                    type="button"
                    onClick={() => handleCategoryNav('jaket')} 
                    className="hover:text-white transition-colors cursor-pointer text-left"
                  >
                    Jaket Parka & Outerwear
                  </button>
                ) : (
                  <Link href="/?category=jaket#katalog" className="hover:text-white transition-colors">
                    Jaket Parka & Outerwear
                  </Link>
                )}
              </li>
            </ul>
          </div>

          {/* Kolom 4: Pengembang SIM */}
          <div className="md:col-span-3 border-t md:border-t-0 border-zinc-800 pt-3 md:pt-0">
            <button
              type="button"
              onClick={() => toggleSection('developer')}
              className="w-full flex items-center justify-between text-left md:pointer-events-none pb-2 md:pb-0"
            >
              <h4 className="text-xs font-black uppercase tracking-widest text-[#E60012]">
                Pengembang SIM
              </h4>
              <span className="md:hidden text-zinc-400">
                {openSections.developer ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </span>
            </button>
            <div className={`pt-2 ${openSections.developer ? 'block' : 'hidden md:block'}`}>
              <div className="p-3.5 bg-zinc-900 border border-zinc-800 text-xs space-y-1.5 text-zinc-300">
                <p className="font-bold text-white uppercase text-[11px]">
                  Kimy Eka Ardiansyah
                </p>
                <p className="text-[10px] text-zinc-400 leading-relaxed">
                  Mahasiswa Teknik Informatika, Universitas Pamulang. Dikembangkan untuk Ujian Akhir Semester (UAS) & Jurnal Ilmiah Komputer JIUP.
                </p>
                <div className="pt-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-zinc-400">Sistem Aktif & Terverifikasi</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* LAYER 4: Trust Badge Logos Pembayaran & Kurir Ekspedisi  */}
      {/* ======================================================== */}
      <div className="border-t border-zinc-800 bg-[#0A0A0A] py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          
          {/* Mitra Pembayaran */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block">
              METODE PEMBAYARAN RESMI
            </span>
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-zinc-300">
                QRIS DINAMIS
              </span>
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-zinc-300">
                BCA
              </span>
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-zinc-300">
                MANDIRI
              </span>
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-zinc-300">
                BNI
              </span>
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-zinc-300">
                BRI
              </span>
            </div>
          </div>

          {/* Mitra Ekspedisi */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block">
              KURIR LOGISTIK RESMI
            </span>
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-zinc-300">
                J&T EXPRESS
              </span>
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-zinc-300">
                JNE REGULER
              </span>
              <span className="px-2 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-mono font-bold text-zinc-300">
                SICEPAT EKSPRES
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* ======================================================== */}
      {/* LAYER 5: Bottom Legal Bar                                */}
      {/* ======================================================== */}
      <div className="border-t border-zinc-900 py-4 px-4 text-center text-[11px] text-zinc-500">
        <p>Copyright © 2026 UrbanStyle Store. Dibuat oleh Kimy Eka Ardiansyah (Teknik Informatika, Universitas Pamulang). Hak Cipta Dilindungi Undang-Undang.</p>
      </div>

    </footer>
  );
}
