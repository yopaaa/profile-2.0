"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

export default function LoginPage() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    const newErrors = {};
    if (!loginData.email) {
      newErrors.email = "Email harus diisi";
    } else if (!validateEmail(loginData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!loginData.password) {
      newErrors.password = "Password harus diisi";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post("/api/login", loginData);
      setSuccessMessage("Login berhasil! Mengarahkan ke admin CMS...");
      setIsLoading(false);
      router.push("/admin");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "Login gagal! Periksa kembali email dan password.";
      setErrors({ api: msg });
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.brandHeader}>
          <Link href="/" className={styles.brand}>
            <span className={styles.brandDot} />
            <span className={styles.brandText}>yopa<span className={styles.brandBadge}>CMS</span></span>
          </Link>
          <h2 className={styles.title}>Admin Login</h2>
          <p className={styles.subtitle}>Masuk untuk mengelola konten <code>data/data.json</code></p>
        </div>

        {successMessage && <div className={styles.success}>{successMessage}</div>}
        {errors.api && <div className={styles.error}>{errors.api}</div>}

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email Address</label>
            <input
              className={styles.input}
              type="email"
              placeholder="admin@yopaaa.dev"
              autoComplete="email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />
            {errors.email && <span className={styles.fieldError}>{errors.email}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="••••••••"
              autoComplete="current-password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />
            {errors.password && <span className={styles.fieldError}>{errors.password}</span>}
          </div>

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Memverifikasi..." : "Masuk ke Panel Admin →"}
          </button>
        </form>

        <div className={styles.footerLink}>
          <Link href="/" className={styles.backHome}>
            ← Kembali ke Website Utama
          </Link>
        </div>
      </div>
    </div>
  );
}
