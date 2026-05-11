"use client";

import { motion } from "framer-motion";

const ALL_BADGES = [
  { id: "first_star",   emoji: "⭐", label: "First Star",   color: "from-yellow-400 to-amber-500" },
  { id: "math_whiz",   emoji: "🧮", label: "Math Whiz",    color: "from-blue-400 to-indigo-500" },
  { id: "reader",      emoji: "📚", label: "Bookworm",     color: "from-green-400 to-teal-500" },
  { id: "scientist",   emoji: "🔬", label: "Scientist",    color: "from-purple-400 to-pink-500" },
  { id: "explorer",    emoji: "🗺️",  label: "Explorer",     color: "from-orange-400 to-red-500" },
  { id: "streak_3",    emoji: "🔥", label: "3-Day Streak", color: "from-red-400 to-orange-500" },
  { id: "perfectstar", emoji: "🌟", label: "Perfect Star", color: "from-yellow-300 to-yellow-500" },
  { id: "helper",      emoji: "🤝", label: "Helper",       color: "from-cyan-400 to-blue-500" },
];

interface BadgesShelfProps {
  earnedBadgeIds: string[];
}

export function BadgesShelf({ earnedBadgeIds }: BadgesShelfProps) {
  const earned = ALL_BADGES.filter((b) => earnedBadgeIds.includes(b.id));
  const locked = ALL_BADGES.filter((b) => !earnedBadgeIds.includes(b.id));

  if (earned.length === 0) return null;

  return (
    <div className="px-4 sm:px-0">
      <h3 className="text-white font-bold text-lg mb-3 px-1">🏆 My Badges</h3>
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
        {earned.map((badge, i) => (
          <motion.div
            key={badge.id}
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: i * 0.1, type: "spring", stiffness: 200 }}
            className={`kids-badge flex-shrink-0 bg-gradient-to-br ${badge.color}`}
          >
            <span className="text-2xl">{badge.emoji}</span>
            <span className="text-white text-xs font-bold">{badge.label}</span>
          </motion.div>
        ))}
        {locked.slice(0, 4).map((badge) => (
          <div
            key={badge.id}
            className="flex-shrink-0 flex flex-col items-center gap-1 p-3 rounded-2xl opacity-30"
            style={{ background: "rgba(255,255,255,0.05)", border: "2px dashed rgba(255,255,255,0.2)" }}
          >
            <span className="text-2xl grayscale">{badge.emoji}</span>
            <span className="text-white text-xs">🔒</span>
          </div>
        ))}
      </div>
    </div>
  );
}
