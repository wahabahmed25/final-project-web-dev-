"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { categories, getCategoryTags } from "@/data/categories";
import { addRecommendation, updateRecommendation } from "@/lib/recommendation";
import type { RecommendationCategory } from "@/types/recommendation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";

const TITLE_MAX = 80;
const DESC_MAX = 500;

function FieldError({ msg }: { msg: string }) {
  if (!msg) return null;
  return (
    <p style={{ marginTop: "0.35rem", fontSize: "0.8rem", color: "var(--error)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
      ⚠ {msg}
    </p>
  );
}

function CharCount({ current, max }: { current: number; max: number }) {
  const pct = current / max;
  const color = pct > 0.9 ? "var(--error)" : pct > 0.75 ? "#D97706" : "var(--text-faint)";
  return (
    <span style={{ fontSize: "0.75rem", color, marginLeft: "auto" }}>
      {current}/{max}
    </span>
  );
}

interface Props {
  initialValues?: {
    title: string;
    category: RecommendationCategory;
    description: string;
    location: string;
    rating: number;
    tags: string[];
  };
  editId?: string;
}

export default function RecommendationForm({ initialValues, editId }: Props) {
  const router = useRouter();
  const { user } = useAuth();
  const { showToast } = useToast();

  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [category, setCategory] = useState<RecommendationCategory>(initialValues?.category ?? "study-spots");
  const [description, setDescription] = useState(initialValues?.description ?? "");
  const [location, setLocation] = useState(initialValues?.location ?? "");
  const [rating, setRating] = useState(initialValues?.rating ?? 5);
  const [tags, setTags] = useState<string[]>(initialValues?.tags ?? []);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Touched state for field-level validation
  const [touched, setTouched] = useState({
    title: false,
    description: false,
    location: false,
  });

  const errors = {
    title:
      !title.trim()
        ? "Title is required."
        : title.length > TITLE_MAX
        ? `Title must be ${TITLE_MAX} characters or fewer.`
        : "",
    description:
      !description.trim()
        ? "Description is required."
        : description.length > DESC_MAX
        ? `Description must be ${DESC_MAX} characters or fewer.`
        : "",
    location: !location.trim() ? "Location is required." : "",
  };

  const isValid = !errors.title && !errors.description && !errors.location;

  const suggestedTags = getCategoryTags(category);

  function toggleTag(tag: string) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  }

  function handleTagInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const val = tagInput.trim().toLowerCase().replace(/^#/, "");
      if (val && !tags.includes(val)) setTags((prev) => [...prev, val]);
      setTagInput("");
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags((prev) => prev.slice(0, -1));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setTouched({ title: true, description: true, location: true });

    if (!user) {
      showToast("You must be logged in to add a recommendation.", "error");
      return;
    }

    if (!isValid) return;

    try {
      setIsSubmitting(true);
      if (editId) {
        await updateRecommendation(editId, { title, description, location, rating, tags });
        showToast("Recommendation updated! ✅", "success");
        router.push(`/recommendation/${editId}`);
      } else {
        await addRecommendation({
          title, category, description, location, rating, tags,
          createdBy: user.uid,
          createdByName: user.displayName || user.email || "Student",
        });
        showToast("Recommendation added successfully! 🎉", "success");
        router.push("/recommendations");
      }
    } catch (err) {
      console.error(err);
      showToast("Something went wrong. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card" style={{ padding: "2rem" }} noValidate>
      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

        {/* Title */}
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>
              Name <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <CharCount current={title.length} max={TITLE_MAX} />
          </div>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value.slice(0, TITLE_MAX))}
            onBlur={() => setTouched((t) => ({ ...t, title: true }))}
            placeholder="e.g. Hunter Library 3rd Floor"
            className={`input${touched.title && errors.title ? " error-field" : ""}`}
          />
          {touched.title && <FieldError msg={errors.title} />}
        </div>

        {/* Category */}
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem" }}>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value as RecommendationCategory); setTags([]); }}
            className="input"
            style={{ cursor: "pointer" }}
          >
            {categories.map((item) => (
              <option key={item.value} value={item.value}>
                {item.icon} {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
            <label style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)" }}>
              Description <span style={{ color: "var(--error)" }}>*</span>
            </label>
            <CharCount current={description.length} max={DESC_MAX} />
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, DESC_MAX))}
            onBlur={() => setTouched((t) => ({ ...t, description: true }))}
            placeholder="Write a helpful description for other students."
            rows={4}
            className={`input${touched.description && errors.description ? " error-field" : ""}`}
            style={{ resize: "vertical", minHeight: "6rem" }}
          />
          {touched.description && <FieldError msg={errors.description} />}
        </div>

        {/* Location */}
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem" }}>
            Location <span style={{ color: "var(--error)" }}>*</span>
          </label>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, location: true }))}
            placeholder="e.g. Hunter East, 3rd Floor"
            className={`input${touched.location && errors.location ? " error-field" : ""}`}
          />
          {touched.location && <FieldError msg={errors.location} />}
        </div>

        {/* Star Rating */}
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem" }}>
            Your Rating
          </label>
          <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className="star-btn"
                onClick={() => setRating(n)}
                aria-label={`Rate ${n} star${n !== 1 ? "s" : ""}`}
              >
                <span style={{ color: n <= rating ? "var(--hunter-gold)" : "var(--border)", transition: "color 0.15s" }}>
                  ★
                </span>
              </button>
            ))}
            <span style={{ marginLeft: "0.5rem", fontSize: "0.825rem", color: "var(--text-muted)" }}>
              {["", "Poor", "Not great", "Okay", "Good", "Excellent"][rating]}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label style={{ display: "block", fontSize: "0.875rem", fontWeight: 600, color: "var(--foreground)", marginBottom: "0.5rem" }}>
            Tags
          </label>

          {/* Suggested tags */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginBottom: "0.75rem" }}>
            {suggestedTags.map((t) => (
              <button
                key={t}
                type="button"
                className={`tag${tags.includes(t) ? " active" : ""}`}
                onClick={() => toggleTag(t)}
              >
                {tags.includes(t) ? "✓ " : "+"} #{t}
              </button>
            ))}
          </div>

          {/* Selected tags display + custom input */}
          <div
            className="input"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.375rem",
              alignItems: "center",
              padding: "0.5rem 0.75rem",
              minHeight: "3rem",
              cursor: "text",
            }}
            onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()}
          >
            {tags.filter((t) => !suggestedTags.includes(t) || tags.includes(t)).map((tag) => (
              <span
                key={tag}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.25rem",
                  padding: "0.15rem 0.625rem",
                  borderRadius: "100px",
                  background: "var(--hunter-purple)",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 500,
                }}
              >
                #{tag}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setTags((prev) => prev.filter((t) => t !== tag)); }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#fff", padding: 0, fontSize: "0.7rem", lineHeight: 1 }}
                >
                  ✕
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder={tags.length === 0 ? "Type a tag and press Enter..." : ""}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: "0.875rem",
                color: "var(--foreground)",
                minWidth: "120px",
                flex: 1,
              }}
            />
          </div>
          <p style={{ marginTop: "0.35rem", fontSize: "0.75rem", color: "var(--text-faint)" }}>
            Select from suggestions above or type your own and press Enter.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn btn-purple"
          style={{ width: "100%", justifyContent: "center", padding: "0.8rem", fontSize: "0.9375rem" }}
        >
          {isSubmitting ? (
            <>
              <span style={{ width:"1rem", height:"1rem", borderRadius:"50%", border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", animation:"spin 0.7s linear infinite", display:"inline-block" }} />
              Saving...
            </>
          ) : editId ? "Save Changes" : "Submit Recommendation"}
        </button>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}