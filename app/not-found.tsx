import Link from "next/link";

export default function NotFound() {
  return (
    <div
      className="hero-bg"
      style={{
        minHeight: "calc(100vh - 4rem)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
      }}
    >
      <div style={{ maxWidth: 520, textAlign: "center" }}>
        {/* 404 number */}
        <p
          className="fade-up"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(5rem, 15vw, 9rem)",
            color: "var(--hunter-purple-light)",
            lineHeight: 1,
            margin: "0 0 0.5rem",
            userSelect: "none",
          }}
        >
          404
        </p>

        {/* Bee */}
        <div className="fade-up-1" style={{ fontSize: "3rem", marginBottom: "1rem" }}>🐝</div>

        <h1
          className="fade-up-2"
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
            color: "var(--foreground)",
            marginBottom: "0.75rem",
          }}
        >
          Page not found
        </h1>

        <p
          className="fade-up-3"
          style={{
            fontSize: "1rem",
            color: "var(--text-muted)",
            lineHeight: 1.7,
            marginBottom: "2rem",
          }}
        >
          This page seems to have wandered off campus. Let&apos;s get you back to something useful.
        </p>

        <div
          className="fade-up-4"
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "0.75rem" }}
        >
          <Link href="/" className="btn btn-purple" style={{ padding: "0.7rem 1.5rem" }}>
            Back to Home
          </Link>
          <Link href="/recommendations" className="btn btn-outline" style={{ padding: "0.7rem 1.5rem" }}>
            Browse Recommendations
          </Link>
        </div>

        {/* Quick links */}
        <div
          className="fade-up-5"
          style={{
            marginTop: "2.5rem",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "0.5rem 1.5rem",
          }}
        >
          {[
            { href: "/recommendations/study-spots", label: "📚 Study Spots" },
            { href: "/recommendations/food",        label: "🍱 Food" },
            { href: "/recommendations/coffee",      label: "☕ Coffee" },
            { href: "/recommendations/bookstores",  label: "📖 Bookstores" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontSize: "0.875rem",
                color: "var(--hunter-purple)",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}