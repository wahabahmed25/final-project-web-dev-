"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getRecommendationById } from "@/lib/recommendation";
import RecommendationForm from "@/components/RecommendationForm";
import type { Recommendation } from "@/types/recommendation";

export default function EditRecommendationPage() {
  const params = useParams();
  const id = String(params.id);
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [rec, setRec] = useState<Recommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.replace("/login"); return; }

    async function load() {
      try {
        const data = await getRecommendationById(id);
        if (!data) { setError("Recommendation not found."); return; }
        if (data.createdBy !== user!.uid) {
          router.replace(`/recommendation/${id}`);
          return;
        }
        setRec(data);
      } catch {
        setError("Could not load this recommendation.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div className="skeleton" style={{ height: "2rem", width: "60%", marginBottom: "1.5rem" }} />
        <div className="skeleton" style={{ height: "400px", borderRadius: "var(--radius-xl)" }} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "2.5rem 1.5rem" }}>
        <div style={{ background: "#FEF2F2", borderRadius: "var(--radius-lg)", padding: "1rem", color: "var(--error)" }}>{error}</div>
      </div>
    );
  }

  if (!rec) return null;

  return (
    <div style={{ minHeight: "calc(100vh - 4rem)", padding: "2.5rem 1.5rem" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Link
          href={`/recommendation/${id}`}
          style={{ display: "inline-flex", alignItems: "center", gap: "0.375rem", fontSize: "0.875rem", fontWeight: 600, color: "var(--hunter-purple)", textDecoration: "none", marginBottom: "1.5rem" }}
        >
          ← Back to recommendation
        </Link>

        <div style={{ marginBottom: "2rem" }}>
          <span style={{ display: "inline-block", fontSize: "0.75rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--hunter-gold-dark)", marginBottom: "0.375rem" }}>
            ✏️ Edit
          </span>
          <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.75rem, 4vw, 2.5rem)", color: "var(--foreground)", margin: "0 0 0.5rem" }}>
            Edit Recommendation
          </h1>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            Update the details for <strong>{rec.title}</strong>.
          </p>
        </div>

        <RecommendationForm
          editId={rec.id}
          initialValues={{
            title: rec.title,
            category: rec.category,
            description: rec.description,
            location: rec.location,
            rating: rec.rating,
            tags: rec.tags,
          }}
        />
      </div>
    </div>
  );
}
