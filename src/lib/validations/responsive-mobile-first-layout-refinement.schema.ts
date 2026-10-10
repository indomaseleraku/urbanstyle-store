// src/lib/validations/responsive-mobile-first-layout-refinement.schema.ts
import { z } from 'zod';

export const mobileLayoutConfigSchema = z.object({
  deviceViewport: z.enum(['mobile-sm', 'mobile-md', 'tablet', 'desktop']).default('mobile-md'),
  bottomNavEnabled: z.boolean().default(true),
  thumbZoneHeightPx: z.number().min(48).max(80).default(56),
  touchTargetMinSizePx: z.number().min(44).max(64).default(48),
  enableHapticFeedback: z.boolean().default(true),
  drawerSwipeThresholdPx: z.number().min(20).max(150).default(60),
  categoryDrawerAnimation: z.enum(['spring', 'ease-out', 'linear']).default('ease-out'),
  stickyBuyBarEnabled: z.boolean().default(true),
});

export const mobileUserInteractionSchema = z.object({
  activeBottomTab: z.enum(['beranda', 'kategori', 'favorit', 'keranjang', 'akun']).default('beranda'),
  isCategorySheetOpen: z.boolean().default(false),
  isSearchModalOpen: z.boolean().default(false),
  feedbackToastMessage: z.string().max(120).optional().default(''),
});

export type MobileLayoutConfigInput = z.infer<typeof mobileLayoutConfigSchema>;
export type MobileUserInteractionInput = z.infer<typeof mobileUserInteractionSchema>;
