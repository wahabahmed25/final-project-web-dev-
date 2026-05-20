import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/data/categories";
import ThemeToggle from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero-bg" style={{ padding: "5rem 1.5rem 4rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>

          {/* Theme toggle — top right */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "1rem" }}>
            <ThemeToggle />
          </div>

          <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
            {/* Badge */}
            <div className="fade-up" style={{ marginBottom: "1.5rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.35rem 1rem",
                  background: "var(--hunter-purple-faint)",
                  border: "1px solid var(--border)",
                  borderRadius: "100px",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  color: "var(--hunter-purple)",
                  letterSpacing: "0.02em",
                }}
              >
                Built for Hunter students
              </span>
            </div>

            <h1
              className="fade-up-1"
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(2.5rem, 6vw, 4rem)",
                color: "var(--foreground)",
                marginBottom: "1.25rem",
                lineHeight: 1.15,
              }}
            >
              Your guide to the
              <span
                style={{
                  display: "block",
                  background: "linear-gradient(135deg, var(--hunter-purple) 0%, #8B4DB8 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                best of Hunter
              </span>
            </h1>

            <p
              className="fade-up-2"
              style={{
                fontSize: "1.0625rem",
                color: "var(--text-muted)",
                lineHeight: 1.7,
                maxWidth: 580,
                margin: "0 auto 2rem",
              }}
            >
              Student-curated recommendations for study spots, food, coffee,
              bookstores, and campus resources. No endless scrolling, just
              clear, helpful picks.
            </p>

            <div
              className="fade-up-3"
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "0.75rem",
              }}
            >
              <Link href="/recommendations" className="btn btn-purple" style={{ padding: "0.75rem 1.75rem", fontSize: "0.9375rem" }}>
                Browse Recommendations
              </Link>
              <Link href="/add-recommendation" className="btn btn-outline" style={{ padding: "0.75rem 1.75rem", fontSize: "0.9375rem" }}>
                Add a Recommendation
              </Link>
            </div>
          </div>

          {/* Stats bar */}
          <div
            className="fade-up-4"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "1px",
              background: "var(--border)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-xl)",
              overflow: "hidden",
              marginTop: "3.5rem",
              maxWidth: 600,
              marginInline: "auto",
            }}
          >
            {[
              { number: "5",     label: "Categories" },
              { number: "100%",  label: "Student-made" },
              { number: "Free",  label: "Always" },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{ background: "var(--surface)", padding: "1.25rem 1rem", textAlign: "center" }}
              >
                <p style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", color: "var(--hunter-purple)", margin: "0 0 0.2rem" }}>
                  {stat.number}
                </p>
                <p style={{ fontSize: "0.775rem", color: "var(--text-faint)", margin: 0, fontWeight: 500 }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ──────────────────────────────────────── */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: "2rem" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--hunter-gold-dark)",
                marginBottom: "0.5rem",
              }}
            >
              ✦ Browse by category
            </span>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                color: "var(--foreground)",
              }}
            >
              What are you looking for?
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: "1rem",
            }}
          >
            {categories.map((category, i) => (
              <CategoryCard key={category.value} category={category} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section
        style={{
          padding: "4rem 1.5rem",
          background: "var(--hunter-purple-faint)",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3rem" }}>
            <span
              style={{
                display: "inline-block",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--hunter-purple)",
                marginBottom: "0.5rem",
              }}
            >
              How it works
            </span>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                color: "var(--foreground)",
              }}
            >
              Simple as 1 - 2 - 3
            </h2>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {[
              { number: "01", title: "Pick a category",  desc: "Choose study spots, food, coffee, bookstores, or school resources.", icon: "🗂️" },
              { number: "02", title: "Compare options",  desc: "Read descriptions, ratings, tags, and locations from fellow students.", icon: "⭐" },
              { number: "03", title: "Share your own",   desc: "Log in with Google and add your own helpful recommendations.", icon: "✏️" },
            ].map((step) => (
              <div key={step.number} className="card" style={{ padding: "1.75rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.5rem", color: "var(--hunter-gold)", lineHeight: 1 }}>
                    {step.number}
                  </span>
                  <span style={{ fontSize: "1.5rem" }}>{step.icon}</span>
                </div>
                <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.1rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.65 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section style={{ padding: "4rem 1.5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div
            style={{
              background: "linear-gradient(135deg, var(--hunter-purple) 0%, var(--hunter-purple-dark) 100%)",
              borderRadius: "var(--radius-2xl)",
              padding: "3rem 2rem",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div style={{ position: "absolute", top: "-3rem", right: "-3rem", width: "12rem", height: "12rem", borderRadius: "50%", background: "rgba(238,177,17,0.15)" }} />
            <div style={{ position: "absolute", bottom: "-2rem", left: "-2rem", width: "8rem", height: "8rem", borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />

            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                color: "#fff",
                marginBottom: "1rem",
                position: "relative",
              }}
            >
              Know a great spot near Hunter?
            </h2>
            <p
              style={{
                fontSize: "1rem",
                color: "rgba(255,255,255,0.75)",
                maxWidth: 480,
                margin: "0 auto 2rem",
                lineHeight: 1.7,
                position: "relative",
              }}
            >
              Help your fellow students by sharing your favorite places and resources. It only takes a minute.
            </p>
            <Link
              href="/add-recommendation"
              className="btn btn-gold"
              style={{ padding: "0.8rem 2rem", fontSize: "0.9375rem", position: "relative" }}
            >
              Add a Recommendation →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}