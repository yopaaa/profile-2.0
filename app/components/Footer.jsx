"use client";

import styles from "./styles/Footer.module.css";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <span className={styles.logo}>yopa</span>
          <p className={styles.tagline}>
            Building things for the web.<br />
            Bangka, Indonesia · hello@yopaaa.dev
          </p>
        </div>

        <div className={styles.links}>
          <a href="#about" className={styles.link}>About</a>
          <a href="#articles" className={styles.link}>Writing</a>
          <a href="#services" className={styles.link}>Work</a>
          <a href="mailto:hello@yopaaa.dev" className={styles.link}>Contact</a>
        </div>
      </div>

      <div className={styles.bottom}>
        <span className={styles.copy}>
          © 2025 Yopa Pitra R.
        </span>
        <button className={styles.toTop} onClick={scrollToTop} aria-label="Scroll to top">
          ↑
        </button>
      </div>
    </footer>
  );
}