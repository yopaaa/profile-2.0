"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./styles/Navbar.module.css";

const navLinks = [
  { name: "About", href: "/#about" },
  { name: "Experience", href: "/#experience" },
  { name: "Portfolio", href: "/#services" },
  { name: "Contact", href: "mailto:hello@yopaaa.dev" },
];

export default function Navbar() {
  const navRef = useRef(null);
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const nav = navRef.current;
    const handleScroll = () => {
      const y = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(docHeight > 0 ? (y / docHeight) * 100 : 0);

      if (y > 60) {
        nav.classList.add(styles.scrolled);
      } else {
        nav.classList.remove(styles.scrolled);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav ref={navRef} className={styles.nav}>
      {/* Scroll progress bar */}
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${scrollPct}%` }} />
      </div>

      <Link href="/" className={styles.logo}>
        <span className={styles.logoDot} />
        yopa
      </Link>

      <ul className={styles.links}>
        {navLinks.map((l) => (
          <li key={l.name}>
            <Link href={l.href} className={styles.link}>
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}