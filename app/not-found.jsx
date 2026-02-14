"use client"

import styles from '@/styles/error.module.css';
import { useRouter } from 'next/navigation';

export default function Custom404() {
   const router = useRouter();

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <h1 className={styles.title}>
          404
        </h1>
        <p className={styles.heading}>
          Halaman tidak ditemukan.
        </p>
        <p className={styles.description}>
          Sepertinya halaman yang Anda cari tidak ada atau telah dihapus.
        </p>

         <button className={styles.button} onClick={() => router.back()}>
          Kembali ke Sebelumnya
        </button>
      </div>

      <div className={styles.footer}>
        <p>
          .
        </p>
      </div>
    </div>
  );
}