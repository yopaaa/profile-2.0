"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import Image from "next/image";
import Link from "next/link";
import { Pin, ArrowRight } from "lucide-react";
import portfolioData from "../../data/data.json";
import styles from "./styles/Services.module.css";

const allProjects = portfolioData.projects || [];

// Prioritaskan proyek yang di-pin, lalu potong max 3
const featuredProjects = [...allProjects]
  .sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return 0;
  })
  .slice(0, 3);

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
          <div className={styles.headerTitleWrap}>
            <span className={styles.label}>Portfolio</span>
            <span className={styles.badge}>Featured (3)</span>
          </div>
          <div className={styles.headerLine} />
          <Link href="/projects" className={styles.viewAllHeaderLink}>
            <span>Semua Proyek ({allProjects.length})</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {/* 1 Row on Laptop/Desktop (3 columns), 1 Column on Mobile */}
        <div className={styles.grid}>
          {featuredProjects.map((p) => (
            <a
              key={p.id}
              href={p.href || `/projects#project-${p.id}`}
              target={p.href ? "_blank" : "_self"}
              rel={p.href ? "noreferrer" : undefined}
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
                  sizes="(max-width: 900px) 100vw, 33vw"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <div className={styles.imageOverlay} />
                
                {/* Badges on top of image */}
                <div className={styles.badgeGroup}>
                  {p.pinned && (
                    <span className={styles.pinnedBadge} title="Proyek Pilihan / Pinned">
                      <Pin size={10} />
                      <span>PINNED</span>
                    </span>
                  )}
                  <span className={styles.cardTag}>{p.tag}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className={styles.cardBody}>
                <div className={styles.cardTop}>
                  <span className={styles.cardId}>{p.id}</span>
                  <h3 className={styles.cardName}>{p.name}</h3>
                </div>
                <p className={styles.cardDesc}>{p.desc}</p>
                <div className={styles.cardFooter}>
                  <span className={styles.cardUrl}>{p.url || "Lihat detail"}</span>
                  <span className={styles.cardArrow}>↗</span>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Button to view all projects */}
        <div className={styles.moreAction} data-anim>
          <Link href="/projects" className={styles.viewAllBtn}>
            <span>Lihat Semua {allProjects.length} Proyek</span>
            <ArrowRight size={15} />
          </Link>
        </div>

      </div>
    </section>
  );
}
