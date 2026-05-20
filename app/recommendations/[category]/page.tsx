"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import RecommendationCard from "@/components/RecommentationCard";
import SearchInput from "@/components/SearchInput";
import ShuffleModal from "@/components/ShuffleModal";
import NearbyPlacesSection from "@/components/NearbyPlacesSection";
import { RecommendationCardSkeleton } from "@/components/LoadingSkeleton";
import { categories, getCategoryLabel, getCategoryIcon, getCategoryAccent, isValidCategory } from "@/data/categories";
import { getRecommendationsByCategory } from "@/lib/recommendation";
import type { Recommendation, RecommendationCategory } from "@/types/recommendation";

type SortOption = "newest" | "top-rated" | "popular";

export default function CategoryRecommendationsPage() {
  const params = useParams();
  const categoryParam = String(params.category);

  if (!isValidCategory(categoryParam)) notFound();

  const category = categoryParam as RecommendationCategory;
  const accent = getCategoryAccent(category);
  const icon = getCategoryIcon(category);
  const catData = categories.find((c) => c.value === category);

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [shufflePick, setShufflePick] = useState<Recommendation | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getRecommendationsByCategory(category);
        setRecommendations(data);
      } catch {
        setError("Could not load this category.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [category]);

  const filtered = useMemo(() => {
    let list = [...recommendations];
    const term = search.toLowerCase().trim();
    if (term) {
      list = list.filter((r) =>
        [r.title, r.description, r.location, ...r.tags].join(" ").toLowerCase().includes(term)
      );
    }
    switch (sort) {
      case "top-rated": list.sort((a, b) => b.rating - a.rating); break;
      case "popular":   list.sort((a, b) => b.upvotes - a.upvotes); break;
      default:          list.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
    }
    return list;
  }, [recommendations, search, sort]);

  // rank by net score within this category
  const rankedIds = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => (b.upvotes - (b.downvotes ?? 0)) - (a.upvotes - (a.downvotes ?? 0)));
    const map = new Map<string, number>();
    sorted.forEach((r, i) => { if (r.upvotes > 0) map.set(r.id, i + 1); });
    return map;
  }, [filtered]);

  function handleShuffle() {
    if (filtered.length === 0) return;
    setShufflePick(filtered[Math.floor(Math.random() * filtered.length)]);
  }

  function handleShuffleAgain() {
    if (filtered.length === 0) return;
    let pick = filtered[Math.floor(Math.random() * filtered.length)];
    if (filtered.length > 1 && pick.id === shufflePick?.id) {
      pick = filtered[(filtered.indexOf(pick) + 1) % filtered.length];
    }
    setShufflePick(pick);
  }

  return (
    <div className={`page-cat-${category}`} style={{ minHeight: "100vh", position: "relative" }}>
      {shufflePick && (
        <ShuffleModal
          recommendation={shufflePick}
          onClose={() => setShufflePick(null)}
          onShuffle={handleShuffleAgain}
        />
      )}
      {/* Category hero */}
      <div
        style={{
          background: catData?.gradient ?? "var(--hunter-purple-faint)",
          borderBottom: "1px solid var(--border)",
          padding: "2.5rem 1.5rem",
        }}
      >
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <Link
            href="/recommendations"
            style={{ fontSize: "0.85rem", fontWeight: 600, color: accent, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.25rem", marginBottom: "1.25rem" }}
          >
            ← Back to all
          </Link>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.625rem", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "2rem" }}>{icon}</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: accent,
                  }}
                >
                  Category
                </span>
              </div>
              <h1
                className="fun-heading"
                style={{
                  fontSize: "clamp(2rem, 5vw, 3rem)",
                  color: "var(--foreground)",
                  margin: 0,
                  lineHeight: 1.1,
                }}
              >
                {getCategoryLabel(category)}
              </h1>
              <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)", maxWidth: 520 }}>
                {catData?.description}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button
                onClick={handleShuffle}
                disabled={filtered.length === 0}
                className="btn btn-gold"
                style={{ gap: "0.5rem" }}
              >
                🎲 Pick for me
              </button>
              <Link href="/add-recommendation" className="btn btn-purple">
                + Add Recommendation
              </Link>
            </div>
          </div>
        </div>
      </div>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Search + sort */}
        <SearchInput value={search} onChange={setSearch} />

        <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-faint)" }}>Sort:</span>
          {(["newest", "top-rated", "popular"] as SortOption[]).map((opt) => (
            <button
              key={opt}
              onClick={() => setSort(opt)}
              style={{
                padding: "0.35rem 0.875rem",
                borderRadius: "100px",
                border: "1.5px solid",
                borderColor: sort === opt ? accent : "var(--border)",
                background: sort === opt ? accent : "var(--surface)",
                color: sort === opt ? "#fff" : "var(--text-muted)",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
                textTransform: "capitalize",
              }}
            >
              {opt === "top-rated" ? "Top Rated" : opt === "popular" ? "Most Upvoted" : "Newest"}
            </button>
          ))}

          {!loading && (
            <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--text-faint)" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Results */}
        <div style={{ marginTop: "1.75rem" }}>
          {loading && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {Array.from({ length: 6 }).map((_, i) => <RecommendationCardSkeleton key={i} />)}
            </div>
          )}

          {error && (
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "var(--radius-lg)", padding: "1rem", color: "var(--error)", fontSize: "0.9rem" }}>
              {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
              <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}>{icon}</span>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.375rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>
                No recommendations yet
              </h2>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                Be the first to add a recommendation in this category.
              </p>
              <Link href="/add-recommendation" className="btn btn-purple">
                Add Recommendation
              </Link>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {filtered.map((r) => <RecommendationCard key={r.id} recommendation={r} rank={rankedIds.get(r.id)} />)}
            </div>
          )}
        </div>

        <NearbyPlacesSection category={category} />
      </section>
    </div>
  );
}