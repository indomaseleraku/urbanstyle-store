import assert from 'node:assert/strict';
import { productCatalogSchema } from '../../../lib/validations/user-authentication-and-product-catalog-management.schema';

console.log('=== [TEST SUITE: MODUL 4 - USER AUTHENTICATION & PRODUCT CATALOG MANAGEMENT] ===');

export async function runModul4Tests() {
  // Test 1: Happy Path
  const validData = productCatalogSchema.parse({
    title: 'Kemeja Flannel Kotak Lengan Panjang',
    sku: 'UQ-FLANNEL-09',
    category: 'pria',
    price: 399000,
    material: '100% Katun Pilihan',
    fit: 'Regular Fit',
    careInstructions: 'Cuci dengan mesin air dingin',
    colors: ['18 WINE', '69 NAVY'],
    sizes: ['S', 'M', 'L', 'XL'],
    initialStock: 45,
    userRole: 'admin',
    isActive: true,
  });
  assert.equal(validData.sku, 'UQ-FLANNEL-09');
  assert.equal(validData.price, 399000);
  assert.equal(validData.userRole, 'admin');
  console.log('  ✓ Happy path Zod product catalog schema lolos');

  // Test 2: Boundary Test - Negative Stock Rejection
  const invalidStock = productCatalogSchema.safeParse({
    title: 'Celana Katun Ankle',
    sku: 'UQ-ANKLE-01',
    category: 'wanita',
    price: 299000,
    material: 'Katun',
    fit: 'Slim Fit',
    careInstructions: 'Jemur teduh',
    colors: ['09 BLACK'],
    sizes: ['M'],
    initialStock: -10, // Invalid negative stock
  });
  assert.equal(invalidStock.success, false);
  console.log('  ✓ Negative stock berhasil ditolak Zod');

  // Test 3: Invalid SKU Pattern Rejection
  const invalidSku = productCatalogSchema.safeParse({
    title: 'Jaket Parka Saku',
    sku: 'invalid sku with spaces!#$',
    category: 'pria',
    price: 599000,
    material: 'Poliester',
    fit: 'Regular Fit',
    careInstructions: 'Cuci lembut',
    colors: ['57 OLIVE'],
    sizes: ['L'],
    initialStock: 10,
  });
  assert.equal(invalidSku.success, false);
  console.log('  ✓ Non-alphanumeric SKU pattern berhasil ditolak');

  // Test 4: Minimum price threshold
  const invalidPrice = productCatalogSchema.safeParse({
    title: 'Kaos Kaki Katun',
    sku: 'UQ-SOCKS-01',
    category: 'pria',
    price: 500, // below minimum 10000
    material: 'Katun',
    fit: 'Regular Fit',
    careInstructions: 'Cuci biasa',
    colors: ['00 WHITE'],
    sizes: ['M'],
    initialStock: 100,
  });
  assert.equal(invalidPrice.success, false);
  console.log('  ✓ Batas harga minimum (Rp 10.000) terproteksi');

  console.log('✓ [MODUL 4] Seluruh pengujian otomatis 100% PASS!\n');
}

runModul4Tests().catch((err) => {
  console.error('Modul 4 test failed:', err);
  process.exit(1);
});
