// lib/hooks/useAdminStore.ts
'use client';

import { useState, useEffect } from 'react';
import { Product, Order, Coupon, OrderStatus, StaffUser } from '@/lib/types';
import { dataStore } from '@/lib/store';
import { DSSData } from '@/components/admin/tabs/DssAnalyticsTab';

export function useAdminStore(isAdmin: boolean) {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [staffList, setStaffList] = useState<StaffUser[]>([]);
  const [dssPeriod, setDssPeriod] = useState<'all' | 'today' | '7days' | '30days'>('all');
  const [dssData, setDssData] = useState<DSSData | null>(null);

  // Modal Control States
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
    if (isAdmin) {
      loadAllData();
    }
  }, [dssPeriod, isAdmin]);

  const handleStockAdjust = async (productId: number, delta: number) => {
    const prod = products.find((p) => p.id === productId);
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

  const handleUpdateOrderStatus = async (orderNumber: string, status: OrderStatus) => {
    await dataStore.updateOrderStatus(orderNumber, status);
    await loadAllData();
  };

  const handleSimulateInstantPaid = async (orderNumber: string) => {
    await dataStore.updateOrderStatus(orderNumber, 'Dibayar');
    await loadAllData();
  };

  const handleSaveResi = async (orderNumber: string, resi: string) => {
    const ord = orders.find((o) => o.order_number === orderNumber);
    if (!ord) return;
    await dataStore.updateOrderStatus(orderNumber, ord.status, resi);
    await loadAllData();
  };

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

  const handleCreateStaff = async (payload: any) => {
    await dataStore.createStaff(payload);
    await loadAllData();
  };

  const handleToggleStaff = async (staffId: string) => {
    await dataStore.toggleStaffStatus(staffId);
    await loadAllData();
  };

  return {
    products,
    orders,
    coupons,
    staffList,
    dssPeriod,
    setDssPeriod,
    dssData,
    editingProduct,
    setEditingProduct,
    exactStockModal,
    setExactStockModal,
    shippingLabelOrder,
    setShippingLabelOrder,
    loadAllData,
    handleStockAdjust,
    handleSetExactStock,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleUpdateOrderStatus,
    handleSimulateInstantPaid,
    handleSaveResi,
    handleCreateCoupon,
    handleToggleCoupon,
    handleDeleteCoupon,
    handleCreateStaff,
    handleToggleStaff,
  };
}
