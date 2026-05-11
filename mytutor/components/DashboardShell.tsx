"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ChartBar, Users, ChalkboardTeacher, GraduationCap, CalendarBlank,
  UserCircle, MagnifyingGlass, List, X, SignOut, Gear, Rocket,
} from "@phosphor-icons/react";
import { JWTPayload } from "@/lib/auth";
import { getInitials } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";

const navLinks = {
  admin: [
    { href: "/dashboard/admin",            label: "Dashboard",   Icon: ChartBar },
    { href: "/dashboard/admin/users",      label: "All Users",   Icon: Users },
    { href: "/dashboard/admin/tutors",     label: "Tutors",      Icon: ChalkboardTeacher },
    { href: "/dashboard/admin/students",   label: "Students",    Icon: GraduationCap },
    { href: "/dashboard/admin/sessions",   label: "Sessions",    Icon: CalendarBlank },
    { href: "/dashboard/admin/approvals",  label: "Approvals",   Icon: Gear },
  ],
  tutor: [
    { href: "/dashboard/tutor",            label: "Dashboard",   Icon: ChartBar },
    { href: "/dashboard/tutor/sessions",   label: "My Sessions", Icon: CalendarBlank },
    { href: "/dashboard/tutor/students",   label: "My Students", Icon: GraduationCap },
    { href: "/dashboard/tutor/content",    label: "My Content",  Icon: Rocket },
    { href: "/dashboard/tutor/profile",    label: "Profile",     Icon: UserCircle },
  ],
  student: [
    { href: "/dashboard/student",          label: "Dashboard",   Icon: ChartBar },
    { href: "/dashboard/student/tutors",   label: "Find Tutors", Icon: MagnifyingGlass },
    { href: "/dashboard/student/sessions", label: "My Sessions", Icon: CalendarBlank },
    { href: "/dashboard/student/content",  label: "Content",     Icon: Rocket },
    { href: "/dashboard/student/profile",  label: "Profile",     Icon: UserCircle },
  ],
};

const roleGradient = {
  admin:   "from-purple-600 to-indigo-700",
  tutor:   "from-blue-600 to-cyan-600",
  student: "from-emerald-600 to-teal-600",
};

const roleBadgeBg = {
  admin:   "bg-purple-500/20 text-purple-300",
  tutor:   "bg-blue-500/20 text-blue-300",
  student: "bg-emerald-500/20 text-emerald-300",
};

export default function DashboardShell({
  user,
  children,
}: {
  user: JWTPayload;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = navLinks[user.role as keyof typeof navLinks] || [];
  const gradient = roleGradient[user.role as keyof typeof roleGradient] || "from-indigo-600 to-purple-600";
  const badgeCls = roleBadgeBg[user.role as keyof typeof roleBadgeBg] || "bg-indigo-500/20 text-indigo-300";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-secondary)" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 flex flex-col transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
        style={{ background: "#0f0a2e", borderRight: "1px solid rgba(139,92,246,0.15)" }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5" style={{ borderBottom: "1px solid rgba(139,92,246,0.15)" }}>
          <Link href="/" className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br ${gradient}`}>
              <GraduationCap size={18} weight="bold" className="text-white" />
            </div>
            <span className="text-lg font-bold text-white">MyTutor</span>
          </Link>
        </div>

        {/* Role badge */}
        <div className="px-5 py-3" style={{ borderBottom: "1px solid rgba(139,92,246,0.15)" }}>
          <span className={`badge text-xs px-3 py-1 ${badgeCls} rounded-full`}>
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`sidebar-link ${isActive ? "active" : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <link.Icon size={18} weight={isActive ? "fill" : "regular"} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-4" style={{ borderTop: "1px solid rgba(139,92,246,0.15)" }}>
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm bg-gradient-to-br ${gradient}`}>
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{user.name}</div>
              <div className="text-xs truncate" style={{ color: "rgba(196,181,253,0.6)" }}>{user.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all text-red-400 hover:text-red-300 hover:bg-red-900/20"
          >
            <SignOut size={16} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-10"
          style={{ background: "var(--bg-card)", borderBottom: "1px solid var(--border)" }}>
          <button
            className="lg:hidden text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <List size={22} />
          </button>
          <div className="flex-1" />
          <ThemeToggle />
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs bg-gradient-to-br ${gradient}`}>
              {getInitials(user.name)}
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)] hidden sm:block">{user.name}</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
