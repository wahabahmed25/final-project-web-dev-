"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import ThemeToggle from "@/components/theme-toggle";

export default function Navbar() {
  const { user, loading, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/recommendations", label: "Browse" },
    { href: "/add-recommendation", label: "Add" },
    ...(user ? [{ href: "/dashboard", label: "Dashboard" }] : []),
  ];

  return (
    <>
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          borderBottom: "1px solid var(--border)",
          /* Use surface variable instead of hardcoded white */
          background: "color-mix(in srgb, var(--surface) 92%, transparent)",
          backdropFilter: "blur(16px)",
        }}
      >
        <nav
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 1.5rem",
            height: "4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <Link
            href="/"
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.625rem" }}
          >
            <span
              style={{
                width: "2rem",
                height: "2rem",
                borderRadius: "8px",
                background: "var(--hunter-purple)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1rem",
                flexShrink: 0,
              }}
            >
              
            </span>
            <span
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.1rem",
                color: "var(--hunter-purple)",
                lineHeight: 1,
              }}
            >
              Hunter Hub
            </span>
          </Link>

          {/* Desktop nav */}
          <div
            className="nav-desktop"
            style={{ display: "none", alignItems: "center", gap: "0.25rem" }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "0.4rem 0.875rem",
                  borderRadius: "100px",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  textDecoration: "none",
                  transition: "color 0.15s, background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--hunter-purple)";
                  (e.currentTarget as HTMLAnchorElement).style.background = "var(--hunter-purple-faint)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--text-muted)";
                  (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
                }}
              >
                {link.label}
              </Link>
            ))}

            <div style={{ width: "1px", height: "1.25rem", background: "var(--border)", margin: "0 0.5rem" }} />

            {/* Theme toggle */}
            <ThemeToggle />

            <div style={{ width: "1px", height: "1.25rem", background: "var(--border)", margin: "0 0.5rem" }} />

            {loading ? (
              <span style={{ fontSize: "0.875rem", color: "var(--text-faint)" }}>...</span>
            ) : user ? (
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span
                  style={{
                    width: "2rem",
                    height: "2rem",
                    borderRadius: "50%",
                    background: "var(--hunter-purple-light)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "0.8rem",
                    fontWeight: 700,
                    color: "var(--hunter-purple)",
                  }}
                >
                  {(user.displayName || user.email || "U")[0].toUpperCase()}
                </span>
                <button
                  onClick={logout}
                  className="btn btn-outline"
                  style={{ padding: "0.4rem 1rem", fontSize: "0.8rem" }}
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link href="/login" className="btn btn-purple" style={{ padding: "0.45rem 1.125rem", fontSize: "0.85rem" }}>
                Login
              </Link>
            )}
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }} className="nav-mobile-btn">
            <ThemeToggle />
            <button
              onClick={() => setMobileOpen((o) => !o)}
              aria-label="Toggle menu"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "0.5rem",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
                width: "2.5rem",
                height: "2.5rem",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ display: "block", width: "20px", height: "2px", background: "var(--hunter-purple)", borderRadius: "2px", transition: "all 0.25s", transform: mobileOpen ? "translateY(7px) rotate(45deg)" : "none" }} />
              <span style={{ display: "block", width: "20px", height: "2px", background: "var(--hunter-purple)", borderRadius: "2px", transition: "all 0.25s", opacity: mobileOpen ? 0 : 1 }} />
              <span style={{ display: "block", width: "20px", height: "2px", background: "var(--hunter-purple)", borderRadius: "2px", transition: "all 0.25s", transform: mobileOpen ? "translateY(-7px) rotate(-45deg)" : "none" }} />
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="mobile-menu"
            style={{
              borderTop: "1px solid var(--border)",
              background: "var(--surface)",
              padding: "1rem 1.5rem 1.5rem",
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "block",
                  padding: "0.75rem 0",
                  fontSize: "1rem",
                  fontWeight: 500,
                  color: "var(--foreground)",
                  textDecoration: "none",
                  borderBottom: "1px solid var(--border-light)",
                }}
              >
                {link.label}
              </Link>
            ))}

            <div style={{ marginTop: "1rem" }}>
              {loading ? null : user ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", margin: 0 }}>
                    Signed in as <strong style={{ color: "var(--foreground)" }}>{user.displayName || user.email}</strong>
                  </p>
                  <button
                    onClick={() => { logout(); setMobileOpen(false); }}
                    className="btn btn-outline"
                    style={{ width: "100%", justifyContent: "center" }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-purple"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  Login with Google
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 767px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .mobile-menu { display: block !important; }
        }
      `}</style>
    </>
  );
}