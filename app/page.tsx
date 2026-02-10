import Link from "next/link";

export default function Page() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Welcome</h1>

      <div className="flex gap-4">
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-lg bg-black text-white hover:bg-gray-800 transition"
        >
          Dashboard
        </Link>

        <Link
          href="/home"
          className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition"
        >
          Home
        </Link>
      </div>
    </main>
  );
}
