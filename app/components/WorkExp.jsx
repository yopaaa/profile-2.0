"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import portfolioData from "../../data/data.json";
import styles from "./styles/WorkExp.module.css";

const experiences = portfolioData.experiences;

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
