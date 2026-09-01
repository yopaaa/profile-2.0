import { NextResponse } from 'next/server';
import { jwtVerify, SignJWT } from 'jose';
import bcrypt from 'bcryptjs';
import fs from 'fs/promises';
import path from 'path';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'rahasia-super-aman');
const accountFilePath = path.join(process.cwd(), 'data', 'account.json');

async function authenticate(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload && payload.role === 'admin' ? payload : null;
  } catch (error) {
    return null;
  }
}

export async function GET(request) {
  try {
    const authUser = await authenticate(request);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const raw = await fs.readFile(accountFilePath, 'utf8');
    const account = JSON.parse(raw);
    const user = Array.isArray(account) ? account[0] : account;

    return NextResponse.json({
      account: {
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal mengambil data akun', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const authUser = await authenticate(request);
    if (!authUser) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, currentPassword, newPassword } = await request.json();

    const raw = await fs.readFile(accountFilePath, 'utf8');
    let account = JSON.parse(raw);
    let user = Array.isArray(account) ? account[0] : account;

    if (name) user.name = name;
    if (email) user.email = email;

    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { message: 'Password saat ini harus diisi untuk mengubah password.' },
          { status: 400 }
        );
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { message: 'Password saat ini salah.' },
          { status: 400 }
        );
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    const dataToSave = Array.isArray(account) ? [user] : user;
    await fs.writeFile(accountFilePath, JSON.stringify(dataToSave, null, 2), 'utf8');

    // Update JWT and cookies
    const token = await new SignJWT({
      email: user.email,
      name: user.name,
      role: user.role || 'admin',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(SECRET_KEY);

    const response = NextResponse.json({
      message: 'Akun berhasil diperbarui!',
      account: { email: user.email, name: user.name, role: user.role },
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    response.cookies.set(
      'userInfo',
      JSON.stringify({ email: user.email, nama: user.name, role: user.role }),
      { sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 }
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Gagal memperbarui akun', error: error.message },
      { status: 500 }
    );
  }
}
