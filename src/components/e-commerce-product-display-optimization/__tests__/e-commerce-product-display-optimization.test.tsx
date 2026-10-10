// src/components/e-commerce-product-display-optimization/__tests__/e-commerce-product-display-optimization.test.tsx
import assert from 'node:assert/strict';
import { 
  productDisplayFilterSchema, 
  productDisplayPreferenceSchema 
} from '../../../lib/validations/e-commerce-product-display-optimization.schema';

console.log('=== [TEST SUITE: MODUL 6 - E-COMMERCE PRODUCT DISPLAY OPTIMIZATION] ===');

export async function runModul6Tests() {
  // Test 1: Happy Path Validation
  const validFilters = productDisplayFilterSchema.parse({
    category: 'kaos',
    gender: 'pria',
    sortBy: 'popular',
    inStockOnly: true,
  });
  assert.equal(validFilters.gender, 'pria');
  assert.equal(validFilters.sortBy, 'popular');
  assert.equal(validFilters.inStockOnly, true);
  console.log('  ✓ Happy path Zod filter validation lolos');

  // Test 2: Defaults Fallback
  const defaultFilters = productDisplayFilterSchema.parse({});
  assert.equal(defaultFilters.category, 'all');
  assert.equal(defaultFilters.gender, 'all');
  assert.equal(defaultFilters.sortBy, 'featured');
  assert.equal(defaultFilters.viewMode, 'grid-4');
  console.log('  ✓ Default fallback values konsisten');

  // Test 3: Preference Schema
  const validPrefs = productDisplayPreferenceSchema.parse({
    enableMacroZoom: true,
    showWeatherBadges: true,
    displayDensity: 'editorial',
  });
  assert.equal(validPrefs.enableMacroZoom, true);
  assert.equal(validPrefs.displayDensity, 'editorial');
  console.log('  ✓ Preference schema validation lolos');

  // Test 4: Boundary rejection
  const invalidFilter = productDisplayFilterSchema.safeParse({
    gender: 'alien', // invalid gender
  });
  assert.equal(invalidFilter.success, false);
  console.log('  ✓ Invalid boundary inputs berhasil ditolak');

  console.log('✓ [MODUL 6] Seluruh pengujian otomatis 100% PASS!\n');
}

runModul6Tests().catch((err) => {
  console.error('Modul 6 test failed:', err);
  process.exit(1);
});
