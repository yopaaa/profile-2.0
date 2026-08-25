"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import styles from "./styles/Services.module.css";

const projects = [
  {
    id: "01",
    icon: "⚡",
    name: "Katalis",
    desc: "URL shortener dengan analitik real-time dan dashboard yang clean.",
    url: "katalis.yopa.dev",
    href: "https://katalis.yopa.dev",
    tag: "Tool",
  },
  {
    id: "02",
    icon: "🧾",
    name: "Kasir",
    desc: "Sistem kasir berbasis web untuk UMKM — cepat, sederhana, offline-first.",
    url: "kasir.yopa.dev",
    href: "https://kasir.yopa.dev",
    tag: "SaaS",
  },
];

export default function Services() {
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
            delay: stagger(120),
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
    <section id="services" ref={sectionRef} className={styles.services}>
      <div className={styles.inner}>
        <div className={styles.header} data-anim>
          <span className={styles.label}>Work</span>
          <div className={styles.headerLine} />
        </div>

        <div className={styles.grid}>
          {projects.map((p) => (
            <a
              key={p.id}
              href={p.href}
              target="_blank"
              rel="noreferrer"
              className={styles.card}
              data-anim
            >
              <div className={styles.cardTop}>
                <span className={styles.cardId}>{p.id}</span>
                <span className={styles.cardTag}>{p.tag}</span>
              </div>
              <div className={styles.cardIcon}>{p.icon}</div>
              <h3 className={styles.cardName}>{p.name}</h3>
              <p className={styles.cardDesc}>{p.desc}</p>
              <div className={styles.cardFooter}>
                <span className={styles.cardUrl}>{p.url}</span>
                <span className={styles.cardArrow}>↗</span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
