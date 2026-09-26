import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Allow static assets, favicon, uploads, login page, and login API
  if (
    path.startsWith('/login') ||
    path.startsWith('/api/auth/login') ||
    path.startsWith('/_next') ||
    path.startsWith('/favicon.ico') ||
    path.startsWith('/uploads')
  ) {
    return NextResponse.next();
  }

  const authSession = request.cookies.get('auth_session')?.value;
  const isAuthenticated = authSession === 'authenticated_admin_session';

  // Protect API routes
  if (path.startsWith('/api/')) {
    if (path.startsWith('/api/auth/me')) {
      return NextResponse.next();
    }
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in first.' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // Protect all web application pages
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    if (path !== '/') {
      loginUrl.searchParams.set('redirect', path);
    }
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
