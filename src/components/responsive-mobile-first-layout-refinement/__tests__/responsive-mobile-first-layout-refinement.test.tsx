// src/components/responsive-mobile-first-layout-refinement/__tests__/responsive-mobile-first-layout-refinement.test.tsx
import assert from 'node:assert/strict';
import { 
  mobileLayoutConfigSchema, 
  mobileUserInteractionSchema 
} from '../../../lib/validations/responsive-mobile-first-layout-refinement.schema';

console.log('=== [TEST SUITE: MODUL 7 - RESPONSIVE MOBILE-FIRST LAYOUT REFINEMENT] ===');

export async function runModul7Tests() {
  // Test 1: Happy Path Validation
  const validConfig = mobileLayoutConfigSchema.parse({
    deviceViewport: 'mobile-md',
    bottomNavEnabled: true,
    thumbZoneHeightPx: 56,
    touchTargetMinSizePx: 48,
    categoryDrawerAnimation: 'ease-out',
  });
  assert.equal(validConfig.thumbZoneHeightPx, 56);
  assert.equal(validConfig.touchTargetMinSizePx, 48);
  assert.equal(validConfig.categoryDrawerAnimation, 'ease-out');
  console.log('  ✓ Happy path Mobile Config Zod validation lolos');

  // Test 2: Defaults Fallback
  const defaultConfig = mobileLayoutConfigSchema.parse({});
  assert.equal(defaultConfig.deviceViewport, 'mobile-md');
  assert.equal(defaultConfig.bottomNavEnabled, true);
  assert.equal(defaultConfig.stickyBuyBarEnabled, true);
  console.log('  ✓ Default fallback values Mobile Config konsisten');

  // Test 3: User Interaction Schema
  const validInteraction = mobileUserInteractionSchema.parse({
    activeBottomTab: 'kategori',
    isCategorySheetOpen: true,
  });
  assert.equal(validInteraction.activeBottomTab, 'kategori');
  assert.equal(validInteraction.isCategorySheetOpen, true);
  console.log('  ✓ Mobile User Interaction schema validation lolos');

  // Test 4: Boundary rejection
  const invalidConfig = mobileLayoutConfigSchema.safeParse({
    thumbZoneHeightPx: 20, // Di bawah batas minimal 48px
  });
  assert.equal(invalidConfig.success, false);
  console.log('  ✓ Invalid boundary inputs (touch target < min) berhasil ditolak');

  console.log('✓ [MODUL 7] Seluruh pengujian otomatis 100% PASS!\n');
}

runModul7Tests().catch((err) => {
  console.error('Modul 7 test failed:', err);
  process.exit(1);
});
