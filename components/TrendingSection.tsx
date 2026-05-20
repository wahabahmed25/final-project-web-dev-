"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getTrendingRecommendations } from "@/lib/recommendation";
import { getCategoryIcon, getCategoryAccent } from "@/data/categories";
import type { Recommendation } from "@/types/recommendation";

export default function TrendingSection() {
  const [items, setItems] = useState<Recommendation[]>([]);

  useEffect(() => {
    getTrendingRecommendations(6).then(setItems).catch(() => {});
  }, []);

  if (items.length === 0) return null;

  return (
    <section style={{ padding: "4rem 1.5rem", position: "relative", zIndex: 1 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <span style={{
            display: "inline-block", fontSize: "0.75rem", fontWeight: 700,
            textTransform: "uppercase", letterSpacing: "0.08em",
            color: "#ef4444", marginBottom: "0.4rem",
          }}>
            🔥 Trending this week
          </span>
          <h2 className="fun-heading" style={{ fontSize: "clamp(1.75rem, 3vw, 2.25rem)", color: "var(--foreground)", margin: 0 }}>
            Hot right now
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "1rem",
        }}>
          {items.map((rec, i) => {
            const accent = getCategoryAccent(rec.category);
            const icon = getCategoryIcon(rec.category);
            return (
              <Link
                key={rec.id}
                href={`/recommendation/${rec.id}`}
                className="card card-hover"
                style={{ display: "block", padding: "1.25rem", textDecoration: "none", position: "relative" }}
              >
                {i === 0 && (
                  <div style={{
                    position: "absolute", top: "-8px", right: "12px",
                    background: "linear-gradient(135deg,#ef4444,#f97316)",
                    color: "#fff", fontSize: "0.6rem", fontWeight: 800,
                    padding: "0.15rem 0.55rem", borderRadius: "100px",
                    letterSpacing: "0.05em",
                  }}>
                    🔥 #1 This Week
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem" }}>{icon}</span>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: accent }}>
                    {rec.category.replace(/-/g, " ")}
                  </span>
                </div>

                <h3
                  className="line-clamp-2"
                  style={{
                    fontFamily: "var(--font-caveat), 'DM Serif Display', serif",
                    fontSize: "1.15rem", color: "var(--foreground)",
                    margin: "0 0 0.5rem", lineHeight: 1.3,
                  }}
                >
                  {rec.title}
                </h3>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--hunter-gold-dark)", fontWeight: 600 }}>
                    {"★".repeat(rec.rating)}{"☆".repeat(5 - rec.rating)} {rec.rating}/5
                  </span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--hunter-purple)" }}>
                    ▲ {rec.upvotes}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <Link href="/recommendations?sort=popular" className="btn btn-outline" style={{ fontSize: "0.875rem" }}>
            See all recommendations →
          </Link>
        </div>
      </div>
    </section>
  );
}
