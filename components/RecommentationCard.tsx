import Link from "next/link";
import { getCategoryLabel, getCategoryIcon, getCategoryAccent } from "@/data/categories";
import type { Recommendation } from "@/types/recommendation";

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

function StarRating({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "1px", alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ fontSize: "0.7rem", color: n <= rating ? "var(--hunter-gold)" : "var(--border)" }}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function RecommendationCard({
  recommendation,
  rank,
}: {
  recommendation: Recommendation;
  rank?: number;
}) {
  const accent = getCategoryAccent(recommendation.category);
  const icon = getCategoryIcon(recommendation.category);
  const isTop = rank === 1;
  const isTorn = (recommendation.downvotes ?? 0) >= 3 ||
    ((recommendation.downvotes ?? 0) - recommendation.upvotes >= 2 && (recommendation.downvotes ?? 0) >= 2);

  const cardClasses = [
    "card card-hover",
    isTop ? "card-golden" : "",
    isTorn ? "card-torn" : "",
  ].filter(Boolean).join(" ");

  return (
    <Link
      href={`/recommendation/${recommendation.id}`}
      className={cardClasses}
      style={{ display: "block", padding: "1.25rem", textDecoration: "none", position: "relative" }}
    >
      {/* Rank badge */}
      {rank !== undefined && rank <= 3 && (
        <div className={`rank-badge rank-${rank}`} title={`Rank #${rank}`}>
          {RANK_MEDALS[rank - 1]}
        </div>
      )}

      {/* "New" badge for no-rank cards */}
      {isTop && (
        <div
          style={{
            position: "absolute", top: "-10px", right: "-8px",
            background: "linear-gradient(135deg,#ffd700,#f59e0b)",
            color: "#5C2D8B", fontSize: "0.65rem", fontWeight: 800,
            padding: "0.2rem 0.55rem", borderRadius: "100px",
            boxShadow: "0 2px 8px rgba(238,177,17,0.45)",
            letterSpacing: "0.04em", zIndex: 10,
            fontFamily: "var(--font-caveat), cursive",
          }}
        >
          🏆 Top Pick
        </div>
      )}


      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.75rem" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.3rem" }}>
            <span style={{ fontSize: "0.8rem" }}>{icon}</span>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: accent }}>
              {getCategoryLabel(recommendation.category)}
            </span>
          </div>
          <h3
            className="line-clamp-2"
            style={{
              fontFamily: "var(--font-caveat), 'DM Serif Display', serif",
              fontSize: "1.15rem",
              color: "var(--foreground)",
              lineHeight: 1.3,
              margin: 0,
            }}
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
            display: "flex", alignItems: "center", gap: "0.3rem",
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
        style={{ marginTop: "0.625rem", fontSize: "0.8375rem", color: "var(--text-muted)", lineHeight: 1.6 }}
      >
        {recommendation.description}
      </p>

      {/* Location — links to Google Maps */}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(recommendation.location + " Hunter College New York")}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={(e) => e.stopPropagation()}
        style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--text-faint)", display: "flex", alignItems: "center", gap: "0.25rem", textDecoration: "none" }}
      >
        <span>📍</span>
        <span style={{ textDecoration: "underline", textDecorationStyle: "dotted" }}>{recommendation.location}</span>
      </a>

      {/* Tags */}
      {recommendation.tags.length > 0 && (
        <div style={{ marginTop: "0.625rem", display: "flex", flexWrap: "wrap", gap: "0.375rem" }}>
          {recommendation.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              style={{
                padding: "0.2rem 0.625rem", borderRadius: "100px",
                fontSize: "0.7rem", fontWeight: 500,
                background: "var(--hunter-purple-faint)", color: "var(--hunter-purple)",
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
          marginTop: "1rem", paddingTop: "0.75rem",
          borderTop: "1px solid var(--border-light)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}
      >
        <span style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>
          by {recommendation.createdByName}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {isTorn && (
            <span style={{
              background: "rgba(239,68,68,0.12)", color: "#ef4444",
              fontSize: "0.65rem", fontWeight: 700,
              padding: "0.15rem 0.5rem", borderRadius: "100px",
              border: "1px solid rgba(239,68,68,0.30)",
            }}>
              😬 Rough
            </span>
          )}
          <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--hunter-purple)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            ▲ {recommendation.upvotes}
          </span>
          {(recommendation.downvotes ?? 0) > 0 && (
            <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#ef4444", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              ▼ {recommendation.downvotes}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
