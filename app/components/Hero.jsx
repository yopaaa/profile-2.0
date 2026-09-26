"use client";

import { useEffect, useRef, useState } from "react";
import { animate, stagger } from "animejs";
import Image from "next/image";
import portfolioData from "../../data/data.json";
import styles from "./styles/Hero.module.css";

const marqueeLine1 = portfolioData.hero.marqueeLine1;
const marqueeLine2 = portfolioData.hero.marqueeLine2;
const personal = portfolioData.personal;
const heroData = portfolioData.hero;

export default function Hero() {
  const heroRef = useRef(null);
  const avatarRef = useRef(null);
  const avatarPath = personal?.avatar || "/images/yopa.png";
  const [imgSrc, setImgSrc] = useState(avatarPath);

  useEffect(() => {
    if (personal?.avatar) {
      setImgSrc(personal.avatar);
    }
  }, [personal?.avatar]);

  useEffect(() => {
    if (!heroRef.current) return;

    const targets = heroRef.current.querySelectorAll("[data-anim]");
    const avatar = avatarRef.current;

    // Stagger fade-up elements
    animate(targets, {
      opacity: [0, 1],
      translateY: [30, 0],
      ease: "outExpo",
      duration: 1000,
      delay: stagger(100, { start: 200 }),
    });

    // Center avatar floating entrance
    if (avatar) {
      animate(avatar, {
        opacity: [0, 1],
        scale: [0.9, 1],
        translateY: [40, 0],
        ease: "outExpo",
        duration: 1200,
        delay: 300,
      });
    }
  }, []);

  return (
    <section ref={heroRef} className={styles.hero} id="hero">
      {/* ── Background Kinetic Running Typography ── */}
      <div className={styles.bgTypography} aria-hidden="true">
        {/* Line 1: moves left */}
        <div className={styles.textTrackLeft}>
          {[...marqueeLine1, ...marqueeLine1, ...marqueeLine1].map((text, i) => (
            <span key={i} className={styles.textSolid}>
              {text} <span className={styles.textDot}>✦</span>
            </span>
          ))}
        </div>

        {/* Line 2: moves right (outlined) */}
        <div className={styles.textTrackRight}>
          {[...marqueeLine2, ...marqueeLine2, ...marqueeLine2].map((text, i) => (
            <span key={i} className={styles.textOutline}>
              {text} <span className={styles.textDot}>✦</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Background Grid & Ambient Glow ── */}
      <div className={styles.bgGrid} />
      <div className={styles.glowCenter} />

      {/* ── Hero Center Container ── */}
      <div className={styles.container}>
        {/* Top Header: Badge & Big Name */}
        <div className={styles.topHeader}>

          <h1 className={styles.name} data-anim>
            Yopa <span className={styles.nameAccent}>Pitra R.</span>
          </h1>
        </div>

        {/* Big Center Avatar */}
        <div ref={avatarRef} className={styles.avatarWrapper}>
          <div className={styles.avatarGlow} />
          
          <div className={styles.imageContainer}>
            <Image
              src={imgSrc}
              alt="Yopa Pitra R."
              width={480}
              height={580}
              priority
              className={styles.avatarImg}
              onError={() => {
                const fallback = personal?.fallbackAvatar || "/images/yopa.jpeg";
                if (imgSrc !== fallback) {
                  setImgSrc(fallback);
                }
              }}
            />
          </div>
        </div>

        {/* Bottom Details & Actions */}
        <div className={styles.bottomContent}>
         

          <div className={styles.actions} data-anim>
            <a href="#services" className={styles.btnPrimary}>
              Lihat Portfolio <span className={styles.arrow}>↗</span>
            </a>
            <a href="#experience" className={styles.btnSecondary}>
              Riwayat Pengalaman
            </a>
          </div>

         
        </div>
      </div>

      {/* Scroll down button */}
      <a href="#about" className={styles.scrollDown} aria-label="Scroll down">
        <span className={styles.scrollText}>SCROLL</span>
        <span className={styles.scrollArrow}>↓</span>
      </a>
    </section>
  );
}