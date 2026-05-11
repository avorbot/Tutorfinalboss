"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "@phosphor-icons/react";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-lg border border-[var(--border)] ${className}`} />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`w-9 h-9 rounded-lg border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--neon-blue)] hover:border-[var(--neon-blue)] hover:shadow-[var(--neon-glow-blue)] transition-all duration-200 bg-[var(--bg-card)] ${className}`}
      aria-label="Toggle theme"
    >
      {isDark ? <Sun size={18} weight="fill" /> : <Moon size={18} weight="fill" />}
    </button>
  );
}
