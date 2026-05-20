"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { getRecommendationsByUser, deleteRecommendation } from "@/lib/recommendation";
import { getCategoryIcon, getCategoryLabel } from "@/data/categories";
import { DashboardCardSkeleton } from "@/components/LoadingSkeleton";
import type { Recommendation } from "@/types/recommendation";

function StatCard({ icon, value, label }: { icon: string; value: string | number; label: string }) {
  return (
    <div
      className="card"
      style={{ padding: "1.5rem", textAlign: "center" }}
    >
      <span style={{ fontSize: "1.75rem", display: "block", marginBottom: "0.5rem" }}>{icon}</span>
      <p
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "1.75rem",
          color: "var(--hunter-purple)",
          margin: "0 0 0.25rem",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
      <p style={{ fontSize: "0.8rem", color: "var(--text-faint)", margin: 0, fontWeight: 500 }}>
        {label}
      </p>
    </div>
  );
}

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (!user) return;
    async function load() {
      try {
        setLoading(true);
        const data = await getRecommendationsByUser(user!.uid);
        setRecommendations(data);
      } catch {
        showToast("Could not load your recommendations.", "error");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    try {
      setDeleting(id);
      await deleteRecommendation(id);
      setRecommendations((prev) => prev.filter((r) => r.id !== id));
      showToast("Recommendation deleted.", "info");
    } catch {
      showToast("Could not delete. Please try again.", "error");
    } finally {
      setDeleting(null);
    }
  }

  if (authLoading) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "3rem 1.5rem", textAlign: "center" }}>
        <div className="skeleton" style={{ height: "2rem", width: "15rem", margin: "0 auto 1rem" }} />
        <div className="skeleton" style={{ height: "1rem", width: "10rem", margin: "0 auto" }} />
      </div>
    );
  }

  if (!user) return null;

  // Stats
  const totalUpvotes = recommendations.reduce((sum, r) => sum + r.upvotes, 0);
  const avgRating =
    recommendations.length > 0
      ? (recommendations.reduce((sum, r) => sum + r.rating, 0) / recommendations.length).toFixed(1)
      : "—";

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div
        style={{
          background: `linear-gradient(135deg, var(--hunter-purple) 0%, var(--hunter-purple-dark) 100%)`,
          padding: "2.5rem 1.5rem",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexWrap: "wrap", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div
                style={{
                  width: "3.5rem",
                  height: "3.5rem",
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.375rem",
                  fontWeight: 700,
                  border: "2px solid rgba(255,255,255,0.3)",
                }}
              >
                {(user.displayName || user.email || "U")[0].toUpperCase()}
              </div>
              <div>
                <h1
                  style={{
                    fontFamily: "'DM Serif Display', serif",
                    fontSize: "1.625rem",
                    color: "#fff",
                    margin: "0 0 0.2rem",
                  }}
                >
                  My Dashboard
                </h1>
                <p style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.7)", margin: 0 }}>
                  {user.displayName || user.email}
                </p>
              </div>
            </div>
            <Link href="/add-recommendation" className="btn btn-gold" style={{ flexShrink: 0 }}>
              + Add Recommendation
            </Link>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem 1.5rem" }}>
        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem",
          }}
        >
          <StatCard icon="📋" value={recommendations.length} label="Submissions" />
          <StatCard icon="▲" value={totalUpvotes} label="Total Upvotes" />
          <StatCard icon="⭐" value={avgRating} label="Avg Rating" />
        </div>

        {/* Recommendations list */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
            <h2
              style={{
                fontFamily: "'DM Serif Display', serif",
                fontSize: "1.375rem",
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              Your Recommendations
            </h2>
          </div>

          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {Array.from({ length: 4 }).map((_, i) => <DashboardCardSkeleton key={i} />)}
            </div>
          ) : recommendations.length === 0 ? (
            <div className="card" style={{ padding: "3rem", textAlign: "center" }}>
              <span style={{ fontSize: "2.5rem", display: "block", marginBottom: "1rem" }}>✍️</span>
              <h3
                style={{
                  fontFamily: "'DM Serif Display', serif",
                  fontSize: "1.25rem",
                  color: "var(--foreground)",
                  marginBottom: "0.5rem",
                }}
              >
                No recommendations yet
              </h3>
              <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1.5rem" }}>
                Share your favorite spots with fellow Hunter students.
              </p>
              <Link href="/add-recommendation" className="btn btn-purple">
                Add Your First Recommendation
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {recommendations.map((r) => (
                <div
                  key={r.id}
                  className="card"
                  style={{
                    padding: "1.25rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    flexWrap: "wrap",
                  }}
                >
                  {/* Category icon */}
                  <div
                    style={{
                      width: "3rem",
                      height: "3rem",
                      borderRadius: "var(--radius-md)",
                      background: "var(--hunter-purple-faint)",
                      border: "1px solid var(--border)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.25rem",
                      flexShrink: 0,
                    }}
                  >
                    {getCategoryIcon(r.category)}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontFamily: "'DM Serif Display', serif",
                        fontSize: "1rem",
                        color: "var(--foreground)",
                        margin: "0 0 0.2rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {r.title}
                    </p>
                    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "0.775rem", color: "var(--text-faint)" }}>
                        {getCategoryLabel(r.category)}
                      </span>
                      <span style={{ fontSize: "0.775rem", color: "var(--hunter-gold-dark)" }}>
                        ★ {r.rating}/5
                      </span>
                      <span style={{ fontSize: "0.775rem", color: "var(--hunter-purple)" }}>
                        ▲ {r.upvotes} upvotes
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                    <Link
                      href={`/recommendation/${r.id}`}
                      className="btn btn-ghost"
                      style={{ padding: "0.4rem 0.875rem", fontSize: "0.8rem" }}
                    >
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(r.id, r.title)}
                      disabled={deleting === r.id}
                      style={{
                        padding: "0.4rem 0.875rem",
                        fontSize: "0.8rem",
                        borderRadius: "100px",
                        border: "1.5px solid #FECACA",
                        background: deleting === r.id ? "#FEF2F2" : "transparent",
                        color: "var(--error)",
                        cursor: "pointer",
                        fontWeight: 600,
                        transition: "all 0.15s",
                      }}
                    >
                      {deleting === r.id ? "..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}