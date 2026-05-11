"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, ShieldCheck } from "@phosphor-icons/react";

export default function ParentRegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", pin: "", confirmPin: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.pin.length !== 4 || !/^\d{4}$/.test(form.pin)) {
      setError("PIN must be exactly 4 digits");
      return;
    }
    if (form.pin !== form.confirmPin) {
      setError("PINs don't match");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/parent/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password, pin: form.pin }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      router.push("/parent/add-child");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg, #050814, #0a1628, #0f0a2e)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}>
            <ShieldCheck size={32} weight="fill" className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2">Parent Registration</h1>
          <p className="text-blue-300">Create your account to set up a Kids Zone for your child</p>
        </div>

        <div className="rounded-3xl p-8 space-y-5"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.3)" }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-blue-300 mb-1">Your Full Name</label>
              <input type="text" className="input" placeholder="Jane Smith" required
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-blue-300 mb-1">Email Address</label>
              <input type="email" className="input" placeholder="you@example.com" required
                value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-blue-300 mb-1">Password</label>
              <input type="password" className="input" placeholder="At least 6 characters" required minLength={6}
                value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>

            <div className="border-t border-white/10 pt-4">
              <p className="text-xs text-purple-300 mb-3">
                🔐 Set a 4-digit PIN — your child will use this to log in
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-bold text-blue-300 mb-1">PIN (4 digits)</label>
                  <input type="password" inputMode="numeric" maxLength={4} pattern="\d{4}" className="input text-center text-2xl tracking-widest"
                    placeholder="••••" required value={form.pin}
                    onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-blue-300 mb-1">Confirm PIN</label>
                  <input type="password" inputMode="numeric" maxLength={4} pattern="\d{4}" className="input text-center text-2xl tracking-widest"
                    placeholder="••••" required value={form.confirmPin}
                    onChange={(e) => setForm({ ...form, confirmPin: e.target.value.replace(/\D/g, "").slice(0, 4) })} />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/40 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl text-lg font-black text-white transition-all"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", boxShadow: "0 0 20px rgba(139,92,246,0.4)" }}>
              {loading ? "Creating account..." : "Create Parent Account →"}
            </button>
          </form>

          <p className="text-center text-sm text-blue-400">
            Already have an account?{" "}
            <Link href="/parent/dashboard" className="text-purple-300 font-bold hover:text-white">
              Go to Dashboard
            </Link>
          </p>
          <p className="text-center text-sm text-blue-400">
            <Link href="/" className="text-blue-300 hover:text-white">← Back to main site</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
