// lib/services/authStorageService.ts
import { UserProfile } from '../types';
import { INITIAL_USERS } from '../mock-data';
import { setAuthCookies } from './authCookieService';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const SESSION_KEY = 'urbanstyle_session';
const REGISTERED_KEY = 'urbanstyle_registered_users';
const CREDENTIALS_KEY = 'urbanstyle_user_credentials';

interface UserCredential {
  email: string;
  password: string;
  user: UserProfile;
}

const DEFAULT_ACCOUNT_PASSWORDS: Record<string, string[]> = {
  'member@urbanstyle.com': ['password', '123456'],
  'thn071205@gmail.com': ['password', '123456'],
  'member': ['password', '123456'],
  'kimy': ['password', '123456'],
  'admin@urbanstyle.com': ['admin123'],
  'admin': ['admin123'],
  'owner': ['admin123'],
  'gudang@urbanstyle.com': ['gudang123'],
  'gudang': ['gudang123'],
  'kasir@urbanstyle.com': ['kasir123'],
  'kasir': ['kasir123'],
};

export function loadUserSession(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function persistUserSession(user: UserProfile | null): Promise<void> {
  if (typeof window === 'undefined') return;
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
  await setAuthCookies(user);
}

function getStoredCredentials(): UserCredential[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CREDENTIALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveRegisteredCredential(user: UserProfile, password: string): Promise<void> {
  const cleanEmail = user.email.toLowerCase().trim();
  const cleanPass = password.trim();

  // 1. Simpan di localStorage untuk cache instan
  if (typeof window !== 'undefined') {
    try {
      const creds = getStoredCredentials();
      const idx = creds.findIndex((c) => c.email.toLowerCase() === cleanEmail);
      if (idx >= 0) {
        creds[idx] = { email: cleanEmail, password: cleanPass, user };
      } else {
        creds.push({ email: cleanEmail, password: cleanPass, user });
      }
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
      saveLocalRegisteredUser(user);
    } catch {}
  }

  // 2. Simpan permanen ke Supabase database cloud
  if (isSupabaseConfigured && supabase) {
    try {
      await supabase.from('user_credentials').upsert(
        {
          email: cleanEmail,
          password_hash: cleanPass,
          role: user.role || 'customer',
          full_name: user.full_name,
          phone: user.phone || null,
          preferred_size: user.preferred_size || 'M',
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'email' }
      );
      await supabase.from('profiles').upsert(
        {
          email: cleanEmail,
          full_name: user.full_name,
          phone: user.phone || null,
          role: user.role || 'customer',
          preferred_size: user.preferred_size || 'M',
        },
        { onConflict: 'email' }
      );
    } catch (err) {
      console.warn('Supabase credential save error:', err);
    }
  }
}

export async function validateUserPassword(
  email: string,
  pass: string
): Promise<{ valid: boolean; user?: UserProfile; message?: string }> {
  const cleanEmail = email.toLowerCase().trim();
  const cleanPass = pass.trim();

  // 1. Validasi langsung ke database Supabase Cloud
  if (isSupabaseConfigured && supabase) {
    try {
      const { data, error } = await supabase
        .from('user_credentials')
        .select('*')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (!error && data) {
        if (data.password_hash === cleanPass) {
          const u: UserProfile = {
            id: data.id,
            email: data.email,
            full_name: data.full_name,
            role: data.role || 'customer',
            phone: data.phone || undefined,
            preferred_size: data.preferred_size || 'M',
            created_at: data.created_at,
          };
          return { valid: true, user: u };
        }
        return {
          valid: false,
          message: 'Kata sandi salah. Silakan periksa kembali atau gunakan Lupa Kata Sandi.',
        };
      }
    } catch (err) {
      console.warn('Supabase auth validation error, fallback to local:', err);
    }
  }

  // 2. Fallback: Cek kredensial yang tersimpan di localStorage
  const creds = getStoredCredentials();
  const matched = creds.find((c) => c.email.toLowerCase() === cleanEmail);
  if (matched) {
    if (matched.password === cleanPass) return { valid: true, user: matched.user };
    return {
      valid: false,
      message: 'Kata sandi salah. Silakan periksa kembali atau gunakan Lupa Kata Sandi.',
    };
  }

  // 3. Fallback: Cek akun bawaan / demo
  if (cleanEmail in DEFAULT_ACCOUNT_PASSWORDS) {
    const allowed = DEFAULT_ACCOUNT_PASSWORDS[cleanEmail];
    if (allowed.includes(cleanPass)) {
      const u = resolveMemberUser(cleanEmail);
      return { valid: true, user: u || undefined };
    }
    return {
      valid: false,
      message: 'Kata sandi salah. Silakan periksa kembali atau gunakan Lupa Kata Sandi.',
    };
  }

  // 4. Jika email terdaftar secara lokal tapi belum ada kredensial
  const localReg = findLocalRegisteredUser(cleanEmail);
  if (localReg) {
    return {
      valid: false,
      message: 'Kata sandi salah. Silakan periksa kembali atau gunakan Lupa Kata Sandi.',
    };
  }

  // 5. Jika email sama sekali belum terdaftar
  return {
    valid: false,
    message: 'Alamat email belum terdaftar. Silakan pilih tab Daftar Akun.',
  };
}

export async function resetUserPassword(email: string, newPassword: string): Promise<boolean> {
  const cleanEmail = email.toLowerCase().trim();
  const cleanPass = newPassword.trim();
  let dbSuccess = false;

  // 1. Update ke Supabase database cloud
  if (isSupabaseConfigured && supabase) {
    try {
      const { error } = await supabase
        .from('user_credentials')
        .update({
          password_hash: cleanPass,
          updated_at: new Date().toISOString(),
        })
        .eq('email', cleanEmail);
      if (!error) dbSuccess = true;
    } catch (err) {
      console.warn('Supabase reset password error:', err);
    }
  }

  // 2. Update ke localStorage fallback
  if (typeof window !== 'undefined') {
    try {
      const creds = getStoredCredentials();
      const idx = creds.findIndex((c) => c.email.toLowerCase() === cleanEmail);
      if (idx >= 0) {
        creds[idx].password = cleanPass;
        localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
        return true;
      }

      const existing =
        INITIAL_USERS.find((u) => u.email.toLowerCase() === cleanEmail) ||
        findLocalRegisteredUser(cleanEmail);
      const profile: UserProfile = existing || {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        full_name: cleanEmail.split('@')[0].toUpperCase(),
        role: 'customer',
        created_at: new Date().toISOString(),
      };
      creds.push({ email: cleanEmail, password: cleanPass, user: profile });
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
      saveLocalRegisteredUser(profile);
      return true;
    } catch {
      return dbSuccess;
    }
  }
  return dbSuccess;
}

export function authenticateStaff(
  cleanEmail: string,
  pass: string
): { success: boolean; user?: UserProfile; message?: string } {
  if (!pass || pass.trim().length === 0) {
    return { success: false, message: 'Kata sandi wajib diisi untuk portal staf.' };
  }
  let found = INITIAL_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!found && ['admin', 'owner'].includes(cleanEmail)) {
    found = INITIAL_USERS.find((u) => u.role === 'owner' || u.role === 'admin') || INITIAL_USERS[1];
  } else if (!found && cleanEmail === 'gudang') {
    found = INITIAL_USERS.find((u) => u.role === 'gudang');
  } else if (!found && cleanEmail === 'kasir') {
    found = INITIAL_USERS.find((u) => u.role === 'kasir');
  }

  if (!found || !['admin', 'owner', 'gudang', 'kasir'].includes(found.role)) {
    return { success: false, message: 'Akses ditolak: Akun tidak terdaftar sebagai staf internal.' };
  }

  const validStaffPass = ['admin123', 'owner123', 'gudang123', 'kasir123'];
  if (!validStaffPass.includes(pass.trim())) {
    return { success: false, message: 'Kata sandi staf tidak sesuai.' };
  }

  return { success: true, user: found };
}

export function resolveMemberUser(cleanEmail: string): UserProfile | null {
  let found = INITIAL_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!found && ['member', 'kimy', 'member@urbanstyle.com', 'kimy.eka@unpam.ac.id', 'thn071205@gmail.com'].includes(cleanEmail)) {
    found = INITIAL_USERS.find((u) => u.role === 'customer') || INITIAL_USERS[0];
  } else if (!found && (cleanEmail === 'admin' || cleanEmail.startsWith('admin@') || cleanEmail === 'owner')) {
    found = INITIAL_USERS.find((u) => u.role === 'owner' || u.role === 'admin') || INITIAL_USERS[1];
  } else if (!found && cleanEmail === 'gudang') {
    found = INITIAL_USERS.find((u) => u.role === 'gudang');
  } else if (!found && cleanEmail === 'kasir') {
    found = INITIAL_USERS.find((u) => u.role === 'kasir');
  }
  return found || findLocalRegisteredUser(cleanEmail);
}

export function findLocalRegisteredUser(cleanEmail: string): UserProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(REGISTERED_KEY);
    if (!raw) return null;
    const users: UserProfile[] = JSON.parse(raw);
    return users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  } catch {
    return null;
  }
}

export function saveLocalRegisteredUser(user: UserProfile): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(REGISTERED_KEY);
    const users: UserProfile[] = raw ? JSON.parse(raw) : [];
    const exists = users.some((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (!exists) {
      users.push(user);
      localStorage.setItem(REGISTERED_KEY, JSON.stringify(users));
    }
  } catch {}
}

export async function resolveOrCreateGoogleUser(
  googleEmail: string,
  googleName: string
): Promise<UserProfile> {
  const cleanEmail = googleEmail.toLowerCase().trim();

  if (process.env.NEXT_PUBLIC_GOOGLE_OAUTH_ENABLED === 'true' && supabase && typeof window !== 'undefined') {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
    } catch {}
  }

  if (cleanEmail === 'thn071205@gmail.com' || cleanEmail === 'member@urbanstyle.com') {
    const base = INITIAL_USERS.find((u) => u.role === 'customer') || INITIAL_USERS[0];
    return { ...base, email: cleanEmail, full_name: googleName || base.full_name };
  }

  const existing =
    INITIAL_USERS.find((u) => u.email.toLowerCase() === cleanEmail) ||
    findLocalRegisteredUser(cleanEmail);
  if (existing) return existing;

  const newProfile: UserProfile = {
    id: `usr_google_${Date.now()}`,
    email: cleanEmail,
    full_name: googleName.trim() || cleanEmail.split('@')[0].toUpperCase(),
    role: 'customer',
    preferred_size: 'L',
    created_at: new Date().toISOString(),
  };
  saveLocalRegisteredUser(newProfile);
  return newProfile;
}
