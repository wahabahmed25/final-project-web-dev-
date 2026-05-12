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
      className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            {getCategoryLabel(recommendation.category)}
          </p>

          <h3 className="mt-1 text-lg font-semibold text-slate-950">
            {recommendation.title}
          </h3>
        </div>

        <div className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-800">
          ⭐ {recommendation.rating}/5
        </div>
      </div>

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
        {recommendation.description}
      </p>

      <p className="mt-3 text-sm text-slate-500">
        📍 {recommendation.location}
      </p>

      {recommendation.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {recommendation.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-500">
        <span>Posted by {recommendation.createdByName}</span>
        <span>{recommendation.upvotes} upvotes</span>
      </div>
    </Link>
  );
}