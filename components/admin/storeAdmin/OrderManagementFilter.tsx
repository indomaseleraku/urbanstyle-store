import React from 'react';
import { Search } from 'lucide-react';
import { Order, OrderStatus } from '@/lib/admin-suite/types';

interface OrderManagementFilterProps {
  orders: Order[];
  statusFilter: 'all' | OrderStatus;
  setStatusFilter: (status: 'all' | OrderStatus) => void;
  search: string;
  setSearch: (search: string) => void;
}

export const OrderManagementFilter: React.FC<OrderManagementFilterProps> = ({
  orders,
  statusFilter,
  setStatusFilter,
  search,
  setSearch,
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto text-xs pb-1 sm:pb-0">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'all'
              ? 'bg-slate-900 dark:bg-slate-800 text-white font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Semua ({orders.length})
        </button>
        <button
          onClick={() => setStatusFilter('processing')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'processing'
              ? 'bg-amber-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Perlu Diproses ({orders.filter((o) => o.status === 'processing').length})
        </button>
        <button
          onClick={() => setStatusFilter('packing')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'packing'
              ? 'bg-blue-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Di Gudang ({orders.filter((o) => o.status === 'packing').length})
        </button>
        <button
          onClick={() => setStatusFilter('shipped')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'shipped'
              ? 'bg-purple-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Dikirim ({orders.filter((o) => o.status === 'shipped').length})
        </button>
        <button
          onClick={() => setStatusFilter('delivered')}
          className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
            statusFilter === 'delivered'
              ? 'bg-emerald-600 text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          Selesai ({orders.filter((o) => o.status === 'delivered').length})
        </button>
      </div>

      <div className="relative w-full sm:w-64">
        <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Cari No. Order, nama, kota..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:bg-white dark:focus:bg-slate-800"
        />
      </div>
    </div>
  );
};
