import { z } from 'zod';

export const authSignInSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  rememberMe: z.boolean().default(true),
});

export const authSignUpSchema = z.object({
  fullName: z.string().min(3, 'Nama lengkap minimal 3 karakter').max(80),
  email: z.string().email('Format email tidak valid'),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, 'Nomor telepon seluler Indonesia tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
  confirmPassword: z.string().min(8, 'Konfirmasi password minimal 8 karakter'),
  role: z.enum(['customer', 'admin', 'warehouse', 'cashier']).default('customer'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
});

export type AuthSignInInput = z.infer<typeof authSignInSchema>;
export type AuthSignUpInput = z.infer<typeof authSignUpSchema>;
