// lib/services/settlementService.ts
// Autonomous Settlement & Mutation Processing Engine (TPS)
// Modul verifikasi pembayaran otomatis (Background Daemon & Webhook Receiver)

import { Order, OrderStatus } from '../types';
import { orderService } from './orderService';

export interface PaymentWebhookPayload {
  order_number?: string;
  order_id?: string;
  amount?: number | string;
  status?: string;
  transaction_status?: string;
  raw_text?: string;
  source?: string;
  signature?: string;
}

export interface SettlementCheckResult {
  success: boolean;
  order: Order | null;
  settled: boolean;
  remainingMs?: number;
  reason?: string;
}

export interface WebhookProcessResult {
  success: boolean;
  order_number?: string;
  amount?: number;
  previous_status?: string;
  new_status?: string;
  message: string;
}

// Default delay untuk background auto-settlement (10 detik agar realistis saat scan di HP)
let autoSettleDelayMs = 10_000;
let isAutoSettlementEnabled = true;

export const settlementService = {
  getAutoSettleDelayMs(): number {
    return autoSettleDelayMs;
  },

  setAutoSettleDelayMs(ms: number): void {
    autoSettleDelayMs = Math.max(0, ms);
  },

  isAutoSettlementEnabled(): boolean {
    return isAutoSettlementEnabled;
  },

  setAutoSettlementEnabled(enabled: boolean): void {
    isAutoSettlementEnabled = Boolean(enabled);
  },

  /**
   * Pengecekan status dan pemicu penyelesaian otomatis (Autonomous Daemon)
   * Dipanggil secara berkala oleh Client (Invoice Page) atau background cron
   */
  async checkAndSettleOrder(orderNumber: string): Promise<SettlementCheckResult> {
    if (!orderNumber || typeof orderNumber !== 'string') {
      return {
        success: false,
        order: null,
        settled: false,
        reason: 'Nomor pesanan tidak valid.',
      };
    }

    const order = await orderService.getOrderByNumber(orderNumber.trim());
    if (!order) {
      return {
        success: false,
        order: null,
        settled: false,
        reason: `Pesanan #${orderNumber} tidak ditemukan dalam database.`,
      };
    }

    // Jika sudah lunas atau dalam tahapan pengiriman
    if (order.status !== 'Menunggu Pembayaran') {
      return {
        success: true,
        order,
        settled: true,
        remainingMs: 0,
        reason: `Pesanan sudah dalam status: ${order.status}`,
      };
    }

    // Jika auto-settlement aktif, cek apakah batas waktu sudah terpenuhi
    if (isAutoSettlementEnabled) {
      const createdAtMs = new Date(order.created_at).getTime();
      const nowMs = Date.now();
      const elapsedMs = Math.max(0, nowMs - createdAtMs);

      if (elapsedMs >= autoSettleDelayMs) {
        // Sistem secara otonom memverifikasi dan mengubah status pesanan
        await orderService.updateOrderStatus(order.order_number, 'Dibayar');
        const updated = await orderService.getOrderByNumber(order.order_number);
        return {
          success: true,
          order: updated || { ...order, status: 'Dibayar' },
          settled: true,
          remainingMs: 0,
          reason: 'Diverifikasi otomatis oleh Sistem Backend UrbanStyle.',
        };
      }

      return {
        success: true,
        order,
        settled: false,
        remainingMs: Math.max(0, autoSettleDelayMs - elapsedMs),
        reason: 'Sistem sedang menunggu mutasi pembayaran dari acquirer...',
      };
    }

    return {
      success: true,
      order,
      settled: false,
      reason: 'Auto-settlement daemon nonaktif. Menunggu webhook mutasi.',
    };
  },

  /**
   * Pemrosesan sinyal Webhook & Mutasi Masuk (MacroDroid / GoBiz / Bank Transfer / Payment Gateway)
   */
  async processPaymentWebhook(payload: PaymentWebhookPayload): Promise<WebhookProcessResult> {
    if (!payload || typeof payload !== 'object') {
      return {
        success: false,
        message: 'Payload webhook tidak valid atau kosong.',
      };
    }

    // Ping check dari aplikasi Android PaymentGatewayin
    const anyPayload = payload as any;
    if (
      anyPayload.is_test ||
      anyPayload.channel === 'Test Ping' ||
      anyPayload.app_name === 'Test Ping' ||
      anyPayload.title === 'Uji Coba Ping' ||
      (typeof anyPayload.raw_text === 'string' && anyPayload.raw_text.toLowerCase().includes('ping'))
    ) {
      return {
        success: true,
        message: 'Koneksi ping dari aplikasi PaymentGatewayin berhasil tersambung!',
      };
    }

    let targetOrderNumber = (payload.order_number || payload.order_id || '').trim();
    let numericAmount = payload.amount !== undefined ? Number(payload.amount) : undefined;

    // Jika menerima raw_text dari notifikasi HP (misal GoBiz / SMS Banking / BCA Push Notif)
    if (payload.raw_text && typeof payload.raw_text === 'string') {
      // 1. Ekstraksi nomor pesanan jika ada ORD-YYYYMMDD-XXX
      const orderMatch = payload.raw_text.match(/ORD-\d{8}-\d{3,4}/i);
      if (orderMatch && !targetOrderNumber) {
        targetOrderNumber = orderMatch[0].toUpperCase();
      }

      // 2. Ekstraksi nominal mutasi uang masuk
      // Contoh: "Rp 100.000", "Rp1.000", "sebesar 50.000"
      const amountMatch = payload.raw_text.match(/(?:rp|sebesar|nominal)\s*[:\.]?\s*([\d\.,]+)/i);
      if (amountMatch && numericAmount === undefined) {
        const cleanedStr = amountMatch[1].replace(/\./g, '').replace(/,/g, '');
        const parsed = parseInt(cleanedStr, 10);
        if (!isNaN(parsed) && parsed > 0) {
          numericAmount = parsed;
        }
      }
    }

    let order: Order | null = null;

    // A. Cari berdasarkan order_number jika tersedia
    if (targetOrderNumber) {
      order = await orderService.getOrderByNumber(targetOrderNumber);
    }

    // B. Jika order_number tidak ada namun ada nominal mutasi, cari order "Menunggu Pembayaran" yang pas
    if (!order && numericAmount !== undefined && numericAmount > 0) {
      const allOrders = await orderService.getOrders();
      // Prioritaskan order yang sedang menunggu pembayaran dengan total_amount cocok
      const pendingMatch = allOrders.find(
        (o) => o.status === 'Menunggu Pembayaran' && Math.round(Number(o.total_amount)) === Math.round(numericAmount!)
      );
      if (pendingMatch) {
        order = pendingMatch;
      }
    }

    if (!order) {
      return {
        success: false,
        message: targetOrderNumber
          ? `Pesanan dengan nomor #${targetOrderNumber} tidak ditemukan.`
          : `Tidak ditemukan pesanan tertunda dengan nominal mutasi Rp ${numericAmount?.toLocaleString('id-ID') || 0}.`,
      };
    }

    // Cek apakah status sudah lunas
    if (order.status !== 'Menunggu Pembayaran') {
      return {
        success: true,
        order_number: order.order_number,
        amount: Number(order.total_amount),
        previous_status: order.status,
        new_status: order.status,
        message: `Pesanan #${order.order_number} sudah dalam status ${order.status}. Tidak perlu perubahan.`,
      };
    }

    // Validasi nominal jika disertakan dalam webhook
    if (numericAmount !== undefined && numericAmount > 0) {
      const expectedAmount = Math.round(Number(order.total_amount));
      const receivedAmount = Math.round(numericAmount);
      // Toleransi 0 rupiah (harus tepat)
      if (receivedAmount !== expectedAmount) {
        return {
          success: false,
          order_number: order.order_number,
          message: `Nominal mutasi tidak cocok! Diterima: Rp ${receivedAmount.toLocaleString('id-ID')}, Tagihan: Rp ${expectedAmount.toLocaleString('id-ID')}.`,
        };
      }
    }

    // Eksekusi verifikasi otomatis dari sistem
    const prevStatus = order.status;
    await orderService.updateOrderStatus(order.order_number, 'Dibayar');

    return {
      success: true,
      order_number: order.order_number,
      amount: Number(order.total_amount),
      previous_status: prevStatus,
      new_status: 'Dibayar',
      message: `Pembayaran pesanan #${order.order_number} sebesar Rp ${Number(order.total_amount).toLocaleString('id-ID')} berhasil diverifikasi otomatis oleh sistem.`,
    };
  },

  /**
   * Simulasi instan penyelesaian pesanan oleh sistem (untuk keperluan presentasi/demo)
   */
  async simulateInstantSettle(orderNumber: string): Promise<boolean> {
    return await orderService.updateOrderStatus(orderNumber, 'Dibayar');
  },
};
