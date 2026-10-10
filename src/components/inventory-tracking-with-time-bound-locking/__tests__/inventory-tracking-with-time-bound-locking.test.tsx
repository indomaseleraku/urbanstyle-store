import assert from 'node:assert/strict';
import { 
  inventoryLockSchema, 
  inventoryAdjustmentSchema 
} from '../../../lib/validations/inventory-tracking-with-time-bound-locking.schema';

console.log('=== [TEST SUITE: MODUL 5 - INVENTORY TRACKING WITH TIME-BOUND LOCKING] ===');

export async function runModul5Tests() {
  // Test 1: Happy Path Lock
  const validLock = inventoryLockSchema.parse({
    sku: 'UQ-AIRISM-TEE-01',
    variantId: 'var-902',
    quantity: 2,
    sessionId: 'sess_live_198273',
    lockDurationMinutes: 10,
    reason: 'checkout_in_progress',
  });
  assert.equal(validLock.sku, 'UQ-AIRISM-TEE-01');
  assert.equal(validLock.quantity, 2);
  assert.equal(validLock.lockDurationMinutes, 10);
  console.log('  ✓ Happy path Zod inventory lock lolos');

  // Test 2: Boundary - Quantity > 10 Rejection (Anti-hoarding)
  const excessiveQty = inventoryLockSchema.safeParse({
    sku: 'UQ-AIRISM-TEE-01',
    variantId: 'var-902',
    quantity: 15, // exceeds max 10
    sessionId: 'sess_live_198273',
  });
  assert.equal(excessiveQty.success, false);
  console.log('  ✓ Batas kuantitas anti-hoarding (> 10 unit) berhasil ditolak');

  // Test 3: Boundary - Duration out of bounds (1 - 30 minutes)
  const excessiveDuration = inventoryLockSchema.safeParse({
    sku: 'UQ-AIRISM-TEE-01',
    variantId: 'var-902',
    quantity: 1,
    sessionId: 'sess_live_198273',
    lockDurationMinutes: 60, // exceeds max 30 mins
  });
  assert.equal(excessiveDuration.success, false);
  console.log('  ✓ Durasi kunci melebihi 30 menit berhasil ditolak');

  // Test 4: Inventory Adjustment Schema validation
  const validAdj = inventoryAdjustmentSchema.parse({
    sku: 'UQ-OXFORD-01',
    variantId: 'var-oxford-m',
    changeAmount: 50,
    reason: 'restock',
    notes: 'Penerimaan kontainer gudang Pamulang',
  });
  assert.equal(validAdj.changeAmount, 50);
  assert.equal(validAdj.reason, 'restock');
  console.log('  ✓ Inventory adjustment schema validation lolos');

  // Test 5: Rejection of zero adjustment
  const zeroAdj = inventoryAdjustmentSchema.safeParse({
    sku: 'UQ-OXFORD-01',
    variantId: 'var-oxford-m',
    changeAmount: 0, // cannot be 0
    reason: 'audit_discrepancy',
  });
  assert.equal(zeroAdj.success, false);
  console.log('  ✓ Perubahan stok bernilai 0 berhasil ditolak');

  console.log('✓ [MODUL 5] Seluruh pengujian otomatis 100% PASS!\n');
}

runModul5Tests().catch((err) => {
  console.error('Modul 5 test failed:', err);
  process.exit(1);
});
