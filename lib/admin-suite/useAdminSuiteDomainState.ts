// lib/admin-suite/useAdminSuiteDomainState.ts
// Domain State & Action Handlers untuk UrbanStyle Commerce OS

import { useState, useEffect } from 'react';
import { 
  Role, Product, Order, OrderStatus, Employee, InboundShipment, 
  ExpenseItem, PromoVoucher, ActivityLog, StockAdjustment 
} from './types';
import { 
  INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_EMPLOYEES, 
  INITIAL_INBOUND, INITIAL_EXPENSES, INITIAL_PROMOS, INITIAL_LOGS 
} from './initialData';

export function useAdminSuiteDomainState(role: Role) {
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window === 'undefined') return INITIAL_PRODUCTS;
    const saved = localStorage.getItem('urban_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    if (typeof window === 'undefined') return INITIAL_ORDERS;
    const saved = localStorage.getItem('urban_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [employees, setEmployees] = useState<Employee[]>(() => {
    if (typeof window === 'undefined') return INITIAL_EMPLOYEES;
    const saved = localStorage.getItem('urban_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [inboundShipments, setInboundShipments] = useState<InboundShipment[]>(() => {
    if (typeof window === 'undefined') return INITIAL_INBOUND;
    const saved = localStorage.getItem('urban_inbound');
    return saved ? JSON.parse(saved) : INITIAL_INBOUND;
  });

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() => {
    if (typeof window === 'undefined') return INITIAL_EXPENSES;
    const saved = localStorage.getItem('urban_expenses');
    return saved ? JSON.parse(saved) : INITIAL_EXPENSES;
  });

  const [promos, setPromos] = useState<PromoVoucher[]>(() => {
    if (typeof window === 'undefined') return INITIAL_PROMOS;
    const saved = localStorage.getItem('urban_promos');
    return saved ? JSON.parse(saved) : INITIAL_PROMOS;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(() => {
    if (typeof window === 'undefined') return INITIAL_LOGS;
    const saved = localStorage.getItem('urban_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [stockAdjustments, setStockAdjustments] = useState<StockAdjustment[]>([
    {
      id: 'adj-01',
      sku: 'URBAN-CHN-03',
      productName: 'Celana Panjang Smart Ankle Pants',
      previousStock: 24,
      adjustedStock: 22,
      diff: -2,
      reason: 'Barang Rusak',
      date: '14 Okt 2026',
      adjustedBy: 'Staf Gudang'
    }
  ]);

  // Sync state ke localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('urban_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('urban_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('urban_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('urban_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const addLog = (action: string, details: string, category: ActivityLog['category']) => {
    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      userName: role === 'superadmin' ? 'Kimy Eka (Owner)' : role === 'store_admin' ? 'Staf Kasir' : 'Staf Gudang',
      userRole: role,
      action,
      details,
      category
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const addProduct = (prodData: Omit<Product, 'id' | 'salesCount' | 'rating'>) => {
    const newProd: Product = { ...prodData, id: `prod-${Date.now()}`, salesCount: 0, rating: 5.0 };
    setProducts(prev => [newProd, ...prev]);
    addLog('Tambah Produk Baru', `Menambahkan "${newProd.name}" (${newProd.sku}) ke katalog`, 'inventory');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    addLog('Update Produk', `Memperbarui data produk ID ${id}`, 'inventory');
  };

  const deleteProduct = (id: string) => {
    const prod = products.find(p => p.id === id);
    setProducts(prev => prev.filter(p => p.id !== id));
    if (prod) addLog('Hapus Produk', `Menghapus produk "${prod.name}" dari katalog`, 'inventory');
  };

  const adjustStock = (sku: string, diff: number, reason: StockAdjustment['reason']) => {
    const product = products.find(p => p.sku === sku);
    if (!product) return;
    const prevStock = product.stock;
    const newStock = Math.max(0, prevStock + diff);

    setProducts(prev => prev.map(p => p.sku === sku ? { ...p, stock: newStock } : p));
    const adj: StockAdjustment = {
      id: `adj-${Date.now()}`,
      sku,
      productName: product.name,
      previousStock: prevStock,
      adjustedStock: newStock,
      diff,
      reason,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      adjustedBy: role === 'warehouse_admin' ? 'Staf Gudang' : 'Superadmin'
    };
    setStockAdjustments(prev => [adj, ...prev]);
    addLog('Penyesuaian Stok', `SKU ${sku} diubah ${diff > 0 ? `+${diff}` : diff} unit (${reason})`, 'inventory');
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, trackingNumber?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status,
          trackingNumber: trackingNumber !== undefined ? trackingNumber : o.trackingNumber,
          paymentStatus: status === 'processing' || status === 'packing' || status === 'shipped' || status === 'delivered' ? 'paid' : o.paymentStatus
        };
      }
      return o;
    }));
    addLog('Update Status Pesanan', `Pesanan ${orderId} diubah status menjadi "${status}"`, 'order');
  };

  const createOrder = (newOrderData: Partial<Order>): Order => {
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newOrderData.customerName || 'Pelanggan Baru',
      customerPhone: newOrderData.customerPhone || '+62 812-0000-0000',
      customerEmail: newOrderData.customerEmail || 'buyer@urbanstyle.com',
      shippingAddress: newOrderData.shippingAddress || 'Jl. Jenderal Sudirman No. 1',
      city: newOrderData.city || 'Jakarta Pusat',
      courier: newOrderData.courier || 'SiCepat Kilat',
      paymentMethod: newOrderData.paymentMethod || 'QRIS',
      paymentStatus: 'paid',
      items: newOrderData.items || [],
      subtotal: newOrderData.subtotal || 0,
      shippingCost: newOrderData.shippingCost || 20000,
      discount: newOrderData.discount || 0,
      total: newOrderData.total || 0,
      status: 'processing',
      createdAt: 'Hari ini ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB',
      notes: newOrderData.notes || ''
    };

    if (newOrder.items) {
      newOrder.items.forEach(item => {
        setProducts(prev => prev.map(p => {
          if (p.id === item.productId || p.sku === item.sku) {
            return { ...p, stock: Math.max(0, p.stock - item.quantity), salesCount: p.salesCount + item.quantity };
          }
          return p;
        }));
      });
    }

    setOrders(prev => [newOrder, ...prev]);
    addLog('Pesanan Dibuat', `Pesanan ${newOrder.orderNumber} berhasil dibuat melalui etalase`, 'order');
    return newOrder;
  };

  const addEmployee = (empData: Omit<Employee, 'id' | 'lastLogin'>) => {
    const newEmp: Employee = { ...empData, id: `emp-${Date.now()}`, lastLogin: 'Baru dibuat' };
    setEmployees(prev => [newEmp, ...prev]);
    addLog('Tambah Karyawan', `Menambahkan ${newEmp.name} (${newEmp.roleLabel})`, 'employee');
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
    addLog('Update Data Karyawan', `Memperbarui profil staf ID ${id}`, 'employee');
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees(prev => prev.map(e => {
      if (e.id === id) {
        const nextStatus = e.status === 'active' ? 'inactive' : 'active';
        addLog('Ubah Status Akses', `Status akses ${e.name} diubah menjadi ${nextStatus}`, 'employee');
        return { ...e, status: nextStatus };
      }
      return e;
    }));
  };

  const receiveShipment = (id: string) => {
    const shipment = inboundShipments.find(s => s.id === id);
    if (!shipment) return;
    setInboundShipments(prev => prev.map(s => s.id === id ? { ...s, status: 'received' } : s));
    addLog('Penerimaan Gudang', `Barang masuk ${shipment.poNumber} (${shipment.totalUnits} unit) diverifikasi QC`, 'inventory');
  };

  const addExpense = (expData: Omit<ExpenseItem, 'id' | 'status'>) => {
    const newExp: ExpenseItem = { ...expData, id: `exp-${Date.now()}`, status: 'approved' };
    setExpenses(prev => [newExp, ...prev]);
    addLog('Catatan Beban Baru', `Beban ${newExp.category} Rp ${newExp.amount.toLocaleString('id-ID')} dicatat`, 'finance');
  };

  const addPromo = (pData: Omit<PromoVoucher, 'id' | 'usageCount'>) => {
    const newP: PromoVoucher = { ...pData, id: `prm-${Date.now()}`, usageCount: 0 };
    setPromos(prev => [newP, ...prev]);
    addLog('Buat Voucher Promo', `Voucher "${newP.code}" diaktifkan`, 'order');
  };

  return {
    products, addProduct, updateProduct, deleteProduct, adjustStock,
    orders, updateOrderStatus, createOrder,
    employees, addEmployee, updateEmployee, toggleEmployeeStatus,
    inboundShipments, receiveShipment, stockAdjustments,
    expenses, addExpense,
    promos, addPromo,
    activityLogs
  };
}
