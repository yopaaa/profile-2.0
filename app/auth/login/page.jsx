"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
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
      setSuccessMessage("Login berhasil! Mengarahkan ke dashboard...");
      setIsLoading(false);

      console.log(data);
      // router.push(`/${data.payload.role}`); // contoh: /admin atau /user
      router.push(`/admin`);
    } catch {
      setErrors({ api: "Login gagal! Silakan coba lagi." });
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h2 className={styles.title}>Masuk ke Akun</h2>

        {successMessage && <p className={styles.success}>{successMessage}</p>}
        {errors.api && <p className={styles.error}>{errors.api}</p>}

        <form onSubmit={handleLogin} className={styles.form}>
          <input
            className={styles.input}
            placeholder="Email"
            value={loginData.email}
            onChange={(e) =>
              setLoginData({ ...loginData, email: e.target.value })
            }
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}

          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={loginData.password}
            onChange={(e) =>
              setLoginData({ ...loginData, password: e.target.value })
            }
          />
          {errors.password && <p className={styles.error}>{errors.password}</p>}

          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <p className={styles.linkText}>
          Belum punya akun?{" "}
          <a href="/auth/register" className={styles.link}>
            Daftar di sini
          </a>
        </p>
      </div>
    </div>
  );
}
