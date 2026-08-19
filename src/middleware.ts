import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminToken = request.cookies.get('pbh_admin_token')?.value || request.cookies.get('pbh_token')?.value;

    if (!adminToken) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /api/admin endpoints (except /api/admin/login)
  if (pathname.startsWith('/api/admin') && pathname !== '/api/admin/login') {
    const adminToken =
      request.cookies.get('pbh_admin_token')?.value ||
      request.cookies.get('pbh_token')?.value ||
      request.headers.get('authorization')?.replace('Bearer ', '');

    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: 'Access Denied: Unauthenticated admin request.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
