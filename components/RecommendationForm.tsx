"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { categories } from "@/data/categories";
import { addRecommendation } from "@/lib/recommendation";
import type { RecommendationCategory } from "@/types/recommendation";
import { useAuth } from "@/context/AuthContext";

export default function RecommendationForm() {
  const router = useRouter();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [category, setCategory] =
    useState<RecommendationCategory>("study-spots");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [rating, setRating] = useState("5");
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!user) {
      setError("You must be logged in to add a recommendation.");
      return;
    }

    if (!title.trim() || !description.trim() || !location.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    const numericRating = Number(rating);

    if (Number.isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      setError("Rating must be between 1 and 5.");
      return;
    }

    try {
      setIsSubmitting(true);

      await addRecommendation({
        title,
        category,
        description,
        location,
        rating: numericRating,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
        createdBy: user.uid,
        createdByName: user.displayName || user.email || "Student",
      });

      router.push("/recommendations");
    } catch (err) {
      console.error(err);
      setError("Something went wrong while saving your recommendation.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {error && (
        <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Recommendation Name
          </label>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Example: Hunter Library 3rd Floor"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Category
          </label>
          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as RecommendationCategory)
            }
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Write a short useful description for other students."
            rows={5}
            className="w-full resize-none rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Location
          </label>
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Example: Hunter East, 3rd Floor"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Rating
          </label>
          <select
            value={rating}
            onChange={(event) => setRating(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          >
            <option value="5">5 - Excellent</option>
            <option value="4">4 - Good</option>
            <option value="3">3 - Okay</option>
            <option value="2">2 - Not great</option>
            <option value="1">1 - Poor</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Tags
          </label>
          <input
            type="text"
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="Example: quiet, wifi, cheap, on-campus"
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
          />
          <p className="mt-2 text-xs text-slate-500">
            Separate tags with commas.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Saving..." : "Submit Recommendation"}
        </button>
      </div>
    </form>
  );
}