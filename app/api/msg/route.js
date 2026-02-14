import { NextResponse } from "next/server";
import {supabase} from '@/utils/db'

export async function POST(request) {
  try {
    const userData = await request.json();
    const {
      name,
      msg
    } = userData;

    // 3. Enkripsi password

    // 4. Insert ke tabel users
    const { data, error: insertError } = await supabase
      .from("messages")
      .insert([
        {
          user_name: name,
          content: msg
        },
      ])
      .select("id, user_name, content, created_at")
      .single();

    if (insertError) throw insertError;

    // 5. Respons sukses
    return NextResponse.json(
      {
        message: "berhasil!",
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
