"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import styles from "./styles/WorkExp.module.css";

const experiences = [
  {
    company: "Freelance",
    role: "Full-stack Developer",
    period: "2022 Present",
    current: true,
    desc: "Membangun web app dan landing page untuk berbagai klien. Stack utama: Next.js, Node.js, PostgreSQL, dan Figma untuk desain.",
    tags: ["Next.js", "Node.js", "PostgreSQL", "Figma"],
  },
  {
    company: "PT. Banka Digital",
    role: "Frontend Developer Intern",
    period: "Jan 2022 Jun 2022",
    current: false,
    desc: "Mengembangkan UI dashboard internal menggunakan React dan Tailwind CSS. Berkolaborasi dengan tim backend untuk integrasi REST API.",
    tags: ["React", "Tailwind CSS", "REST API"],
  },
  {
    company: "Universitas Bangka Belitung",
    role: "Lab Assistant Web Programming",
    period: "2021 2022",
    current: false,
    desc: "Membantu mahasiswa dalam praktikum HTML, CSS, dan JavaScript. Membuat modul praktikum dan materi ajar.",
    tags: ["HTML", "CSS", "JavaScript"],
  },
];

export default function WorkExp() {
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
            duration: 750,
            delay: stagger(100),
          });

          // Animate timeline line growing down
          animate(sectionRef.current.querySelector("[data-line]"), {
            scaleY: [0, 1],
            ease: "outExpo",
            duration: 1200,
            delay: 200,
          });

          observer.disconnect();
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="experience" ref={sectionRef} className={styles.section}>
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header} data-anim>
          <span className={styles.label}>Experience</span>
          <div className={styles.headerLine} />
        </div>

        {/* Timeline */}
        <div className={styles.timeline}>
          {/* Vertical line */}
          <div className={styles.lineTrack}>
            <div className={styles.lineBar} data-line />
          </div>

          {/* Items */}
          <div className={styles.items}>
            {experiences.map((exp, i) => (
              <div key={i} className={styles.item} data-anim>
                {/* Dot */}
                <div className={styles.dotWrap}>
                  <div className={`${styles.dot} ${exp.current ? styles.dotActive : ""}`} />
                </div>

                {/* Content */}
                <div className={styles.content}>
                  <div className={styles.meta}>
                    <span className={styles.period}>{exp.period}</span>
                    {exp.current && (
                      <span className={styles.currentBadge}>Current</span>
                    )}
                  </div>

                  <h3 className={styles.role}>{exp.role}</h3>
                  <span className={styles.company}>{exp.company}</span>

                  <p className={styles.desc}>{exp.desc}</p>

                  <div className={styles.tags}>
                    {exp.tags.map((t) => (
                      <span key={t} className={styles.tag}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
