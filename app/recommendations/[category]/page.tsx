"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import RecommendationCard from "@/components/RecommentationCard";
import SearchInput from "@/components/SearchInput";
import {
  getCategoryLabel,
  isValidCategory,
} from "@/data/categories";
import { getRecommendationsByCategory } from "@/lib/recommendation";
import type {
  Recommendation,
  RecommendationCategory,
} from "@/types/recommendation";

export default function CategoryRecommendationsPage() {
  const params = useParams();
  const categoryParam = String(params.category);

  if (!isValidCategory(categoryParam)) {
    notFound();
  }

  const category = categoryParam as RecommendationCategory;

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecommendations() {
      try {
        setLoading(true);
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

    if (!term) {
      return recommendations;
    }

    return recommendations.filter((item) => {
      const searchableText = [
        item.title,
        item.description,
        item.location,
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
        <Link
          href="/recommendations"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to all recommendations
        </Link>

        <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Category
            </p>
            <h1 className="mt-2 text-4xl font-bold text-slate-950">
              {getCategoryLabel(category)}
            </h1>
            <p className="mt-3 max-w-2xl text-slate-600">
              Browse student suggestions in this category.
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
              No recommendations yet
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Be the first to add a recommendation in this category.
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