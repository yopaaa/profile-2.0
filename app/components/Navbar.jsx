"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import styles from "./styles/Navbar.module.css";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Work", href: "#services" },
  { name: "Writing", href: "#articles" },
  { name: "Contact", href: "mailto:hello@yopaaa.dev" },
];

export default function Navbar() {
  const navRef = useRef(null);

  useEffect(() => {
    let lastY = 0;
    const nav = navRef.current;
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > 80) {
        nav.classList.add(styles.scrolled);
      } else {
        nav.classList.remove(styles.scrolled);
      }
      lastY = y;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav ref={navRef} className={styles.nav}>
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