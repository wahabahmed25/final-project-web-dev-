import Link from "next/link";
import { getCategoryLabel } from "@/data/categories";
import type { Recommendation } from "@/types/recommendation";

export default function RecommendationCard({
  recommendation,
}: {
  recommendation: Recommendation;
}) {
  return (
    <Link
      href={`/recommendation/${recommendation.id}`}
      className="block sticky-note p-5"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p
            className="text-xs font-bold uppercase tracking-wide"
            style={{ color: "var(--purple)" }}
          >
            {getCategoryLabel(recommendation.category)}
          </p>

          <h3
            className="mt-1 text-lg font-bold"
            style={{ color: "var(--fg-primary)" }}
          >
            {recommendation.title}
          </h3>
        </div>

        <div
          className="shrink-0 rounded-full px-3 py-1 text-sm font-bold"
          style={{
            background: "var(--note-yellow)",
            color: "var(--fg-primary)",
          }}
        >
          ⭐ {recommendation.rating}/5
        </div>
      </div>

      <p
        className="mt-3 line-clamp-2 text-sm leading-6"
        style={{ color: "var(--fg-secondary)" }}
      >
        {recommendation.description}
      </p>

      <p className="mt-3 text-sm" style={{ color: "var(--fg-muted)" }}>
        📍 {recommendation.location}
      </p>

      {recommendation.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {recommendation.tags.slice(0, 3).map((tag) => (
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
      )}

      <div
        className="mt-4 flex items-center justify-between border-t pt-4 text-xs"
        style={{
          borderColor: "var(--border)",
          color: "var(--fg-muted)",
        }}
      >
        <span>By {recommendation.createdByName}</span>
        <span style={{ color: "var(--purple)", fontWeight: 600 }}>
          {recommendation.upvotes} upvotes
        </span>
      </div>
    </Link>
  );
}
