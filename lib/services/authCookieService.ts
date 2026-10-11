// lib/services/authCookieService.ts
import { UserProfile } from '../types';
import { createSessionToken } from './cryptoSession';

export const COOKIE_USER_KEY = 'urbanstyle_auth_user';
export const COOKIE_ROLE_KEY = 'urbanstyle_auth_role';
export const COOKIE_TOKEN_KEY = 'urbanstyle_session_token';

export async function setAuthCookies(u: UserProfile | null): Promise<void> {
  if (typeof document === 'undefined') return;
  if (u) {
    document.cookie = `${COOKIE_USER_KEY}=${u.id}; path=/; max-age=604800; SameSite=Lax`;
    document.cookie = `${COOKIE_ROLE_KEY}=${u.role}; path=/; max-age=604800; SameSite=Lax`;
    try {
      const token = await createSessionToken(u.id, u.role);
      document.cookie = `${COOKIE_TOKEN_KEY}=${token}; path=/; max-age=604800; SameSite=Lax`;
    } catch (err) {
      console.error('Gagal membuat signed token:', err);
    }
  } else {
    document.cookie = `${COOKIE_USER_KEY}=; path=/; max-age=0; SameSite=Lax`;
    document.cookie = `${COOKIE_ROLE_KEY}=; path=/; max-age=0; SameSite=Lax`;
    document.cookie = `${COOKIE_TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
  }
}
