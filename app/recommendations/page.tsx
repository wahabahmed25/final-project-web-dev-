"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RecommendationCard from "@/components/RecommentationCard";
import SearchInput from "@/components/SearchInput";
import { RecommendationCardSkeleton } from "@/components/LoadingSkeleton";
import { categories } from "@/data/categories";
import { getAllRecommendations } from "@/lib/recommendation";
import type { Recommendation } from "@/types/recommendation";

type SortOption = "newest" | "top-rated" | "popular";

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest",    label: "Newest" },
  { value: "top-rated", label: "Top Rated" },
  { value: "popular",   label: "Most Upvoted" },
];

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getAllRecommendations();
        setRecommendations(data);
      } catch {
        setError("Could not load recommendations.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    let list = [...recommendations];

    // Category filter
    if (activeCategory !== "all") {
      list = list.filter((r) => r.category === activeCategory);
    }

    // Search
    const term = search.toLowerCase().trim();
    if (term) {
      list = list.filter((r) =>
        [r.title, r.description, r.location, r.category, ...r.tags]
          .join(" ")
          .toLowerCase()
          .includes(term)
      );
    }

    // Sort
    switch (sort) {
      case "top-rated":
        list.sort((a, b) => b.rating - a.rating);
        break;
      case "popular":
        list.sort((a, b) => b.upvotes - a.upvotes);
        break;
      default: // newest
        list.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
    }

    return list;
  }, [recommendations, search, sort, activeCategory]);

  return (
    <div style={{ minHeight: "100vh" }}>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <span
              style={{
                display: "block",
                fontSize: "0.75rem",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "var(--hunter-gold-dark)",
                marginBottom: "0.375rem",
              }}
            >
              ✦ Browse
            </span>
            <h1
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              All Recommendations
            </h1>
            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Student picks for the best spots near Hunter.
            </p>
          </div>
          <Link href="/add-recommendation" className="btn btn-purple">
            + Add Recommendation
          </Link>
        </div>

        {/* Search */}
        <SearchInput value={search} onChange={setSearch} />

        {/* Category pills */}
        <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <button
            className={`tag${activeCategory === "all" ? " active" : ""}`}
            onClick={() => setActiveCategory("all")}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`tag${activeCategory === cat.value ? " active" : ""}`}
              onClick={() => setActiveCategory(activeCategory === cat.value ? "all" : cat.value)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div style={{ marginTop: "1.25rem", display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-faint)" }}>Sort:</span>
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSort(opt.value)}
              style={{
                padding: "0.35rem 0.875rem",
                borderRadius: "100px",
                border: "1.5px solid",
                borderColor: sort === opt.value ? "var(--hunter-purple)" : "var(--border)",
                background: sort === opt.value ? "var(--hunter-purple)" : "var(--surface)",
                color: sort === opt.value ? "#fff" : "var(--text-muted)",
                fontSize: "0.8rem",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {opt.label}
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
            <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "var(--radius-lg)", padding: "1rem 1.25rem", color: "var(--error)", fontSize: "0.9rem" }}>
              {error}
            </div>
          )}

          {!loading && !error && filtered.length === 0 && (
            <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
              <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}>🔍</span>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "1.375rem", color: "var(--foreground)", marginBottom: "0.5rem" }}>
                No recommendations found
              </h2>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                {search ? "Try a different search term." : "Be the first to add one!"}
              </p>
              <Link href="/add-recommendation" className="btn btn-purple">
                Add Recommendation
              </Link>
            </div>
          )}

          {!loading && !error && filtered.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {filtered.map((r) => <RecommendationCard key={r.id} recommendation={r} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}