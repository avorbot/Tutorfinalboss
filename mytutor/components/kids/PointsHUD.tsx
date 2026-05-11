"use client";

import { motion } from "framer-motion";

interface PointsHUDProps {
  points: number;
  level: number;
  name: string;
  avatarEmoji: string;
}

export function PointsHUD({ points, level, name, avatarEmoji }: PointsHUDProps) {
  const nextLevel = level * 200;
  const progress = Math.min((points / nextLevel) * 100, 100);

  return (
    <motion.div
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="mx-4 sm:mx-auto sm:max-w-2xl rounded-3xl p-5"
      style={{
        background: "linear-gradient(135deg, rgba(139,92,246,0.3), rgba(59,130,246,0.2))",
        border: "2px solid rgba(139,92,246,0.4)",
        boxShadow: "0 0 30px rgba(139,92,246,0.3)",
      }}
    >
      <div className="flex items-center gap-4">
        <div className="text-5xl">{avatarEmoji}</div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-white font-bold text-lg">{name}</span>
            <span className="text-yellow-300 font-bold text-sm">⭐ {points.toLocaleString()} pts</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-purple-300 text-xs font-bold">Level {level} Explorer</span>
            <span className="text-blue-400 text-xs">· {nextLevel - points} pts to Level {level + 1}</span>
          </div>
          {/* Progress bar */}
          <div className="h-3 bg-blue-900/50 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #8b5cf6, #3b82f6)" }}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
