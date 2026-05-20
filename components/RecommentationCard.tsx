import Link from "next/link";
import { getCategoryLabel, getCategoryIcon, getCategoryAccent } from "@/data/categories";
import type { Recommendation } from "@/types/recommendation";

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "1px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{
            fontSize: "0.7rem",
            color: n <= rating ? "var(--hunter-gold)" : "var(--border)",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function RecommendationCard({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  const accent = getCategoryAccent(recommendation.category);
  const icon = getCategoryIcon(recommendation.category);

  return (
    <Link
      href={`/recommendation/${recommendation.id}`}
      className="card card-hover"
      style={{
        display: "block",
        padding: "1.25rem",
        textDecoration: "none",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.3rem" }}>
            <span style={{ fontSize: "0.8rem" }}>{icon}</span>
            <span
              style={{
                fontSize: "0.7rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color: accent,
              }}
            >
              {getCategoryLabel(recommendation.category)}
            </span>
          </div>
          <h3
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "1.0625rem",
              color: "var(--foreground)",
              lineHeight: 1.3,
            }}
            className="line-clamp-2"
          >
            {recommendation.title}
          </h3>
        </div>

        {/* Rating badge */}
        <div
          className="rating-badge"
          style={{
            flexShrink: 0,
            background: "var(--hunter-gold-light)",
            border: "1px solid rgba(238,177,17,0.25)",
            borderRadius: "100px",
            padding: "0.2rem 0.625rem",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--hunter-gold-dark)" }}>
            {recommendation.rating}
          </span>
          <span style={{ fontSize: "0.65rem", color: "var(--hunter-gold)" }}>★</span>
        </div>
      </div>

      {/* Stars */}
      <div style={{ marginTop: "0.5rem" }}>
        <StarRating rating={recommendation.rating} />
      </div>

      {/* Description */}
      <p
        className="line-clamp-2"
        style={{
          marginTop: "0.625rem",
          fontSize: "0.8375rem",
          color: "var(--text-muted)",
          lineHeight: 1.6,
        }}
      >
        {recommendation.description}
      </p>

      {/* Location */}
      <p
        style={{
          marginTop: "0.625rem",
          fontSize: "0.8rem",
          color: "var(--text-faint)",
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
        }}
      >
        <span>📍</span>
        {recommendation.location}
      </p>

      {/* Tags */}
      {recommendation.tags.length > 0 && (
        <div style={{ marginTop: "0.75rem", display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {recommendation.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                padding: "0.2rem 0.625rem",
                borderRadius: "100px",
                fontSize: "0.7rem",
                fontWeight: 500,
                background: "var(--hunter-purple-faint)",
                color: "var(--hunter-purple)",
                border: "1px solid var(--border-light)",
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: "1rem",
          paddingTop: "0.75rem",
          borderTop: "1px solid var(--border-light)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
          by {recommendation.createdByName}
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "var(--hunter-purple)",
            display: "flex",
            alignItems: "center",
            gap: "0.25rem",
          }}
        >
          ▲ {recommendation.upvotes}
        </span>
      </div>
    </Link>
  );
}