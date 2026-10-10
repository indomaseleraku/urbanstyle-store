import { z } from 'zod';

export const productCatalogSchema = z.object({
  title: z.string().min(3, 'Nama produk minimal 3 karakter').max(120, 'Nama produk maksimal 120 karakter'),
  sku: z.string().min(4, 'SKU minimal 4 karakter').regex(/^[A-Z0-9-]+$/, 'SKU harus alfanumerik kapital dan strip'),
  category: z.enum(['pria', 'wanita', 'anak', 'bayi']),
  price: z.number().positive('Harga harus lebih besar dari 0').min(10000, 'Harga minimal Rp 10.000'),
  originalPrice: z.number().positive('Harga acuan harus positif').optional(),
  material: z.string().min(3, 'Material minimal 3 karakter'),
  fit: z.enum(['Regular Fit', 'Slim Fit', 'Relaxed Fit', 'Oversized Fit']),
  careInstructions: z.string().min(5, 'Instruksi perawatan wajib diisi'),
  colors: z.array(z.string()).min(1, 'Minimal satu varian warna wajib dipilih'),
  sizes: z.array(z.string()).min(1, 'Minimal satu varian ukuran wajib dipilih'),
  initialStock: z.number().int().nonnegative('Stok awal tidak boleh negatif'),
  userRole: z.enum(['customer', 'admin', 'warehouse', 'cashier']).default('admin'),
  isActive: z.boolean().default(true),
});

export type ProductCatalogInput = z.infer<typeof productCatalogSchema>;
