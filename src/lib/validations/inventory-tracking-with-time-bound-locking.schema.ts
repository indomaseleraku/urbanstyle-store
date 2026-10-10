import { z } from 'zod';

export const inventoryLockSchema = z.object({
  sku: z.string().min(4, 'SKU minimal 4 karakter'),
  variantId: z.string().min(2, 'Varian ID diperlukan'),
  quantity: z.number().int().positive('Jumlah reservasi minimal 1').max(10, 'Maksimal 10 unit per reservasi'),
  sessionId: z.string().min(6, 'ID sesi checkout wajib ada'),
  lockDurationMinutes: z.number().int().min(1).max(30).default(10),
  reason: z.enum(['checkout_in_progress', 'cart_reservation', 'pos_hold']).default('checkout_in_progress'),
});

export const inventoryAdjustmentSchema = z.object({
  sku: z.string().min(4, 'SKU minimal 4 karakter'),
  variantId: z.string().min(2, 'Varian ID diperlukan'),
  changeAmount: z.number().int().refine((val) => val !== 0, 'Perubahan stok tidak boleh 0'),
  reason: z.enum(['restock', 'damaged', 'audit_discrepancy', 'return']),
  notes: z.string().optional(),
});

export type InventoryLockInput = z.infer<typeof inventoryLockSchema>;
export type InventoryAdjustmentInput = z.infer<typeof inventoryAdjustmentSchema>;
