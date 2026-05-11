"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { KidsLayout } from "@/components/kids/KidsLayout";
import { KidsPlanet } from "@/components/kids/KidsPlanet";
import { PointsHUD } from "@/components/kids/PointsHUD";
import { BadgesShelf } from "@/components/kids/BadgesShelf";

const PLANETS = [
  { label: "Maths",    emoji: "🔢", color: "#ef4444", glowColor: "rgba(239,68,68,0.6)",   subject: "math" },
  { label: "Science",  emoji: "🔬", color: "#3b82f6", glowColor: "rgba(59,130,246,0.6)",  subject: "science" },
  { label: "English",  emoji: "📖", color: "#10b981", glowColor: "rgba(16,185,129,0.6)",  subject: "english" },
  { label: "History",  emoji: "🗺️",  color: "#f59e0b", glowColor: "rgba(245,158,11,0.6)", subject: "history" },
  { label: "Art",      emoji: "🎨", color: "#8b5cf6", glowColor: "rgba(139,92,246,0.6)",  subject: "art" },
  { label: "Music",    emoji: "🎵", color: "#ec4899", glowColor: "rgba(236,72,153,0.6)",  subject: "music" },
];

const DAILY_QUESTS = [
  { emoji: "🔢", text: "Count to 100! Can you do it?", subject: "math" },
  { emoji: "📖", text: "Read 3 sentences out loud!", subject: "english" },
  { emoji: "🔬", text: "Find something green outside!", subject: "science" },
];

interface KidsAccount {
  name: string;
  level: number;
  points: number;
  avatarId: string;
  badges: string;
}

const AVATAR_EMOJIS = ["🦁","🐸","🐼","🐧","🐬","🦋","🦊","🐉"];

export default function KidsDashboardPage() {
  const [kid, setKid] = useState<KidsAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [quest] = useState(DAILY_QUESTS[Math.floor(Math.random() * DAILY_QUESTS.length)]);
  const [celebration, setCelebration] = useState(false);

  useEffect(() => {
    fetch("/api/kids/progress")
      .then((r) => r.json())
      .then((d) => { if (d.kid) setKid(d.kid); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  function handlePlanetClick(subject: string) {
    alert(`🚀 Let's explore ${subject}! Your tutor will share lessons here soon.`);
  }

  async function handleQuestComplete() {
    setCelebration(true);
    await fetch("/api/kids/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: quest.subject, stars: 1 }),
    });
    setTimeout(() => setCelebration(false), 3000);
  }

  if (loading) {
    return (
      <KidsLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            animate={{ rotate: 360, scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-6xl"
          >
            🚀
          </motion.div>
        </div>
      </KidsLayout>
    );
  }

  const avatarEmoji = kid ? AVATAR_EMOJIS[parseInt(kid.avatarId) - 1] || "🦁" : "🦁";
  const badges = kid ? JSON.parse(kid.badges || "[]") : [];

  return (
    <KidsLayout>
      {/* Confetti celebration */}
      {celebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              initial={{ y: "110vh", x: `${Math.random() * 100}vw`, opacity: 1 }}
              animate={{ y: "-10vh", opacity: 0 }}
              transition={{ duration: 2, delay: Math.random() * 0.5 }}
            >
              {["⭐","🎉","🌟","🏆","✨"][i % 5]}
            </motion.div>
          ))}
          <div className="text-center z-50">
            <div className="text-8xl">🎉</div>
            <div className="text-4xl font-black text-yellow-300 mt-2">Amazing!</div>
          </div>
        </div>
      )}

      <div className="pb-16 space-y-8">
        {/* Points HUD */}
        {kid && (
          <div className="pt-2">
            <PointsHUD
              points={kid.points}
              level={kid.level}
              name={kid.name}
              avatarEmoji={avatarEmoji}
            />
          </div>
        )}

        {/* Welcome if no kid session */}
        {!kid && (
          <div className="text-center py-8 px-4">
            <div className="text-6xl mb-4">👋</div>
            <h2 className="text-3xl font-black text-white mb-2">Hello Explorer!</h2>
            <p className="text-blue-300 text-lg">Ask your parent to set up your account.</p>
          </div>
        )}

        {/* Daily Quest card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-4 sm:mx-auto sm:max-w-2xl rounded-3xl p-6"
          style={{
            background: "linear-gradient(135deg, rgba(245,158,11,0.2), rgba(239,68,68,0.1))",
            border: "2px solid rgba(245,158,11,0.4)",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-yellow-400 font-black text-sm uppercase tracking-wider">⚡ Today&apos;s Quest</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{quest.emoji}</span>
            <div className="flex-1">
              <p className="text-white font-bold text-xl">{quest.text}</p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleQuestComplete}
            className="w-full mt-4 py-4 rounded-2xl text-xl font-black text-white"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #ef4444)",
              boxShadow: "0 0 20px rgba(245,158,11,0.4)",
            }}
          >
            ✅ I did it! Give me my star!
          </motion.button>
        </motion.div>

        {/* Badges */}
        {badges.length > 0 && <BadgesShelf earnedBadgeIds={badges} />}

        {/* Planet grid */}
        <div className="px-4 sm:px-0">
          <h3 className="text-white font-black text-2xl text-center mb-6">🌌 Choose Your Planet</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto justify-items-center">
            {PLANETS.map((p) => (
              <KidsPlanet
                key={p.label}
                label={p.label}
                emoji={p.emoji}
                color={p.color}
                glowColor={p.glowColor}
                onClick={() => handlePlanetClick(p.subject)}
                stars={Math.floor(Math.random() * 3)}
              />
            ))}
          </div>
        </div>
      </div>
    </KidsLayout>
  );
}
