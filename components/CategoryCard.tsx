import Link from "next/link";
import type { Category } from "@/data/categories";

const categoryEmojis: Record<string, string> = {
  "study-spots": "📚",
  "food": "🍕",
  "coffee": "☕",
  "bookstores": "📖",
  "school-resources": "🏫",
};

export default function CategoryCard({ category }: { category: Category }) {
  const emoji = categoryEmojis[category.value] ?? "📌";
  return (
    <Link
      href={`/recommendations/${category.value}`}
      className="block sticky-note p-6"
    >
      <div className="text-3xl mb-2">{emoji}</div>
      <h3
        className="text-xl font-bold font-fun"
        style={{ color: "var(--fg-primary)" }}
      >
        {category.label}
      </h3>

      <p
        className="mt-2 text-sm leading-6"
        style={{ color: "var(--fg-secondary)" }}
      >
        {category.description}
      </p>

      <p
        className="mt-4 text-sm font-bold"
        style={{ color: "var(--purple)" }}
      >
        View recommendations →
      </p>
    </Link>
  );
}
