// components/CheckoutModal.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck } from 'lucide-react';
import { CartItem, Order, UserAddress, BANK_ACCOUNTS } from '@/lib/types';
import { COURIERS, FREE_SHIPPING_THRESHOLD } from './CartDrawer';
import { useAuth } from '@/lib/auth-context';
import { dataStore } from '@/lib/store';
import ShippingForm from './checkout/ShippingForm';
import PaymentMethodSelector from './checkout/PaymentMethodSelector';
import CouponInput from './checkout/CouponInput';
import OrderSuccessView from './checkout/OrderSuccessView';

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

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<{ text: string; isError: boolean } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      if (!name) setName(user.full_name || '');
      if (!phone) setPhone(user.phone || '');
      dataStore.getUserAddresses(user.id).then((addrs) => {
        setSavedAddresses(addrs);
        const def = addrs.find((a) => a.is_default) || addrs[0];
        if (def && !address) {
          setAddress(`${def.address_line}, ${def.city} ${def.postal_code}`);
          if (def.phone && !phone) setPhone(def.phone);
        }
      });
    }
  }, [user, isOpen]);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const courierObj = COURIERS.find((c) => c.name === selectedCourier) || COURIERS[0];
  const shippingCost = isFreeShipping ? 0 : courierObj.price;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingCost);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    setCouponMsg(null);
    const res = await dataStore.validateCoupon(couponCode, subtotal);
    setIsValidatingCoupon(false);
    if (res.valid) {
      setAppliedCoupon(couponCode);
      setDiscountAmount(res.discount_amount);
      setCouponMsg({ text: res.message, isError: false });
    } else {
      setAppliedCoupon(null);
      setDiscountAmount(0);
      setCouponMsg({ text: res.message, isError: true });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setErrorMsg('Mohon lengkapi seluruh formulir data pengiriman.');
      return;
    }
    setErrorMsg('');
    setIsSubmitting(true);
    const result = await onConfirmOrder({
      user_id: user?.id,
      customer_name: name.trim(),
      customer_phone: phone.trim(),
      customer_address: address.trim(),
      shipping_courier: selectedCourier,
      shipping_cost: shippingCost,
      coupon_code: appliedCoupon || undefined,
      discount_amount: discountAmount,
      payment_method: paymentMethod,
      bank_name: paymentMethod === 'Bank Transfer' ? selectedBank : undefined,
    });
    setIsSubmitting(false);
    if (result.success && result.order) {
      setCreatedOrder(result.order);
      onOrderSuccess();
    } else {
      setErrorMsg(result.message || 'Gagal memproses pesanan. Silakan coba lagi.');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
          />

          <div className="min-h-full flex items-center justify-center p-3 sm:p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="relative bg-white border border-zinc-300 shadow-2xl max-w-xl w-full p-5 sm:p-8 rounded-none z-10"
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-950 hover:bg-zinc-100 transition-colors rounded-none cursor-pointer"
                aria-label="Tutup checkout"
              >
                <X size={20} />
              </button>

              {createdOrder ? (
                <OrderSuccessView order={createdOrder} onClose={onClose} />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-zinc-200 pb-3">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#E60012] font-mono">
                      // TRANSACTION ENGINE (TPS)
                    </span>
                    <h3 className="text-base sm:text-lg font-black uppercase tracking-tight text-[#111111]">
                      Penyelesaian Pesanan
                    </h3>
                  </div>

                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-[#E60012] text-xs font-medium rounded-none">
                      {errorMsg}
                    </div>
                  )}

                  <ShippingForm
                    name={name}
                    onChangeName={setName}
                    phone={phone}
                    onChangePhone={setPhone}
                    address={address}
                    onChangeAddress={setAddress}
                    savedAddresses={savedAddresses}
                    onSelectSavedAddress={(a) => {
                      setAddress(`${a.address_line}, ${a.city} ${a.postal_code}`);
                      if (a.phone) setPhone(a.phone);
                    }}
                  />

                  <PaymentMethodSelector
                    paymentMethod={paymentMethod}
                    onSelectPaymentMethod={setPaymentMethod}
                    selectedBank={selectedBank}
                    onSelectBank={setSelectedBank}
                  />

                  <CouponInput
                    couponCode={couponCode}
                    onChangeCouponCode={setCouponCode}
                    appliedCoupon={appliedCoupon}
                    discountAmount={discountAmount}
                    couponMsg={couponMsg}
                    isValidating={isValidatingCoupon}
                    onApplyCoupon={handleApplyCoupon}
                  />

                  {/* Summary & Place Order Button */}
                  <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-2 text-xs rounded-none">
                    <div className="flex justify-between text-zinc-600">
                      <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} item)</span>
                      <span className="font-mono font-bold text-zinc-950 tabular-nums">
                        Rp {subtotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-[#E60012]">
                        <span>Diskon Kupon</span>
                        <span className="font-mono font-bold tabular-nums">
                          -Rp {discountAmount.toLocaleString('id-ID')}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-zinc-600">
                      <span>Ongkos Kirim ({selectedCourier.split(' ')[0]})</span>
                      <span className="font-mono font-bold text-zinc-950 tabular-nums">
                        {isFreeShipping ? 'GRATIS' : `Rp ${shippingCost.toLocaleString('id-ID')}`}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-black text-zinc-950 pt-2 border-t border-zinc-200">
                      <span className="uppercase">Total Pembayaran</span>
                      <span className="text-[#E60012] font-mono tabular-nums">
                        Rp {grandTotal.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-[#111111] hover:bg-[#E60012] disabled:bg-zinc-400 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-colors rounded-none flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                  >
                    <ShieldCheck size={16} />
                    <span>{isSubmitting ? 'Memproses Transaksi...' : `Konfirmasi & Bayar Rp ${grandTotal.toLocaleString('id-ID')}`}</span>
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
