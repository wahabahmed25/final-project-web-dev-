import Link from "next/link";
import type { Category } from "@/data/categories";

export default function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      href={`/recommendations/${category.value}`}
      className="block sticky-note p-6"
    >
      <h3
        className="text-lg font-bold"
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
