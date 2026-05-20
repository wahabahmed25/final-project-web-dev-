import RecommendationForm from "@/components/RecommendationForm";
import Link from "next/link";

export default function AddRecommendationPage() {
  return (
    <div style={{ minHeight: "calc(100vh - 4rem)", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Back */}
        <Link
          href="/recommendations"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.375rem",
            fontSize: "0.875rem",
            fontWeight: 600,
            color: "var(--hunter-purple)",
            textDecoration: "none",
            marginBottom: "1.5rem",
          }}
        >
          ← Back to recommendations
        </Link>

        {/* Header */}
        <div style={{ marginBottom: "2rem" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.75rem",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "var(--hunter-gold-dark)",
              marginBottom: "0.375rem",
            }}
          >
            ✦ Share with the community
          </span>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(2rem, 5vw, 2.75rem)",
              color: "var(--foreground)",
              margin: "0 0 0.5rem",
            }}
          >
            Add a Recommendation
          </h1>
          <p style={{ fontSize: "0.9375rem", color: "var(--text-muted)", lineHeight: 1.7 }}>
            Know a great study spot, meal, or resource? Tell your fellow students about it.
          </p>
        </div>

        {/* Tips */}
        <div
          style={{
            background: "var(--hunter-purple-faint)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "1.25rem 1.5rem",
            marginBottom: "1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "0.875rem",
          }}
        >
          {[
            { icon: "🎯", tip: "Be specific — a precise location helps." },
            { icon: "⭐", tip: "Honest ratings are more useful than perfect ones." },
            { icon: "🏷️", tip: "Tags help others discover your pick." },
          ].map((item) => (
            <div key={item.icon} style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
              <span style={{ fontSize: "1rem", flexShrink: 0, marginTop: "1px" }}>{item.icon}</span>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", lineHeight: 1.55 }}>{item.tip}</span>
            </div>
          ))}
        </div>

        <RecommendationForm />
      </div>
    </div>
  );
}