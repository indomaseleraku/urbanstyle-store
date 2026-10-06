import React from 'react';
import Link from 'next/link';
import { dataStore } from '@/lib/store';
import { BANK_ACCOUNTS } from '@/lib/types';
import { 
  ArrowLeft, 
  CheckCircle2, 
  QrCode, 
  Truck, 
  ExternalLink,
  Building2,
  AlertCircle
} from 'lucide-react';
import { InvoicePrintButton, InvoicePaymentButton, CopyButton } from '@/components/InvoiceActions';
import { DynamicQRISCard } from '@/components/DynamicQRISCard';
import { RealtimePaymentStatus } from '@/components/RealtimePaymentStatus';

export default async function InvoicePage({ params }: { params: Promise<{ orderNumber: string }> }) {
  const resolvedParams = await params;
  const orderNumber = resolvedParams.orderNumber;
  const order = await dataStore.getOrderByNumber(orderNumber);

  if (!order) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 border border-zinc-300 max-w-md w-full text-center space-y-4">
          <p className="text-xs uppercase font-bold tracking-widest text-[#E60012]">Faktur Tidak Ditemukan</p>
          <h1 className="text-lg font-black uppercase text-zinc-900">Pesanan #{orderNumber} Belum Terdaftar</h1>
          <p className="text-xs text-zinc-600">Silakan kembali ke katalog untuk membuat pesanan baru.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-[#E60012] transition-colors"
          >
            <ArrowLeft size={14} /> Kembali ke Toko
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = order.items.reduce((s, it) => s + it.price * it.quantity, 0);
  const selectedBank = order.bank_name ? BANK_ACCOUNTS[order.bank_name] : BANK_ACCOUNTS['BCA'];


  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 py-6 px-3 sm:px-6 selection:bg-[#E60012] selection:text-white">
      <div className="max-w-4xl mx-auto space-y-4">
        
        {/* Navigation Bar */}
        <div className="flex items-center justify-between no-print">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 transition-colors"
          >
            <ArrowLeft size={16} /> Kembali ke Katalog
          </Link>
          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href={`/track/${order.order_number}`}
              className="text-xs font-bold uppercase tracking-wider bg-zinc-950 hover:bg-[#E60012] text-white flex items-center gap-1.5 px-3 py-1.5 transition-colors shadow-xs"
            >
              <Truck size={14} />
              <span>Lacak Pengiriman 🚚</span>
            </Link>
            <Link
              href="/admin"
              className="text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-950 flex items-center gap-1 border border-zinc-300 bg-white px-3 py-1.5"
            >
              Dasbor SIM <ExternalLink size={12} />
            </Link>
            <InvoicePrintButton />
          </div>
        </div>

        {/* Invoice Card */}
        <div className="bg-white border border-zinc-300 shadow-md p-6 sm:p-10 space-y-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-zinc-200 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#E60012] text-white flex flex-col items-center justify-center font-black tracking-tighter leading-none shrink-0 shadow-xs">
                <span className="text-xs">UR</span>
                <span className="text-[10px]">BAN</span>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-zinc-950">
                  UrbanStyle Store
                </h1>
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">
                  LifeWear Essentials • Modul Transaksi (TPS)
                </p>
              </div>
            </div>

            <div className="sm:text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-black uppercase tracking-wider">
                <CheckCircle2 size={14} />
                <span>Status: {order.status}</span>
              </div>
              <p className="text-xs font-mono font-bold text-zinc-700 mt-1">
                No: {order.order_number}
              </p>
              <p className="text-[11px] text-zinc-400">
                {new Date(order.created_at).toLocaleDateString('id-ID', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Customer & Shipping Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 bg-zinc-50 border border-zinc-200 text-xs">
            <div className="space-y-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Data Pemesan:</p>
              <p className="font-bold text-sm text-zinc-900">{order.customer_name}</p>
              <p className="text-zinc-600 font-mono">{order.customer_phone}</p>
              <p className="text-zinc-600 leading-relaxed pt-1">{order.customer_address}</p>
            </div>
            <div className="space-y-1 sm:border-l sm:border-zinc-200 sm:pl-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Ekspedisi & Pembayaran:</p>
              <div className="flex items-center gap-1.5 font-bold text-zinc-900">
                <Truck size={14} className="text-[#E60012]" />
                <span>{order.shipping_courier}</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-zinc-900 pt-1">
                {order.payment_method === 'Bank Transfer' ? (
                  <Building2 size={14} className="text-[#E60012]" />
                ) : (
                  <QrCode size={14} className="text-zinc-700" />
                )}
                <span>
                  Metode: {order.payment_method}
                  {order.payment_method === 'Bank Transfer' && order.bank_name ? ` (${order.bank_name})` : ''}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 pt-1">
                Verifikasi Transaksi Otomatis Terhubung ke Server SIM
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-600 mb-2">
              Rincian Item Busana Dipesan:
            </h2>
            <div className="border border-zinc-200 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-zinc-100 border-b border-zinc-200 text-zinc-700 font-bold uppercase text-[11px]">
                    <th className="p-3">Item Busana</th>
                    <th className="p-3 text-center">Ukuran</th>
                    <th className="p-3 text-center">Warna</th>
                    <th className="p-3 text-right">Harga Satuan</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200">
                  {order.items.map((it, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50">
                      <td className="p-3 font-semibold text-zinc-950">{it.product_name}</td>
                      <td className="p-3 text-center font-mono font-bold">{it.selected_size}</td>
                      <td className="p-3 text-center text-zinc-600">{it.selected_color}</td>
                      <td className="p-3 text-right font-mono">Rp {it.price.toLocaleString('id-ID')}</td>
                      <td className="p-3 text-center font-bold">{it.quantity}</td>
                      <td className="p-3 text-right font-mono font-bold">Rp {it.subtotal.toLocaleString('id-ID')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* QRIS / Bank Transfer Display and Financial Total */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-zinc-200 items-start">
            
            {order.status === 'Dibayar' || order.status === 'Selesai' || order.status === 'Dikemas' || order.status === 'Dikirim' ? (
              /* Bukti Pembayaran Sah & Terverifikasi Sistem */
              <div className="p-5 border-2 border-emerald-600 bg-emerald-50/60 text-left space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-emerald-200">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={20} className="text-emerald-700" />
                    <span className="text-xs font-black uppercase text-emerald-900 tracking-wider">
                      Bukti Pembayaran Sah (Lunas)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono font-bold bg-emerald-600 text-white px-2 py-0.5 uppercase">
                    {order.status}
                  </span>
                </div>

                <div className="p-3.5 bg-white border border-emerald-200 space-y-2 text-xs">
                  <div className="flex justify-between text-zinc-600">
                    <span>Metode Pembayaran:</span>
                    <span className="font-bold text-zinc-950 font-mono">
                      {order.payment_method}
                      {order.bank_name ? ` (${order.bank_name})` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Total Terverifikasi:</span>
                    <span className="font-black text-emerald-700 font-mono">
                      Rp {Number(order.total_amount).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-600">
                    <span>Verifikasi Sistem:</span>
                    <span className="font-semibold text-emerald-700">Otomatis / Real-Time TPS</span>
                  </div>
                </div>

                <div className="p-2.5 bg-emerald-100/70 border border-emerald-300 text-[11px] text-emerald-800 space-y-1">
                  <p className="font-bold">✓ Transaksi Telah Diterima</p>
                  <p>Pesanan Anda telah diteruskan ke tim gudang untuk pengemasan dan pembuatan nomor resi ekspedisi.</p>
                </div>

                <Link
                  href={`/track/${order.order_number}`}
                  className="w-full py-2.5 bg-zinc-950 hover:bg-[#E60012] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                >
                  <Truck size={14} />
                  <span>Lacak Pengiriman Pesanan</span>
                </Link>
              </div>
            ) : order.payment_method === 'Bank Transfer' ? (
              /* Bank Transfer Details Box */
              <div className="p-4 border border-zinc-200 bg-zinc-50/70 text-left space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                  <span className="text-[10px] font-black uppercase tracking-wider text-zinc-600">
                    Instruksi Transfer Bank Manual
                  </span>
                  <span className="text-[10px] font-bold text-[#E60012] uppercase font-mono">
                    Bank {order.bank_name || 'BCA'}
                  </span>
                </div>

                <div className="p-3 bg-white border border-zinc-200 space-y-3">
                  {/* Account detail */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase">Nomor Rekening Tujuan</p>
                      <p className="font-mono font-black text-sm tracking-wider text-zinc-900">
                        {selectedBank?.accountNumber || '8830-9912-4411'}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-bold">
                        a/n {selectedBank?.holderName || 'KIMY EKA ARDIANSYAH / URBANSTYLE'}
                      </p>
                    </div>
                    <CopyButton
                      textToCopy={selectedBank?.accountNumber?.replace(/[^0-9]/g, '') || '883099124411'}
                      label="Salin No. Rek"
                      successLabel="Tersalin!"
                      className="px-2.5 py-1.5 text-xs font-bold uppercase bg-zinc-100 hover:bg-zinc-200 text-zinc-800 flex items-center gap-1 border border-zinc-300 transition-colors cursor-pointer"
                    />
                  </div>

                  {/* Nominal with Unique Code */}
                  <div className="p-2.5 bg-red-50/80 border border-red-200">
                    <p className="text-[10px] text-red-700 font-bold uppercase">Nominal Tepat Transfer (Wajib Sama Persis):</p>
                    <div className="flex items-baseline gap-1 my-1">
                      <span className="text-sm font-black text-zinc-800">Rp</span>
                      <span className="text-lg font-black text-zinc-950 font-mono tracking-tight">
                        {Math.floor(Number(order.total_amount) / 1000).toLocaleString('id-ID')}.
                      </span>
                      <span className="text-xl font-black text-[#E60012] font-mono px-1 bg-red-100 border border-red-300">
                        {String(order.unique_code || (Number(order.total_amount) % 1000)).padStart(3, '0')}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-500">
                      Termasuk kode unik 3 digit (<strong className="text-red-700">+{order.unique_code || 0}</strong>) untuk verifikasi mutasi otomatis.
                    </p>
                    <CopyButton
                      textToCopy={String(order.total_amount)}
                      label={`Salin Total (Rp ${Number(order.total_amount).toLocaleString('id-ID')})`}
                      successLabel="Nominal Tersalin!"
                      className="mt-2 w-full py-1.5 text-xs font-bold uppercase bg-white border border-red-300 hover:bg-red-100 text-red-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    />
                  </div>
                </div>

                <div className="p-2.5 bg-amber-50 border border-amber-200 text-[10px] text-amber-800 space-y-1">
                  <div className="flex items-center gap-1 font-bold text-amber-900">
                    <AlertCircle size={12} className="shrink-0" />
                    <span>PERHATIAN TRANSFER:</span>
                  </div>
                  <p>• Transfer tepat hingga 3 digit terakhir agar mutasi terbaca otomatis oleh sistem.</p>
                  <p>• Rekening diverifikasi dalam 2 jam sejak pesanan dibuat.</p>
                </div>

                {/* Pemantau Pembayaran Real-time Otomatis dari Sistem */}
                <RealtimePaymentStatus
                  orderNumber={order.order_number}
                  initialStatus={order.status}
                  paymentMethod={order.payment_method}
                  amount={Number(order.total_amount)}
                />
              </div>
            ) : (
              /* QRIS Standar Bank Indonesia EMVCo & CRC-16 */
              <div className="space-y-3">
                <DynamicQRISCard
                  amount={Number(order.total_amount)}
                  orderNumber={order.order_number}
                />

                {/* Pemantau Pembayaran Real-time Otomatis dari Sistem */}
                <RealtimePaymentStatus
                  orderNumber={order.order_number}
                  initialStatus={order.status}
                  paymentMethod={order.payment_method}
                  amount={Number(order.total_amount)}
                />
              </div>
            )}

            {/* Price Calculation */}
            <div className="space-y-2 text-xs">
              <div className="p-4 bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal Produk:</span>
                  <span className="font-mono font-semibold">Rp {subtotal.toLocaleString('id-ID')}</span>
                </div>
                {order.discount_amount && order.discount_amount > 0 ? (
                  <div className="flex justify-between text-emerald-700">
                    <span>Diskon Kupon Promo ({order.coupon_code || 'PROMO'}):</span>
                    <span className="font-mono font-semibold">- Rp {Number(order.discount_amount).toLocaleString('id-ID')}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-zinc-600">
                  <span>Biaya Pengiriman ({order.shipping_courier}):</span>
                  <span className="font-mono font-semibold">
                    {order.shipping_cost === 0 ? 'GRATIS' : `Rp ${order.shipping_cost.toLocaleString('id-ID')}`}
                  </span>
                </div>
                {order.payment_method === 'Bank Transfer' && order.unique_code && order.unique_code > 0 ? (
                  <div className="flex justify-between text-[#E60012]">
                    <span>Kode Unik Rekening:</span>
                    <span className="font-mono font-semibold">+ Rp {order.unique_code.toLocaleString('id-ID')}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-zinc-600">
                  <span>Biaya Layanan Gerbang Pembayaran:</span>
                  <span className="font-mono font-semibold text-emerald-700">Rp 0 (Bebas Biaya)</span>
                </div>
                <div className="pt-2 border-t border-zinc-300 flex justify-between items-baseline font-black text-base text-zinc-950">
                  <span className="uppercase text-xs tracking-wider">Total Pembayaran:</span>
                  <span className="text-[#E60012] font-mono text-lg">
                    Rp {Number(order.total_amount).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <div className="p-3 bg-zinc-100 border border-zinc-200 text-[11px] text-zinc-600 space-y-1">
                <p className="font-bold uppercase text-zinc-900">Catatan Validitas Nota:</p>
                <p>• Nota ini diterbitkan secara otomatis oleh modul TPS UrbanStyle Store.</p>
                <p>• Stok barang telah dikurangi secara atomik di database PostgreSQL Supabase.</p>
                <p>• Nomor resi pengiriman akan diperbarui oleh admin setelah barang dikemas.</p>
              </div>
            </div>

          </div>

          {/* Academic Footer Notice */}
          <div className="pt-6 border-t border-zinc-200 text-center text-[11px] text-zinc-400">
            Sistem Informasi E-Commerce UrbanStyle Store • Karya Ilmiah Kimy Eka Ardiansyah (Universitas Pamulang, 2026)
          </div>

        </div>

      </div>
    </div>
  );
}
