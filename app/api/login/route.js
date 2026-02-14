import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { supabase } from '@/utils/db'

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'rahasia-super-aman');

export async function POST(request) {
  try {
    const { email, password } = await request.json();    
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password wajib diisi.' },
        { status: 400 }
      );
    }

    // 🔍 1. Cek user berdasarkan email
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .limit(1);

    if (error) throw error;

    const user = users?.[0];
    if (!user) {
      return NextResponse.json(
        { message: 'Email tidak ditemukan.' },
        { status: 404 }
      );
    }

    // 🔑 2. Bandingkan password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: 'Password salah.' },
        { status: 401 }
      );
    }

    // 🎫 3. Buat token JWT
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
      role: user.role || 'user',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(SECRET_KEY);

    // 🍪 4. Set cookie HttpOnly dan user info
    const response = NextResponse.json(
      { message: 'Login berhasil!', payload: { id: user.id, email: user.email, role: user.role } },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    response.cookies.set(
      'userInfo',
      JSON.stringify({
        id: user.id,
        nama: user.nama,
        email: user.email,
        nomor: user.nomor,
        instansi: user.instansi,
        role: user.role,
      }),
      {
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
      }
    );

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan server.', error: error.message },
      { status: 500 }
    );
  }
}
