// app/admin/page.tsx
// Halaman Dashboard Manajemen SIM UrbanStyle Store (Modular Orchestrator)
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Lock } from 'lucide-react';
import { Product, Order, Coupon, OrderStatus, StaffUser } from '@/lib/types';
import { dataStore } from '@/lib/store';
import { useAuth } from '@/lib/auth-context';

// Modular Components
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar, AdminTab } from '@/components/admin/AdminSidebar';
import { DssAnalyticsTab, DSSData } from '@/components/admin/tabs/DssAnalyticsTab';
import { InventoryTab } from '@/components/admin/tabs/InventoryTab';
import { OrdersTab } from '@/components/admin/tabs/OrdersTab';
import { CouponsTab } from '@/components/admin/tabs/CouponsTab';
import { StaffTab } from '@/components/admin/tabs/StaffTab';
import { EditProductModal } from '@/components/admin/modals/EditProductModal';
import { ExactStockModal } from '@/components/admin/modals/ExactStockModal';
import { ThermalLabelModal } from '@/components/admin/modals/ThermalLabelModal';

export default function AdminDashboardPage() {
  const { user, isAdmin, isOwner, isGudang, isKasir, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>(
    isGudang ? 'inventory' : isKasir ? 'orders' : 'dss'
  );

  // System Domain Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);

  // DSS State
  const [dssPeriod, setDssPeriod] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [dssData, setDssData] = useState<DSSData | null>(null);

  // Modal Control States
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [exactStockModal, setExactStockModal] = useState<{ product: Product; newStock: number } | null>(null);
  const [shippingLabelOrder, setShippingLabelOrder] = useState<Order | null>(null);

  // Load all system data across domains
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
    loadAllData();
  }, [dssPeriod]);

  // Tab switch guard based on RBAC role
  useEffect(() => {
    if (isGudang && (activeTab === 'dss' || activeTab === 'staff')) {
      setActiveTab('inventory');
    } else if (isKasir && (activeTab === 'dss' || activeTab === 'staff')) {
      setActiveTab('orders');
    }
  }, [isGudang, isKasir, activeTab]);

  // --- Handlers: Inventory ---
  const handleStockAdjust = async (productId: number, delta: number) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;
    const newStock = Math.max(0, prod.stock + delta);
    await dataStore.updateStock(productId, newStock);
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

  const handleUpdateProduct = async (updatedProduct: Product) => {
    await dataStore.updateProduct(updatedProduct.id, {
      name: updatedProduct.name,
      price: Number(updatedProduct.price),
      stock: Number(updatedProduct.stock),
      fabric_details: updatedProduct.fabric_details,
      gender: updatedProduct.gender,
      image_url: updatedProduct.image_url,
    });
    setEditingProduct(null);
    await loadAllData();
  };

  const handleDeleteProduct = async (productId: number, productName: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus produk "${productName}" dari katalog?`)) {
      await dataStore.deleteProduct(productId);
      await loadAllData();
    }
  };

  // --- Handlers: Orders & Shipping ---
  const handleUpdateOrderStatus = async (orderNumber: string, status: OrderStatus) => {
    await dataStore.updateOrderStatus(orderNumber, status);
    await loadAllData();
  };

  const handleSimulateInstantPaid = async (orderNumber: string) => {
    await dataStore.updateOrderStatus(orderNumber, 'Dibayar');
    await loadAllData();
  };

  const handleSaveResi = async (orderNumber: string, resi: string) => {
    const ord = orders.find(o => o.order_number === orderNumber);
    if (!ord) return;
    await dataStore.updateOrderStatus(orderNumber, ord.status, resi);
    await loadAllData();
  };

  // --- Handlers: Coupons ---
  const handleCreateCoupon = async (payload: any) => {
    await dataStore.createCoupon(payload);
    await loadAllData();
  };

  const handleToggleCoupon = async (couponId: number) => {
    await dataStore.toggleCouponStatus(couponId);
    await loadAllData();
  };

  const handleDeleteCoupon = async (couponId: number, code: string) => {
    if (confirm(`Hapus voucher promo "${code}"?`)) {
      await dataStore.deleteCoupon(couponId);
      await loadAllData();
    }
  };

  // --- Handlers: Staff RBAC ---
  const handleCreateStaff = async (payload: any) => {
    await dataStore.createStaff(payload);
    await loadAllData();
  };

  const handleToggleStaff = async (staffId: string) => {
    await dataStore.toggleStaffStatus(staffId);
    await loadAllData();
  };

  // RBAC Access Restriction View (PRD V5.2 FR-04)
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center p-4 font-sans text-white">
        <div className="max-w-md w-full bg-[#121215] border border-red-900/60 p-8 text-center space-y-4 shadow-2xl">
          <div className="w-12 h-12 bg-red-950/80 border border-red-800 text-[#E60012] flex items-center justify-center mx-auto rounded-full">
            <Lock size={22} />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono tracking-widest text-[#E60012] uppercase font-bold block">
              KURO-COMMERCE RBAC SECURITY
            </span>
            <h1 className="text-base font-black uppercase tracking-tight text-white">
              Akses Terbatas: Staf SIM Sah Saja
            </h1>
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Halaman ini terproteksi oleh <span className="font-semibold text-white">Multi-Role Access Control</span> (PRD V5.2 FR-04). Hanya staf resmi dengan peran <span className="text-zinc-200 font-mono">Owner</span>, <span className="text-zinc-200 font-mono">Gudang</span>, atau <span className="text-zinc-200 font-mono">Kasir</span> yang diizinkan mengakses konsol operasional.
          </p>
          <div className="pt-3 border-t border-zinc-800 space-y-2">
            <Link
              href="/admin/login"
              className="block w-full py-2.5 bg-[#E60012] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider transition-colors text-center"
            >
              Masuk ke Portal Staf (/admin/login)
            </Link>
            <Link
              href="/"
              className="block w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors text-center border border-zinc-800"
            >
              Kembali ke Etalase Toko
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950 font-sans print:bg-white">
      {/* Header Bar */}
      <AdminHeader
        user={user}
        isOwner={isOwner}
        isGudang={isGudang}
        isKasir={isKasir}
        onRefresh={loadAllData}
        onLogout={logout}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Navigation Sidebar / Tab Bar */}
        <AdminSidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          isOwner={isOwner}
          isGudang={isGudang}
        />

        {/* Tab 1: DSS Analytics & Pareto */}
        {activeTab === 'dss' && (
          <DssAnalyticsTab
            dssData={dssData}
            dssPeriod={dssPeriod}
            setDssPeriod={setDssPeriod}
            orders={orders}
            isGudang={isGudang}
            onNavigateToInventory={() => setActiveTab('inventory')}
          />
        )}

        {/* Tab 2: Inventory & Restock */}
        {activeTab === 'inventory' && (
          <InventoryTab
            products={products}
            isOwner={isOwner}
            onStockAdjust={handleStockAdjust}
            onOpenExactStock={(product) => setExactStockModal({ product, newStock: product.stock })}
            onOpenEditProduct={(product) => setEditingProduct(product)}
            onDeleteProduct={handleDeleteProduct}
            onCreateProduct={handleCreateProduct}
          />
        )}

        {/* Tab 3: Orders & TPS Logistics */}
        {activeTab === 'orders' && (
          <OrdersTab
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onSimulateInstantPaid={handleSimulateInstantPaid}
            onSaveResi={handleSaveResi}
            onOpenShippingLabel={(order) => setShippingLabelOrder(order)}
          />
        )}

        {/* Tab 4: Coupons & Promo */}
        {activeTab === 'coupons' && (
          <CouponsTab
            coupons={coupons}
            onToggleStatus={handleToggleCoupon}
            onDeleteCoupon={handleDeleteCoupon}
            onCreateCoupon={handleCreateCoupon}
          />
        )}

        {/* Tab 5: Staff RBAC (Owner Only) */}
        {activeTab === 'staff' && (
          <StaffTab
            staffList={staffList}
            onToggleStatus={handleToggleStaff}
            onCreateStaff={handleCreateStaff}
          />
        )}
      </main>

      {/* Modals */}
      <EditProductModal
        product={editingProduct}
        onClose={() => setEditingProduct(null)}
        onSave={handleUpdateProduct}
      />

      <ExactStockModal
        data={exactStockModal}
        onClose={() => setExactStockModal(null)}
        onSave={handleSetExactStock}
      />

      <ThermalLabelModal
        order={shippingLabelOrder}
        onClose={() => setShippingLabelOrder(null)}
      />
    </div>
  );
}
