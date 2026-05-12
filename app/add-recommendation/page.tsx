"use client";

import Link from "next/link";
import RecommendationForm from "@/components/RecommendationForm";
import { useAuth } from "@/context/AuthContext";

export default function AddRecommendationPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
            Checking login status...
          </div>
        </section>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <section className="mx-auto max-w-3xl px-4 py-12">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-3xl font-bold text-slate-950">
              Login required
            </h1>

            <p className="mt-3 text-slate-600">
              You need to log in before adding a recommendation.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Go to Login
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="mx-auto max-w-3xl px-4 py-12">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Share with students
          </p>

          <h1 className="mt-2 text-4xl font-bold text-slate-950">
            Add a Recommendation
          </h1>

          <p className="mt-3 text-slate-600">
            Add a helpful place or resource for other Hunter students.
          </p>
        </div>

        <RecommendationForm />
      </section>
    </div>
  );
}