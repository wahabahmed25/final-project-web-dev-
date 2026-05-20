import Link from "next/link";
import type { Category } from "@/data/categories";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/recommendations/${category.value}`}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-900"
    >
      <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
        {category.label}
      </h3>
      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {category.description}
      </p>
      <p className="mt-4 text-sm font-semibold text-blue-600 dark:text-blue-400">
        View recommendations
      </p>
    </Link>
  );
}