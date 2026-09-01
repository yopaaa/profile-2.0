"use client";

import { useState, useEffect } from "react";
import {
  ShieldCheck,
  KeyRound,
  Save,
  CheckCircle2,
  AlertTriangle,
  User,
  Mail,
} from "lucide-react";
import styles from "./settings.module.css";

export default function SettingsPage() {
  const [account, setAccount] = useState({ name: "", email: "" });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetchAccount();
  }, []);

  const fetchAccount = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/account");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Gagal memuat info akun");
      }
      const data = await res.json();
      if (data.account) {
        setAccount({
          name: data.account.name || "",
          email: data.account.email || "",
        });
      }
    } catch (err) {
      showStatus("error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (type, text) => {
    setStatus({ type, text });
    setTimeout(() => setStatus(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      showStatus("error", "Konfirmasi password baru tidak cocok.");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: account.name,
        email: account.email,
      };

      if (newPassword) {
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      const res = await fetch("/api/admin/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal memperbarui akun");
      }

      showStatus("success", "✓ Pengaturan akun berhasil diperbarui di /data/account.json!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      showStatus("error", err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Memuat pengaturan akun...</p>
      </div>
    );
  }

  return (
    <div className={styles.settingsWrap}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Account Settings</h1>
          <p className={styles.subtitle}>
            Kelola data login admin yang tersimpan di <code>data/account.json</code>
          </p>
        </div>
      </header>

      {status && (
        <div
          className={`${styles.alert} ${
            status.type === "success" ? styles.alertSuccess : styles.alertError
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertTriangle size={16} />
          )}
          <span>{status.text}</span>
        </div>
      )}

      <div className={styles.card}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleHeader}>
              <User size={18} color="var(--accent, #e8ff5a)" />
              <h3>Profil Administrator</h3>
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label>Nama Admin</label>
            <input
              type="text"
              required
              value={account.name}
              onChange={(e) => setAccount({ ...account, name: e.target.value })}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label>Email Login</label>
            <input
              type="email"
              required
              value={account.email}
              onChange={(e) => setAccount({ ...account, email: e.target.value })}
            />
          </div>

          <div className={styles.divider} />

          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleHeader}>
              <KeyRound size={18} color="var(--accent, #e8ff5a)" />
              <h3>Ganti Password (Opsional)</h3>
            </div>
            <p>Kosongkan jika tidak ingin mengubah password akun saat ini.</p>
          </div>

          <div className={styles.fieldGroup}>
            <label>Password Saat Ini</label>
            <input
              type="password"
              placeholder="Masukkan password lama"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

          <div className={styles.grid2}>
            <div className={styles.fieldGroup}>
              <label>Password Baru</label>
              <input
                type="password"
                placeholder="Minimal 6 karakter"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Ulangi Password Baru</label>
              <input
                type="password"
                placeholder="Konfirmasi password baru"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button type="submit" disabled={saving} className={styles.submitBtn}>
              <Save size={15} />
              <span>{saving ? "Menyimpan..." : "Simpan Perubahan Akun"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
