"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getRecommendationById, upvoteRecommendation } from "@/lib/recommendation";
import { getCategoryLabel } from "@/data/categories";

import type { Recommendation } from "@/types/recommendation";

export default function RecommendationDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();

  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecommendation() {
      try {
        setLoading(true);
        const data = await getRecommendationById(id);

        if (!data) {
          notFound();
        }

        setRecommendation(data);
      } catch (err) {
        console.error(err);
        setError("Could not load this recommendation.");
      } finally {
        setLoading(false);
      }
    }

    loadRecommendation();
  }, [id]);

  async function handleUpvote() {
    if (!recommendation) return;

    try {
      setUpvoting(true);
      await upvoteRecommendation(recommendation.id);

      setRecommendation({
        ...recommendation,
        upvotes: recommendation.upvotes + 1,
      });
    } catch (err) {
      console.error(err);
      setError("Could not upvote right now.");
    } finally {
      setUpvoting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
            Loading recommendation...
          </div>
        </section>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-2xl bg-red-50 p-6 text-red-700">{error}</div>
        </section>
      </div>
    );
  }

  if (!recommendation) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-3xl px-4 py-12">
        <Link
          href="/recommendations"
          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Back to recommendations
        </Link>

        <article className="mt-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                {getCategoryLabel(recommendation.category)}
              </p>

              <h1 className="mt-2 text-3xl font-bold text-slate-950">
                {recommendation.title}
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Posted by {recommendation.createdByName}
              </p>
            </div>

            <div className="rounded-full bg-yellow-100 px-4 py-2 text-sm font-semibold text-yellow-800">
              ⭐ {recommendation.rating}/5
            </div>
          </div>

          <div className="mt-8 grid gap-6">
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Description
              </h2>
              <p className="mt-2 leading-7 text-slate-700">
                {recommendation.description}
              </p>
            </div>

            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Location
              </h2>
              <p className="mt-2 text-slate-700">📍 {recommendation.location}</p>
            </div>

            {recommendation.tags.length > 0 && (
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Tags
                </h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {recommendation.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-slate-200 pt-6">
              {user ? (
                <button
                  onClick={handleUpvote}
                  disabled={upvoting}
                  className="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:bg-slate-400"
                >
                  {upvoting
                    ? "Upvoting..."
                    : `Upvote (${recommendation.upvotes})`}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Login to upvote
                </Link>
              )}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}