"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AvatarDisplay } from "@/components/kids/AvatarPicker";

interface KidsAccount {
  id: string;
  name: string;
  age: number;
  avatarId: string;
  points: number;
  level: number;
  badges: string;
}

export default function ParentDashboardPage() {
  const [kids, setKids] = useState<KidsAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/parent/kids")
      .then((r) => r.json())
      .then((d) => { setKids(d.kids || []); setLoading(false); })
      .catch(() => { setError("Could not load. Are you logged in?"); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen px-4 py-12"
      style={{ background: "linear-gradient(160deg, #050814, #0a1628, #0f0a2e)" }}>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Parent Dashboard</h1>
            <p className="text-blue-300 text-sm mt-1">Monitor your children&apos;s learning journey</p>
          </div>
          <Link href="/parent/add-child"
            className="px-5 py-3 rounded-2xl text-sm font-bold text-white"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)", boxShadow: "0 0 15px rgba(139,92,246,0.4)" }}>
            + Add Child
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-16 text-blue-300">Loading...</div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-400 mb-4">{error}</p>
            <Link href="/parent/register" className="text-purple-300 hover:text-white underline">Register as Parent</Link>
          </div>
        ) : kids.length === 0 ? (
          <div className="text-center py-16 rounded-3xl" style={{ background: "rgba(255,255,255,0.03)", border: "2px dashed rgba(139,92,246,0.3)" }}>
            <div className="text-6xl mb-4">👶</div>
            <p className="text-white font-bold text-xl mb-2">No children yet</p>
            <p className="text-blue-300 mb-6">Add your first child to get started!</p>
            <Link href="/parent/add-child"
              className="px-8 py-4 rounded-2xl text-lg font-black text-white inline-block"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #3b82f6)" }}>
              + Add Child
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {kids.map((kid) => {
              const badges = JSON.parse(kid.badges || "[]") as string[];
              return (
                <div key={kid.id} className="rounded-3xl p-6 flex items-center gap-5"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(139,92,246,0.3)" }}>
                  <div className="text-5xl"><AvatarDisplay avatarId={kid.avatarId} size="md" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white font-black text-xl">{kid.name}</h3>
                      <span className="text-blue-300 text-sm">Age {kid.age}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-yellow-300 font-bold">⭐ {kid.points} pts</span>
                      <span className="text-purple-300">Level {kid.level}</span>
                      {badges.length > 0 && <span className="text-emerald-300">🏆 {badges.length} badge{badges.length !== 1 ? "s" : ""}</span>}
                    </div>
                    {/* Mini progress bar */}
                    <div className="mt-3 h-2 bg-blue-900/50 rounded-full overflow-hidden max-w-48">
                      <div className="h-full rounded-full"
                        style={{
                          width: `${Math.min((kid.points / (kid.level * 200)) * 100, 100)}%`,
                          background: "linear-gradient(90deg, #8b5cf6, #3b82f6)",
                        }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link href="/" className="text-blue-400 hover:text-white text-sm transition-colors">← Back to main site</Link>
        </div>
      </div>
    </div>
  );
}
