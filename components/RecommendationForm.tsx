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
  const [category, setCategory] = useState<RecommendationCategory>("study-spots");
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
      className="sticky-note note-lavender p-8"
    >
      {error && (
        <div
          className="mb-6 rounded-2xl px-4 py-3 text-sm font-semibold"
          style={{
            background: "var(--note-pink)",
            color: "var(--fg-primary)",
            border: "1.5px solid var(--border-hover)",
          }}
        >
          {error}
        </div>
      )}

      <div className="grid gap-5">
        {[
          {
            label: "Recommendation Name",
            type: "text" as const,
            value: title,
            onChange: setTitle,
            placeholder: "Example: Hunter Library 3rd Floor",
          },
          {
            label: "Location",
            type: "text" as const,
            value: location,
            onChange: setLocation,
            placeholder: "Example: Hunter East, 3rd Floor",
          },
          {
            label: "Tags",
            type: "text" as const,
            value: tags,
            onChange: setTags,
            placeholder: "Example: quiet, wifi, cheap, on-campus",
            hint: "Separate tags with commas.",
          },
        ].map(({ label, type, value, onChange, placeholder, hint }) => (
          <div key={label}>
            <label
              className="mb-2 block text-sm font-bold"
              style={{ color: "var(--fg-primary)" }}
            >
              {label}
            </label>
            <input
              type={type}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="themed-input"
            />
            {hint && (
              <p className="mt-1.5 text-xs" style={{ color: "var(--fg-muted)" }}>
                {hint}
              </p>
            )}
          </div>
        ))}

        <div>
          <label
            className="mb-2 block text-sm font-bold"
            style={{ color: "var(--fg-primary)" }}
          >
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as RecommendationCategory)}
            className="themed-input"
          >
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-bold"
            style={{ color: "var(--fg-primary)" }}
          >
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a short useful description for other students."
            rows={5}
            className="themed-input resize-none"
          />
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-bold"
            style={{ color: "var(--fg-primary)" }}
          >
            Rating
          </label>
          <select
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            className="themed-input"
          >
            <option value="5">5 — Excellent</option>
            <option value="4">4 — Good</option>
            <option value="3">3 — Okay</option>
            <option value="2">2 — Not great</option>
            <option value="1">1 — Poor</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-purple w-full glow-sm"
        >
          {isSubmitting ? "Saving..." : "Submit Recommendation"}
        </button>
      </div>
    </form>
  );
}
