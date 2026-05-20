import Link from "next/link";
import CategoryCard from "@/components/CategoryCard";
import { categories } from "@/data/categories";
import ThemeToggle from "@/components/theme-toggle";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
        <div className="mb-8 flex justify-end">
          <ThemeToggle />
        </div>

        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
            Built for Hunter students
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl dark:text-white">
            Find trusted recommendations near Hunter faster.
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Browse student-friendly suggestions for study spots, food, coffee,
            bookstores, school resources, and more. No endless scrolling. Just
            clear recommendations in one place.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href="/recommendations"
              className="rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Browse Recommendations
            </Link>

            <Link
              href="/add-recommendation"
              className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-sm transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              Add a Recommendation
            </Link>
          </div>
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.value} category={category} />
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                01
              </p>
              <h3 className="mt-3 font-semibold text-slate-950 dark:text-white">
                Pick a category
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Choose study spots, food, coffee, bookstores, or school
                resources.
              </p>
            </div>

            <div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                02
              </p>
              <h3 className="mt-3 font-semibold text-slate-950 dark:text-white">
                Compare options
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Read short descriptions, ratings, tags, and locations.
              </p>
            </div>

            <div>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                03
              </p>
              <h3 className="mt-3 font-semibold text-slate-950 dark:text-white">
                Share your own
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                Log in and add useful recommendations for other students.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}