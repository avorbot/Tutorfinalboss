"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      const role = data.user.role;
      router.push(`/dashboard/${role}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const demoLogins = [
    { role: "Admin", email: "admin@mytutor.app", password: "demo1234", color: "bg-purple-50 border-purple-200 text-purple-700" },
    { role: "Tutor", email: "tutor@mytutor.app", password: "demo1234", color: "bg-blue-50 border-blue-200 text-blue-700" },
    { role: "Student", email: "student@mytutor.app", password: "demo1234", color: "bg-green-50 border-green-200 text-green-700" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MT</span>
            </div>
            <span className="text-lg font-bold text-gray-900">MyTutor</span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to your account to continue</p>

          {/* Demo quick-login */}
          <div className="mb-6">
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
              Demo Quick Login
            </p>
            <div className="grid grid-cols-3 gap-2">
              {demoLogins.map((d) => (
                <button
                  key={d.role}
                  type="button"
                  onClick={() => setForm({ email: d.email, password: d.password })}
                  className={`text-xs py-2 px-3 rounded-lg border cursor-pointer transition-all hover:opacity-80 ${d.color}`}
                >
                  {d.role}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="input"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="input"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 rounded-lg text-base"
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-600 font-medium hover:underline">
              Create one free
            </Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 to-purple-700 items-center justify-center p-12">
        <div className="text-white text-center max-w-sm">
          <div className="text-7xl mb-6">📚</div>
          <h2 className="text-3xl font-bold mb-4">Learn Without Limits</h2>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Join thousands of students and tutors on MyTutor. Personalized learning, on your schedule.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-4 text-left">
            {["✓ Verified tutors", "✓ All subjects", "✓ Any device", "✓ Affordable rates"].map((f) => (
              <div key={f} className="bg-white/10 rounded-lg px-4 py-2 text-sm">{f}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
