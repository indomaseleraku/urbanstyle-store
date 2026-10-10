// app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Product, Order, Coupon, OrderStatus, StaffUser } from '@/lib/types';
import { dataStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar, AdminTab } from '@/components/admin/AdminSidebar';
import { DssAnalyticsTab, DSSData } from '@/components/admin/tabs/DssAnalyticsTab';
import { InventoryTab } from '@/components/admin/tabs/InventoryTab';
import { OrdersTab } from '@/components/admin/tabs/OrdersTab';
import { CouponsTab } from '@/components/admin/tabs/CouponsTab';
import { StaffTab } from '@/components/admin/tabs/StaffTab';
import AdminModals from '@/components/admin/AdminModals';

export default function AdminDashboardPage() {
  const { user, isAdmin, isOwner, isGudang, isKasir, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>(
    isGudang ? 'inventory' : isKasir ? 'orders' : 'dss'
  );

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [dssPeriod, setDssPeriod] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [dssData, setDssData] = useState<DSSData | null>(null);

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [exactStockModal, setExactStockModal] = useState<{ product: Product; newStock: number } | null>(null);
  const [shippingLabelOrder, setShippingLabelOrder] = useState<Order | null>(null);

  const loadAllData = async () => {
    const [p, o, c, d, s] = await Promise.all([
      dataStore.getProducts('all'),
      dataStore.getOrders(),
      dataStore.getCoupons(),
      dataStore.getDSSAnalytics(dssPeriod),
      dataStore.getStaffList(),
    ]);
    setProducts(p);
    setOrders(o);
    setCoupons(c);
    setDssData(d);
    setStaffList(s);
  };

  useEffect(() => {
    if (isAdmin) loadAllData();
  }, [dssPeriod, isAdmin]);

  useEffect(() => {
    if (isGudang && (activeTab === 'dss' || activeTab === 'staff')) setActiveTab('inventory');
    else if (isKasir && (activeTab === 'dss' || activeTab === 'staff')) setActiveTab('orders');
  }, [isGudang, isKasir, activeTab]);

  const handleStockAdjust = async (productId: number, delta: number) => {
    const prod = products.find((p) => p.id === productId);
    if (!prod) return;
    await dataStore.updateStock(productId, Math.max(0, prod.stock + delta));
    await loadAllData();
  };

  const handleSetExactStock = async (productId: number, stockQty: number) => {
    await dataStore.updateStock(productId, stockQty);
    setExactStockModal(null);
    await loadAllData();
  };

  const handleCreateProduct = async (payload: any) => {
    await dataStore.addProduct(payload);
    await loadAllData();
  };

  const handleUpdateProduct = async (p: Product) => {
    await dataStore.updateProduct(p.id, p);
    setEditingProduct(null);
    await loadAllData();
  };

  const handleDeleteProduct = async (productId: number, name: string) => {
    if (confirm(`Yakin ingin menghapus produk "${name}"?`)) {
      await dataStore.deleteProduct(productId);
      await loadAllData();
    }
  };

  const handleUpdateOrderStatus = async (orderNumber: string, status: OrderStatus, trackingNo?: string) => {
    await dataStore.updateOrderStatus(orderNumber, status, trackingNo);
    await loadAllData();
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white border border-zinc-300 p-8 max-w-md w-full text-center space-y-4 rounded-none shadow-sm">
          <div className="w-12 h-12 bg-red-100 text-[#E60012] flex items-center justify-center mx-auto rounded-none">
            <Lock size={24} />
          </div>
          <h1 className="text-base font-extrabold uppercase tracking-tight text-zinc-950">Akses Ditolak (RBAC)</h1>
          <p className="text-xs text-zinc-600">Halaman ini memerlukan otorisasi internal staf UrbanStyle Store.</p>
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/admin/login" className="px-4 py-2.5 bg-zinc-950 text-white text-xs font-bold uppercase tracking-wider rounded-none">Masuk ke Portal Staf</Link>
            <Link href="/" className="px-4 py-2 text-xs font-semibold text-zinc-600 hover:text-black">Kembali ke Beranda</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 flex flex-col font-sans">
      <AdminHeader
        user={user}
        isOwner={isOwner}
        isGudang={isGudang}
        isKasir={isKasir}
        onRefresh={loadAllData}
        onLogout={logout}
      />
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col md:flex-row gap-6">
        <AdminSidebar activeTab={activeTab} onSelectTab={setActiveTab} isOwner={isOwner} isGudang={isGudang} isKasir={isKasir} />
        <main className="flex-1 min-w-0">
          {activeTab === 'dss' && <DssAnalyticsTab dssData={dssData} dssPeriod={dssPeriod} setDssPeriod={setDssPeriod} orders={orders} isGudang={isGudang} onNavigateToInventory={() => setActiveTab('inventory')} />}
          {activeTab === 'inventory' && <InventoryTab products={products} isOwner={isOwner} onStockAdjust={handleStockAdjust} onOpenExactStock={(p) => setExactStockModal({ product: p, newStock: p.stock })} onOpenEditProduct={setEditingProduct} onDeleteProduct={handleDeleteProduct} onCreateProduct={handleCreateProduct} />}
          {activeTab === 'orders' && <OrdersTab orders={orders} onUpdateStatus={handleUpdateOrderStatus} onOpenShippingLabel={setShippingLabelOrder} />}
          {activeTab === 'coupons' && <CouponsTab coupons={coupons} isOwner={isOwner} onCreateCoupon={async (cp) => { await dataStore.createCoupon(cp); await loadAllData(); }} onToggleStatus={async (id) => { await dataStore.toggleCouponStatus(id); await loadAllData(); }} onDeleteCoupon={async (id) => { await dataStore.deleteCoupon(id); await loadAllData(); }} />}
          {activeTab === 'staff' && <StaffTab staffList={staffList} isOwner={isOwner} onCreateStaff={async (st) => { await dataStore.createStaff(st); await loadAllData(); }} onToggleStatus={async (id) => { await dataStore.toggleStaffStatus(id); await loadAllData(); }} />}
        </main>
      </div>
      <AdminModals
        editingProduct={editingProduct} onCloseEditProduct={() => setEditingProduct(null)} onUpdateProduct={handleUpdateProduct}
        exactStockModal={exactStockModal} onCloseExactStock={() => setExactStockModal(null)} onSetExactStock={handleSetExactStock}
        shippingLabelOrder={shippingLabelOrder} onCloseShippingLabel={() => setShippingLabelOrder(null)}
      />
    </div>
  );
}
