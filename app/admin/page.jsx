"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  User,
  Zap,
  Briefcase,
  Layers,
  Sparkles,
  Share2,
  Repeat,
  Search,
  FileCode,
  Save,
  Plus,
  Trash2,
  Code,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Pin,
  Upload,
} from "lucide-react";
import styles from "./page.module.css";

const TABS = [
  { id: "personal", label: "Personal Info", icon: User },
  { id: "hero", label: "Hero Section", icon: Zap },
  { id: "experiences", label: "Experiences", icon: Briefcase },
  { id: "projects", label: "Projects", icon: Layers },
  { id: "about", label: "About & Skills", icon: Sparkles },
  { id: "socials", label: "Social Links", icon: Share2 },
  { id: "marquee", label: "Marquee Strip", icon: Repeat },
  { id: "seo", label: "SEO & Metadata", icon: Search },
  { id: "raw", label: "Raw JSON", icon: FileCode },
];

function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabFromUrl = searchParams ? searchParams.get("tab") : null;

  const [data, setData] = useState(null);
  const [initialData, setInitialData] = useState(null);
  const [activeTab, setActiveTab] = useState(tabFromUrl || "personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [rawJsonText, setRawJsonText] = useState("");
  const [jsonError, setJsonError] = useState("");
  const [uploadingTarget, setUploadingTarget] = useState(null);

  // Sync tab with URL parameter
  useEffect(() => {
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
      if (tabFromUrl === "raw" && data) {
        setRawJsonText(JSON.stringify(data, null, 2));
      }
    }
  }, [tabFromUrl, data]);

  // Load data on mount
  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Gagal mengambil data");
      }
      const json = await res.json();
      setData(json.data);
      setInitialData(JSON.stringify(json.data));
      setRawJsonText(JSON.stringify(json.data, null, 2));
    } catch (err) {
      showStatus("error", err.message || "Gagal memuat data dari data.json");
    } finally {
      setLoading(false);
    }
  };

  const showStatus = (type, text) => {
    setStatusMessage({ type, text });
    setTimeout(() => {
      setStatusMessage(null);
    }, 4000);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.replace(`/admin?tab=${tabId}`, { scroll: false });
    if (tabId === "raw" && data) {
      setRawJsonText(JSON.stringify(data, null, 2));
    }
  };

  const handleSave = async (dataToSave = data) => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataToSave),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Gagal menyimpan");
      }
      setData(dataToSave);
      setInitialData(JSON.stringify(dataToSave));
      setRawJsonText(JSON.stringify(dataToSave, null, 2));
      showStatus("success", "✓ Data berhasil disimpan ke /data/data.json!");
    } catch (err) {
      showStatus("error", err.message || "Terjadi kesalahan saat menyimpan");
    } finally {
      setSaving(false);
    }
  };

  const hasUnsavedChanges = initialData && JSON.stringify(data) !== initialData;

  // --- Image Upload Handler ---
  const handleImageUpload = async (e, targetType, projectIndex = null) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const targetId = projectIndex !== null ? `project-${projectIndex}` : targetType;
    setUploadingTarget(targetId);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", projectIndex !== null ? "projects" : "personal");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Gagal mengunggah gambar");
      }

      if (projectIndex !== null) {
        updateProject(projectIndex, "image", result.url);
      } else {
        updatePersonal(targetType, result.url);
      }

      showStatus("success", `✓ Gambar berhasil disimpan ke ${result.url}`);
    } catch (err) {
      showStatus("error", err.message || "Terjadi kesalahan saat upload gambar");
    } finally {
      setUploadingTarget(null);
      e.target.value = "";
    }
  };

  // --- Handlers for Personal ---
  const updatePersonal = (field, value) => {
    setData((prev) => ({
      ...prev,
      personal: { ...prev.personal, [field]: value },
    }));
  };

  // --- Handlers for Hero ---
  const updateHero = (field, value) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  // --- Handlers for Experiences ---
  const updateExperience = (index, field, value) => {
    setData((prev) => {
      const newExp = [...prev.experiences];
      newExp[index] = { ...newExp[index], [field]: value };
      return { ...prev, experiences: newExp };
    });
  };

  const addExperience = () => {
    const newExpItem = {
      company: "Nama Perusahaan / Client",
      role: "Posisi Pekerjaan",
      period: "2024 — Present",
      current: true,
      desc: "Deskripsi tanggung jawab dan pencapaian pekerjaan...",
      tags: ["Next.js", "React", "Node.js"],
    };
    setData((prev) => ({
      ...prev,
      experiences: [newExpItem, ...prev.experiences],
    }));
  };

  const removeExperience = (index) => {
    if (!confirm("Hapus pengalaman kerja ini?")) return;
    setData((prev) => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== index),
    }));
  };

  // --- Handlers for Projects ---
  const updateProject = (index, field, value) => {
    setData((prev) => {
      const newProjects = [...prev.projects];
      newProjects[index] = { ...newProjects[index], [field]: value };
      return { ...prev, projects: newProjects };
    });
  };

  const addProject = () => {
    const newProjectItem = {
      id: String(data.projects.length + 1).padStart(2, "0"),
      tag: "Web App",
      name: "Nama Proyek Baru",
      desc: "Deskripsi singkat mengenai fungsionalitas dan fitur proyek.",
      url: "project.yopa.dev",
      href: "https://project.yopa.dev",
      image: "/images/projects/katalis.png",
      pinned: false,
    };
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProjectItem],
    }));
  };

  const removeProject = (index) => {
    if (!confirm("Hapus proyek ini?")) return;
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  // --- Handlers for About Stats & Skills ---
  const updateStat = (index, field, value) => {
    setData((prev) => {
      const newStats = [...prev.about.stats];
      newStats[index] = { ...newStats[index], [field]: value };
      return { ...prev, about: { ...prev.about, stats: newStats } };
    });
  };

  const addStat = () => {
    setData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        stats: [
          ...prev.about.stats,
          { num: "10+", label: "Kategori Baru", count: 10, plus: true },
        ],
      },
    }));
  };

  const removeStat = (index) => {
    setData((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        stats: prev.about.stats.filter((_, i) => i !== index),
      },
    }));
  };

  // --- Handlers for Socials ---
  const updateSocial = (index, field, value) => {
    setData((prev) => {
      const newSocials = [...prev.socials];
      newSocials[index] = { ...newSocials[index], [field]: value };
      return { ...prev, socials: newSocials };
    });
  };

  const addSocial = () => {
    setData((prev) => ({
      ...prev,
      socials: [
        ...prev.socials,
        { name: "Platform", handle: "@username", url: "https://...", abbr: "PL" },
      ],
    }));
  };

  const removeSocial = (index) => {
    setData((prev) => ({
      ...prev,
      socials: prev.socials.filter((_, i) => i !== index),
    }));
  };

  // --- Handlers for SEO ---
  const updateSeo = (field, value) => {
    setData((prev) => ({
      ...prev,
      seo: { ...prev.seo, [field]: value },
    }));
  };

  // --- Raw JSON handler ---
  const handleRawJsonChange = (e) => {
    const val = e.target.value;
    setRawJsonText(val);
    try {
      const parsed = JSON.parse(val);
      setData(parsed);
      setJsonError("");
    } catch (err) {
      setJsonError(err.message);
    }
  };

  const handleFormatJson = () => {
    try {
      const parsed = JSON.parse(rawJsonText);
      setRawJsonText(JSON.stringify(parsed, null, 2));
      setJsonError("");
    } catch (err) {
      setJsonError(err.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Memuat data dari <code>data/data.json</code>...</p>
      </div>
    );
  }

  return (
    <div className={styles.adminWrap}>
      {/* Top sticky header */}
      <header className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <h1 className={styles.pageHeading}>Content Manager</h1>
          <span className={styles.fileBadge}>📁 /data/data.json</span>
        </div>

        <div className={styles.topBarRight}>
          {hasUnsavedChanges && (
            <span className={styles.unsavedBadge}>• Perubahan belum disimpan</span>
          )}
          <button
            onClick={() => handleSave()}
            disabled={saving || Boolean(jsonError)}
            className={styles.saveBtn}
          >
            <Save size={15} />
            <span>{saving ? "Menyimpan..." : "Simpan ke data.json"}</span>
          </button>
        </div>
      </header>

      {/* Toast Alert */}
      {statusMessage && (
        <div
          className={`${styles.alert} ${
            statusMessage.type === "success" ? styles.alertSuccess : styles.alertError
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 size={16} />
          ) : (
            <AlertTriangle size={16} />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}



      {/* Main Tab Content */}
      <div className={styles.tabContentCard}>
        {/* ─── TAB 1: PERSONAL ─── */}
        {activeTab === "personal" && data?.personal && (
          <div className={styles.sectionForm}>
            <div className={styles.sectionHeader}>
              <h2>Informasi Pribadi</h2>
              <p>Pengaturan nama, email, bio, dan status ketersediaan.</p>
            </div>

            <div className={styles.formGrid2}>
              <div className={styles.fieldGroup}>
                <label>Nama Lengkap</label>
                <input
                  type="text"
                  value={data.personal.name || ""}
                  onChange={(e) => updatePersonal("name", e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Nama Panggilan (Short Name)</label>
                <input
                  type="text"
                  value={data.personal.shortName || ""}
                  onChange={(e) => updatePersonal("shortName", e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Role / Pekerjaan Utama</label>
                <input
                  type="text"
                  value={data.personal.role || ""}
                  onChange={(e) => updatePersonal("role", e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Lokasi</label>
                <input
                  type="text"
                  value={data.personal.location || ""}
                  onChange={(e) => updatePersonal("location", e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Email Kontak</label>
                <input
                  type="email"
                  value={data.personal.email || ""}
                  onChange={(e) => updatePersonal("email", e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Status Ketersediaan</label>
                <input
                  type="text"
                  value={data.personal.availability || ""}
                  onChange={(e) => updatePersonal("availability", e.target.value)}
                />
              </div>

              <div className={styles.uploadFieldWrap}>
                <label>Foto Avatar Utama (PNG Transparan)</label>
                <div className={styles.uploadRow}>
                  <div className={styles.uploadPreviewBox}>
                    {data.personal.avatar ? (
                      <img
                        src={data.personal.avatar}
                        alt="Avatar Preview"
                        className={styles.uploadPreviewImg}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className={styles.uploadPreviewEmpty}>No Image</span>
                    )}
                  </div>
                  <div className={styles.uploadInputWrap}>
                    <input
                      type="text"
                      placeholder="/images/yopa.png"
                      value={data.personal.avatar || ""}
                      onChange={(e) => updatePersonal("avatar", e.target.value)}
                    />
                    <label
                      className={`${styles.uploadBtn} ${
                        uploadingTarget === "avatar" ? styles.uploadBtnDisabled : ""
                      }`}
                    >
                      <Upload size={13} />
                      <span>{uploadingTarget === "avatar" ? "Mengunggah..." : "Upload Foto Avatar"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className={styles.hiddenFileInput}
                        disabled={uploadingTarget === "avatar"}
                        onChange={(e) => handleImageUpload(e, "avatar")}
                      />
                    </label>
                  </div>
                </div>
                <span className={styles.fieldHint}>File disimpan otomatis ke /public/images/</span>
              </div>

              <div className={styles.uploadFieldWrap}>
                <label>Foto Fallback (JPEG)</label>
                <div className={styles.uploadRow}>
                  <div className={styles.uploadPreviewBox}>
                    {data.personal.fallbackAvatar ? (
                      <img
                        src={data.personal.fallbackAvatar}
                        alt="Fallback Preview"
                        className={styles.uploadPreviewImg}
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className={styles.uploadPreviewEmpty}>No Image</span>
                    )}
                  </div>
                  <div className={styles.uploadInputWrap}>
                    <input
                      type="text"
                      placeholder="/images/yopa.jpeg"
                      value={data.personal.fallbackAvatar || ""}
                      onChange={(e) => updatePersonal("fallbackAvatar", e.target.value)}
                    />
                    <label
                      className={`${styles.uploadBtn} ${
                        uploadingTarget === "fallbackAvatar" ? styles.uploadBtnDisabled : ""
                      }`}
                    >
                      <Upload size={13} />
                      <span>{uploadingTarget === "fallbackAvatar" ? "Mengunggah..." : "Upload Foto Fallback"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className={styles.hiddenFileInput}
                        disabled={uploadingTarget === "fallbackAvatar"}
                        onChange={(e) => handleImageUpload(e, "fallbackAvatar")}
                      />
                    </label>
                  </div>
                </div>
                <span className={styles.fieldHint}>File disimpan otomatis ke /public/images/</span>
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label>Bio Singkat (Hero Section)</label>
              <textarea
                rows={3}
                value={data.personal.bio || ""}
                onChange={(e) => updatePersonal("bio", e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Bio Lengkap (About Section)</label>
              <textarea
                rows={4}
                value={data.personal.aboutBio || ""}
                onChange={(e) => updatePersonal("aboutBio", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ─── TAB 2: HERO ─── */}
        {activeTab === "hero" && data?.hero && (
          <div className={styles.sectionForm}>
            <div className={styles.sectionHeader}>
              <h2>Hero Section</h2>
              <p>Konfigurasi teks besar, baris teks berjalan di belakang foto, dan tags.</p>
            </div>

            <div className={styles.formGrid2}>
              <div className={styles.fieldGroup}>
                <label>Sapaan Awal</label>
                <input
                  type="text"
                  value={data.hero.greeting || ""}
                  onChange={(e) => updateHero("greeting", e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Subtitle Role</label>
                <input
                  type="text"
                  value={data.hero.roleTitle || ""}
                  onChange={(e) => updateHero("roleTitle", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label>Teks Berjalan Baris 1 (Bergerak ke Kiri - pisahkan dengan koma)</label>
              <input
                type="text"
                value={(data.hero.marqueeLine1 || []).join(", ")}
                onChange={(e) =>
                  updateHero(
                    "marqueeLine1",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Teks Berjalan Baris 2 (Bergerak ke Kanan - Outlined - pisahkan dengan koma)</label>
              <input
                type="text"
                value={(data.hero.marqueeLine2 || []).join(", ")}
                onChange={(e) =>
                  updateHero(
                    "marqueeLine2",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Tech Tags Chip di Bawah Tombol CTA (pisahkan dengan koma)</label>
              <input
                type="text"
                value={(data.hero.techTags || []).join(", ")}
                onChange={(e) =>
                  updateHero(
                    "techTags",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
              />
            </div>
          </div>
        )}

        {/* ─── TAB 3: EXPERIENCES ─── */}
        {activeTab === "experiences" && data?.experiences && (
          <div className={styles.sectionForm}>
            <div className={styles.sectionHeaderBetween}>
              <div>
                <h2>Riwayat Pengalaman (Timeline)</h2>
                <p>Tambah, ubah, atau hapus item riwayat pekerjaan pada timeline.</p>
              </div>
              <button onClick={addExperience} className={styles.addBtn}>
                <Plus size={14} />
                <span>Tambah Pengalaman</span>
              </button>
            </div>

            <div className={styles.itemsList}>
              {data.experiences.map((exp, index) => (
                <div key={index} className={styles.cardItem}>
                  <div className={styles.cardItemHeader}>
                    <div className={styles.cardItemTitle}>
                      <span className={styles.itemBadge}>#{index + 1}</span>
                      <strong>{exp.role || "Role"}</strong> — {exp.company || "Perusahaan"}
                    </div>
                    <button
                      onClick={() => removeExperience(index)}
                      className={styles.deleteBtn}
                    >
                      <Trash2 size={13} />
                      <span>Hapus</span>
                    </button>
                  </div>

                  <div className={styles.formGrid2}>
                    <div className={styles.fieldGroup}>
                      <label>Nama Perusahaan / Organisasi</label>
                      <input
                        type="text"
                        value={exp.company || ""}
                        onChange={(e) => updateExperience(index, "company", e.target.value)}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Posisi / Role</label>
                      <input
                        type="text"
                        value={exp.role || ""}
                        onChange={(e) => updateExperience(index, "role", e.target.value)}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Periode Waktu</label>
                      <input
                        type="text"
                        value={exp.period || ""}
                        onChange={(e) => updateExperience(index, "period", e.target.value)}
                      />
                    </div>

                    <div className={styles.fieldGroupCheckbox}>
                      <label>
                        <input
                          type="checkbox"
                          checked={Boolean(exp.current)}
                          onChange={(e) =>
                            updateExperience(index, "current", e.target.checked)
                          }
                        />
                        <span>Pekerjaan Saat Ini (Badge "Current" & Dot Berkedip)</span>
                      </label>
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label>Deskripsi Tanggung Jawab & Pekerjaan</label>
                    <textarea
                      rows={2}
                      value={exp.desc || ""}
                      onChange={(e) => updateExperience(index, "desc", e.target.value)}
                    />
                  </div>

                  <div className={styles.fieldGroup}>
                    <label>Tags Teknologi (pisahkan dengan koma)</label>
                    <input
                      type="text"
                      value={(exp.tags || []).join(", ")}
                      onChange={(e) =>
                        updateExperience(
                          index,
                          "tags",
                          e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 4: PROJECTS ─── */}
        {activeTab === "projects" && data?.projects && (
          <div className={styles.sectionForm}>
            <div className={styles.sectionHeaderBetween}>
              <div>
                <h2>Daftar Proyek (Portfolio)</h2>
                <p>Kelola item proyek dengan gambar preview 16:9.</p>
              </div>
              <button onClick={addProject} className={styles.addBtn}>
                <Plus size={14} />
                <span>Tambah Proyek</span>
              </button>
            </div>

            <div className={styles.itemsList}>
              {data.projects.map((proj, index) => (
                <div key={index} className={styles.cardItem}>
                  <div className={styles.cardItemHeader}>
                    <div className={styles.cardItemTitle}>
                      <span className={styles.itemBadge}>#{proj.id || index + 1}</span>
                      <strong>{proj.name || "Nama Proyek"}</strong>
                      {proj.pinned && (
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px",
                            fontSize: "10px",
                            fontWeight: "600",
                            padding: "2px 8px",
                            borderRadius: "12px",
                            background: "rgba(232, 255, 90, 0.15)",
                            color: "var(--accent, #e8ff5a)",
                            border: "1px solid rgba(232, 255, 90, 0.3)",
                            marginLeft: "8px",
                          }}
                        >
                          <Pin size={10} /> Pinned
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => removeProject(index)}
                      className={styles.deleteBtn}
                    >
                      <Trash2 size={13} />
                      <span>Hapus</span>
                    </button>
                  </div>

                  <div className={styles.formGrid3}>
                    <div className={styles.fieldGroup}>
                      <label>Nomor Urut ID</label>
                      <input
                        type="text"
                        value={proj.id || ""}
                        onChange={(e) => updateProject(index, "id", e.target.value)}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Kategori / Tag</label>
                      <input
                        type="text"
                        value={proj.tag || ""}
                        onChange={(e) => updateProject(index, "tag", e.target.value)}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Nama Proyek</label>
                      <input
                        type="text"
                        value={proj.name || ""}
                        onChange={(e) => updateProject(index, "name", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.fieldGroup}>
                    <label>Deskripsi Proyek</label>
                    <textarea
                      rows={2}
                      value={proj.desc || ""}
                      onChange={(e) => updateProject(index, "desc", e.target.value)}
                    />
                  </div>

                  <div className={styles.formGrid2}>
                    <div className={styles.fieldGroup}>
                      <label>Teks Display URL</label>
                      <input
                        type="text"
                        value={proj.url || ""}
                        onChange={(e) => updateProject(index, "url", e.target.value)}
                      />
                    </div>

                    <div className={styles.fieldGroup}>
                      <label>Link Target (Href)</label>
                      <input
                        type="text"
                        value={proj.href || ""}
                        onChange={(e) => updateProject(index, "href", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className={styles.uploadFieldWrap} style={{ marginTop: "12px" }}>
                    <label>Gambar Preview Proyek (16:9 / 16:10)</label>
                    <div className={styles.uploadRow}>
                      <div className={styles.uploadPreviewBox} style={{ width: "96px", height: "60px" }}>
                        {proj.image ? (
                          <img
                            src={proj.image}
                            alt="Project Preview"
                            className={styles.uploadPreviewImg}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <span className={styles.uploadPreviewEmpty}>No Preview</span>
                        )}
                      </div>
                      <div className={styles.uploadInputWrap}>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                          <input
                            type="text"
                            placeholder="/images/projects/nama-proyek.png"
                            value={proj.image || ""}
                            onChange={(e) => updateProject(index, "image", e.target.value)}
                            style={{ flex: 1 }}
                          />
                          <label
                            className={`${styles.uploadBtn} ${
                              uploadingTarget === `project-${index}` ? styles.uploadBtnDisabled : ""
                            }`}
                          >
                            <Upload size={13} />
                            <span>
                              {uploadingTarget === `project-${index}`
                                ? "Mengunggah..."
                                : "Upload Gambar"}
                            </span>
                            <input
                              type="file"
                              accept="image/*"
                              className={styles.hiddenFileInput}
                              disabled={uploadingTarget === `project-${index}`}
                              onChange={(e) => handleImageUpload(e, "project", index)}
                            />
                          </label>
                        </div>
                        <span className={styles.fieldHint}>Tersimpan otomatis ke /public/images/projects/</span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.fieldGroupCheckbox} style={{ marginTop: "12px" }}>
                    <label>
                      <input
                        type="checkbox"
                        checked={Boolean(proj.pinned)}
                        onChange={(e) => updateProject(index, "pinned", e.target.checked)}
                      />
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                        <Pin size={13} color={proj.pinned ? "var(--accent, #e8ff5a)" : "#666"} />
                        <span>Pin ke Halaman Utama (Tampilkan di Beranda — Prioritas Max 3 Proyek)</span>
                      </span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 5: ABOUT & SKILLS ─── */}
        {activeTab === "about" && data?.about && (
          <div className={styles.sectionForm}>
            <div className={styles.sectionHeader}>
              <h2>Statistik & Keahlian</h2>
              <p>Kelola 4 angka statistik dan daftar keahlian pada section About.</p>
            </div>

            <div className={styles.subSection}>
              <div className={styles.sectionHeaderBetween}>
                <h3>Angka Statistik</h3>
                <button onClick={addStat} className={styles.addBtnSmall}>
                  <Plus size={12} />
                  <span>Tambah Stat</span>
                </button>
              </div>

              <div className={styles.statsGrid}>
                {data.about.stats.map((stat, index) => (
                  <div key={index} className={styles.statEditorCard}>
                    <div className={styles.statEditorHeader}>
                      <span>Stat #{index + 1}</span>
                      <button
                        onClick={() => removeStat(index)}
                        className={styles.deleteTextBtn}
                        aria-label="Hapus stat"
                      >
                        ✕
                      </button>
                    </div>
                    <div className={styles.fieldGroup}>
                      <label>Angka Tampilan (ex: 4+, 99%)</label>
                      <input
                        type="text"
                        value={stat.num || ""}
                        onChange={(e) => updateStat(index, "num", e.target.value)}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label>Label</label>
                      <input
                        type="text"
                        value={stat.label || ""}
                        onChange={(e) => updateStat(index, "label", e.target.value)}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label>Nilai Target Animasi (Angka Bulat)</label>
                      <input
                        type="number"
                        value={stat.count || 0}
                        onChange={(e) =>
                          updateStat(index, "count", parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.subSection}>
              <h3>Daftar Skills (Pill Chips)</h3>
              <p className={styles.fieldHint}>
                Pisahkan dengan koma untuk memperbarui daftar keahlian.
              </p>
              <textarea
                rows={3}
                value={(data.about.skills || []).join(", ")}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    about: {
                      ...prev.about,
                      skills: e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean),
                    },
                  }))
                }
              />
              <div className={styles.chipPreview}>
                {(data.about.skills || []).map((skill, i) => (
                  <span key={i} className={styles.skillChip}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 6: SOCIALS ─── */}
        {activeTab === "socials" && data?.socials && (
          <div className={styles.sectionForm}>
            <div className={styles.sectionHeaderBetween}>
              <div>
                <h2>Media Sosial & Kontak</h2>
                <p>Kelola link profil media sosial Anda.</p>
              </div>
              <button onClick={addSocial} className={styles.addBtn}>
                <Plus size={14} />
                <span>Tambah Sosial</span>
              </button>
            </div>

            <div className={styles.itemsList}>
              {data.socials.map((soc, index) => (
                <div key={index} className={styles.cardItem}>
                  <div className={styles.cardItemHeader}>
                    <div className={styles.cardItemTitle}>
                      <span className={styles.itemBadge}>{soc.abbr || "SO"}</span>
                      <strong>{soc.name}</strong> ({soc.handle})
                    </div>
                    <button
                      onClick={() => removeSocial(index)}
                      className={styles.deleteBtn}
                    >
                      <Trash2 size={13} />
                      <span>Hapus</span>
                    </button>
                  </div>

                  <div className={styles.formGrid4}>
                    <div className={styles.fieldGroup}>
                      <label>Platform Name</label>
                      <input
                        type="text"
                        value={soc.name || ""}
                        onChange={(e) => updateSocial(index, "name", e.target.value)}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label>Singkatan (Abbr)</label>
                      <input
                        type="text"
                        value={soc.abbr || ""}
                        onChange={(e) => updateSocial(index, "abbr", e.target.value)}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label>Handle / Username</label>
                      <input
                        type="text"
                        value={soc.handle || ""}
                        onChange={(e) => updateSocial(index, "handle", e.target.value)}
                      />
                    </div>
                    <div className={styles.fieldGroup}>
                      <label>URL Profil</label>
                      <input
                        type="text"
                        value={soc.url || ""}
                        onChange={(e) => updateSocial(index, "url", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 7: MARQUEE ─── */}
        {activeTab === "marquee" && (
          <div className={styles.sectionForm}>
            <div className={styles.sectionHeader}>
              <h2>Pita Marquee Berjalan</h2>
              <p>Teks teknologi yang berjalan horizontal di tengah halaman (pisahkan dengan koma).</p>
            </div>

            <div className={styles.fieldGroup}>
              <label>Daftar Teknologi Marquee</label>
              <textarea
                rows={3}
                value={(data.marquee || []).join(", ")}
                onChange={(e) =>
                  setData((prev) => ({
                    ...prev,
                    marquee: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
              />
            </div>

            <div className={styles.chipPreview}>
              {(data.marquee || []).map((item, i) => (
                <span key={i} className={styles.marqueeChip}>
                  {item} ✦
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ─── TAB 8: SEO ─── */}
        {activeTab === "seo" && data?.seo && (
          <div className={styles.sectionForm}>
            <div className={styles.sectionHeader}>
              <h2>SEO & Metadata Mesin Pencari</h2>
              <p>Optimasi judul, deskripsi, kata kunci, dan OpenGraph preview untuk Googlebot.</p>
            </div>

            <div className={styles.formGrid2}>
              <div className={styles.fieldGroup}>
                <label>Website URL (Canonical Base)</label>
                <input
                  type="text"
                  value={data.seo.siteUrl || ""}
                  onChange={(e) => updateSeo("siteUrl", e.target.value)}
                />
              </div>

              <div className={styles.fieldGroup}>
                <label>Penulis (Author)</label>
                <input
                  type="text"
                  value={data.seo.author || ""}
                  onChange={(e) => updateSeo("author", e.target.value)}
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label>Meta Title (Judul Tab Browser & Google Search)</label>
              <input
                type="text"
                value={data.seo.title || ""}
                onChange={(e) => updateSeo("title", e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Meta Description (Deskripsi di Hasil Pencarian)</label>
              <textarea
                rows={3}
                value={data.seo.description || ""}
                onChange={(e) => updateSeo("description", e.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>Keywords (Kata Kunci - pisahkan dengan koma)</label>
              <input
                type="text"
                value={(data.seo.keywords || []).join(", ")}
                onChange={(e) =>
                  updateSeo(
                    "keywords",
                    e.target.value.split(",").map((s) => s.trim()).filter(Boolean)
                  )
                }
              />
            </div>

            <div className={styles.fieldGroup}>
              <label>OpenGraph Image Preview</label>
              <input
                type="text"
                value={data.seo.ogImage || ""}
                onChange={(e) => updateSeo("ogImage", e.target.value)}
              />
            </div>
          </div>
        )}

        {/* ─── TAB 9: RAW JSON EDITOR ─── */}
        {activeTab === "raw" && (
          <div className={styles.sectionForm}>
            <div className={styles.sectionHeaderBetween}>
              <div>
                <h2>Raw JSON Editor</h2>
                <p>Edit langsung struktur objek file <code>/data/data.json</code>.</p>
              </div>
              <div className={styles.rawJsonActions}>
                <button onClick={handleFormatJson} className={styles.formatBtn}>
                  <Code size={14} />
                  <span>Format / Rapikan JSON</span>
                </button>
              </div>
            </div>

            {jsonError && (
              <div className={styles.jsonErrorBadge}>
                ⚠️ Syntax Error: {jsonError}
              </div>
            )}

            <textarea
              className={styles.rawJsonTextarea}
              rows={24}
              value={rawJsonText}
              onChange={handleRawJsonChange}
              spellCheck={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className={styles.loadingContainer}>
          <div className={styles.spinner} />
          <p>Memuat Panel Admin...</p>
        </div>
      }
    >
      <AdminContent />
    </Suspense>
  );
}