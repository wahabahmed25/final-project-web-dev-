"use client";
import { useEffect, useRef } from "react";

const CATEGORY_SYMBOLS: Record<string, string[]> = {
  coffee:            ["☕", "🫘", "☕", "🫘", "☕", "🫘", "✨"],
  bookstores:        ["📚", "📖", "📕", "📗", "📘", "📖", "📚"],
  "study-spots":     ["💤", "Zzz", "A+", "😴", "Zzz", "A+", "💤"],
  "school-resources":["✏️", "📏", "✏️", "📐", "🖊️", "📏", "✏️"],
  food:              ["🍴", "🍕", "🥢", "🍔", "🌮", "🍴", "🍜"],
};

export default function CategoryParticles({ category }: { category: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pool = containerRef.current;
    if (!pool) return;

    const symbols = CATEGORY_SYMBOLS[category];
    if (!symbols || symbols.length === 0) return;

    function spawn() {
      if (!pool) return;
      const el = document.createElement("span");
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const x = 5 + Math.random() * 90; // % across viewport
      const startY = 60 + Math.random() * 35; // % down viewport (lower third-ish)
      const size = 15 + Math.random() * 18;
      const rot = (Math.random() - 0.5) * 40;
      const duration = 2200 + Math.random() * 1200;

      el.textContent = symbol;
      el.style.cssText = `
        position: fixed;
        left: ${x}vw;
        top: ${startY}vh;
        font-size: ${size}px;
        pointer-events: none;
        user-select: none;
        z-index: 9;
        --rot: ${rot}deg;
        animation: cat-float ${duration}ms ease-out forwards;
      `;
      pool.appendChild(el);
      setTimeout(() => el.remove(), duration + 50);
    }

    // Scatter a few staggered initial particles
    for (let i = 0; i < 4; i++) setTimeout(spawn, i * 350);

    const iv = setInterval(spawn, 1400);
    return () => clearInterval(iv);
  }, [category]);

  return (
    <div
      ref={containerRef}
      style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9 }}
      aria-hidden
    />
  );
}
