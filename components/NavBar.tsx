"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold text-slate-950">
          Hunter Recommendations Hub
        </Link>

        <div className="flex items-center gap-4 text-sm">
          <Link
            href="/recommendations"
            className="font-medium text-slate-600 transition hover:text-slate-950"
          >
            Browse
          </Link>

          <Link
            href="/add-recommendation"
            className="font-medium text-slate-600 transition hover:text-slate-950"
          >
            Add
          </Link>

          {loading ? (
            <span className="text-slate-400">Loading...</span>
          ) : user ? (
            <button
              onClick={logout}
              className="rounded-full bg-slate-950 px-4 py-2 font-medium text-white transition hover:bg-slate-800"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="rounded-full bg-slate-950 px-4 py-2 font-medium text-white transition hover:bg-slate-800"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}