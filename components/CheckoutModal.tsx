// components/CheckoutModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { CartItem, Order, UserAddress, BANK_ACCOUNTS } from '@/lib/types';
import { 
  X, 
  QrCode, 
  CheckCircle2, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  Copy, 
  Check, 
  Tag, 
  Truck,
  Sparkles,
  MapPin,
  Building2,
  AlertCircle
} from 'lucide-react';
import { COURIERS, FREE_SHIPPING_THRESHOLD } from './CartDrawer';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/store';
import { DynamicQRISCard } from './DynamicQRISCard';
import { RealtimePaymentStatus } from './RealtimePaymentStatus';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  selectedCourier: string;
  onConfirmOrder: (payload: {
    user_id?: string;
    customer_name: string;
    customer_phone: string;
    customer_address: string;
    shipping_courier: string;
    shipping_cost: number;
    coupon_code?: string;
    discount_amount?: number;
    payment_method: 'QRIS' | 'Bank Transfer' | 'COD';
    bank_name?: string;
  }) => Promise<{ success: boolean; order?: Order; message?: string }>;
  onOrderSuccess: () => void;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  items,
  selectedCourier,
  onConfirmOrder,
  onOrderSuccess,
}: CheckoutModalProps) {
  const { user } = useAuth();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'QRIS' | 'Bank Transfer'>('QRIS');
  const [selectedBank, setSelectedBank] = useState<keyof typeof BANK_ACCOUNTS>('BCA');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [copiedRekening, setCopiedRekening] = useState(false);
  const [copiedNominal, setCopiedNominal] = useState(false);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Auto pre-fill from user profile and address book
  useEffect(() => {
    if (user && isOpen) {
      if (!name) setName(user.full_name || '');
      if (!phone) setPhone(user.phone || '');
      
      dataStore.getUserAddresses(user.id).then((addrs) => {
        setSavedAddresses(addrs);
        const def = addrs.find(a => a.is_default) || addrs[0];
        if (def && !address) {
          setAddress(`${def.address_line}, ${def.city} ${def.postal_code}`);
          if (def.phone && !phone) setPhone(def.phone);
        }
      });
    }
  }, [user, isOpen]);

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const courierObj = COURIERS.find(c => c.name === selectedCourier) || COURIERS[0];
  const shippingCost = isFreeShipping ? 0 : courierObj.price;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = async (codeToApply?: string) => {
    const code = (codeToApply || couponCode).toUpperCase().trim();
    if (!code) return;
    if (codeToApply) setCouponCode(code);
    setIsValidatingCoupon(true);
    setCouponMsg(null);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();

      if (data.valid) {
        setAppliedCoupon(code);
        setDiscountAmount(data.discount_amount);
        setCouponMsg({ text: data.message, isError: false });
      } else {
        setCouponMsg({ text: data.message || 'Kupon tidak valid.', isError: true });
        setAppliedCoupon(null);
        setDiscountAmount(0);
      }
    } catch (e) {
      setCouponMsg({ text: 'Gagal memvalidasi kupon.', isError: true });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('Mohon lengkapi Nama, No. WhatsApp, dan Alamat Pengiriman.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await onConfirmOrder({
        user_id: user?.id,
        customer_name: name,
        customer_phone: phone,
        customer_address: address,
        shipping_courier: selectedCourier,
        shipping_cost: shippingCost,
        coupon_code: appliedCoupon || undefined,
        discount_amount: discountAmount > 0 ? discountAmount : undefined,
        payment_method: paymentMethod,
        bank_name: paymentMethod === 'Bank Transfer' ? selectedBank : undefined,
      });

      if (res.success && res.order) {
        setCreatedOrder(res.order);
        onOrderSuccess();
      } else {
        setErrorMsg(res.message || 'Terjadi kesalahan saat memproses pesanan.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Gagal terhubung ke server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyOrderNumber = () => {
    if (createdOrder) {
      navigator.clipboard.writeText(createdOrder.order_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const copyRekening = (noRek: string) => {
    navigator.clipboard.writeText(noRek);
    setCopiedRekening(true);
    setTimeout(() => setCopiedRekening(false), 2000);
  };

  const copyNominal = (nom: number) => {
    navigator.clipboard.writeText(String(nom));
    setCopiedNominal(true);
    setTimeout(() => setCopiedNominal(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 font-sans">
      <div className="bg-white border border-zinc-300 w-full max-w-xl overflow-hidden shadow-2xl animate-in max-sm:slide-in-from-bottom sm:zoom-in-95 duration-200 max-sm:max-h-[92vh] rounded-none">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div>
            <span className="text-[10px] font-bold text-[#E60012] uppercase tracking-widest">
              MODUL TRANSAKSI (TPS)
            </span>
            <h2 className="text-base sm:text-lg font-black uppercase tracking-tight text-zinc-900">
              {createdOrder ? 'Faktur Nota Transaksi Digital' : 'Konfirmasi & Checkout Belanja'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-zinc-900" aria-label="Tutup">
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[85vh] overflow-y-auto">
          {!createdOrder ? (
            /* STEP 1: FORM CHECKOUT */
            <form onSubmit={handleCheckout} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-none">
                  {errorMsg}
                </div>
              )}

              {/* Address selector if saved addresses exist */}
              {savedAddresses.length > 0 && (
                <div className="p-3 bg-zinc-50 border border-zinc-200 space-y-1.5 rounded-none">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                    <MapPin size={12} />
                    <span>Pilih dari Buku Alamat Tersimpan:</span>
                  </span>
                  <select
                    onChange={(e) => {
                      const sel = savedAddresses.find(a => a.id === e.target.value);
                      if (sel) {
                        setAddress(`${sel.address_line}, ${sel.city} ${sel.postal_code}`);
                        if (sel.phone) setPhone(sel.phone);
                        if (sel.recipient_name) setName(sel.recipient_name);
                      }
                    }}
                    className="w-full p-2 text-base md:text-xs border border-zinc-300 bg-white font-medium rounded-none"
                  >
                    <option value="">-- Gunakan Alamat Tersimpan --</option>
                    {savedAddresses.map(a => (
                      <option key={a.id} value={a.id}>
                        {a.label}: {a.recipient_name} - {a.city}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider block mb-1">
                    Nama Lengkap Penerima *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Kimy Eka Ardiansyah"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-base md:text-sm border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:border-zinc-900 font-medium rounded-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider block mb-1">
                    Nomor WhatsApp / Ponsel *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-base md:text-sm border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:border-zinc-900 font-medium rounded-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider block mb-1">
                    Alamat Lengkap Pengiriman *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Jl. Surya Kencana No. 1, Pamulang Barat, Tangerang Selatan"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-base md:text-sm border border-zinc-300 bg-zinc-50 focus:bg-white focus:outline-none focus:border-zinc-900 font-medium rounded-none"
                  />
                </div>
              </div>

              {/* Coupon Engine Input Box */}
              <div className="pt-3 border-t border-zinc-200 space-y-2">
                <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider block flex items-center gap-1.5">
                  <Tag size={13} className="text-[#E60012]" />
                  <span>Kupon Diskon & Promo:</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Contoh: URBANWELCOME50"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 text-base md:text-xs border border-zinc-300 uppercase font-mono tracking-wider focus:outline-none focus:border-black rounded-none"
                  />
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon()}
                    disabled={isValidatingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-black hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 rounded-none"
                  >
                    {isValidatingCoupon ? 'Cek...' : 'Terapkan'}
                  </button>
                </div>

                {/* 1-Click Voucher Chips (P0-05) */}
                <div className="space-y-1 pt-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                    Kupon Rekomendasi (Klik 1x):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {[
                      { code: 'URBANWELCOME50', label: 'Potongan Rp 50.000' },
                      { code: 'LIFEWEAR10', label: 'Diskon 10%' },
                      { code: 'BEBASONGKIR', label: 'Gratis Ongkir Rp 15rb' },
                    ].map((v) => (
                      <button
                        key={v.code}
                        type="button"
                        onClick={() => handleApplyCoupon(v.code)}
                        className={`text-left px-2.5 py-1.5 border text-[10px] font-mono transition-all rounded-none flex items-center gap-1.5 ${
                          appliedCoupon === v.code
                            ? 'bg-zinc-950 text-white border-zinc-950 font-bold shadow-xs'
                            : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200 hover:border-zinc-400'
                        }`}
                      >
                        <span className="font-bold">{v.code}</span>
                        <span className={`text-[9px] font-sans ${appliedCoupon === v.code ? 'text-zinc-300' : 'text-zinc-500'}`}>
                          ({v.label})
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {couponMsg && (
                  <p className={`text-[11px] font-medium ${couponMsg.isError ? 'text-red-600' : 'text-green-700'}`}>
                    {couponMsg.text}
                  </p>
                )}
              </div>

              {/* Payment Method Selector */}
              <div className="pt-2 border-t border-zinc-200">
                <label className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider block mb-2">
                  Metode Pembayaran Digital:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('QRIS')}
                    className={`p-3 border text-left flex items-start gap-2.5 transition-all rounded-none ${
                      paymentMethod === 'QRIS'
                        ? 'border-zinc-950 bg-zinc-50 ring-2 ring-zinc-950'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <QrCode size={20} className="text-[#E60012] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase text-zinc-900">QRIS Dinamis</p>
                      <p className="text-[10px] text-zinc-500 font-medium">Instan semua e-wallet & m-banking</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('Bank Transfer')}
                    className={`p-3 border text-left flex items-start gap-2.5 transition-all rounded-none ${
                      paymentMethod === 'Bank Transfer'
                        ? 'border-zinc-950 bg-zinc-50 ring-2 ring-zinc-950'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <ShieldCheck size={20} className="text-zinc-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-black uppercase text-zinc-900">Transfer Bank</p>
                      <p className="text-[10px] text-zinc-500 font-medium">BCA, Mandiri, BNI, BRI</p>
                    </div>
                  </button>
                </div>

                {/* Sub-selector for Bank Destination */}
                {paymentMethod === 'Bank Transfer' && (
                  <div className="mt-3 p-3 bg-zinc-50 border border-zinc-200 space-y-2 animate-in fade-in duration-150">
                    <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block">
                      Pilih Bank Rekening Tujuan:
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {(['BCA', 'Mandiri', 'BRI', 'BNI'] as const).map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setSelectedBank(b)}
                          className={`py-2 px-1 text-center border text-xs font-bold transition-all ${
                            selectedBank === b
                              ? 'border-zinc-950 bg-zinc-950 text-white ring-1 ring-zinc-950'
                              : 'border-zinc-200 bg-white hover:border-zinc-400 text-zinc-800'
                          }`}
                        >
                          <span className="block">{b}</span>
                          <span className="block text-[8px] font-mono font-normal opacity-75">0% Fee</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-zinc-500 pt-1">
                      ℹ️ Sistem akan menambahkan <strong>3 digit kode unik acak</strong> pada nominal transfer untuk identifikasi otomatis (PRD V5.2 FR-13).
                    </p>
                  </div>
                )}
              </div>

              {/* Summary Box */}
              <div className="p-3.5 bg-zinc-100 border border-zinc-200 text-xs space-y-1 rounded-none">
                <div className="flex justify-between text-zinc-600">
                  <span>Total Produk ({items.length} item):</span>
                  <span>Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-green-700 font-semibold">
                    <span>Diskon Kupon ({appliedCoupon}):</span>
                    <span>- Rp {discountAmount.toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600">
                  <span>Ongkos Kirim ({selectedCourier}):</span>
                  <span>{isFreeShipping ? 'GRATIS' : `Rp ${shippingCost.toLocaleString('id-ID')}`}</span>
                </div>
                <div className="flex justify-between font-black text-sm text-zinc-950 pt-1 border-t border-zinc-300">
                  <span>TOTAL ESTIMASI:</span>
                  <span className="text-[#E60012]">
                    Rp {grandTotal.toLocaleString('id-ID')}
                    {paymentMethod === 'Bank Transfer' && <span className="text-[10px] text-zinc-500 font-normal ml-1">(+ 3 digit kode unik saat submit)</span>}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#111111] hover:bg-[#E60012] text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2 rounded-none min-h-[48px]"
              >
                {isSubmitting ? (
                  <span>Memproses Transaksi...</span>
                ) : (
                  <>
                    <span>
                      {paymentMethod === 'Bank Transfer' 
                        ? 'Konfirmasi & Dapatkan Kode Unik Transfer' 
                        : 'Konfirmasi & Terbitkan QRIS'}
                    </span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: NOTA INVOICE DIGITAL & PEMBAYARAN */
            <div className="space-y-5 text-center">
              
              {/* Success Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold uppercase">
                <CheckCircle2 size={16} />
                <span>Transaksi Berhasil Dibuat (Status: {createdOrder.status})</span>
              </div>

              {/* Order Number Box */}
              <div className="p-3 bg-zinc-100 border border-zinc-200 flex items-center justify-between text-left">
                <div>
                  <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">NOMOR PESANAN RESMI</p>
                  <p className="text-sm font-black text-zinc-950 font-mono">{createdOrder.order_number}</p>
                </div>
                <button
                  onClick={copyOrderNumber}
                  className="px-2.5 py-1 text-xs font-semibold bg-white border border-zinc-300 hover:bg-zinc-50 flex items-center gap-1"
                >
                  {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copied ? 'Tersalin' : 'Salin'}</span>
                </button>
              </div>

              {/* Payment Detail: Bank Transfer vs Dynamic QRIS */}
              {createdOrder.payment_method === 'Bank Transfer' ? (
                <div className="p-4 sm:p-5 bg-white border-2 border-zinc-900 text-left space-y-4 max-w-md mx-auto shadow-sm">
                  <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200">
                    <div className="flex items-center gap-2">
                      <Building2 size={16} className="text-[#E60012]" />
                      <span className="text-xs font-black uppercase text-zinc-950">
                        {BANK_ACCOUNTS[createdOrder.bank_name || 'BCA']?.bankName || 'Transfer Bank'}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold uppercase bg-zinc-100 text-zinc-700 px-2 py-0.5">
                      0% Potongan Fee
                    </span>
                  </div>

                  {/* Nomor Rekening Box */}
                  <div className="p-3 bg-zinc-50 border border-zinc-200 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">NOMOR REKENING TUJUAN</p>
                      <p className="text-base font-mono font-black text-zinc-950 tracking-wider">
                        {BANK_ACCOUNTS[createdOrder.bank_name || 'BCA']?.accountNumber || '8830192844'}
                      </p>
                      <p className="text-[11px] text-zinc-600 font-medium pt-0.5">
                        a.n. {BANK_ACCOUNTS[createdOrder.bank_name || 'BCA']?.holderName || 'URBANSTYLE STORE'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyRekening(BANK_ACCOUNTS[createdOrder.bank_name || 'BCA']?.accountNumber || '8830192844')}
                      className="px-3 py-1.5 text-xs font-bold uppercase bg-zinc-900 text-white hover:bg-[#E60012] flex items-center gap-1 transition-colors"
                    >
                      {copiedRekening ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                      <span>{copiedRekening ? 'Tersalin' : 'Salin No. Rekening'}</span>
                    </button>
                  </div>

                  {/* Total Nominal Tepat dengan Highlight 3 Digit Kode Unik */}
                  <div className="p-3 bg-red-50 border border-red-200 text-center space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-red-800 block">
                      JUMLAH TRANSFER TEPAT (WAJIB SESUAI 3 DIGIT TERAKHIR):
                    </span>
                    <div className="text-2xl font-black font-mono text-zinc-950 flex items-center justify-center gap-0.5">
                      <span>Rp {Math.floor(createdOrder.total_amount / 1000).toLocaleString('id-ID')}.</span>
                      <span className="bg-[#E60012] text-white px-1.5 py-0.5 font-black tracking-widest">
                        {String(createdOrder.unique_code || (createdOrder.total_amount % 1000)).padStart(3, '0')}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500 pt-0.5">
                      *Termasuk 3 digit kode unik pengenal transaksi otomatis (+Rp {createdOrder.unique_code || 0})
                    </p>
                    <button
                      type="button"
                      onClick={() => copyNominal(createdOrder.total_amount)}
                      className="mt-2 w-full py-1.5 text-xs font-bold uppercase bg-white border border-red-300 hover:bg-red-100 text-red-700 flex items-center justify-center gap-1 transition-colors"
                    >
                      {copiedNominal ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      <span>{copiedNominal ? 'Nominal Tersalin!' : `Salin Total Tepat (Rp ${createdOrder.total_amount.toLocaleString('id-ID')})`}</span>
                    </button>
                  </div>

                  {/* Notice Alert */}
                  <div className="flex items-start gap-2 text-[10px] text-amber-800 bg-amber-50 p-2.5 border border-amber-200">
                    <AlertCircle size={14} className="shrink-0 mt-0.5 text-amber-600" />
                    <p>
                      <strong>PENTING:</strong> Pastikan Anda mentransfer <strong>persis hingga 3 digit terakhir</strong>. Kode unik dikunci selama 2 jam agar mutasi rekening terverifikasi secara otomatis.
                    </p>
                  </div>
                </div>
              ) : (
                /* Dynamic QRIS Standar Bank Indonesia (EMVCo & CRC-16) */
                <DynamicQRISCard
                  amount={createdOrder.total_amount}
                  orderNumber={createdOrder.order_number}
                />
              )}

              {/* Pemantau Pembayaran Otomatis dari Sistem (Real-Time) */}
              <RealtimePaymentStatus
                orderNumber={createdOrder.order_number}
                initialStatus={createdOrder.status}
                paymentMethod={createdOrder.payment_method}
                amount={Number(createdOrder.total_amount)}
                onStatusChanged={(newStatus) => {
                  setCreatedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
                }}
              />

              {/* Order Items Table Preview */}
              <div className="text-left border border-zinc-200 divide-y divide-zinc-200 text-xs">
                <div className="p-2.5 bg-zinc-50 font-bold text-zinc-700 uppercase flex justify-between">
                  <span>Rincian Pakaian</span>
                  <span>Subtotal</span>
                </div>
                {createdOrder.items.map((it, idx) => (
                  <div key={idx} className="p-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-bold text-zinc-900">{it.product_name}</p>
                      <p className="text-[10px] text-zinc-500">{it.selected_color} • Size {it.selected_size} • Qty {it.quantity}</p>
                    </div>
                    <span className="font-semibold text-zinc-900">Rp {Number(it.subtotal).toLocaleString('id-ID')}</span>
                  </div>
                ))}
                {createdOrder.discount_amount && createdOrder.discount_amount > 0 && (
                  <div className="p-2.5 flex justify-between items-center text-green-700 font-semibold">
                    <span>Diskon Kupon Promo:</span>
                    <span>- Rp {Number(createdOrder.discount_amount).toLocaleString('id-ID')}</span>
                  </div>
                )}
                <div className="p-2.5 bg-zinc-50 font-black text-zinc-950 flex justify-between text-sm">
                  <span>TOTAL PEMBAYARAN:</span>
                  <span className="text-[#E60012]">Rp {Number(createdOrder.total_amount).toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`/track/${createdOrder.order_number}`}
                    className="py-3 bg-black hover:bg-zinc-800 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors rounded-none"
                  >
                    <Truck size={14} />
                    <span>Lacak Pengiriman 🚚</span>
                  </a>

                  <a
                    href={`/invoice/${createdOrder.order_number}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 bg-[#E60012] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shadow-xs rounded-none"
                  >
                    <QrCode size={14} />
                    <span>Halaman Faktur ↗</span>
                  </a>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 py-3 border border-zinc-300 hover:bg-zinc-100 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors rounded-none"
                  >
                    <Printer size={14} />
                    <span>Cetak Nota</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-3 border border-zinc-300 hover:border-black text-xs font-bold uppercase tracking-wider transition-colors rounded-none"
                  >
                    Selesai
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
}
