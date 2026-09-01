import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import fs from 'fs';
import path from 'path';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'rahasia-super-aman');

function getAccountData() {
  try {
    const accountFilePath = path.join(process.cwd(), 'data', 'account.json');
    if (!fs.existsSync(accountFilePath)) {
      return null;
    }
    const raw = fs.readFileSync(accountFilePath, 'utf8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading account.json:', err);
    return null;
  }
}

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email dan password wajib diisi.' },
        { status: 400 }
      );
    }

    const account = getAccountData();
    if (!account) {
      return NextResponse.json(
        { message: 'File account.json tidak ditemukan di server.' },
        { status: 500 }
      );
    }

    // Support both single account object and array of accounts
    const accounts = Array.isArray(account) ? account : [account];
    const user = accounts.find(
      (acc) => acc.email && acc.email.toLowerCase() === email.trim().toLowerCase()
    );

    if (!user) {
      return NextResponse.json(
        { message: 'Email atau akun tidak ditemukan.' },
        { status: 401 }
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
      email: user.email,
      name: user.name || 'Admin',
      role: user.role || 'admin',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET_KEY);

    // 🍪 4. Set cookie HttpOnly dan user info
    const response = NextResponse.json(
      {
        message: 'Login berhasil!',
        payload: {
          email: user.email,
          name: user.name || 'Admin',
          role: user.role || 'admin',
        },
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
    });

    response.cookies.set(
      'userInfo',
      JSON.stringify({
        email: user.email,
        nama: user.name || 'Admin',
        role: user.role || 'admin',
      }),
      {
        sameSite: 'lax',
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
