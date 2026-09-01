import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'rahasia-super-aman');

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);

    // Proteksi role admin
    if (req.nextUrl.pathname.startsWith('/admin') && payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error('JWT verification error in middleware:', err.message);
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete('token');
    response.cookies.delete('userInfo');
    return response;
  }
}

export const config = {
  matcher: ['/admin/:path*']
};
