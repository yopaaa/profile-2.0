"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import Image from "next/image";
import portfolioData from "../../data/data.json";
import styles from "./styles/Services.module.css";

const projects = portfolioData.projects;

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
            translateY: [32, 0],
            ease: "outExpo",
            duration: 800,
            delay: stagger(140),
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
    <section id="services" ref={sectionRef} className={styles.services}>
      <div className={styles.inner}>

        {/* Header */}
        <div className={styles.header} data-anim>
          <span className={styles.label}>Portfolio</span>
          <div className={styles.headerLine} />
          <span className={styles.count}>{projects.length} projects</span>
        </div>

        {/* Grid */}
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
              {/* Image Preview */}
              <div className={styles.imageWrap}>
                <Image
                  src={p.image}
                  alt={`${p.name} preview`}
                  fill
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  // Fallback jika image belum ada
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                {/* Overlay gradient */}
                <div className={styles.imageOverlay} />
                {/* Tag di atas image */}
                <span className={styles.cardTag}>{p.tag}</span>
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <span className={styles.cardId}>{p.id}</span>
                  <h3 className={styles.cardName}>{p.name}</h3>
                </div>
                <p className={styles.cardDesc}>{p.desc}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.cardUrl}>{p.url}</span>
                  <span className={styles.cardArrow}>↗</span>
                </div>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
