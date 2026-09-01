"use client";

import { useEffect, useRef } from "react";
import styles from "./styles/Cursor.module.css";

export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let raf;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const tick = () => {
      ringX = lerp(ringX, mouseX, 0.12);
      ringY = lerp(ringY, mouseY, 0.12);
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      raf = requestAnimationFrame(tick);
    };

    const onEnterLink = () => {
      ring.classList.add(styles.hover);
      dot.classList.add(styles.hover);
    };

    const onLeaveLink = () => {
      ring.classList.remove(styles.hover);
      dot.classList.remove(styles.hover);
    };

    window.addEventListener("mousemove", onMove);
    raf = requestAnimationFrame(tick);

    // Track hover on interactive elements
    const addListeners = () => {
      document.querySelectorAll("a, button, [role='button'], input, textarea, select").forEach((el) => {
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
      });
    };

    addListeners();

    // Re-apply on DOM changes
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className={styles.dot} />
      <div ref={ringRef} className={styles.ring} />
    </>
  );
}
