"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const pressSelector = ".btn, button, .service-card, .project-card, .portfolio-mock, .industry-card, .journey-item";

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function ExperienceEnhancers() {
  const pathname = usePathname();

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
