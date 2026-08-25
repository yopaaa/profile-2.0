"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import styles from "./styles/Articles.module.css";

const posts = [
  {
    tag: "React",
    title: "Kenapa Saya Berhenti Pakai useEffect untuk Data Fetching",
    excerpt: "useEffect bukan jawaban untuk semua masalah. Berikut pendekatan yang lebih bersih...",
    date: "12 Apr 2025 · 8 min",
  },
  {
    tag: "Design",
    title: "Neubrutalism: Estetika yang Jujur di Dunia Digital",
    excerpt: "Apa itu neubrutalism, kenapa trending, dan bagaimana menggunakannya dengan tepat.",
    date: "28 Mar 2025 · 6 min",
  },
  {
    tag: "Backend",
    title: "Membangun API yang Tidak Membuat Dev Lain Menangis",
    excerpt: "Panduan praktis membuat REST API yang konsisten, terdokumentasi, dan mudah di-maintain.",
    date: "15 Mar 2025 · 12 min",
  },
];

export default function Articles() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(sectionRef.current.querySelectorAll("[data-anim]"), {
            opacity: [0, 1],
            translateY: [24, 0],
            ease: "outExpo",
            duration: 800,
            delay: stagger(100),
          });
          observer.disconnect();
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="articles" ref={sectionRef} className={styles.articles}>
      <div className={styles.inner}>
        <div className={styles.header} data-anim>
          <span className={styles.label}>Writing</span>
          <div className={styles.headerLine} />
          <a href="#" className={styles.viewAll}>All posts →</a>
        </div>

        <div className={styles.list}>
          {posts.map((p, i) => (
            <a key={i} href="#" className={styles.item} data-anim>
              <div className={styles.itemMeta}>
                <span className={styles.tag}>{p.tag}</span>
                <span className={styles.date}>{p.date}</span>
              </div>
              <h3 className={styles.title}>{p.title}</h3>
              <p className={styles.excerpt}>{p.excerpt}</p>
              <span className={styles.readMore}>Read more →</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}