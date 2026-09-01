import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logout berhasil' });
  
  response.cookies.set('token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });

  response.cookies.set('userInfo', '', {
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}
