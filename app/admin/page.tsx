// app/admin/page.tsx
// Halaman Dashboard Manajemen SIM UrbanStyle Store (Modular Orchestrator)
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useAdminStore } from '@/lib/hooks/useAdminStore';

// Modular Components
import { AdminHeader } from '@/components/admin/AdminHeader';
import { AdminSidebar, AdminTab } from '@/components/admin/AdminSidebar';
import { DssAnalyticsTab } from '@/components/admin/tabs/DssAnalyticsTab';
import { InventoryTab } from '@/components/admin/tabs/InventoryTab';
import { OrdersTab } from '@/components/admin/tabs/OrdersTab';
import { CouponsTab } from '@/components/admin/tabs/CouponsTab';
import { StaffTab } from '@/components/admin/tabs/StaffTab';
import { EditProductModal } from '@/components/admin/modals/EditProductModal';
import { ExactStockModal } from '@/components/admin/modals/ExactStockModal';
import { ThermalLabelModal } from '@/components/admin/modals/ThermalLabelModal';
import AdminAccessDenied from '@/components/admin/AdminAccessDenied';

export default function AdminDashboardPage() {
  const { user, isAdmin, isOwner, isGudang, isKasir, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<AdminTab>(
    isGudang ? 'inventory' : isKasir ? 'orders' : 'dss'
  );

  const s = useAdminStore(isAdmin);

  // Tab switch guard based on RBAC role
  useEffect(() => {
    if (isGudang && (activeTab === 'dss' || activeTab === 'staff')) {
      setActiveTab('inventory');
    } else if (isKasir && (activeTab === 'dss' || activeTab === 'staff')) {
      setActiveTab('orders');
    }
  }, [isGudang, isKasir, activeTab]);

  // RBAC Access Restriction View (PRD V5.2 FR-04)
  if (!isAdmin) {
    return <AdminAccessDenied />;
  }

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-950 font-sans print:bg-white">
      {/* Header Bar */}
      <AdminHeader
        user={user}
        isOwner={isOwner}
        isGudang={isGudang}
        isKasir={isKasir}
        onRefresh={s.loadAllData}
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
            dssData={s.dssData}
            dssPeriod={s.dssPeriod}
            setDssPeriod={s.setDssPeriod}
            orders={s.orders}
            isGudang={isGudang}
            onNavigateToInventory={() => setActiveTab('inventory')}
          />
        )}

        {/* Tab 2: Inventory & Restock */}
        {activeTab === 'inventory' && (
          <InventoryTab
            products={s.products}
            isOwner={isOwner}
            onStockAdjust={s.handleStockAdjust}
            onOpenExactStock={(product) => s.setExactStockModal({ product, newStock: product.stock })}
            onOpenEditProduct={(product) => s.setEditingProduct(product)}
            onDeleteProduct={s.handleDeleteProduct}
            onCreateProduct={s.handleCreateProduct}
          />
        )}

        {/* Tab 3: Orders & TPS Logistics */}
        {activeTab === 'orders' && (
          <OrdersTab
            orders={s.orders}
            onUpdateOrderStatus={s.handleUpdateOrderStatus}
            onSimulateInstantPaid={s.handleSimulateInstantPaid}
            onSaveResi={s.handleSaveResi}
            onOpenShippingLabel={(order) => s.setShippingLabelOrder(order)}
          />
        )}

        {/* Tab 4: Coupons & Promo */}
        {activeTab === 'coupons' && (
          <CouponsTab
            coupons={s.coupons}
            onToggleStatus={s.handleToggleCoupon}
            onDeleteCoupon={s.handleDeleteCoupon}
            onCreateCoupon={s.handleCreateCoupon}
          />
        )}

        {/* Tab 5: Staff RBAC (Owner Only) */}
        {activeTab === 'staff' && (
          <StaffTab
            staffList={s.staffList}
            onToggleStatus={s.handleToggleStaff}
            onCreateStaff={s.handleCreateStaff}
          />
        )}
      </main>

      {/* Modals */}
      <EditProductModal
        product={s.editingProduct}
        onClose={() => s.setEditingProduct(null)}
        onSave={s.handleUpdateProduct}
      />

      <ExactStockModal
        data={s.exactStockModal}
        onClose={() => s.setExactStockModal(null)}
        onSave={s.handleSetExactStock}
      />

      <ThermalLabelModal
        order={s.shippingLabelOrder}
        onClose={() => s.setShippingLabelOrder(null)}
      />
    </div>
  );
}
