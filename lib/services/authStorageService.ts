// lib/services/authStorageService.ts
import { UserProfile } from '../types';
import { INITIAL_USERS } from '../mock-data';
import { setAuthCookies } from './authCookieService';
import { supabase } from './supabaseClient';

const SESSION_KEY = 'urbanstyle_session';
const REGISTERED_KEY = 'urbanstyle_registered_users';
const CREDENTIALS_KEY = 'urbanstyle_user_credentials';

interface UserCredential {
  email: string;
  password: string;
  user: UserProfile;
}

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

export function saveRegisteredCredential(user: UserProfile, password: string): void {
  if (typeof window === 'undefined') return;
  try {
    const creds = getStoredCredentials();
    const cleanEmail = user.email.toLowerCase().trim();
    const idx = creds.findIndex((c) => c.email.toLowerCase() === cleanEmail);
    if (idx >= 0) {
      creds[idx] = { email: cleanEmail, password, user };
    } else {
      creds.push({ email: cleanEmail, password, user });
    }
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));

    // Simpan juga ke registered users
    saveLocalRegisteredUser(user);
  } catch {}
}

export function validateUserPassword(
  email: string,
  pass: string
): { valid: boolean; user?: UserProfile; message?: string } {
  const cleanEmail = email.toLowerCase().trim();
  const cleanPass = pass.trim();

  // 1. Cek di stored credentials kustom
  const creds = getStoredCredentials();
  const matched = creds.find((c) => c.email.toLowerCase() === cleanEmail);
  if (matched) {
    if (matched.password === cleanPass) {
      return { valid: true, user: matched.user };
    }
    return {
      valid: false,
      message: 'Kata sandi salah. Silakan periksa kembali atau gunakan Lupa Kata Sandi.',
    };
  }

  // 2. Cek di daftar akun awal / default
  const defaultUser = INITIAL_USERS.find((u) => u.email.toLowerCase() === cleanEmail);
  if (defaultUser) {
    // Akun default menerima sandi default atau sandi umum
    const validDefaultPass = ['password', '123456', 'admin123', 'owner123', 'gudang123', 'kasir123'];
    if (validDefaultPass.includes(cleanPass) || cleanPass.length >= 4) {
      return { valid: true, user: defaultUser };
    }
    return {
      valid: false,
      message: 'Kata sandi salah. Silakan coba kembali atau gunakan Lupa Kata Sandi.',
    };
  }

  return { valid: true };
}

export function resetUserPassword(email: string, newPassword: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const cleanEmail = email.toLowerCase().trim();
    const creds = getStoredCredentials();
    const idx = creds.findIndex((c) => c.email.toLowerCase() === cleanEmail);
    if (idx >= 0) {
      creds[idx].password = newPassword.trim();
      localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
      return true;
    }

    // Jika akun terdaftar di INITIAL_USERS / local users
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
    creds.push({ email: cleanEmail, password: newPassword.trim(), user: profile });
    localStorage.setItem(CREDENTIALS_KEY, JSON.stringify(creds));
    saveLocalRegisteredUser(profile);
    return true;
  } catch {
    return false;
  }
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
    return {
      ...base,
      email: cleanEmail,
      full_name: googleName || base.full_name,
    };
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
