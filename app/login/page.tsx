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
    <div
      className="corkboard min-h-screen flex items-center justify-center px-4 py-16"
    >
      {/* Big sticky note card */}
      <div
        className="sticky-note note-lavender w-full max-w-md p-10 text-center mt-6"
        style={{ borderRadius: "4px" }}
      >
        {/* Pin dot */}
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full z-10 glow-md"
          style={{
            background: "var(--purple)",
            boxShadow: "var(--glow-md)",
            marginTop: "2px",
          }}
        />

        <span
          className="inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest mb-4"
          style={{
            background: "var(--purple-light)",
            color: "var(--purple)",
          }}
        >
          Student Access
        </span>

        <h1
          className="text-3xl font-bold leading-tight mb-3"
          style={{ color: "var(--fg-primary)" }}
        >
          Login to Hunter Recommendations Hub
        </h1>

        <p
          className="text-sm leading-7"
          style={{ color: "var(--fg-secondary)" }}
        >
          Sign in with Google to add recommendations and upvote helpful
          suggestions from other students.
        </p>

        {loading ? (
          <div
            className="mt-8 rounded-2xl px-5 py-3 text-sm"
            style={{
              background: "var(--bg-secondary)",
              color: "var(--fg-muted)",
            }}
          >
            Loading...
          </div>
        ) : user ? (
          <div className="mt-8 flex flex-col gap-4">
            <div
              className="rounded-2xl px-5 py-4 text-sm"
              style={{
                background: "var(--note-mint)",
                color: "var(--fg-primary)",
                border: "1px solid var(--border-hover)",
              }}
            >
              Signed in as{" "}
              <span className="font-bold">
                {user.displayName || user.email}
              </span>
            </div>
            <button onClick={logout} className="btn-outline w-full">
              Sign Out
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="btn-purple mt-8 w-full glow-sm"
          >
            Continue with Google
          </button>
        )}

        {/* Decorative doodle lines */}
        <div
          className="mt-8 flex items-center gap-2"
          style={{ color: "var(--fg-muted)" }}
        >
          <div className="flex-1 border-t" style={{ borderColor: "var(--border)" }} />
          <span className="text-xs">Hunter College</span>
          <div className="flex-1 border-t" style={{ borderColor: "var(--border)" }} />
        </div>
      </div>
    </div>
  );
}
