"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      type="button"
      suppressHydrationWarning
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        padding: "0.375rem 0.75rem",
        borderRadius: "100px",
        border: "1.5px solid var(--border)",
        background: "var(--surface)",
        color: "var(--text-muted)",
        fontSize: "0.8rem",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--hunter-purple)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--hunter-purple)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
        (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
      }}
    >
      <span suppressHydrationWarning>
        {resolvedTheme === "dark" ? "☀️" : "🌙"}
      </span>
      <span suppressHydrationWarning>
        {resolvedTheme === "dark" ? "Light" : "Dark"}
      </span>
    </button>
  );
}