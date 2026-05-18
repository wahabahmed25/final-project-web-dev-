"use client";

import Link from "next/link";
import RecommendationForm from "@/components/RecommendationForm";
import { useAuth } from "@/context/AuthContext";

export default function AddRecommendationPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="corkboard min-h-screen flex items-start justify-center px-4 py-16">
        <div
          className="sticky-note note-yellow w-full max-w-3xl p-6 mt-6 text-sm"
          style={{ color: "var(--fg-secondary)" }}
        >
          Checking login status...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="corkboard min-h-screen flex items-start justify-center px-4 py-16">
        <div className="sticky-note note-pink w-full max-w-3xl p-10 text-center mt-6">
          <h1
            className="text-3xl font-extrabold"
            style={{ color: "var(--fg-primary)" }}
          >
            Login required
          </h1>
          <p className="mt-3 text-sm" style={{ color: "var(--fg-secondary)" }}>
            You need to log in before adding a recommendation.
          </p>
          <Link href="/login" className="btn-purple mt-6 glow-sm">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="corkboard min-h-screen px-4 py-16">
      <div className="mx-auto max-w-3xl">
        {/* Header note */}
        <div className="sticky-note note-mint p-8 mb-10 mt-6">
          <p
            className="text-xs font-bold uppercase tracking-widest mb-2"
            style={{ color: "var(--purple)" }}
          >
            Share with students
          </p>
          <h1
            className="text-4xl font-extrabold"
            style={{ color: "var(--fg-primary)" }}
          >
            Add a Recommendation
          </h1>
          <p className="mt-2 text-sm leading-6" style={{ color: "var(--fg-secondary)" }}>
            Add a helpful place or resource for other Hunter students.
          </p>
        </div>

        <RecommendationForm />
        <div className="pb-16" />
      </div>
    </div>
  );
}
