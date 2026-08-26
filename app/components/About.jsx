"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import styles from "./styles/About.module.css";

const stats = [
  { num: "4+", label: "Years exp.", count: 4, plus: true },
  { num: "32", label: "Projects", count: 32, plus: false },
  { num: "18", label: "Clients", count: 18, plus: false },
  { num: "99%", label: "Satisfaction", count: 99, plus: false },
];

const skills = ["React.js", "Next.js", "Node.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "Docker", "Figma"];

export default function About() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const targets = sectionRef.current.querySelectorAll("[data-anim]");

          // Stagger fade-up
          animate(targets, {
            opacity: [0, 1],
            translateY: [30, 0],
            ease: "outExpo",
            duration: 800,
            delay: stagger(100),
          });

          // Count-up stats
          sectionRef.current.querySelectorAll("[data-count]").forEach((el) => {
            const target = parseInt(el.dataset.count);
            const isPlus = el.dataset.plus === "true";
            let obj = { val: 0 };
            animate(obj, {
              val: target,
              ease: "outExpo",
              duration: 1200,
              delay: 300,
              onUpdate: () => {
                el.textContent = Math.round(obj.val) + (isPlus ? "+" : "");
              },
            });
          });

          observer.disconnect();
        });
      },
      { threshold: 0.2 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className={styles.about}>
      <div className={styles.inner}>
        <div className={styles.header} data-anim>
          <span className={styles.label}>About</span>
          <div className={styles.headerLine} />
        </div>

        <div className={styles.statsRow} data-anim>
          {stats.map((s, i) => (
            <div key={i} className={styles.statItem}>
              <span
                className={styles.statNum}
                data-count={s.count}
                data-plus={s.plus ? "true" : "false"}
              >
                {s.num}
              </span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        <p className={styles.bio} data-anim>
          Halo, saya Yopa full-stack developer berbasis di Bangka yang passionate
          dalam membangun produk digital yang bermakna. Saya percaya kode yang bersih
          dan desain yang intuitif berjalan beriringan.
        </p>

        <div className={styles.skills} data-anim>
          {skills.map((s) => (
            <span key={s} className={styles.skill}>{s}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
