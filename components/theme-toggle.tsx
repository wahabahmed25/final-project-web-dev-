"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        className="rounded-md border px-3 py-2 text-sm"
        aria-label="Toggle theme"
      >
        Theme
      </button>
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="rounded-md border px-3 py-2 text-sm transition hover:opacity-80"
      aria-label="Toggle theme"
      type="button"
    >
      {currentTheme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}