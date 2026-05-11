"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { KidsLayout } from "@/components/kids/KidsLayout";

const subjects = [
  { emoji: "🔢", label: "Maths",    color: "#ef4444", glow: "rgba(239,68,68,0.6)" },
  { emoji: "🔬", label: "Science",  color: "#3b82f6", glow: "rgba(59,130,246,0.6)" },
  { emoji: "📖", label: "English",  color: "#10b981", glow: "rgba(16,185,129,0.6)" },
  { emoji: "🗺️",  label: "History",  color: "#f59e0b", glow: "rgba(245,158,11,0.6)" },
  { emoji: "🎨", label: "Art",      color: "#8b5cf6", glow: "rgba(139,92,246,0.6)" },
  { emoji: "🎵", label: "Music",    color: "#ec4899", glow: "rgba(236,72,153,0.6)" },
];

const floatingItems = ["A", "B", "C", "1", "2", "3", "✦", "★"];

export default function KidsLandingPage() {
  return (
    <KidsLayout>
      <div className="relative min-h-screen flex flex-col items-center justify-center px-4 pt-8 pb-16">
        {/* Floating letters */}
        {floatingItems.map((item, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl sm:text-4xl font-black pointer-events-none select-none"
            style={{
              top: `${10 + (i * 11) % 70}%`,
              left: `${(i * 13) % 85}%`,
              color: ["#60a5fa", "#34d399", "#f59e0b", "#a78bfa", "#f472b6"][i % 5],
              textShadow: "0 0 10px currentColor",
            }}
            animate={{
              y: [0, -25, 0],
              rotate: [0, i % 2 === 0 ? 15 : -15, 0],
              opacity: [0.4, 0.8, 0.4],
            }}
            transition={{
              duration: 3 + i * 0.4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            {item}
          </motion.div>
        ))}

        {/* Central planet */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="w-48 h-48 sm:w-64 sm:h-64 rounded-full flex items-center justify-center text-8xl sm:text-9xl mb-8 relative"
          style={{
            background: "radial-gradient(circle at 35% 30%, #4f46e5, #1e1b4b)",
            boxShadow: "0 0 60px rgba(79,70,229,0.7), 0 0 120px rgba(79,70,229,0.3), inset 0 -20px 40px rgba(0,0,0,0.4)",
          }}
        >
          🌍
          {/* Orbit ring */}
          <div className="absolute inset-0 rounded-full border-2 border-dashed border-purple-500/30"
            style={{ transform: "scale(1.3) rotateX(75deg)" }} />
        </motion.div>

        {/* Hero text */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl sm:text-7xl font-black text-white text-center mb-4 leading-tight"
          style={{ textShadow: "0 0 30px rgba(139,92,246,0.8)" }}
        >
          Learn &amp; Play!
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-blue-200 text-xl sm:text-2xl text-center mb-10 max-w-md"
        >
          Super fun learning adventures for young explorers 🚀
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, type: "spring" }}
          className="flex flex-col sm:flex-row gap-4 mb-14"
        >
          <Link
            href="/kids/login"
            className="text-2xl font-black text-white px-10 py-5 rounded-full text-center transition-all"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #3b82f6)",
              boxShadow: "0 0 30px rgba(139,92,246,0.6), 0 8px 30px rgba(0,0,0,0.3)",
            }}
          >
            🚀 Start Learning!
          </Link>
          <Link
            href="/parent/register"
            className="text-lg font-bold text-purple-300 px-8 py-5 rounded-full text-center border-2 border-purple-500/50 hover:border-purple-400 hover:text-white transition-all"
          >
            I&apos;m a Parent →
          </Link>
        </motion.div>

        {/* Subject preview planets */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="w-full max-w-2xl"
        >
          <p className="text-center text-blue-300 text-sm font-bold uppercase tracking-widest mb-6">Choose your adventure</p>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 justify-items-center">
            {subjects.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7 + i * 0.08, type: "spring" }}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-3xl cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    background: s.color,
                    boxShadow: `0 0 20px ${s.glow}`,
                  }}
                >
                  {s.emoji}
                </div>
                <span className="text-white text-xs font-bold">{s.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </KidsLayout>
  );
}
