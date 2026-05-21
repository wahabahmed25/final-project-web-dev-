"use client";
import { useEffect, useRef } from "react";

const SYMBOLS = ["✦", "✧", "★", "·", "◦", "•", "✦"];
const COLORS = ["#5C2D8B", "#EEB111", "#9333ea", "#a78bfa", "#fbbf24", "#C07EFF", "#f59e0b"];

export default function CursorParticles() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pool = containerRef.current;
    if (!pool) return;

    // pool is now guaranteed non-null for the lifetime of this effect
    const safePool: HTMLDivElement = pool;

    let last = 0;

    function spawn(x: number, y: number) {
      const el = document.createElement("span");
      const symbol = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
      const color  = COLORS[Math.floor(Math.random() * COLORS.length)];
      const size   = 9 + Math.random() * 13;
      const dx     = (Math.random() - 0.5) * 52;

      el.textContent = symbol;
      el.style.cssText = `
        position:fixed;
        left:${x}px;
        top:${y}px;
        color:${color};
        font-size:${size}px;
        pointer-events:none;
        user-select:none;
        transform:translate(-50%,-50%);
        z-index:99999;
        --dx:${dx}px;
        animation:cursor-spark 0.85s ease-out forwards;
      `;
      safePool.appendChild(el);
      setTimeout(() => el.remove(), 900);
    }

    function onMove(e: MouseEvent) {
      const now = Date.now();
      if (now - last < 80) return;
      last = now;
      spawn(e.clientX, e.clientY);
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99999 }}
      aria-hidden
    />
  );
}