"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import styles from "./styles/Hero.module.css";


export default function Hero() {
  const heroRef = useRef(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const targets = heroRef.current.querySelectorAll("[data-anim]");
    const line = heroRef.current.querySelector("[data-line]");
    const dot = heroRef.current.querySelector("[data-dot]");

    // Stagger fade-up
    animate(targets, {
      opacity: [0, 1],
      translateY: [40, 0],
      ease: "outExpo",
      duration: 900,
      delay: stagger(120, { start: 200 }),
    });

    // Line expand
    if (line) {
      animate(line, {
        width: ["0%", "100%"],
        ease: "outExpo",
        duration: 1400,
        delay: 400,
      });
    }

    // Dot pop-in
    if (dot) {
      animate(dot, {
        scale: [0, 1],
        opacity: [0, 1],
        ease: "outElastic(1, .6)",
        duration: 1000,
        delay: 800,
      });
    }
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} id="hero">
      <div className={styles.inner}>
        <div className={styles.status} data-anim>
          <span data-dot className={styles.statusDot} />
          <span className={styles.statusText}>Available for work</span>
        </div>

        <div className={styles.nameWrap}>
          <h1 className={styles.name} data-anim>
            Yopa<br />
            <em className={styles.nameAccent}>Pitra R.</em>
          </h1>
        </div>

        <div className={styles.divider} data-anim>
          <span data-line className={styles.dividerLine} />
        </div>

        <p className={styles.desc} data-anim>
          Full-stack developer & UI designer yang suka membangun<br />
          produk digital bermakna — berbasis di Bangka, Indonesia.
        </p>

        <div className={styles.cta} data-anim>
          <a href="#services" className={styles.btnPrimary}>
            Lihat Proyek <span className={styles.arrow}>↗</span>
          </a>
          <a href="#articles" className={styles.btnGhost}>
            Baca Artikel
          </a>
        </div>

        <div className={styles.tags} data-anim>
          {["React", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "Figma"].map((t) => (
            <span key={t} className={styles.tag}>{t}</span>
          ))}
        </div>
      </div>

      <div className={styles.bgCircle} />
    </section>
  );
}