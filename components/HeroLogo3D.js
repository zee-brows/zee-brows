"use client";

import { useEffect, useRef, useState } from "react";

export default function HeroLogo3D({ src = "/assets/zee-brows-official-logo-cutout.webp" }) {
  const shellRef = useRef(null);
  const [engaged, setEngaged] = useState(false);
  const [dragging, setDragging] = useState(false);
  const maskStyle = { maskImage: `url("${src}")`, WebkitMaskImage: `url("${src}")` };
  const motionRef = useRef({
    currentX: -7,
    currentY: 18,
    currentZ: 0,
    targetX: -7,
    targetY: 18,
    targetZ: 0,
    autoY: 18,
    dragging: false,
    interactive: true,
    dragStartX: 0,
    dragStartY: 0,
    dragBaseX: -7,
    dragBaseY: 18
  });

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell || typeof window === "undefined") return undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const state = motionRef.current;
    state.interactive = !coarsePointer && !reduceMotion;

    if (reduceMotion) {
      shell.style.setProperty("--logo-rx", "-4deg");
      shell.style.setProperty("--logo-ry", "12deg");
      shell.style.setProperty("--logo-rz", "0deg");
      return undefined;
    }

    let frame = 0;
    const animate = () => {
      if (!state.dragging) {
        state.autoY += coarsePointer ? 0.035 : 0.055;
        if (!state.interactive || !engaged) {
          state.targetY = state.autoY;
          state.targetX = -7 + Math.sin(state.autoY * 0.018) * 5;
          state.targetZ = Math.sin(state.autoY * 0.012) * 2;
        }
      }

      state.currentX += (state.targetX - state.currentX) * 0.085;
      state.currentY += (state.targetY - state.currentY) * 0.085;
      state.currentZ += (state.targetZ - state.currentZ) * 0.075;

      shell.style.setProperty("--logo-rx", `${state.currentX.toFixed(2)}deg`);
      shell.style.setProperty("--logo-ry", `${state.currentY.toFixed(2)}deg`);
      shell.style.setProperty("--logo-rz", `${state.currentZ.toFixed(2)}deg`);
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, [engaged]);

  const moveFromPointer = (event) => {
    const shell = shellRef.current;
    const state = motionRef.current;
    if (!shell || !state.interactive || state.dragging) return;

    const rect = shell.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    state.targetY = state.autoY + x * 42;
    state.targetX = -8 - y * 26;
    state.targetZ = x * -5;
  };

  const startDrag = (event) => {
    const state = motionRef.current;
    if (!state.interactive) return;
    state.dragging = true;
    state.dragStartX = event.clientX;
    state.dragStartY = event.clientY;
    state.dragBaseX = state.targetX;
    state.dragBaseY = state.targetY;
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const drag = (event) => {
    const state = motionRef.current;
    if (!state.interactive || !state.dragging) return;
    state.targetY = state.dragBaseY + (event.clientX - state.dragStartX) * 0.62;
    state.targetX = state.dragBaseX - (event.clientY - state.dragStartY) * 0.38;
    state.targetZ = Math.max(-8, Math.min(8, (event.clientX - state.dragStartX) * -0.035));
  };

  const endDrag = (event) => {
    const state = motionRef.current;
    if (!state.dragging) return;
    state.dragging = false;
    state.autoY = state.targetY;
    setDragging(false);
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  return (
    <div
      className={`hero-logo-3d ${engaged ? "is-engaged" : ""} ${dragging ? "is-dragging" : ""}`}
      ref={shellRef}
      onPointerEnter={() => setEngaged(true)}
      onPointerLeave={() => setEngaged(false)}
      onPointerMove={moveFromPointer}
      onPointerDown={startDrag}
      onPointerMoveCapture={drag}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      role="img"
      aria-label="Interactive 3D Zee Brows logo"
    >
      <div className="hero-logo-aura" aria-hidden="true" />
      <div className="hero-logo-stage">
        <div className="hero-logo-stack">
          {Array.from({ length: 14 }).map((_, index) => (
            <img
              className="hero-logo-depth"
              src={src}
              alt=""
              aria-hidden="true"
              style={{ "--depth": index }}
              key={index}
            />
          ))}
          <img className="hero-logo-face" src={src} alt="Zee Brows official logo" draggable="false" />
          <span className="hero-logo-metal" style={maskStyle} aria-hidden="true" />
          <span className="hero-logo-shine" style={maskStyle} aria-hidden="true" />
        </div>
        <span className="hero-logo-shadow" aria-hidden="true" />
        <span className="hero-logo-reflection" aria-hidden="true">
          <img src={src} alt="" aria-hidden="true" />
        </span>
      </div>
      <div className="hero-logo-rings" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
