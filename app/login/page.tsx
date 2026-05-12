"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, loginWithGoogle, logout } = useAuth();

  async function handleLogin() {
    await loginWithGoogle();
    router.push("/recommendations");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="mx-auto flex max-w-md px-4 py-16">
        <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Student Access
          </p>

          <h1 className="mt-2 text-3xl font-bold text-slate-950">
            Login to Hunter Recommendations Hub
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Log in with Google to add recommendations and upvote helpful
            suggestions.
          </p>

          {loading ? (
            <div className="mt-8 rounded-2xl bg-slate-100 px-5 py-3 text-sm text-slate-600">
              Loading...
            </div>
          ) : user ? (
            <div className="mt-8">
              <div className="rounded-2xl bg-green-50 px-5 py-4 text-sm text-green-700">
                You are logged in as{" "}
                <span className="font-semibold">
                  {user.displayName || user.email}
                </span>
                .
              </div>

              <button
                onClick={logout}
                className="mt-4 w-full rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100"
              >
                Logout
              </button>
            </div>
          ) : (
            <button
              onClick={handleLogin}
              className="mt-8 w-full rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Continue with Google
            </button>
          )}
        </div>
      </section>
    </div>
  );
}