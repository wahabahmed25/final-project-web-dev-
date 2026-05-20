"use client";
import Link from "next/link";
import { getCategoryLabel, getCategoryIcon, getCategoryAccent } from "@/data/categories";
import type { Recommendation } from "@/types/recommendation";

function StarDisplay({ rating }: { rating: number }) {
  return (
    <span>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ color: n <= rating ? "var(--hunter-gold)" : "var(--border)", fontSize: "1rem" }}>★</span>
      ))}
    </span>
  );
}

export default function ShuffleModal({
  recommendation,
  onClose,
  onShuffle,
}: {
  recommendation: Recommendation;
  onClose: () => void;
  onShuffle: () => void;
}) {
  const accent = getCategoryAccent(recommendation.category);
  const icon = getCategoryIcon(recommendation.category);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 9000,
        background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1.5rem",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          border: "2px solid var(--hunter-purple)",
          borderRadius: "var(--radius-xl)",
          padding: "2rem",
          maxWidth: 420, width: "100%",
          boxShadow: "0 0 60px rgba(92,45,139,0.40), 0 24px 48px rgba(0,0,0,0.30)",
          position: "relative",
          animation: "shuffle-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) both",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          style={{
            position: "absolute", top: "1rem", right: "1rem",
            background: "var(--surface-2)", border: "1px solid var(--border)",
            borderRadius: "50%", width: "2rem", height: "2rem",
            cursor: "pointer", fontSize: "1rem", color: "var(--text-faint)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          ×
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎲</div>
          <p style={{
            fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase",
            letterSpacing: "0.1em", color: "var(--hunter-gold-dark)",
          }}>
            Your random pick!
          </p>
        </div>

        {/* Category */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.625rem" }}>
          <span style={{ fontSize: "1rem" }}>{icon}</span>
          <span style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: accent }}>
            {getCategoryLabel(recommendation.category)}
          </span>
        </div>

        {/* Title */}
        <h2 style={{
          fontFamily: "var(--font-caveat), 'DM Serif Display', serif",
          fontSize: "1.75rem", color: "var(--foreground)",
          marginBottom: "0.5rem", lineHeight: 1.2,
        }}>
          {recommendation.title}
        </h2>

        {/* Stars + rating */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "1rem" }}>
          <StarDisplay rating={recommendation.rating} />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--hunter-gold-dark)" }}>
            {recommendation.rating}/5
          </span>
        </div>

        {/* Description */}
        <p style={{
          fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.65,
          marginBottom: "0.875rem",
          display: "-webkit-box", WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical", overflow: "hidden",
        }}>
          {recommendation.description}
        </p>

        {/* Location */}
        <p style={{ fontSize: "0.85rem", color: "var(--text-faint)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          📍 {recommendation.location}
        </p>

        {/* Votes */}
        <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--hunter-purple)" }}>▲ {recommendation.upvotes} upvotes</span>
          {(recommendation.downvotes ?? 0) > 0 && (
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#ef4444" }}>▼ {recommendation.downvotes}</span>
          )}
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={onShuffle}
            className="btn btn-outline"
            style={{ flex: 1, justifyContent: "center" }}
          >
            🎲 Try Again
          </button>
          <Link
            href={`/recommendation/${recommendation.id}`}
            className="btn btn-purple"
            style={{ flex: 1, justifyContent: "center" }}
          >
            View it →
          </Link>
        </div>
      </div>
    </div>
  );
}
