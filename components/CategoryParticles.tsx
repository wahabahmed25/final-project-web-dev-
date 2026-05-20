"use client";
import { useEffect, useRef } from "react";

const CATEGORY_SYMBOLS: Record<string, string[]> = {
  coffee:             ["☕", "🫘", "☕", "🫘", "☕", "🫘"],
  bookstores:         ["📚", "📖", "📕", "📗", "📘", "📖"],
  "study-spots":      ["💤", "Zzz", "A+", "😴", "Zzz", "A+"],
  "school-resources": ["✏️", "📏", "📐", "🖊️", "📏", "✏️"],
  food:               ["🍴", "🍕", "🥢", "🍔", "🌮", "🍜"],
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

      // Random position across the full viewport (% within the fixed container)
      const x = 3 + Math.random() * 94;       // 3–97% horizontal
      const startY = 65 + Math.random() * 30; // 65–95% vertical (lower screen)
      const size = 18 + Math.random() * 20;
      const rot = (Math.random() - 0.5) * 45;
      const dur = 2400 + Math.random() * 1200;

      el.textContent = symbol;
      el.style.cssText = `
        position: absolute;
        left: ${x}%;
        top: ${startY}%;
        font-size: ${size}px;
        line-height: 1;
        pointer-events: none;
        user-select: none;
        --rot: ${rot}deg;
        animation: cat-float ${dur}ms ease-out forwards;
      `;
      pool.appendChild(el);
      setTimeout(() => el.remove(), dur + 60);
    }

    // Scatter initial burst
    for (let i = 0; i < 5; i++) setTimeout(spawn, i * 300);

    const iv = setInterval(spawn, 1300);
    return () => clearInterval(iv);
  }, [category]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: 5000,
        overflow: "hidden",
      }}
      aria-hidden
    />
  );
}
