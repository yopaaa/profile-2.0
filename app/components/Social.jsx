"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import portfolioData from "../../data/data.json";
import styles from "./styles/Social.module.css";

const socials = portfolioData.socials;

export default function Social() {
  const sectionRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(sectionRef.current.querySelectorAll("[data-anim]"), {
            opacity: [0, 1],
            translateY: [20, 0],
            ease: "outExpo",
            duration: 700,
            delay: stagger(80),
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
    <section id="social" ref={sectionRef} className={styles.social}>
      <div className={styles.inner}>
        <div className={styles.header} data-anim>
          <span className={styles.label}>Find me</span>
          <div className={styles.headerLine} />
        </div>

        <div className={styles.list}>
          {socials.map((s) => (
            <a
              key={s.name}
              href={s.url}
              target="_blank"
              rel="noreferrer"
              className={styles.item}
              data-anim
            >
              <span className={styles.abbr}>{s.abbr}</span>
              <div className={styles.itemInfo}>
                <span className={styles.name}>{s.name}</span>
                <span className={styles.handle}>{s.handle}</span>
              </div>
              <span className={styles.arrow}>↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}