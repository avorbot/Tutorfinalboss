"use client";

import Link from "next/link";

export function KidsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{
        background: "linear-gradient(160deg, #050814 0%, #0a1628 50%, #0f0a2e 100%)",
        fontFamily: "'Nunito', 'Fredoka One', system-ui, sans-serif",
      }}
    >
      {/* Stars background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + "px",
              height: Math.random() * 3 + 1 + "px",
              top: Math.random() * 100 + "%",
              left: Math.random() * 100 + "%",
              opacity: Math.random() * 0.6 + 0.2,
              animation: `pulse ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: Math.random() * 3 + "s",
            }}
          />
        ))}
      </div>

      {/* Top bar */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4">
        <Link href="/kids" className="flex items-center gap-2">
          <div className="text-2xl">🚀</div>
          <span className="text-white font-bold text-xl">MyTutor Kids</span>
        </Link>
        <Link
          href="/"
          className="text-xs text-blue-300 hover:text-white transition-colors border border-blue-800 px-3 py-1.5 rounded-full"
        >
          Adult site →
        </Link>
      </header>

      <main className="relative z-10">{children}</main>
    </div>
  );
}
