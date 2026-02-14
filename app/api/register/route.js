import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import {supabase} from '@/utils/db'

export async function POST(request) {
  try {
    const userData = await request.json();
    const {
      nama,
      email,
      nomor,
      instansi,
      password,
      confirmPassword,
      role,
    } = userData;

    // 1. Validasi data
    if (!nama || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { message: "Semua kolom harus diisi." },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { message: "Password dan konfirmasi password tidak cocok." },
        { status: 400 }
      );
    }

    // 2. Cek apakah email sudah terdaftar di Supabase
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (findError) throw findError;

    if (existingUser) {
      return NextResponse.json(
        { message: "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    // 3. Enkripsi password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Insert ke tabel users
    const { data, error: insertError } = await supabase
      .from("users")
      .insert([
        {
          nama,
          email,
          nomor,
          instansi,
          password: hashedPassword,
          role: role || "admin",
          profile: null
        },
      ])
      .select("id, email, role")
      .single();

    if (insertError) throw insertError;

    // 5. Respons sukses
    return NextResponse.json(
      {
        message: "Registrasi berhasil!",
        user: data,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Terjadi kesalahan:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server.", error: error.message },
      { status: 500 }
    );
  }
}
