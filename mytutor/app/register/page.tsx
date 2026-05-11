"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") || "student";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: defaultRole,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push(`/dashboard/${data.user.role}`);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const roles = [
    { value: "student", label: "Student", icon: "🎓", desc: "I want to find a tutor" },
    { value: "tutor", label: "Tutor", icon: "👨‍🏫", desc: "I want to teach students" },
    { value: "admin", label: "Admin", icon: "⚙️", desc: "Platform administrator" },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-indigo-600 to-blue-700 items-center justify-center p-12">
        <div className="text-white text-center max-w-sm">
          <div className="text-7xl mb-6">🚀</div>
          <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-indigo-200 text-lg leading-relaxed">
            Create your account in seconds. Students, tutors and admins all welcome.
          </p>
          <div className="mt-10 space-y-3">
            {roles.map((r) => (
              <div key={r.value} className={`flex items-center gap-3 p-3 rounded-xl border ${form.role === r.value ? "bg-white/20 border-white/40" : "bg-white/10 border-white/10"}`}>
                <span className="text-2xl">{r.icon}</span>
                <div className="text-left">
                  <div className="font-semibold text-sm">{r.label}</div>
                  <div className="text-xs text-indigo-200">{r.desc}</div>
                </div>
                {form.role === r.value && <span className="ml-auto text-white">✓</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MT</span>
            </div>
            <span className="text-lg font-bold text-gray-900">MyTutor</span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-6">Join MyTutor — free forever for students</p>

          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.value })}
                  className={`py-3 px-3 rounded-xl border-2 text-center cursor-pointer transition-all text-sm ${
                    form.role === r.value
                      ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-600"
                  }`}
                >
                  <div className="text-xl mb-1">{r.icon}</div>
                  <div className="font-medium">{r.label}</div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                className="input"
                placeholder="John Doe"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
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
                placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
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
              {loading ? "Creating account..." : `Create ${form.role.charAt(0).toUpperCase() + form.role.slice(1)} Account →`}
            </button>
          </form>

          <p className="mt-4 text-xs text-center text-gray-400">
            By registering, you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="mt-4 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-indigo-600 font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
