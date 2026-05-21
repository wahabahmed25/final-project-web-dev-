"use client";

import TagFilter from "@/components/TagFilter";
import { getCategoryTags } from "@/data/categories";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RecommendationCard from "@/components/RecommentationCard";
import SearchInput from "@/components/SearchInput";
import ShuffleModal from "@/components/ShuffleModal";
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
  const [minRating, setMinRating] = useState(0);
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [shufflePick, setShufflePick] = useState<Recommendation | null>(null);

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

  if (activeCategory !== "all") {
    list = list.filter((r) => r.category === activeCategory);
  }

  const term = search.toLowerCase().trim();
  if (term) {
    list = list.filter((r) =>
      [r.title, r.description, r.location, r.category, ...r.tags]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }

  if (minRating > 0) list = list.filter((r) => r.rating >= minRating);

  if (activeTags.length > 0) {
    list = list.filter((r) =>
      activeTags.every((tag) => r.tags.map((t) => t.toLowerCase()).includes(tag.toLowerCase()))
    );
  }

  switch (sort) {
    case "top-rated": list.sort((a, b) => b.rating - a.rating); break;
    case "popular": list.sort((a, b) => b.upvotes - a.upvotes); break;
    default: list.sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
  }
  return list;
}, [recommendations, search, sort, activeCategory, minRating, activeTags]);

  const rankedIds = useMemo(() => {
    const sorted = [...filtered].sort((a, b) => (b.upvotes - (b.downvotes ?? 0)) - (a.upvotes - (a.downvotes ?? 0)));
    const map = new Map<string, number>();
    sorted.forEach((r, i) => { if (r.upvotes > 0) map.set(r.id, i + 1); });
    return map;
  }, [filtered]);

  function handleShuffle() {
    if (filtered.length === 0) return;
    const pick = filtered[Math.floor(Math.random() * filtered.length)];
    setShufflePick(pick);
  }

  function handleShuffleAgain() {
    if (filtered.length === 0) return;
    let pick = filtered[Math.floor(Math.random() * filtered.length)];
    // avoid same pick if possible
    if (filtered.length > 1 && pick.id === shufflePick?.id) {
      pick = filtered[(filtered.indexOf(pick) + 1) % filtered.length];
    }
    setShufflePick(pick);
  }

  // Dynamic background: use category photo bg when a single category is filtered
  const bgClass = activeCategory !== "all"
    ? `page-recs page-cat-${activeCategory}`
    : "page-recs";

  return (
    <div className={bgClass} style={{ minHeight: "100vh" }}>
      {shufflePick && (
        <ShuffleModal
          recommendation={shufflePick}
          onClose={() => setShufflePick(null)}
          onShuffle={handleShuffleAgain}
        />
      )}

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "2.5rem 1.5rem" }}>

        {/* Header */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "1rem", marginBottom: "2rem" }}>
          <div>
            <span style={{
              display: "block", fontSize: "0.75rem", fontWeight: 700,
              textTransform: "uppercase", letterSpacing: "0.08em",
              color: "var(--hunter-gold-dark)", marginBottom: "0.375rem",
            }}>
              ✦ Browse
            </span>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              color: "var(--foreground)", margin: 0,
            }}>
              All Recommendations
            </h1>
            <p style={{ marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)" }}>
              Student picks for the best spots near Hunter.
            </p>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
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

        {/* Search */}
        <SearchInput value={search} onChange={setSearch} />

        {/* Category pills */}
        <div style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          <button
            className={`tag${activeCategory === "all" ? " active" : ""}`}
            onClick={() => { setActiveCategory("all"); setActiveTags([]); }}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              className={`tag${activeCategory === cat.value ? " active" : ""}`}
              onClick={() => {
  setActiveCategory(activeCategory === cat.value ? "all" : cat.value);
  setActiveTags([]);
}}
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
                padding: "0.35rem 0.875rem", borderRadius: "100px",
                border: "1.5px solid",
                borderColor: sort === opt.value ? "var(--hunter-purple)" : "var(--border)",
                background: sort === opt.value ? "var(--hunter-purple)" : "var(--surface)",
                color: sort === opt.value ? "#fff" : "var(--text-muted)",
                fontSize: "0.8rem", fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
              }}
            >
              {opt.label}
            </button>
          ))}

          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginLeft: "0.5rem" }}>
            <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-faint)" }}>★ Min:</span>
            <button onClick={() => setMinRating(0)} style={{ padding: "0.3rem 0.6rem", borderRadius: "100px", border: "1.5px solid", borderColor: minRating === 0 ? "var(--hunter-purple)" : "var(--border)", background: minRating === 0 ? "var(--hunter-purple)" : "var(--surface)", color: minRating === 0 ? "#fff" : "var(--text-muted)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>Any</button>
            {[2, 3, 4, 5].map((n) => (
              <button key={n} onClick={() => setMinRating(minRating === n ? 0 : n)} style={{ padding: "0.3rem 0.6rem", borderRadius: "100px", border: "1.5px solid", borderColor: minRating === n ? "var(--hunter-gold)" : "var(--border)", background: minRating === n ? "var(--hunter-gold-light)" : "var(--surface)", color: minRating === n ? "var(--hunter-gold-dark)" : "var(--text-muted)", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer" }}>{"★".repeat(n)}</button>
            ))}
          </div>

          {!loading && (
            <span style={{ marginLeft: "auto", fontSize: "0.8rem", color: "var(--text-faint)" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Smart Tag Filters */}
        {(() => {
          const tagPool =
            activeCategory !== "all"
              ? getCategoryTags(activeCategory)
              : Array.from(new Set(recommendations.flatMap((r) => r.tags))).slice(0, 20);
          return (
            <TagFilter
              allTags={tagPool}
              activeTags={activeTags}
              onToggle={(tag) =>
                setActiveTags((prev) =>
                  prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
                )
              }
              onClear={() => setActiveTags([])}
            />
          );
        })()}

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
              {filtered.map((r) => <RecommendationCard key={r.id} recommendation={r} rank={rankedIds.get(r.id)} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
