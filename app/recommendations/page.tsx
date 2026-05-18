"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RecommendationCard from "@/components/RecommentationCard";
import SearchInput from "@/components/SearchInput";
import { categories } from "@/data/categories";
import { getAllRecommendations } from "@/lib/recommendation";
import type { Recommendation } from "@/types/recommendation";

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setLoading(true);
        const data = await getAllRecommendations();
        setRecommendations(data);
      } catch (err) {
        console.error(err);
        setError("Could not load recommendations.");
      } finally {
        setLoading(false);
      }
    }
    loadRecommendations();
  }, []);

  const filteredRecommendations = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return recommendations;
    return recommendations.filter((item) =>
      [item.title, item.description, item.location, item.category, ...item.tags]
        .join(" ")
        .toLowerCase()
        .includes(term)
    );
  }, [recommendations, search]);

  return (
    <div className="corkboard min-h-screen cat-bg-recommendations">
      <section className="mx-auto max-w-6xl px-4 py-12">
        {/* Header note */}
        <div
          className="sticky-note note-pink p-8 mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between mt-6"
        >
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "var(--purple)" }}
            >
              Browse
            </p>
            <h1
              className="text-4xl font-extrabold"
              style={{ color: "var(--fg-primary)" }}
            >
              All Recommendations
            </h1>
            <p
              className="mt-2 max-w-xl text-sm leading-6"
              style={{ color: "var(--fg-secondary)" }}
            >
              Search student recommendations for useful places and resources on
              or near Hunter.
            </p>
          </div>
          <Link href="/add-recommendation" className="btn-purple shrink-0 glow-sm">
            + Add Recommendation
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchInput value={search} onChange={setSearch} />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Link
              key={category.value}
              href={`/recommendations/${category.value}`}
              className="sticky-note rounded-full px-4 py-2 text-xs font-bold transition-all"
              style={{ color: "var(--fg-secondary)" }}
            >
              {category.label}
            </Link>
          ))}
        </div>

        {/* States */}
        {loading && (
          <div
            className="sticky-note note-yellow p-6 text-sm mt-6"
            style={{ color: "var(--fg-secondary)" }}
          >
            Loading recommendations...
          </div>
        )}

        {error && (
          <div
            className="sticky-note mt-6 p-6 text-sm"
            style={{
              background: "var(--note-pink)",
              color: "var(--fg-primary)",
            }}
          >
            {error}
          </div>
        )}

        {!loading && !error && filteredRecommendations.length === 0 && (
          <div className="sticky-note note-lavender mt-6 p-10 text-center">
            <h2
              className="text-lg font-bold"
              style={{ color: "var(--fg-primary)" }}
            >
              No recommendations found
            </h2>
            <p className="mt-2 text-sm" style={{ color: "var(--fg-secondary)" }}>
              Try a different search or add the first recommendation.
            </p>
          </div>
        )}

        {!loading && !error && filteredRecommendations.length > 0 && (() => {
          const maxUpvotes = recommendations.reduce((m, r) => Math.max(m, r.upvotes), 0);
          return (
            <div className="sticky-grid mt-10 grid gap-8 pt-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRecommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  isTop={maxUpvotes > 0 && recommendation.upvotes === maxUpvotes}
                />
              ))}
            </div>
          );
        })()}

        <div className="pb-16" />
      </section>
    </div>
  );
}
