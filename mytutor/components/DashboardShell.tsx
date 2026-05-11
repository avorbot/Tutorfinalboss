"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { JWTPayload } from "@/lib/auth";
import { getInitials } from "@/lib/utils";

const navLinks = {
  admin: [
    { href: "/dashboard/admin", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/admin/users", label: "All Users", icon: "👥" },
    { href: "/dashboard/admin/tutors", label: "Tutors", icon: "👨‍🏫" },
    { href: "/dashboard/admin/students", label: "Students", icon: "🎓" },
    { href: "/dashboard/admin/sessions", label: "Sessions", icon: "📅" },
  ],
  tutor: [
    { href: "/dashboard/tutor", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/tutor/sessions", label: "My Sessions", icon: "📅" },
    { href: "/dashboard/tutor/students", label: "My Students", icon: "🎓" },
    { href: "/dashboard/tutor/profile", label: "Profile", icon: "👤" },
  ],
  student: [
    { href: "/dashboard/student", label: "Dashboard", icon: "📊" },
    { href: "/dashboard/student/tutors", label: "Find Tutors", icon: "🔍" },
    { href: "/dashboard/student/sessions", label: "My Sessions", icon: "📅" },
    { href: "/dashboard/student/profile", label: "Profile", icon: "👤" },
  ],
};

const roleColors = {
  admin: "bg-purple-600",
  tutor: "bg-blue-600",
  student: "bg-green-600",
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
  const roleColor = roleColors[user.role as keyof typeof roleColors] || "bg-indigo-600";

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">MT</span>
            </div>
            <span className="text-lg font-bold text-gray-900">MyTutor</span>
          </Link>
        </div>

        {/* Role badge */}
        <div className="px-5 py-3 border-b border-gray-100">
          <span
            className={`badge text-white ${roleColor} text-xs`}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Portal
          </span>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`sidebar-link ${pathname === link.href ? "active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className={`w-9 h-9 ${roleColor} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 truncate">{user.name}</div>
              <div className="text-xs text-gray-400 truncate">{user.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary w-full text-sm py-2 text-red-600 border-red-100 hover:bg-red-50"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-10">
          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setSidebarOpen(true)}
          >
            ☰
          </button>
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${roleColor} rounded-full flex items-center justify-center text-white font-semibold text-xs`}>
              {getInitials(user.name)}
            </div>
            <span className="text-sm font-medium text-gray-700 hidden sm:block">{user.name}</span>
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
