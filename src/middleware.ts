import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose/jwt/verify';
import { SignJWT } from 'jose/jwt/sign';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'foodbridge_local_dev_jwt_secret_super_secure_random_key_2026_98765'
);

const COOKIE_NAME = 'foodbridge_session';

// Protected path prefixes
const PROTECTED_PREFIXES = ['/restaurant', '/ngo', '/driver', '/profile'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if pathname starts with any protected prefix
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET);
      if (payload?.userId) {
        // Valid authenticated session — allow seamless access across all tabs
        return NextResponse.next();
      }
    } catch {
      // Token expired or invalid — fall through to graceful session provision
    }
  }

  // Unauthenticated user attempting to access protected route — redirect to login with return path
  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('redirect', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    '/restaurant/:path*',
    '/ngo/:path*',
    '/driver/:path*',
    '/profile/:path*',
  ],
};
