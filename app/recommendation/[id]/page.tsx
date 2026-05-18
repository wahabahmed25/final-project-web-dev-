"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getRecommendationById, upvoteRecommendation, downvoteRecommendation } from "@/lib/recommendation";
import { getCategoryLabel } from "@/data/categories";
import type { Recommendation } from "@/types/recommendation";

export default function RecommendationDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();

  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState(false);
  const [downvoting, setDownvoting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRecommendation() {
      try {
        setLoading(true);
        const data = await getRecommendationById(id);
        if (!data) notFound();
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
      setRecommendation({ ...recommendation, upvotes: recommendation.upvotes + 1 });
    } catch (err) {
      console.error(err);
      setError("Could not upvote right now.");
    } finally {
      setUpvoting(false);
    }
  }

  async function handleDownvote() {
    if (!recommendation) return;
    try {
      setDownvoting(true);
      await downvoteRecommendation(recommendation.id);
      setRecommendation({ ...recommendation, downvotes: (recommendation.downvotes ?? 0) + 1 });
    } catch (err) {
      console.error(err);
      setError("Could not downvote right now.");
    } finally {
      setDownvoting(false);
    }
  }

  if (loading) {
    return (
      <div className="corkboard min-h-screen px-4 py-12">
        <div className="mx-auto max-w-3xl mt-6">
          <div
            className="sticky-note note-yellow p-6 text-sm"
            style={{ color: "var(--fg-secondary)" }}
          >
            Loading recommendation...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="corkboard min-h-screen px-4 py-12">
        <div className="mx-auto max-w-3xl mt-6">
          <div
            className="sticky-note note-pink p-6 text-sm"
            style={{ color: "var(--fg-primary)" }}
          >
            {error}
          </div>
        </div>
      </div>
    );
  }

  if (!recommendation) return null;

  return (
    <div className="corkboard min-h-screen px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/recommendations"
          className="text-sm font-bold transition-colors hover:text-[var(--purple)]"
          style={{ color: "var(--fg-secondary)" }}
        >
          ← Back to recommendations
        </Link>

        {/* Main detail sticky note */}
        <article className="sticky-note note-lavender mt-10 p-8">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "var(--purple)" }}
              >
                {getCategoryLabel(recommendation.category)}
              </p>
              <h1
                className="mt-2 text-3xl font-extrabold"
                style={{ color: "var(--fg-primary)" }}
              >
                {recommendation.title}
              </h1>
              <p className="mt-2 text-xs" style={{ color: "var(--fg-muted)" }}>
                Posted by {recommendation.createdByName}
              </p>
            </div>

            <div
              className="shrink-0 rounded-full px-4 py-2 text-sm font-bold"
              style={{
                background: "var(--note-yellow)",
                color: "var(--fg-primary)",
              }}
            >
              ⭐ {recommendation.rating}/5
            </div>
          </div>

          <div className="mt-8 grid gap-6">
            <div>
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--fg-muted)" }}
              >
                Description
              </h2>
              <p className="leading-7 text-sm" style={{ color: "var(--fg-secondary)" }}>
                {recommendation.description}
              </p>
            </div>

            <div>
              <h2
                className="text-xs font-bold uppercase tracking-widest mb-2"
                style={{ color: "var(--fg-muted)" }}
              >
                Location
              </h2>
              <p className="text-sm" style={{ color: "var(--fg-secondary)" }}>
                📍 {recommendation.location}
              </p>
            </div>

            {recommendation.tags.length > 0 && (
              <div>
                <h2
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "var(--fg-muted)" }}
                >
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2 mt-2">
                  {recommendation.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full px-3 py-1 text-xs font-semibold"
                      style={{
                        background: "var(--purple-light)",
                        color: "var(--purple)",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div
              className="border-t pt-6 flex flex-wrap gap-3 items-center"
              style={{ borderColor: "var(--border)" }}
            >
              {user ? (
                <>
                  <button
                    onClick={handleUpvote}
                    disabled={upvoting}
                    className="btn-purple glow-sm"
                  >
                    {upvoting ? "..." : `👍 Upvote (${recommendation.upvotes})`}
                  </button>
                  <button
                    onClick={handleDownvote}
                    disabled={downvoting}
                    className="btn-outline"
                    style={{ borderColor: "#f43f5e", color: "#f43f5e" }}
                  >
                    {downvoting ? "..." : `👎 Downvote (${recommendation.downvotes ?? 0})`}
                  </button>
                </>
              ) : (
                <Link href="/login" className="btn-purple glow-sm">
                  Login to vote
                </Link>
              )}
            </div>
          </div>
        </article>

        <div className="pb-16" />
      </div>
    </div>
  );
}
