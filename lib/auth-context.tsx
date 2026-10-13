'use client';

// lib/auth-context.tsx
// Global Authentication & Role-Based Access Control (RBAC) Provider

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, StaffRole } from './types';
import { INITIAL_USERS } from './mock-data';
import {
  loadUserSession,
  persistUserSession,
  findLocalRegisteredUser,
  resolveOrCreateGoogleUser,
  validateUserPassword,
  saveRegisteredCredential,
  resetUserPassword,
} from './services/authStorageService';

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
  loginWithGoogle: (googleEmail?: string, googleName?: string) => Promise<{ success: boolean; message?: string }>;
  resetPassword: (email: string, newPass: string) => Promise<{ success: boolean; message?: string }>;
  logout: (redirectTo?: string | unknown) => Promise<void>;
  loginAsDemoMember: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
  loginAsStaff: (role: StaffRole) => Promise<void>;
  updateUser: (data: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    const stored = loadUserSession();
    if (stored) {
      setUser(stored);
      persistUserSession(stored).catch(() => {});
    }
    setIsLoading(false);
  }, []);

  const isStaff = Boolean(user && ['admin', 'owner', 'gudang', 'kasir'].includes(user.role));
  const isOwner = Boolean(user && (user.role === 'owner' || user.role === 'admin'));
  const isGudang = Boolean(user && user.role === 'gudang');
  const isKasir = Boolean(user && user.role === 'kasir');
  const staffRole: StaffRole | null =
    user?.staff_role || (user?.role === 'admin' ? 'owner' : isStaff ? (user?.role as StaffRole) : null);

  const login = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail) {
      setIsLoading(false);
      return { success: false, message: 'Alamat email wajib diisi.' };
    }
    if (!pass || pass.trim().length === 0) {
      setIsLoading(false);
      return { success: false, message: 'Kata sandi wajib diisi.' };
    }

    // Validasi kata sandi terdaftar terlebih dahulu
    const passCheck = validateUserPassword(cleanEmail, pass);
    if (!passCheck.valid) {
      setIsLoading(false);
      return { success: false, message: passCheck.message || 'Kata sandi salah.' };
    }

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

    if (!found) {
      const localReg = findLocalRegisteredUser(cleanEmail);
      if (localReg) found = localReg;
    }

    if (found) {
      setUser(found);
      await persistUserSession(found);
      setIsLoading(false);
      setIsAuthModalOpen(false);
      if (['admin', 'owner', 'gudang', 'kasir'].includes(found.role)) window.location.href = '/admin';
      return { success: true };
    }

    setIsLoading(false);
    return {
      success: false,
      message: 'Email belum terdaftar. Silakan pilih tab Daftar Akun.',
    };
  };

  const staffLogin = async (email: string, pass: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.toLowerCase().trim();
    let found = INITIAL_USERS.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!found && ['admin', 'owner'].includes(cleanEmail)) {
      found = INITIAL_USERS.find((u) => u.role === 'owner' || u.role === 'admin') || INITIAL_USERS[1];
    } else if (!found && cleanEmail === 'gudang') {
      found = INITIAL_USERS.find((u) => u.role === 'gudang');
    } else if (!found && cleanEmail === 'kasir') {
      found = INITIAL_USERS.find((u) => u.role === 'kasir');
    }

    if (!found || !['admin', 'owner', 'gudang', 'kasir'].includes(found.role)) {
      setIsLoading(false);
      return { success: false, message: 'Akses ditolak: Akun tidak terdaftar sebagai staf internal.' };
    }
    if (!pass || pass.trim().length === 0) {
      setIsLoading(false);
      return { success: false, message: 'Kata sandi wajib diisi untuk mengakses portal staf.' };
    }

    setUser(found);
    await persistUserSession(found);
    setIsLoading(false);
    return { success: true };
  };

  const register = async (email: string, pass: string, fullName: string): Promise<{ success: boolean; message?: string }> => {
    setIsLoading(true);
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setIsLoading(false);
      return { success: false, message: 'Format alamat email tidak valid.' };
    }
    if (!pass || pass.trim().length < 4) {
      setIsLoading(false);
      return { success: false, message: 'Kata sandi minimal 4 karakter.' };
    }

    const newMember: UserProfile = {
      id: `usr_${Date.now()}`,
      email: cleanEmail,
      full_name: fullName.trim() || cleanEmail.split('@')[0].toUpperCase(),
      role: 'customer',
      preferred_size: 'M',
      created_at: new Date().toISOString(),
    };

    saveRegisteredCredential(newMember, pass.trim());
    setUser(newMember);
    await persistUserSession(newMember);
    setIsLoading(false);
    return { success: true };
  };

  const loginWithGoogle = async (googleEmail = 'thn071205@gmail.com', googleName = 'Kimy Eka Ardiansyah') => {
    setIsLoading(true);
    const profile = await resolveOrCreateGoogleUser(googleEmail, googleName);
    setUser(profile);
    await persistUserSession(profile);
    setIsLoading(false);
    setIsAuthModalOpen(false);
    return { success: true };
  };

  const resetPassword = async (email: string, newPass: string): Promise<{ success: boolean; message?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    if (!newPass || newPass.trim().length < 4) {
      return { success: false, message: 'Kata sandi baru minimal 4 karakter.' };
    }
    const ok = resetUserPassword(cleanEmail, newPass.trim());
    if (ok) {
      return { success: true, message: 'Kata sandi berhasil diperbarui.' };
    }
    return { success: false, message: 'Gagal memperbarui kata sandi.' };
  };

  const logout = async (redirectTo?: string | unknown) => {
    setUser(null);
    await persistUserSession(null);
    window.location.href = typeof redirectTo === 'string' ? redirectTo : '/';
  };

  const loginAsDemoMember = async () => {
    const member = INITIAL_USERS.find((u) => u.role === 'customer') || INITIAL_USERS[0];
    setUser(member);
    await persistUserSession(member);
    setIsAuthModalOpen(false);
  };

  const loginAsDemoAdmin = async () => {
    const admin = INITIAL_USERS.find((u) => u.role === 'owner' || u.role === 'admin') || INITIAL_USERS[1];
    setUser(admin);
    await persistUserSession(admin);
    setIsAuthModalOpen(false);
  };

  const loginAsStaff = async (role: StaffRole) => {
    const staff = INITIAL_USERS.find((u) => u.role === role || (role === 'owner' && u.role === 'admin')) || INITIAL_USERS[1];
    setUser(staff);
    await persistUserSession(staff);
  };

  const updateUser = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    await persistUserSession(updated);
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
        loginWithGoogle,
        resetPassword,
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
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
