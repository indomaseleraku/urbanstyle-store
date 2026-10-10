// src/lib/validations/e-commerce-product-display-optimization.schema.ts
import { z } from 'zod';

export const productDisplayFilterSchema = z.object({
  category: z.string().default('all'),
  gender: z.enum(['all', 'pria', 'wanita', 'unisex', 'anak']).default('all'),
  sortBy: z.enum(['featured', 'popular', 'price-asc', 'price-desc', 'newest']).default('featured'),
  searchQuery: z.string().max(100, 'Kata kunci maksimal 100 karakter').optional().default(''),
  inStockOnly: z.boolean().default(false),
  priceRange: z.object({
    min: z.number().nonnegative().default(0),
    max: z.number().positive().default(2000000),
  }).default({ min: 0, max: 2000000 }),
  viewMode: z.enum(['grid-4', 'grid-2', 'editorial']).default('grid-4'),
});

export const productDisplayPreferenceSchema = z.object({
  enableMacroZoom: z.boolean().default(true),
  showWeatherBadges: z.boolean().default(true),
  enableColorCrossfade: z.boolean().default(true),
  displayDensity: z.enum(['compact', 'comfortable', 'editorial']).default('comfortable'),
  highlightDiscountPercent: z.number().min(0).max(100).default(10),
});

export type ProductDisplayFilterInput = z.infer<typeof productDisplayFilterSchema>;
export type ProductDisplayPreferenceInput = z.infer<typeof productDisplayPreferenceSchema>;
