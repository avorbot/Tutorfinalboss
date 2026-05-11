"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AvatarPicker } from "@/components/kids/AvatarPicker";

export default function AddChildPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", age: "", avatarId: "1", favouriteColor: "blue" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const age = parseInt(form.age);
    if (isNaN(age) || age < 1 || age > 12) {
      setError("Age must be between 1 and 12");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/parent/kids", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, age, avatarId: form.avatarId, favouriteColor: form.favouriteColor }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to add child"); return; }
      router.push("/parent/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const colors = ["blue","purple","red","green","yellow","pink"];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(160deg, #050814, #0a1628, #0f0a2e)" }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">👶</div>
          <h1 className="text-3xl font-black text-white mb-2">Add Your Child</h1>
          <p className="text-blue-300">Set up their learning profile</p>
        </div>

        <div className="rounded-3xl p-8 space-y-6"
          style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.3)" }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-blue-300 mb-1">Child&apos;s Name</label>
              <input type="text" className="input" placeholder="e.g. Amara" required
                value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-bold text-blue-300 mb-1">Age (1–12)</label>
              <input type="number" className="input" min={1} max={12} placeholder="e.g. 7" required
                value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-bold text-blue-300 mb-3">Pick a Character</label>
              <AvatarPicker selected={form.avatarId} onSelect={(id) => setForm({ ...form, avatarId: id })} />
            </div>

            <div>
              <label className="block text-sm font-bold text-blue-300 mb-3">Favourite Colour</label>
              <div className="flex flex-wrap gap-2">
                {colors.map((c) => (
                  <button key={c} type="button" onClick={() => setForm({ ...form, favouriteColor: c })}
                    className={`w-10 h-10 rounded-full border-4 transition-all capitalize ${form.favouriteColor === c ? "border-white scale-125 shadow-lg" : "border-transparent"}`}
                    style={{ background: c === "purple" ? "#8b5cf6" : c === "blue" ? "#3b82f6" : c === "red" ? "#ef4444" : c === "green" ? "#10b981" : c === "yellow" ? "#f59e0b" : "#ec4899" }}
                    aria-label={c}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-500/40 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl text-lg font-black text-white"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", boxShadow: "0 0 20px rgba(139,92,246,0.4)" }}>
              {loading ? "Adding..." : "🚀 Create Kid Account!"}
            </button>
          </form>

          <Link href="/parent/dashboard" className="block text-center text-sm text-blue-400 hover:text-white">
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
