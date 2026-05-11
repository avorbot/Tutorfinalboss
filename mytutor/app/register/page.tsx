"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, ChalkboardTeacher, Gear, Rocket } from "@phosphor-icons/react";

const COUNTRIES = [
  "Uganda", "Kenya", "Tanzania", "Rwanda", "Ethiopia", "Nigeria", "Ghana", "South Africa",
  "United States", "United Kingdom", "Canada", "Australia", "United Arab Emirates",
  "Saudi Arabia", "India", "Germany", "France", "Other",
];

const EDUCATION_LEVELS = [
  { value: "primary",       label: "Primary School" },
  { value: "secondary",     label: "Secondary School" },
  { value: "university",    label: "University / College" },
  { value: "adult",         label: "Adult Learner" },
  { value: "professional",  label: "Professional / Corporate" },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get("role") || "student";

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: defaultRole,
    dateOfBirth: "",
    country: "",
    city: "",
    educationLevel: "",
    phone: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function getAge(dob: string): number {
    if (!dob) return 99;
    const diff = Date.now() - new Date(dob).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (form.dateOfBirth) {
      const age = getAge(form.dateOfBirth);
      if (age < 9) {
        setError("Children under 9 cannot register directly. Ask a parent to create a Kids account at /kids");
        return;
      }
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
    { value: "student", label: "Student", icon: GraduationCap,      desc: "I want to find a tutor" },
    { value: "tutor",   label: "Tutor",   icon: ChalkboardTeacher,  desc: "I want to teach students" },
    { value: "admin",   label: "Admin",   icon: Gear,               desc: "Platform administrator" },
  ];

  return (
    <div className="min-h-screen flex bg-[var(--bg-primary)]">
      {/* Left - Visual */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-12" style={{ background: "var(--gradient-hero)" }}>
        <div className="text-white text-center max-w-sm">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
            <Rocket size={40} weight="fill" className="text-white" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Start Your Journey</h2>
          <p className="text-blue-200 text-lg leading-relaxed">
            Create your account in seconds. Students, tutors and admins all welcome.
          </p>
          <div className="mt-10 space-y-3">
            {roles.map((r) => {
              const Icon = r.icon;
              return (
                <div key={r.value} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${form.role === r.value ? "bg-white/20 border-white/40" : "bg-white/10 border-white/10"}`}>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/10">
                    <Icon size={20} weight="fill" className="text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-semibold text-sm">{r.label}</div>
                    <div className="text-xs text-blue-200">{r.desc}</div>
                  </div>
                  {form.role === r.value && <span className="ml-auto text-emerald-300 font-bold">✓</span>}
                </div>
              );
            })}
          </div>
          <div className="mt-8 p-4 rounded-xl bg-white/10 border border-white/20 text-left">
            <p className="text-sm text-blue-200">
              <span className="text-white font-semibold">Kids under 9?</span> Parents can create a safe, gamified kids account at{" "}
              <Link href="/kids" className="text-emerald-300 underline">/kids</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-start justify-center px-6 py-12 overflow-y-auto">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-accent)" }}>
              <GraduationCap size={18} weight="bold" className="text-white" />
            </div>
            <span className="text-lg font-bold text-[var(--text-primary)]">MyTutor</span>
          </Link>

          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-1">Create your account</h1>
          <p className="text-[var(--text-muted)] text-sm mb-6">Join MyTutor — free forever for students</p>

          {/* Role selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-[var(--text-primary)] mb-2">I am a...</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => {
                const Icon = r.icon;
                return (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`py-3 px-3 rounded-xl border-2 text-center cursor-pointer transition-all text-sm ${
                      form.role === r.value
                        ? "border-[var(--neon-blue)] bg-blue-50 dark:bg-blue-950/30 text-[var(--neon-blue)]"
                        : "border-[var(--border)] hover:border-[var(--neon-blue)]/50 text-[var(--text-muted)]"
                    }`}
                  >
                    <div className="flex justify-center mb-1">
                      <Icon size={22} weight={form.role === r.value ? "fill" : "regular"} />
                    </div>
                    <div className="font-medium text-xs">{r.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic info */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Full Name</label>
              <input type="text" className="input" placeholder="John Doe" value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Email Address</label>
              <input type="email" className="input" placeholder="you@example.com" value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Password</label>
              <input type="password" className="input" placeholder="At least 6 characters" value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-[var(--border)]" />
              <span className="text-xs text-[var(--text-muted)]">Profile (optional but recommended)</span>
              <div className="flex-1 h-px bg-[var(--border)]" />
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Date of Birth</label>
              <input type="date" className="input" value={form.dateOfBirth}
                onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                max={new Date().toISOString().split("T")[0]} />
              {form.dateOfBirth && getAge(form.dateOfBirth) < 13 && (
                <p className="text-xs text-amber-500 mt-1">Note: Parental guidance recommended for users under 13.</p>
              )}
            </div>

            {/* Country + City */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Country</label>
                <select className="input" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
                  <option value="">Select country</option>
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">City</label>
                <input type="text" className="input" placeholder="Kampala" value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })} />
              </div>
            </div>

            {/* Education Level */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Education Level</label>
              <select className="input" value={form.educationLevel} onChange={(e) => setForm({ ...form, educationLevel: e.target.value })}>
                <option value="">Select your level</option>
                {EDUCATION_LEVELS.map((l) => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-[var(--text-primary)] mb-1">Phone (optional)</label>
              <input type="tel" className="input" placeholder="+256 700 000000" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 rounded-lg text-base">
              {loading ? "Creating account..." : `Create ${form.role.charAt(0).toUpperCase() + form.role.slice(1)} Account →`}
            </button>
          </form>

          <p className="mt-4 text-xs text-center text-[var(--text-muted)]">
            By registering you agree to our Terms of Service and Privacy Policy.
          </p>
          <p className="mt-4 text-center text-sm text-[var(--text-muted)]">
            Already have an account?{" "}
            <Link href="/login" className="text-[var(--neon-blue)] font-medium hover:underline">
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
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[var(--text-muted)]">Loading...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
