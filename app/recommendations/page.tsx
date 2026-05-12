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

    if (!term) {
      return recommendations;
    }

    return recommendations.filter((item) => {
      const searchableText = [
        item.title,
        item.description,
        item.location,
        item.category,
        ...item.tags,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(term);
    });
  }, [recommendations, search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Browse
            </p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">
              All Recommendations
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Search student recommendations for useful places and resources on
              or near Hunter.
            </p>
          </div>

          <Link
            href="/add-recommendation"
            className="rounded-full bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Add Recommendation
          </Link>
        </div>

        <div className="mt-8">
          <SearchInput value={search} onChange={setSearch} />
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          {categories.map((category) => (
            <Link
              key={category.value}
              href={`/recommendations/${category.value}`}
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-blue-300 hover:text-blue-600"
            >
              {category.label}
            </Link>
          ))}
        </div>

        {loading && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
            Loading recommendations...
          </div>
        )}

        {error && (
          <div className="mt-10 rounded-2xl bg-red-50 p-6 text-red-700">
            {error}
          </div>
        )}

        {!loading && !error && filteredRecommendations.length === 0 && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h2 className="text-lg font-semibold text-slate-950">
              No recommendations found
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Try a different search or add the first recommendation.
            </p>
          </div>
        )}

        {!loading && !error && filteredRecommendations.length > 0 && (
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredRecommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}