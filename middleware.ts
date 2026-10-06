// middleware.ts
// Edge Middleware Guard: Proteksi RBAC & Autentikasi Pengguna UrbanStyle Store

import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const authUser = request.cookies.get('urbanstyle_auth_user')?.value;
  const authRole = request.cookies.get('urbanstyle_auth_role')?.value;

  // 1. Proteksi Halaman Eksekutif Admin (/admin) & Portal Staf Terisolasi (/admin/login)
  const isStaffRole = ['admin', 'owner', 'gudang', 'kasir'].includes(authRole || '');

  if (pathname === '/admin/login') {
    // Jika staf sudah memiliki sesi login aktif, langsung alihkan ke dashboard admin
    if (authUser && isStaffRole) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
    // Izinkan akses ke halaman login staf terisolasi
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    // Jika belum login atau bukan staf internal, alihkan ke portal /admin/login
    if (!authUser || !isStaffRole) {
      const url = new URL('/admin/login', request.url);
      if (pathname !== '/admin') {
        url.searchParams.set('redirect', pathname);
      }
      return NextResponse.redirect(url);
    }
  }

  // 2. Proteksi Halaman Portal Akun Member (/account)
  if (pathname.startsWith('/account')) {
    if (!authUser) {
      const url = new URL('/', request.url);
      url.searchParams.set('login', 'required');
      url.searchParams.set('redirect', '/account');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/account/:path*'],
};
