import assert from 'node:assert/strict';
import { 
  authSignInSchema, 
  authSignUpSchema 
} from '../../../lib/validations/supabase-auth-integration.schema';

console.log('=== [TEST SUITE: MODUL 2 - SUPABASE AUTH INTEGRATION] ===');

export async function runModul2Tests() {
  // Test 1: Happy Path Sign Up
  const validUser = authSignUpSchema.parse({
    fullName: 'Kimy Eka Ardiansyah',
    email: 'kimy@urbanstyle.store',
    phone: '081234567890',
    password: 'PasswordSuperAman123!',
    confirmPassword: 'PasswordSuperAman123!',
    role: 'admin',
  });
  assert.equal(validUser.fullName, 'Kimy Eka Ardiansyah');
  assert.equal(validUser.email, 'kimy@urbanstyle.store');
  assert.equal(validUser.role, 'admin');
  console.log('  ✓ Happy path Zod auth registration schema lolos');

  // Test 2: Password Mismatch Rejection
  const passwordMismatch = authSignUpSchema.safeParse({
    fullName: 'Budi Santoso',
    email: 'budi@urbanstyle.store',
    phone: '081234567891',
    password: 'Password123!',
    confirmPassword: 'PasswordLain456!',
    role: 'warehouse',
  });
  assert.equal(passwordMismatch.success, false);
  console.log('  ✓ Password mismatch berhasil ditolak Zod refine');

  // Test 3: Short password (<8 chars) rejection
  const shortPassword = authSignUpSchema.safeParse({
    fullName: 'Budi Santoso',
    email: 'budi@urbanstyle.store',
    phone: '081234567891',
    password: 'short',
    confirmPassword: 'short',
  });
  assert.equal(shortPassword.success, false);
  console.log('  ✓ Password kurang dari 8 karakter berhasil ditolak');

  // Test 4: Invalid Indonesian phone number rejection
  const invalidPhone = authSignUpSchema.safeParse({
    fullName: 'Budi Santoso',
    email: 'budi@urbanstyle.store',
    phone: '123456', // non-Indonesian invalid format
    password: 'Password123!',
    confirmPassword: 'Password123!',
  });
  assert.equal(invalidPhone.success, false);
  console.log('  ✓ Format nomor seluler tidak valid (+62/08) berhasil ditolak');

  // Test 5: Sign In Schema validation
  const validSignIn = authSignInSchema.parse({
    email: 'admin@urbanstyle.store',
    password: 'Password123!',
    rememberMe: true,
  });
  assert.equal(validSignIn.email, 'admin@urbanstyle.store');
  assert.equal(validSignIn.rememberMe, true);
  console.log('  ✓ Happy path Zod sign-in schema lolos');

  console.log('✓ [MODUL 2] Seluruh pengujian otomatis 100% PASS!\n');
}

runModul2Tests().catch((err) => {
  console.error('Modul 2 test failed:', err);
  process.exit(1);
});
