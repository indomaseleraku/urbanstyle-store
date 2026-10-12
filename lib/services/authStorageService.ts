// lib/services/authStorageService.ts
import { UserProfile } from '../types';
import { INITIAL_USERS } from '../mock-data';
import { setAuthCookies } from './authCookieService';
import { supabase } from './supabaseClient';

const SESSION_KEY = 'urbanstyle_session';
const REGISTERED_KEY = 'urbanstyle_registered_users';

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
