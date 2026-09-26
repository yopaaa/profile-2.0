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
  } catch {
    return false;
  }
}

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml',
];

const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];

export async function POST(request) {
  try {
    const isAuth = await authenticate(request);
    if (!isAuth) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const folderType = formData.get('folder') || formData.get('type') || 'general';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ message: 'File gambar tidak ditemukan' }, { status: 400 });
    }

    // Validate size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ message: 'Ukuran file terlalu besar. Maksimal 10MB' }, { status: 400 });
    }

    // Validate extension & mime
    const originalName = file.name || 'image.png';
    const ext = path.extname(originalName).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: 'Format file tidak didukung. Gunakan PNG, JPG, JPEG, WEBP, atau SVG.' },
        { status: 400 }
      );
    }

    // Determine target subfolder inside public/images
    let subfolder = '';
    if (folderType === 'projects' || folderType === 'project') {
      subfolder = 'projects';
    } else if (folderType === 'personal' || folderType === 'avatar') {
      subfolder = ''; // saved in public/images
    } else {
      subfolder = '';
    }

    const uploadDir = path.join(process.cwd(), 'public', 'images', subfolder);

    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Generate safe clean filename with timestamp
    const cleanBase = path
      .basename(originalName, ext)
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .slice(0, 30);
    const filename = `${folderType === 'personal' ? 'avatar' : 'img'}_${Date.now()}_${cleanBase}${ext}`;
    const filePath = path.join(uploadDir, filename);

    // Write file to disk
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    await fs.writeFile(filePath, buffer);

    // Construct public URL
    const relativeUrl = subfolder
      ? `/images/${subfolder}/${filename}`
      : `/images/${filename}`;

    return NextResponse.json(
      {
        success: true,
        message: 'Gambar berhasil diunggah!',
        url: relativeUrl,
        filename,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json(
      { message: 'Gagal mengunggah gambar', error: error.message },
      { status: 500 }
    );
  }
}
