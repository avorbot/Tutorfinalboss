"use client";

import { motion } from "framer-motion";

interface KidsPlanetProps {
  label: string;
  emoji: string;
  color: string;
  glowColor: string;
  onClick: () => void;
  stars?: number;
}

export function KidsPlanet({ label, emoji, color, glowColor, onClick, stars = 0 }: KidsPlanetProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.12, y: -8 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="flex flex-col items-center gap-3 cursor-pointer"
      style={{ background: "none", border: "none" }}
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, ease: "easeInOut" }}
        className="w-28 h-28 sm:w-36 sm:h-36 rounded-full flex items-center justify-center text-5xl sm:text-6xl relative"
        style={{
          background: `radial-gradient(circle at 30% 30%, ${color}, ${color}88)`,
          boxShadow: `0 0 40px ${glowColor}, 0 0 80px ${glowColor}44, inset 0 -10px 20px rgba(0,0,0,0.3)`,
        }}
      >
        {emoji}
        {/* Shine */}
        <div
          className="absolute top-4 left-5 w-8 h-4 rounded-full opacity-40"
          style={{ background: "radial-gradient(ellipse, white, transparent)" }}
        />
      </motion.div>
      <div className="text-center">
        <div className="text-white font-bold text-lg">{label}</div>
        {stars > 0 && (
          <div className="text-yellow-300 text-sm">{"⭐".repeat(stars)}</div>
        )}
      </div>
    </motion.button>
  );
}
