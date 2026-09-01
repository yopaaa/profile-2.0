import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import fs from 'fs/promises';
import path from 'path';

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET || 'rahasia-super-aman');

async function authenticate(request) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) return false;
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload && payload.role === 'admin';
  } catch (error) {
    return false;
  }
}

const dataFilePath = path.join(process.cwd(), 'data', 'data.json');

export async function GET(request) {
  try {
    const isAuth = await authenticate(request);
    if (!isAuth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const rawData = await fs.readFile(dataFilePath, 'utf8');
    const data = JSON.parse(rawData);

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Error reading data.json:', error);
    return NextResponse.json(
      { message: 'Gagal membaca file data.json', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const isAuth = await authenticate(request);
    if (!isAuth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json(
        { message: 'Format data tidak valid.' },
        { status: 400 }
      );
    }

    // Format and write JSON to data/data.json
    const jsonString = JSON.stringify(body, null, 2);
    await fs.writeFile(dataFilePath, jsonString, 'utf8');

    return NextResponse.json(
      { message: 'Data berhasil disimpan!', data: body },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error writing data.json:', error);
    return NextResponse.json(
      { message: 'Gagal menyimpan file data.json', error: error.message },
      { status: 500 }
    );
  }
}
