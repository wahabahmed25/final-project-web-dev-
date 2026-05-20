import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "2.5rem 1.5rem",
        marginTop: "auto",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
          }}
        >
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "1.25rem" }}>🐝</span>
              <span
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1.1rem",
                  color: "var(--hunter-purple)",
                }}
              >
                Hunter Hub
              </span>
            </div>
            <p style={{ fontSize: "0.825rem", color: "var(--text-muted)", margin: 0, lineHeight: 1.6 }}>
              A student-built recommendations hub for the Hunter College community.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--text-faint)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              Explore
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { href: "/recommendations", label: "Browse All" },
                { href: "/recommendations/study-spots", label: "Study Spots" },
                { href: "/recommendations/food", label: "Food" },
                { href: "/recommendations/coffee", label: "Coffee" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: "0.875rem", color: "var(--text-muted)", textDecoration: "none" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Account */}
          <div>
            <p
              style={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "var(--text-faint)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: "0.75rem",
              }}
            >
              Account
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {[
                { href: "/login", label: "Login" },
                { href: "/dashboard", label: "My Dashboard" },
                { href: "/add-recommendation", label: "Add Recommendation" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{ fontSize: "0.875rem", color: "var(--text-muted)", textDecoration: "none" }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop: "2rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--border-light)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <p style={{ fontSize: "0.8rem", color: "var(--text-faint)", margin: 0 }}>
            © {year} Hunter Recommendations Hub · Built by Hunter students
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--hunter-purple)",
              }}
            />
            <span
              style={{
                display: "inline-block",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: "var(--hunter-gold)",
              }}
            />
            <span style={{ fontSize: "0.8rem", color: "var(--text-faint)" }}>CUNY Hunter College</span>
          </div>
        </div>
      </div>
    </footer>
  );
}