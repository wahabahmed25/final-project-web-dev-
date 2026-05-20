"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, notFound } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import {
  getRecommendationById,
  upvoteRecommendation,
  downvoteRecommendation,
  getComments,
  addComment,
  type Comment,
} from "@/lib/recommendation";
import { getCategoryLabel, getCategoryIcon, getCategoryAccent } from "@/data/categories";
import { DetailSkeleton } from "@/components/LoadingSkeleton";
import VoteEffect from "@/components/VoteEffect";
import type { Recommendation } from "@/types/recommendation";

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} style={{ fontSize: "1rem", color: n <= rating ? "var(--hunter-gold)" : "var(--border)" }}>
          ★
        </span>
      ))}
    </div>
  );
}

export default function RecommendationDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const { user } = useAuth();
  const { showToast } = useToast();

  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [upvoting, setUpvoting] = useState(false);
  const [downvoting, setDownvoting] = useState(false);
  const [upvoteAnim, setUpvoteAnim] = useState(false);
  const [downvoteAnim, setDownvoteAnim] = useState(false);
  const [error, setError] = useState("");

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  const clearUpvoteAnim = useCallback(() => setUpvoteAnim(false), []);
  const clearDownvoteAnim = useCallback(() => setDownvoteAnim(false), []);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getRecommendationById(id);
        if (!data) notFound();
        setRecommendation(data);
      } catch {
        setError("Could not load this recommendation.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  useEffect(() => {
    async function loadComments() {
      try {
        setCommentsLoading(true);
        const data = await getComments(id);
        setComments(data);
      } catch {
        // silently fail
      } finally {
        setCommentsLoading(false);
      }
    }
    loadComments();
  }, [id]);

  async function handleUpvote() {
    if (!recommendation) return;
    try {
      setUpvoting(true);
      await upvoteRecommendation(recommendation.id);
      setRecommendation({ ...recommendation, upvotes: recommendation.upvotes + 1 });
      setUpvoteAnim(true);
      showToast("Upvoted! 👍", "success");
    } catch {
      showToast("Could not upvote right now.", "error");
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
      setDownvoteAnim(true);
      showToast("Downvoted.", "success");
    } catch {
      showToast("Could not downvote right now.", "error");
    } finally {
      setDownvoting(false);
    }
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !commentText.trim()) return;
    try {
      setSubmittingComment(true);
      await addComment(id, {
        text: commentText,
        createdBy: user.uid,
        createdByName: user.displayName || user.email || "Student",
      });
      const fresh = await getComments(id);
      setComments(fresh);
      setCommentText("");
      showToast("Comment added!", "success");
    } catch {
      showToast("Could not post your comment.", "error");
    } finally {
      setSubmittingComment(false);
    }
  }

  if (loading) {
    return (
      <div style={{ maxWidth: 768, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ height: "1rem", width: "5rem", marginBottom: "1.5rem", borderRadius: "100px" }} className="skeleton" />
        <DetailSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 768, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ background: "#FEF2F2", borderRadius: "var(--radius-lg)", padding: "1rem", color: "var(--error)" }}>{error}</div>
      </div>
    );
  }

  if (!recommendation) return null;

  const accent = getCategoryAccent(recommendation.category);
  const icon = getCategoryIcon(recommendation.category);

  return (
    <div style={{ maxWidth: 768, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
      {/* Back */}
      <Link
        href="/recommendations"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.375rem",
          fontSize: "0.875rem",
          fontWeight: 600,
          color: "var(--hunter-purple)",
          textDecoration: "none",
          marginBottom: "1.5rem",
        }}
      >
        ← Back to recommendations
      </Link>

      {/* Main card */}
      <article className="card" style={{ padding: "2rem", marginBottom: "1.5rem" }}>
        {/* Category */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "1rem" }}>{icon}</span>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: accent }}>
            {getCategoryLabel(recommendation.category)}
          </span>
        </div>

        {/* Title + rating */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "0.5rem" }}>
          <h1
            style={{
              fontFamily: "'DM Serif Display', serif",
              fontSize: "clamp(1.75rem, 4vw, 2.25rem)",
              color: "var(--foreground)",
              flex: 1,
              minWidth: 200,
              margin: 0,
            }}
          >
            {recommendation.title}
          </h1>

          <div
            className="rating-badge"
            style={{
              background: "var(--hunter-gold-light)",
              border: "1px solid rgba(238,177,17,0.3)",
              borderRadius: "var(--radius-lg)",
              padding: "0.625rem 1rem",
              textAlign: "center",
              flexShrink: 0,
            }}
          >
            <p style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--hunter-gold-dark)", margin: "0 0 0.2rem" }}>
              {recommendation.rating}/5
            </p>
            <StarDisplay rating={recommendation.rating} />
          </div>
        </div>

        <p style={{ fontSize: "0.85rem", color: "var(--text-faint)", marginBottom: "1.75rem" }}>
          Posted by <strong style={{ color: "var(--text-muted)" }}>{recommendation.createdByName}</strong>
        </p>

        {/* Description */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-faint)", marginBottom: "0.625rem" }}>
            Description
          </h2>
          <p style={{ fontSize: "0.9375rem", color: "var(--foreground)", lineHeight: 1.75 }}>
            {recommendation.description}
          </p>
        </div>

        {/* Location */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h2 style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-faint)", marginBottom: "0.5rem" }}>
            Location
          </h2>
          <p style={{ fontSize: "0.9375rem", color: "var(--foreground)", display: "flex", alignItems: "center", gap: "0.4rem" }}>
            📍 {recommendation.location}
          </p>
        </div>

        {/* Tags */}
        {recommendation.tags.length > 0 && (
          <div style={{ marginBottom: "1.75rem" }}>
            <h2 style={{ fontSize: "0.7rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-faint)", marginBottom: "0.625rem" }}>
              Tags
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {recommendation.tags.map((tag) => (
                <span
                  key={tag}
                  className="tag"
                  style={{ cursor: "default" }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Vote buttons */}
        <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "1.5rem" }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
              {/* Upvote */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={handleUpvote}
                  disabled={upvoting}
                  className="btn btn-purple"
                  style={{ gap: "0.5rem" }}
                >
                  ▲ {upvoting ? "..." : `Upvote (${recommendation.upvotes})`}
                </button>
                <VoteEffect type="up" active={upvoteAnim} onDone={clearUpvoteAnim} />
              </div>

              {/* Downvote */}
              <div style={{ position: "relative" }}>
                <button
                  onClick={handleDownvote}
                  disabled={downvoting}
                  className="btn btn-outline"
                  style={{ gap: "0.5rem", borderColor: "#f43f5e", color: "#f43f5e" }}
                >
                  ▼ {downvoting ? "..." : `Downvote (${recommendation.downvotes ?? 0})`}
                </button>
                <VoteEffect type="down" active={downvoteAnim} onDone={clearDownvoteAnim} />
              </div>

              <span style={{ fontSize: "0.825rem", color: "var(--text-faint)", marginLeft: "0.25rem" }}>
                {recommendation.upvotes} student{recommendation.upvotes !== 1 ? "s" : ""} found this helpful
              </span>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/login" className="btn btn-purple">
                Login to vote
              </Link>
              <span style={{ fontSize: "0.85rem", color: "var(--text-faint)" }}>
                {recommendation.upvotes} upvote{recommendation.upvotes !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      </article>

      {/* ── Comments ── */}
      <section className="card" style={{ padding: "1.75rem" }}>
        <h2
          style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "1.375rem",
            color: "var(--foreground)",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          💬 Comments
          <span style={{ fontSize: "0.875rem", fontFamily: "'DM Sans', sans-serif", fontWeight: 600, color: "var(--text-faint)" }}>
            ({commentsLoading ? "..." : comments.length})
          </span>
        </h2>

        {/* Comment form */}
        {user ? (
          <form onSubmit={handleAddComment} style={{ marginBottom: "2rem" }}>
            <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
              <div
                style={{
                  width: "2.25rem", height: "2.25rem", borderRadius: "50%",
                  background: "var(--hunter-purple-light)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  fontSize: "0.875rem", fontWeight: 700, color: "var(--hunter-purple)",
                  flexShrink: 0, marginTop: "2px",
                }}
              >
                {(user.displayName || user.email || "U")[0].toUpperCase()}
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Share your thoughts with other students..."
                  rows={3}
                  className="input"
                  style={{ resize: "vertical", minHeight: "5rem" }}
                  maxLength={500}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.625rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-faint)" }}>{commentText.length}/500</span>
                  <button
                    type="submit"
                    disabled={submittingComment || !commentText.trim()}
                    className="btn btn-purple"
                    style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}
                  >
                    {submittingComment ? "Posting..." : "Post Comment"}
                  </button>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div
            style={{
              background: "var(--hunter-purple-faint)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1rem 1.25rem",
              marginBottom: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", margin: 0 }}>Log in to leave a comment.</p>
            <Link href="/login" className="btn btn-purple" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}>Login</Link>
          </div>
        )}

        {/* Comments list */}
        {commentsLoading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {[1, 2].map((i) => (
              <div key={i} style={{ display: "flex", gap: "0.75rem" }}>
                <div className="skeleton" style={{ width: "2.25rem", height: "2.25rem", borderRadius: "50%", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div className="skeleton" style={{ height: "0.875rem", width: "30%", marginBottom: "0.5rem" }} />
                  <div className="skeleton" style={{ height: "0.8rem", width: "90%" }} />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "0.9rem", color: "var(--text-faint)", padding: "1.5rem 0" }}>
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            {comments.map((comment) => (
              <div
                key={comment.id}
                style={{ display: "flex", gap: "0.75rem", paddingBottom: "1.25rem", borderBottom: "1px solid var(--border-light)" }}
              >
                <div
                  style={{
                    width: "2.25rem", height: "2.25rem", borderRadius: "50%",
                    background: "var(--hunter-purple-light)", display: "flex",
                    alignItems: "center", justifyContent: "center",
                    fontSize: "0.875rem", fontWeight: 700, color: "var(--hunter-purple)", flexShrink: 0,
                  }}
                >
                  {comment.createdByName[0].toUpperCase()}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)", margin: "0 0 0.375rem" }}>
                    {comment.createdByName}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "var(--text-muted)", lineHeight: 1.65, margin: 0 }}>
                    {comment.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
