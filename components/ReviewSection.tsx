"use client";

import { useEffect, useState } from "react";
import { getReviews, addReview } from "@/lib/recommendation";
import type { Review } from "@/lib/recommendation";
import { useAuth } from "@/context/AuthContext";

const labelStyle = {
  display: "block" as const,
  fontSize: "0.78rem",
  fontWeight: 600,
  color: "var(--text-faint)",
  textTransform: "uppercase" as const,
  letterSpacing: "0.05em",
  marginBottom: "0.4rem",
  margin: "0 0 0.4rem 0",
};

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div style={{ display: "flex", gap: "4px" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.6rem",
            color: n <= value ? "var(--hunter-gold)" : "var(--border)",
            padding: 0,
            lineHeight: 1,
            transition: "color 0.1s",
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

function StarDisplay({ rating }: { rating: number }) {
  return (
    <div style={{ display: "flex", gap: "2px" }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          style={{
            fontSize: "0.9rem",
            color: n <= rating ? "var(--hunter-gold)" : "var(--border)",
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

interface ReviewSectionProps {
  recommendationId: string;
}

export default function ReviewSection({ recommendationId }: ReviewSectionProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rating, setRating] = useState(0);
  const [liked, setLiked] = useState("");
  const [headsUp, setHeadsUp] = useState("");
  const [formError, setFormError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    getReviews(recommendationId).then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, [recommendationId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (rating === 0) {
      setFormError("Please select a star rating.");
      return;
    }
    if (liked.trim().length < 5) {
      setFormError("Tell us a little about what you liked!");
      return;
    }
    setFormError("");
    setSubmitting(true);
    try {
      await addReview(recommendationId, {
        rating,
        liked,
        heads_up: headsUp,
        createdBy: user.uid,
        createdByName: user.displayName ?? user.email ?? "Student",
      });
      const updated = await getReviews(recommendationId);
      setReviews(updated);
      setRating(0);
      setLiked("");
      setHeadsUp("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setFormError("Something went wrong. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : null;

  return (
    <section style={{ marginTop: "2.5rem" }}>

      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.5rem",
          marginBottom: "1.25rem",
        }}
      >
        <h2 style={{ fontSize: "1.15rem", fontWeight: 700, margin: 0 }}>
          Student Reviews ({loading ? "..." : reviews.length})
        </h2>
        {avgRating !== null && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <StarDisplay rating={Math.round(avgRating)} />
            <span style={{ fontSize: "0.85rem", color: "var(--text-faint)" }}>
              {avgRating.toFixed(1)} avg
            </span>
          </div>
        )}
      </div>

      {/* Form */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          style={{
            border: "1px solid var(--border)",
            borderRadius: "12px",
            padding: "1.25rem",
            marginBottom: "1.75rem",
            background: "var(--surface)",
          }}
        >
          <p style={{ fontWeight: 700, marginTop: 0, marginBottom: "1rem", fontSize: "0.95rem" }}>
            Leave a Review
          </p>

          {/* Star picker */}
          <div style={{ marginBottom: "1rem" }}>
            <p style={labelStyle}>Your Rating *</p>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          {/* What did you like */}
          <div style={{ marginBottom: "1rem" }}>
            <p style={labelStyle}>What did you like? *</p>
            <textarea
              value={liked}
              onChange={(e) => setLiked(e.target.value)}
              placeholder="e.g. Super quiet, great outlets, good coffee..."
              maxLength={300}
              rows={3}
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--foreground)",
                fontSize: "0.875rem",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            <span style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>
              {liked.length}/300
            </span>
          </div>

          {/* Heads up */}
          <div style={{ marginBottom: "1rem" }}>
            <p style={labelStyle}>Anything to know before going? (optional)</p>
            <textarea
              value={headsUp}
              onChange={(e) => setHeadsUp(e.target.value)}
              placeholder="e.g. Gets crowded after 12pm, cash only, bring headphones..."
              maxLength={300}
              rows={2}
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "transparent",
                color: "var(--foreground)",
                fontSize: "0.875rem",
                resize: "vertical",
                boxSizing: "border-box",
              }}
            />
            <span style={{ fontSize: "0.72rem", color: "var(--text-faint)" }}>
              {headsUp.length}/300
            </span>
          </div>

          {formError && (
            <p style={{ color: "var(--error)", fontSize: "0.82rem", margin: "0 0 0.75rem" }}>
              ⚠ {formError}
            </p>
          )}
          {success && (
            <p style={{ color: "green", fontSize: "0.82rem", margin: "0 0 0.75rem" }}>
              ✓ Review submitted!
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="btn btn-purple"
            style={{ opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      ) : (
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--text-faint)",
            marginBottom: "1.5rem",
            border: "1px dashed var(--border)",
            borderRadius: "8px",
            padding: "0.75rem 1rem",
          }}
        >
          Log in to leave a review.
        </p>
      )}

      {/* Reviews List */}
      {loading ? (
        <p style={{ fontSize: "0.875rem", color: "var(--text-faint)" }}>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p style={{ fontSize: "0.875rem", color: "var(--text-faint)" }}>
          No reviews yet. Be the first!
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {reviews.map((review) => (
            <div
              key={review.id}
              style={{
                border: "1px solid var(--border)",
                borderRadius: "10px",
                padding: "1rem 1.25rem",
                background: "var(--surface)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: "0.4rem",
                  marginBottom: "0.6rem",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      background: "var(--hunter-purple)",
                      color: "#fff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "0.75rem",
                      fontWeight: 700,
                      flexShrink: 0,
                    }}
                  >
                    {review.createdByName.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    {review.createdByName}
                  </span>
                </div>
                <StarDisplay rating={review.rating} />
              </div>

              <div style={{ marginBottom: review.heads_up ? "0.6rem" : 0 }}>
                <span
                  style={{
                    fontSize: "0.72rem",
                    fontWeight: 700,
                    color: "var(--hunter-purple)",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                  }}
                >
                  Liked
                </span>
                <p style={{ margin: "0.2rem 0 0", fontSize: "0.875rem", color: "var(--foreground)" }}>
                  {review.liked}
                </p>
              </div>

              {review.heads_up && (
                <div>
                  <span
                    style={{
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      color: "var(--text-faint)",
                      textTransform: "uppercase",
                      letterSpacing: "0.04em",
                    }}
                  >
                    Heads up
                  </span>
                  <p style={{ margin: "0.2rem 0 0", fontSize: "0.875rem", color: "var(--foreground)" }}>
                    {review.heads_up}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}