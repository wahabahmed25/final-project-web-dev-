import Link from "next/link";
import type { Category } from "@/data/categories";

export default function CategoryCard({ category, index = 0 }: { category: Category; index?: number }) {
  return (
    <Link
      href={`/recommendations/${category.value}`}
      className={`card card-hover fade-up-${Math.min(index + 1, 6)}`}
      style={{
        display: "block",
        padding: "1.5rem",
        textDecoration: "none",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Background accent */}
      <div
        style={{
          position: "absolute",
          top: "-1rem",
          right: "-1rem",
          width: "6rem",
          height: "6rem",
          borderRadius: "50%",
          background: category.gradient,
          opacity: 0.6,
        }}
      />

      {/* Icon */}
      <div
        style={{
          width: "2.75rem",
          height: "2.75rem",
          borderRadius: "var(--radius-md)",
          background: category.gradient,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "1.4rem",
          marginBottom: "1rem",
          position: "relative",
        }}
      >
        {category.icon}
      </div>

      {/* Title — uses CSS variable so it flips in dark mode */}
      <h3
        style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "1.125rem",
          color: "var(--foreground)",
          marginBottom: "0.375rem",
        }}
      >
        {category.label}
      </h3>

      {/* Description */}
      <p
        style={{
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          lineHeight: 1.6,
          marginBottom: "1.25rem",
        }}
      >
        {category.description}
      </p>

      {/* CTA */}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "0.25rem",
          fontSize: "0.825rem",
          fontWeight: 600,
          color: category.accent,
        }}
      >
        View recommendations →
      </span>
    </Link>
  );
}