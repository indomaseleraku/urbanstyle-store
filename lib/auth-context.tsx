'use client';

// lib/auth-context.tsx
// Global Authentication & Role-Based Access Control (RBAC) Provider

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole, StaffRole } from './types';
import { INITIAL_USERS } from './mock-data';
import { createSessionToken } from './services/cryptoSession';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isGudang: boolean;
  isKasir: boolean;
  isStaff: boolean;
  staffRole: StaffRole | null;
  isLoading: boolean;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  login: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  staffLogin: (email: string, pass: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, pass: string, fullName: string) => Promise<{ success: boolean; message?: string }>;
  logout: (redirectTo?: string | unknown) => void;
  loginAsDemoMember: () => void;
  loginAsDemoAdmin: () => void;
  loginAsStaff: (role: StaffRole) => void;
  updateUser: (data: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const COOKIE_USER_KEY = 'urbanstyle_auth_user';
const COOKIE_ROLE_KEY = 'urbanstyle_auth_role';
const COOKIE_TOKEN_KEY = 'urbanstyle_session_token';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Inisialisasi session dari localStorage / Cookie saat mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('urbanstyle_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setAuthCookies(parsed);
      }
    } catch (e) {
      console.error('Failed to parse auth session:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setAuthCookies = async (u: UserProfile | null) => {
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
  };

  const isStaff = Boolean(user && ['admin', 'owner', 'gudang', 'kasir'].includes(user.role));
  const isOwner = Boolean(user && (user.role === 'owner' || user.role === 'admin'));
  const isGudang = Boolean(user && user.role === 'gudang');
  const isKasir = Boolean(user && user.role === 'kasir');
  const staffRole: StaffRole | null = (user?.staff_role || (user?.role === 'admin' ? 'owner' : (isStaff ? (user?.role as StaffRole) : null)));

  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.toLowerCase().trim();
    let found = INITIAL_USERS.find(u => u.email.toLowerCase() === cleanEmail);

    // Deteksi akun administrator / owner
    if (!found && (cleanEmail === 'admin' || cleanEmail.startsWith('admin@') || cleanEmail === 'owner')) {
      found = INITIAL_USERS.find(u => u.role === 'owner' || u.role === 'admin') || INITIAL_USERS[1];
    } else if (!found && cleanEmail === 'gudang') {
      found = INITIAL_USERS.find(u => u.role === 'gudang');
    } else if (!found && cleanEmail === 'kasir') {
      found = INITIAL_USERS.find(u => u.role === 'kasir');
    }

    if (found) {
      setUser(found);
      localStorage.setItem('urbanstyle_session', JSON.stringify(found));
      setAuthCookies(found);
      setIsLoading(false);
      setIsAuthModalOpen(false);

      // Jika akun adalah staf/admin, langsung alihkan ke dashboard admin
      if (['admin', 'owner', 'gudang', 'kasir'].includes(found.role)) {
        window.location.href = '/admin';
      }

      return { success: true };
    }

    // Default auto-create member jika email belum terdaftar
    const newMember: UserProfile = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      full_name: cleanEmail.split('@')[0].toUpperCase(),
      role: 'customer',
      preferred_size: 'M',
      created_at: new Date().toISOString(),
    };
    setUser(newMember);
    localStorage.setItem('urbanstyle_session', JSON.stringify(newMember));
    setAuthCookies(newMember);
    setIsLoading(false);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  // Login khusus portal staf internal (/admin/login)
  const staffLogin = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.toLowerCase().trim();
    let found = INITIAL_USERS.find(u => u.email.toLowerCase() === cleanEmail);

    if (!found && (cleanEmail === 'admin' || cleanEmail === 'owner')) {
      found = INITIAL_USERS.find(u => u.role === 'owner' || u.role === 'admin') || INITIAL_USERS[1];
    } else if (!found && cleanEmail === 'gudang') {
      found = INITIAL_USERS.find(u => u.role === 'gudang');
    } else if (!found && cleanEmail === 'kasir') {
      found = INITIAL_USERS.find(u => u.role === 'kasir');
    }

    if (!found || !['admin', 'owner', 'gudang', 'kasir'].includes(found.role)) {
      setIsLoading(false);
      return { 
        success: false, 
        message: 'Akses ditolak: Akun tidak terdaftar sebagai staf internal (Owner, Gudang, atau Kasir).' 
      };
    }

    if (!pass || pass.trim().length === 0) {
      setIsLoading(false);
      return {
        success: false,
        message: 'Kata sandi wajib diisi untuk mengakses portal staf.',
      };
    }

    setUser(found);
    localStorage.setItem('urbanstyle_session', JSON.stringify(found));
    setAuthCookies(found);
    setIsLoading(false);
    return { success: true };
  };

  const register = async (email: string, pass: string, fullName: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const newMember: UserProfile = {
      id: `usr_${Date.now()}`,
      email: email.toLowerCase().trim(),
      full_name: fullName.trim() || 'Member UrbanStyle',
      role: 'customer',
      preferred_size: 'M',
      created_at: new Date().toISOString(),
    };
    setUser(newMember);
    localStorage.setItem('urbanstyle_session', JSON.stringify(newMember));
    setAuthCookies(newMember);
    setIsLoading(false);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const logout = (redirectTo?: string | unknown) => {
    setUser(null);
    localStorage.removeItem('urbanstyle_session');
    setAuthCookies(null);
    const dest = typeof redirectTo === 'string' ? redirectTo : '/';
    window.location.href = dest;
  };

  const loginAsDemoMember = () => {
    const member = INITIAL_USERS.find(u => u.role === 'customer') || INITIAL_USERS[0];
    setUser(member);
    localStorage.setItem('urbanstyle_session', JSON.stringify(member));
    setAuthCookies(member);
    setIsAuthModalOpen(false);
  };

  const loginAsDemoAdmin = () => {
    const admin = INITIAL_USERS.find(u => u.role === 'owner' || u.role === 'admin') || INITIAL_USERS[1];
    setUser(admin);
    localStorage.setItem('urbanstyle_session', JSON.stringify(admin));
    setAuthCookies(admin);
    setIsAuthModalOpen(false);
  };

  const loginAsStaff = (role: StaffRole) => {
    const staff = INITIAL_USERS.find(u => u.role === role || (role === 'owner' && u.role === 'admin')) || INITIAL_USERS[1];
    setUser(staff);
    localStorage.setItem('urbanstyle_session', JSON.stringify(staff));
    setAuthCookies(staff);
  };

  const updateUser = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem('urbanstyle_session', JSON.stringify(updated));
    setAuthCookies(updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isAdmin: isStaff,
        isOwner,
        isGudang,
        isKasir,
        isStaff,
        staffRole,
        isLoading,
        isAuthModalOpen,
        openAuthModal: () => setIsAuthModalOpen(true),
        closeAuthModal: () => setIsAuthModalOpen(false),
        login,
        staffLogin,
        register,
        logout,
        loginAsDemoMember,
        loginAsDemoAdmin,
        loginAsStaff,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
