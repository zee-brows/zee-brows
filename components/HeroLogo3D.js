"use client";

import { useEffect, useRef, useState } from "react";

const FALLBACK_LOGO = "/assets/logo-3d.png";

export default function HeroLogo3D({ src = "/assets/zee-brows-official-logo-cutout.webp" }) {
  const shellRef = useRef(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: -8, y: 18, z: 0 });
  const [logoSrc, setLogoSrc] = useState(src || FALLBACK_LOGO);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLogoSrc(src || FALLBACK_LOGO);
  }, [src]);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || typeof window === "undefined") return undefined;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    let frame = 0;
    let idle = 18;

    const animate = () => {
      if (!reduced) idle += coarse ? 0.045 : 0.07;
      const nextY = idle + target.current.x * (coarse ? 0 : 32);
      const nextX = -8 - target.current.y * (coarse ? 0 : 18);
      const nextZ = target.current.x * (coarse ? 0 : -4);

      current.current.x += (nextX - current.current.x) * 0.08;
      current.current.y += (nextY - current.current.y) * 0.08;
      current.current.z += (nextZ - current.current.z) * 0.08;

      shell.style.setProperty("--logo-tilt-x", `${current.current.x.toFixed(2)}deg`);
      shell.style.setProperty("--logo-tilt-y", `${current.current.y.toFixed(2)}deg`);
      shell.style.setProperty("--logo-tilt-z", `${current.current.z.toFixed(2)}deg`);
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  const onPointerMove = (event) => {
    const shell = shellRef.current;
    if (!shell || window.matchMedia("(pointer: coarse)").matches) return;
    const rect = shell.getBoundingClientRect();
    target.current.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    target.current.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
  };

  const resetPointer = () => {
    target.current.x = 0;
    target.current.y = 0;
  };

  return (
    <div
      className={`hero-logo-3d hero-logo-showroom hero-logo-visible ${ready ? "is-ready" : ""}`}
      ref={shellRef}
      onPointerMove={onPointerMove}
      onPointerLeave={resetPointer}
      role="img"
      aria-label="Premium Zee Brows logo sculpture"
    >
      <div className="logo-showroom-light" aria-hidden="true" />
      <div className="logo-sculpture">
        {Array.from({ length: 16 }).map((_, index) => (
          <img
            src={logoSrc}
            className="logo-depth-layer"
            style={{ "--layer": index }}
            alt=""
            aria-hidden="true"
            onError={() => setLogoSrc(FALLBACK_LOGO)}
            key={index}
          />
        ))}
        <img
          src={logoSrc}
          className="logo-main-face"
          alt="Zee Brows official logo"
          draggable="false"
          onLoad={() => setReady(true)}
          onError={() => setLogoSrc(FALLBACK_LOGO)}
        />
        <span className="logo-metal-sheen" aria-hidden="true" />
        <span className="logo-gold-edge" aria-hidden="true" />
      </div>
      <span className="logo-floor-shadow" aria-hidden="true" />
      <span className="logo-reflection" aria-hidden="true">
        <img src={logoSrc} alt="" aria-hidden="true" />
      </span>
    </div>
  );
}
