"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import RecommendationCard from "@/components/RecommentationCard";
import SearchInput from "@/components/SearchInput";
import NearbyPlacesSection from "@/components/NearbyPlacesSection";
import { getCategoryLabel, isValidCategory } from "@/data/categories";
import { getRecommendationsByCategory } from "@/lib/recommendation";
import type { Recommendation, RecommendationCategory } from "@/types/recommendation";

export default function CategoryRecommendationsPage() {
  const params = useParams();
  const categoryParam = String(params.category);

  if (!isValidCategory(categoryParam)) notFound();

  const category = categoryParam as RecommendationCategory;

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setLoading(true);
        setError("");
        const data = await getRecommendationsByCategory(category);
        setRecommendations(data);
      } catch (err) {
        console.error(err);
        setError("Could not load this category.");
      } finally {
        setLoading(false);
      }
    }
    loadRecommendations();
  }, [category]);

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
    <div className={`corkboard min-h-screen cat-bg-${category}`}>
      <section className="mx-auto max-w-6xl px-4 py-12">
        <Link
          href="/recommendations"
          className="text-sm font-bold transition-colors hover:text-[var(--purple)]"
          style={{ color: "var(--fg-secondary)" }}
        >
          ← Back to all recommendations
        </Link>

        {/* Header note */}
        <div className="sticky-note note-mint mt-8 p-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-widest mb-2"
              style={{ color: "var(--purple)" }}
            >
              Category
            </p>
            <h1
              className="text-4xl font-extrabold"
              style={{ color: "var(--fg-primary)" }}
            >
              {getCategoryLabel(category)}
            </h1>
            <p className="mt-2 text-sm leading-6" style={{ color: "var(--fg-secondary)" }}>
              Browse student suggestions in this category.
            </p>
          </div>
          <Link href="/add-recommendation" className="btn-purple shrink-0 glow-sm">
            + Add Recommendation
          </Link>
        </div>

        <div className="mt-8">
          <SearchInput value={search} onChange={setSearch} />
        </div>

        {/* Student picks section */}
        <div className="mt-10">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-1"
            style={{ color: "var(--purple)" }}
          >
            Student Picks
          </p>
          <h2
            className="text-2xl font-extrabold mb-6"
            style={{ color: "var(--fg-primary)" }}
          >
            Recommendations from students
          </h2>

          {loading && (
            <div
              className="sticky-note note-yellow p-6 text-sm"
              style={{ color: "var(--fg-secondary)" }}
            >
              Loading recommendations...
            </div>
          )}

          {error && (
            <div
              className="sticky-note note-pink p-6 text-sm"
              style={{ color: "var(--fg-primary)" }}
            >
              {error}
            </div>
          )}

          {!loading && !error && filteredRecommendations.length === 0 && (
            <div className="sticky-note note-lavender p-10 text-center">
              <h3
                className="text-lg font-bold"
                style={{ color: "var(--fg-primary)" }}
              >
                No student recommendations yet
              </h3>
              <p className="mt-2 text-sm" style={{ color: "var(--fg-secondary)" }}>
                Be the first to add a recommendation in this category.
              </p>
              <Link href="/add-recommendation" className="btn-purple mt-5 glow-sm">
                Add Recommendation
              </Link>
            </div>
          )}

          {!loading && !error && filteredRecommendations.length > 0 && (() => {
            const maxUpvotes = recommendations.reduce((m, r) => Math.max(m, r.upvotes), 0);
            return (
              <div className="sticky-grid grid gap-8 pt-6 md:grid-cols-2 lg:grid-cols-3">
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
        </div>

        <NearbyPlacesSection category={category} />
        <div className="pb-16" />
      </section>
    </div>
  );
}
