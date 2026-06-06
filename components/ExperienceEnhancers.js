"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const interactiveSelector = "a, button, .service-card, .project-card, .portfolio-mock, .industry-card, .journey-item, .glass";
const pressSelector = ".btn, button, .service-card, .project-card, .portfolio-mock, .industry-card, .journey-item";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function ExperienceEnhancers() {
  const pathname = usePathname();
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const [cursorActive, setCursorActive] = useState(false);
  const [showCursor, setShowCursor] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const finePointer = window.matchMedia("(pointer: fine)");
    if (!finePointer.matches || window.innerWidth < 900) return;

    setShowCursor(true);
    let frame = 0;
    const move = (event) => {
      mouse.current.x = event.clientX;
      mouse.current.y = event.clientY;
    };
    const animate = () => {
      ring.current.x += (mouse.current.x - ring.current.x) * 0.18;
      ring.current.y += (mouse.current.y - ring.current.y) * 0.18;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ring.current.x}px, ${ring.current.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(animate);
    };

    const enter = (event) => {
      if (event.target.closest(interactiveSelector)) setCursorActive(true);
    };
    const leave = (event) => {
      if (event.target.closest(interactiveSelector)) setCursorActive(false);
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerover", enter);
    document.addEventListener("pointerout", leave);
    frame = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerover", enter);
      document.removeEventListener("pointerout", leave);
    };
  }, []);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const progress = Math.min(window.scrollY / 700, 1);
      document.documentElement.style.setProperty("--scroll-shift", progress.toFixed(3));
      frame = 0;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const pointerDown = (event) => {
      const target = event.target.closest(pressSelector);
      if (!target) return;
      target.classList.add("is-pressing");

      const rect = target.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "tap-ripple";
      ripple.style.left = `${event.clientX - rect.left}px`;
      ripple.style.top = `${event.clientY - rect.top}px`;
      target.appendChild(ripple);
      window.setTimeout(() => ripple.remove(), 520);
    };

    const pointerUp = () => {
      document.querySelectorAll(".is-pressing").forEach((element) => element.classList.remove("is-pressing"));
    };

    const tiltMove = (event) => {
      const card = event.target.closest(".service-card, .project-card, .portfolio-mock, .industry-card, .journey-item");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-x", `${(-y * 8).toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${(x * 10).toFixed(2)}deg`);
      card.style.setProperty("--shine-x", `${((x + 0.5) * 100).toFixed(0)}%`);
      card.style.setProperty("--shine-y", `${((y + 0.5) * 100).toFixed(0)}%`);
    };

    const tiltLeave = (event) => {
      const card = event.target.closest(".service-card, .project-card, .portfolio-mock, .industry-card, .journey-item");
      if (!card) return;
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    };

    document.addEventListener("pointerdown", pointerDown);
    document.addEventListener("pointerup", pointerUp);
    document.addEventListener("pointercancel", pointerUp);
    document.addEventListener("pointermove", tiltMove, { passive: true });
    document.addEventListener("pointerout", tiltLeave);

    return () => {
      document.removeEventListener("pointerdown", pointerDown);
      document.removeEventListener("pointerup", pointerUp);
      document.removeEventListener("pointercancel", pointerUp);
      document.removeEventListener("pointermove", tiltMove);
      document.removeEventListener("pointerout", tiltLeave);
    };
  }, []);

  return (
    <>
      {showCursor ? (
        <>
          <span className={`cursor-dot ${cursorActive ? "is-active" : ""}`} ref={dotRef} />
          <span className={`cursor-ring ${cursorActive ? "is-active" : ""}`} ref={ringRef} />
        </>
      ) : null}
      <AnimatePresence mode="wait">
        <motion.span
          key={pathname}
          className="page-transition-flash"
          initial={{ opacity: 0.55, scaleX: 0 }}
          animate={{ opacity: 0, scaleX: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        />
      </AnimatePresence>
    </>
  );
}
