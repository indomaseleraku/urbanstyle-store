// components/admin/AdminSidebar.tsx
// Navigation Tab Bar untuk Modul-Modul Staf SIM UrbanStyle

import React from 'react';
import { BarChart3, Package, ShoppingCart, Tag, Users } from 'lucide-react';

export type AdminTab = 'dss' | 'inventory' | 'orders' | 'coupons' | 'staff';

interface AdminSidebarProps {
  activeTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  isOwner: boolean;
  isGudang: boolean;
  isKasir?: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  onSelectTab,
  isOwner,
  isGudang,
}) => {
  return (
    <div className="flex border-b border-zinc-300 gap-1 bg-white p-1.5 shadow-2xs overflow-x-auto print:hidden">
      {/* Tab 1: DSS (Khusus Owner / Bukan Gudang) */}
      <button
        onClick={() => onSelectTab('dss')}
        className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
          activeTab === 'dss' 
            ? 'bg-zinc-950 text-white' 
            : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
        } ${isGudang ? 'opacity-50' : ''}`}
      >
        <BarChart3 size={15} />
        <span>Eksekutif DSS & Pareto</span>
        {isGudang && <span className="text-[9px] bg-zinc-200 text-zinc-600 px-1 font-mono">Terkunci</span>}
      </button>

      {/* Tab 2: Inventory & Flexible Restock */}
      <button
        onClick={() => onSelectTab('inventory')}
        className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
          activeTab === 'inventory' 
            ? 'bg-zinc-950 text-white' 
            : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
        }`}
      >
        <Package size={15} />
        <span>Kontrol Inventaris & Restok</span>
      </button>

      {/* Tab 3: Orders & Logistics TPS */}
      <button
        onClick={() => onSelectTab('orders')}
        className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
          activeTab === 'orders' 
            ? 'bg-zinc-950 text-white' 
            : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
        }`}
      >
        <ShoppingCart size={15} />
        <span>Transaksi & Resi Logistik</span>
      </button>

      {/* Tab 4: Coupons */}
      <button
        onClick={() => onSelectTab('coupons')}
        className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
          activeTab === 'coupons' 
            ? 'bg-zinc-950 text-white' 
            : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
        }`}
      >
        <Tag size={15} />
        <span>Manajemen Kupon</span>
      </button>

      {/* Tab 5: Manajemen Karyawan RBAC (Hanya Owner) */}
      {isOwner && (
        <button
          onClick={() => onSelectTab('staff')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap cursor-pointer ${
            activeTab === 'staff' 
              ? 'bg-zinc-950 text-white' 
              : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
          }`}
        >
          <Users size={15} />
          <span>Manajemen Karyawan (RBAC)</span>
        </button>
      )}
    </div>
  );
};
