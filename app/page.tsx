import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";
import PinStringWeb from "@/components/PinStringWeb";
import { categories } from "@/data/categories";

export default function HomePage() {
  return (
    <div className="corkboard min-h-screen">
      <PinStringWeb />
      {/* ── Hero notice ───────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pt-20 pb-8">
        <div className="flex justify-center">
          {/* Big center sticky note for hero */}
          <div
            className="sticky-note note-yellow text-center px-12 py-16 w-full"
            style={{ maxWidth: "780px" }}
          >
            <span
              className="inline-block rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-5"
              style={{
                background: "var(--purple-light)",
                color: "var(--purple)",
              }}
            >
              Built for Hunter students
            </span>

            <h1
              className="text-6xl font-black leading-tight sm:text-7xl text-glow"
              style={{ color: "var(--fg-primary)" }}
            >
              Find trusted spots near Hunter — fast.
            </h1>

            <p
              className="mt-5 text-base leading-7"
              style={{ color: "var(--fg-secondary)" }}
            >
              Student-curated suggestions for study spots, food, coffee,
              bookstores, and more. No endless scrolling. Just clear
              recommendations in one place.
            </p>

            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/recommendations" className="btn-purple glow-sm">
                Browse Recommendations
              </Link>
              <Link href="/add-recommendation" className="btn-outline">
                Add a Recommendation
              </Link>
            </div>
          </div>
        </div>

        {/* ── Category sticky notes ───────────────────── */}
        <div className="sticky-grid mt-20 grid gap-8 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.value} category={category} />
          ))}
        </div>

        {/* ── How it works ────────────────────────────── */}
        <div className="sticky-grid mt-20 grid gap-8 pt-6 md:grid-cols-3">
          {[
            {
              num: "01",
              title: "Pick a category",
              desc: "Study spots, food, coffee, bookstores, or school resources.",
            },
            {
              num: "02",
              title: "Compare options",
              desc: "Read short descriptions, ratings, tags, and locations.",
            },
            {
              num: "03",
              title: "Share your own",
              desc: "Log in and add useful recommendations for other students.",
            },
          ].map(({ num, title, desc }) => (
            <div key={num} className="sticky-note p-8 text-center">
              <p
                className="text-4xl font-black text-glow"
                style={{ color: "var(--purple)" }}
              >
                {num}
              </p>
              <h3
                className="mt-3 text-base font-bold"
                style={{ color: "var(--fg-primary)" }}
              >
                {title}
              </h3>
              <p
                className="mt-2 text-sm leading-6"
                style={{ color: "var(--fg-secondary)" }}
              >
                {desc}
              </p>
            </div>
          ))}
        </div>

        <div className="pb-20" />
      </section>
    </div>
  );
}
