"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 nav-surface">
      {/* Pushpin decorations */}
      <svg className="absolute left-2 top-1/2 -translate-y-1/2 hidden sm:block" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <circle cx="7" cy="7" r="6" fill="#f43f5e" opacity="0.75"/>
        <circle cx="5.5" cy="5.5" r="2" fill="rgba(255,200,200,0.7)"/>
        <line x1="7" y1="13" x2="7" y2="18" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <svg className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:block" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
        <circle cx="7" cy="7" r="6" fill="#3b82f6" opacity="0.72"/>
        <circle cx="5.5" cy="5.5" r="2" fill="rgba(180,210,255,0.7)"/>
        <line x1="7" y1="13" x2="7" y2="18" stroke="#9ca3af" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo sticker */}
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="sticky-note note-lavender rounded-full px-4 py-1.5 font-fun text-base font-bold tracking-tight transition-all"
            style={{ color: "var(--purple)" }}
          >
            🏫 Hunter Hub
          </span>
        </Link>

        <div className="flex items-center gap-3 text-sm">
          <Link href="/recommendations" className="nav-tab nav-tab-browse">
            📚 Browse
          </Link>

          <Link href="/add-recommendation" className="nav-tab nav-tab-add">
            ✏️ Add
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="theme-pill"
          >
            {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
          </button>

          {loading ? (
            <span style={{ color: "var(--fg-muted)" }} className="text-sm">
              Loading...
            </span>
          ) : user ? (
            <button onClick={logout} className="btn-purple">
              Logout
            </button>
          ) : (
            <Link href="/login" className="btn-purple">
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
