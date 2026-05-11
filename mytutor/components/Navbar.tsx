"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { List, X, GraduationCap } from "@phosphor-icons/react";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#how-it-works", label: "How It Works" },
  { href: "/#subjects", label: "Subjects" },
  { href: "/kids", label: "Kids" },
];

export function Navbar() {
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastY, setLastY] = useState(0);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (y) => {
    setHidden(y > lastY && y > 80);
    setLastY(y);
  });

  return (
    <motion.nav
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-[var(--border)]"
      style={{ backdropFilter: "blur(16px)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--gradient-accent)" }}>
              <GraduationCap size={18} weight="bold" className="text-white" />
            </div>
            <span className="gradient-text">MyTutor</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-[var(--neon-blue)] ${
                  pathname === link.href
                    ? "text-[var(--neon-blue)]"
                    : "text-[var(--text-muted)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/login" className="hidden md:inline-flex btn btn-outline text-sm py-2 px-4">
              Log in
            </Link>
            <Link href="/register" className="hidden md:inline-flex btn btn-primary text-sm py-2 px-4">
              Get Started
            </Link>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-[var(--border)] text-[var(--text-muted)]"
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <List size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden border-t border-[var(--border)] px-4 py-4 space-y-2"
          style={{ background: "var(--bg-card)" }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 px-3 rounded-lg text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--neon-blue)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link href="/login" onClick={() => setMenuOpen(false)} className="btn btn-secondary w-full justify-center">Log in</Link>
            <Link href="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary w-full justify-center">Get Started</Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
