"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Pin,
  Clock,
  History,
  ExternalLink,
  ArrowUp,
  Sparkles,
} from "lucide-react";
import styles from "./projects.module.css";

export default function ProjectsClient({ projects = [] }) {
  // Sort options: "pinned" (Pilihan / Pin), "newest" (Terbaru), "oldest" (Terlama)
  const [activeSort, setActiveSort] = useState("pinned");

  const sortedProjects = useMemo(() => {
    const list = [...projects];

    if (activeSort === "pinned") {
      return list.sort((a, b) => {
        // Pinned projects first
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;
        // Then by ID descending (newer first)
        return String(b.id || "").localeCompare(String(a.id || ""), undefined, {
          numeric: true,
        });
      });
    }

    if (activeSort === "newest") {
      return list.sort((a, b) => {
        return String(b.id || "").localeCompare(String(a.id || ""), undefined, {
          numeric: true,
        });
      });
    }

    if (activeSort === "oldest") {
      return list.sort((a, b) => {
        return String(a.id || "").localeCompare(String(b.id || ""), undefined, {
          numeric: true,
        });
      });
    }

    return list;
  }, [projects, activeSort]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Top Navigation */}
        <nav className={styles.topNav}>
          <Link href="/" className={styles.backBtn}>
            <ArrowLeft size={15} />
            <span>Kembali ke Beranda</span>
          </Link>

        </nav>

        

        {/* Filter & Sorting Controls */}
        <div className={styles.filterBar}>
          <div className={styles.filterGroup}>
            <span className={styles.filterLabel}>Urutkan:</span>

            {/* Filter: Pinned */}
            <button
              onClick={() => setActiveSort("pinned")}
              className={`${styles.filterBtn} ${
                activeSort === "pinned" ? styles.filterBtnActive : ""
              }`}
            >
              <Pin size={13} />
              <span>Dipin (Pilihan)</span>
            </button>

            {/* Filter: Terbaru */}
            <button
              onClick={() => setActiveSort("newest")}
              className={`${styles.filterBtn} ${
                activeSort === "newest" ? styles.filterBtnActive : ""
              }`}
            >
              <Clock size={13} />
              <span>Terbaru</span>
            </button>

            {/* Filter: Terlama */}
            <button
              onClick={() => setActiveSort("oldest")}
              className={`${styles.filterBtn} ${
                activeSort === "oldest" ? styles.filterBtnActive : ""
              }`}
            >
              <History size={13} />
              <span>Terlama</span>
            </button>
          </div>

          <div className={styles.countBadge}>
            Menampilkan {sortedProjects.length} proyek
          </div>
        </div>

        {/* 1 Column List of Projects (Image Left, Explanation Right) */}
        <div className={styles.projectsList}>
          {sortedProjects.map((p) => {
            const hasLink = Boolean(p.href && p.href.trim() !== "");

            return (
              <article
                key={p.id}
                id={`project-${p.id}`}
                className={styles.projectCard}
              >
                {/* 1. Image on the Left Side */}
                <div className={styles.imageColumn}>
                  <Image
                    src={p.image}
                    alt={`${p.name} preview`}
                    fill
                    className={styles.projectImage}
                    sizes="(max-width: 900px) 100vw, 460px"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div className={styles.imageOverlay} />

                  <div className={styles.badgeStack}>
                    {p.pinned && (
                      <span className={styles.pinnedBadge} title="Proyek Unggulan / Pinned">
                        <Pin size={11} />
                        <span>PINNED</span>
                      </span>
                    )}
                    <span className={styles.tagBadge}>{p.tag}</span>
                  </div>
                </div>

                {/* 2. Explanation on the Right Side */}
                <div className={styles.contentColumn}>
                  <div className={styles.contentTop}>
                    <div className={styles.metaRow}>
                      <span className={styles.projectId}>#{p.id}</span>
                      <span className={styles.projectCategory}>{p.tag}</span>
                    </div>

                    <h2 className={styles.projectName}>{p.name}</h2>
                    <p className={styles.projectDesc}>{p.desc}</p>
                  </div>

                  <div className={styles.contentBottom}>
                    <span className={styles.urlText}>
                      {p.url || (hasLink ? "Live Preview" : "Repository / Internal")}
                    </span>

                    {hasLink ? (
                      <a
                        href={p.href}
                        target="_blank"
                        rel="noreferrer"
                        className={styles.actionLink}
                      >
                        <span>Kunjungi Situs</span>
                        <ExternalLink size={14} />
                      </a>
                    ) : (
                      <span className={styles.actionLink} style={{ color: "#555" }}>
                        <span>Detail Proyek</span>
                        <span>✦</span>
                      </span>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Footer */}
        <footer className={styles.footer}>
          <div>© {new Date().getFullYear()} Yopa Pitra Ramadhani. All rights reserved.</div>
          <button onClick={scrollToTop} className={styles.backToTop}>
            <span>Kembali ke atas</span>
            <ArrowUp size={14} />
          </button>
        </footer>
      </div>
    </div>
  );
}
