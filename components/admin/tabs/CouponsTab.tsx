// components/admin/tabs/CouponsTab.tsx
// Manajemen Kupon Diskon Promo & Kode Voucher Toko

import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Coupon } from '@/lib/types';

interface CouponsTabProps {
  coupons: Coupon[];
  isOwner?: boolean;
  onToggleStatus: (couponId: number) => Promise<void>;
  onDeleteCoupon: (couponId: number, code?: string) => Promise<void>;
  onCreateCoupon: (couponPayload: any) => Promise<void>;
}

export const CouponsTab: React.FC<CouponsTabProps> = ({
  coupons,
  isOwner,
  onToggleStatus,
  onDeleteCoupon,
  onCreateCoupon,
}) => {
  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'fixed' | 'percentage'>('fixed');
  const [newCouponDiscount, setNewCouponDiscount] = useState(50000);
  const [newCouponMin, setNewCouponMin] = useState(200000);
  const [newCouponLimit, setNewCouponLimit] = useState(100);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  const handleSubmitNewCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCreateCoupon({
      code: newCouponCode.trim().toUpperCase(),
      type: newCouponType,
      discount_amount: Number(newCouponDiscount),
      min_purchase: Number(newCouponMin),
      max_discount: newCouponType === 'percentage' ? 100000 : undefined,
      usage_limit: Number(newCouponLimit),
      is_active: true,
      description: newCouponDesc || `Potongan ${newCouponType === 'fixed' ? 'Rp ' + newCouponDiscount : newCouponDiscount + '%'}`,
    });
    setIsAddingCoupon(false);
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  return (
    <div className="bg-white border border-zinc-200 shadow-2xs space-y-4 animate-in fade-in duration-200">
      <div className="p-4 sm:p-5 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-base font-extrabold uppercase tracking-tight text-zinc-950">
            Manajemen Kupon Diskon Promo
          </h3>
          <p className="text-xs text-zinc-500">
            Aktifkan/nonaktifkan voucher, batasi kuota belanja, dan terbitkan kode kupon baru
          </p>
        </div>

        <button
          onClick={() => setIsAddingCoupon(!isAddingCoupon)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#E60012] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
        >
          <Plus size={14} />
          <span>Buat Kupon Baru</span>
        </button>
      </div>

      {/* Form Tambah Kupon */}
      {isAddingCoupon && (
        <form onSubmit={handleSubmitNewCoupon} className="p-4 sm:p-5 bg-zinc-50 border-b border-zinc-200 space-y-3 animate-in fade-in">
          <h4 className="text-xs font-black uppercase text-zinc-900">Formulir Voucher Kupon Baru</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Kode Voucher</label>
              <input
                type="text"
                required
                placeholder="Contoh: MERDEKA20"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 bg-white font-mono uppercase"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Tipe Diskon</label>
              <select
                value={newCouponType}
                onChange={(e) => setNewCouponType(e.target.value as any)}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 bg-white font-medium"
              >
                <option value="fixed">Nominal Tetap (Rp)</option>
                <option value="percentage">Persentase (%)</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">
                {newCouponType === 'fixed' ? 'Nominal Potongan (Rp)' : 'Persentase Diskon (%)'}
              </label>
              <input
                type="number"
                required
                value={newCouponDiscount}
                onChange={(e) => setNewCouponDiscount(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 bg-white font-medium"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Min. Belanja (Rp)</label>
              <input
                type="number"
                required
                value={newCouponMin}
                onChange={(e) => setNewCouponMin(Number(e.target.value))}
                className="w-full px-3 py-1.5 text-xs border border-zinc-300 bg-white font-medium"
              />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Deskripsi Kupon</label>
            <input
              type="text"
              placeholder="Diskon spesial member LifeWear"
              value={newCouponDesc}
              onChange={(e) => setNewCouponDesc(e.target.value)}
              className="w-full px-3 py-1.5 text-xs border border-zinc-300 bg-white font-medium"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200">
            <button
              type="button"
              onClick={() => setIsAddingCoupon(false)}
              className="px-3 py-1.5 text-xs font-bold uppercase border border-zinc-300 text-zinc-700 bg-white cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-black text-white text-xs font-bold uppercase hover:bg-[#E60012] cursor-pointer"
            >
              Terbitkan Kupon
            </button>
          </div>
        </form>
      )}

      {/* Tabel Kupon */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-50 border-y border-zinc-200 text-zinc-600 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Kode Kupon</th>
              <th className="py-3 px-4">Tipe & Nilai Diskon</th>
              <th className="py-3 px-4">Min. Belanja</th>
              <th className="py-3 px-4">Penggunaan</th>
              <th className="py-3 px-4">Status & Sakelar</th>
              <th className="py-3 px-4 text-center">Aksi Hapus</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {coupons.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-50/80 transition-colors">
                <td className="py-3 px-4">
                  <span className="font-mono font-bold text-xs bg-zinc-100 px-2 py-0.5 border border-zinc-200">
                    {c.code}
                  </span>
                  <p className="text-[10px] text-zinc-500 mt-1">{c.description}</p>
                </td>
                <td className="py-3 px-4 font-bold text-zinc-900 font-mono">
                  {c.type === 'fixed' 
                    ? `Rp ${new Intl.NumberFormat('id-ID').format(c.discount_amount)}`
                    : `${c.discount_amount}%`
                  }
                </td>
                <td className="py-3 px-4 font-medium text-zinc-700 font-mono">
                  Rp {new Intl.NumberFormat('id-ID').format(c.min_purchase)}
                </td>
                <td className="py-3 px-4 font-mono text-zinc-700">
                  {c.used_count} / {c.usage_limit} voucher
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => onToggleStatus(c.id)}
                    className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer ${
                      c.is_active 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' 
                        : 'bg-zinc-100 text-zinc-600 border-zinc-300 hover:bg-zinc-200'
                    }`}
                    title="Klik untuk ubah status aktif/nonaktif"
                  >
                    {c.is_active ? '✓ Aktif' : '✕ Nonaktif'}
                  </button>
                </td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => onDeleteCoupon(c.id, c.code)}
                    className="p-1.5 text-red-600 hover:text-white hover:bg-[#E60012] border border-red-200 transition-colors cursor-pointer"
                    title="Hapus Voucher"
                  >
                    <Trash2 size={13} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
