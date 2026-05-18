"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 nav-surface">
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
