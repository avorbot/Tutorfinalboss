import React, {useState} from "react";
import {ThemeToggle} from "./ThemeToggle";

const NAV_LINKS = {
  admin: [
    {href: "/dashboard/", label: "Dashboard", icon: "📊"},
    {href: "/dashboard/?section=users", label: "All Users", icon: "👥"},
    {href: "/dashboard/?section=tutors", label: "Tutors", icon: "👨‍🏫"},
    {href: "/dashboard/?section=students", label: "Students", icon: "🎓"},
    {href: "/dashboard/?section=sessions", label: "Sessions", icon: "📅"},
    {href: "/dashboard/?section=approvals", label: "Approvals", icon: "✅"},
    {href: "/studio/", label: "CMS Studio", icon: "🎨"},
  ],
  tutor: [
    {href: "/dashboard/", label: "Dashboard", icon: "📊"},
    {href: "/dashboard/?section=sessions", label: "My Sessions", icon: "📅"},
    {href: "/dashboard/?section=students", label: "My Students", icon: "🎓"},
    {href: "/dashboard/?section=content", label: "My Content", icon: "🚀"},
    {href: "/dashboard/?section=messages", label: "Messages", icon: "💬"},
    {href: "/dashboard/?section=profile", label: "Profile", icon: "👤"},
    {href: "/studio/", label: "CMS Studio", icon: "🎨"},
  ],
  student: [
    {href: "/dashboard/", label: "Dashboard", icon: "📊"},
    {href: "/dashboard/?section=tutors", label: "Find Tutors", icon: "🔍"},
    {href: "/dashboard/?section=sessions", label: "My Sessions", icon: "📅"},
    {href: "/dashboard/?section=messages", label: "Messages", icon: "💬"},
    {href: "/dashboard/?section=profile", label: "Profile", icon: "👤"},
  ],
  parent: [
    {href: "/dashboard/", label: "Dashboard", icon: "📊"},
    {href: "/dashboard/?section=kids", label: "My Kids", icon: "👧"},
    {href: "/kids/", label: "Kids Zone", icon: "🚀"},
    {href: "/dashboard/?section=profile", label: "Profile", icon: "👤"},
  ],
  kid: [
    {href: "/kids/", label: "Learning Zone", icon: "🚀"},
    {href: "/dashboard/", label: "My Progress", icon: "⭐"},
  ],
};

const ROLE_COLORS = {
  admin:   {gradient: "linear-gradient(135deg,#7c3aed,#4f46e5)", badge: "#7c3aed22", text: "#a78bfa"},
  tutor:   {gradient: "linear-gradient(135deg,#1a7a3c,#155e30)", badge: "#1a7a3c22", text: "#4ade80"},
  student: {gradient: "linear-gradient(135deg,#f97316,#ea580c)", badge: "#f9731622", text: "#fb923c"},
  parent:  {gradient: "linear-gradient(135deg,#0891b2,#0e7490)", badge: "#0891b222", text: "#22d3ee"},
  kid:     {gradient: "linear-gradient(135deg,#f59e0b,#d97706)", badge: "#f59e0b22", text: "#fbbf24"},
};

export function DashboardShell({user, children}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const links = NAV_LINKS[user.role] || NAV_LINKS.student;
  const colors = ROLE_COLORS[user.role] || ROLE_COLORS.student;
  const initials = (user.name || "??").split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div style={{minHeight: "100vh", display: "flex", background: "var(--bg-secondary)"}}>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)",
            zIndex: 20, display: "none"}} className="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Logo */}
        <div className="sidebar-header">
          <a href="/" className="sidebar-logo">
            <div className="sidebar-logo-icon" style={{background: colors.gradient}}>⬢</div>
            <span className="sidebar-brand">MyTutor</span>
          </a>
        </div>

        {/* Role badge */}
        <div style={{padding: "0.5rem 1rem", borderBottom: "1px solid var(--border)"}}>
          <span style={{display: "inline-block", padding: "0.25rem 0.75rem",
            borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 600,
            background: colors.badge, color: colors.text}}>
            {(user.role || "student").charAt(0).toUpperCase() + (user.role || "student").slice(1)} Portal
          </span>
        </div>

        {/* Nav */}
        <nav style={{flex: 1, padding: "1rem 0.75rem", overflowY: "auto"}}>
          {links.map(link => (
            <a key={link.href} href={link.href} className="sidebar-link">
              <span>{link.icon}</span>
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        {/* User */}
        <div style={{padding: "1rem", borderTop: "1px solid var(--border)"}}>
          <div style={{display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem"}}>
            <div style={{width: 36, height: 36, borderRadius: "50%", background: colors.gradient,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0}}>
              {initials}
            </div>
            <div style={{flex: 1, minWidth: 0}}>
              <div style={{color: "var(--text-primary)", fontSize: "0.875rem", fontWeight: 600,
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                {user.name}
              </div>
              <div style={{color: "var(--text-muted)", fontSize: "0.75rem",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
                {user.email}
              </div>
            </div>
          </div>
          <a href="/logout/"
            style={{display: "flex", alignItems: "center", justifyContent: "center",
              gap: "0.5rem", padding: "0.5rem", borderRadius: "0.5rem",
              color: "#f87171", fontSize: "0.875rem", textDecoration: "none",
              transition: "background 0.2s"}}
            onMouseEnter={e => e.currentTarget.style.background = "rgba(239,68,68,0.1)"}
            onMouseLeave={e => e.currentTarget.style.background = "transparent"}
          >
            ⏻ Sign Out
          </a>
        </div>
      </aside>

      {/* Main */}
      <div style={{flex: 1, display: "flex", flexDirection: "column", minWidth: 0}}>
        <header className="dashboard-header">
          <button
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
          >
            ☰
          </button>
          <div style={{flex: 1}} />
          <ThemeToggle />
          <div style={{display: "flex", alignItems: "center", gap: "0.75rem"}}>
            <div style={{width: 32, height: 32, borderRadius: "50%", background: colors.gradient,
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontWeight: 700, fontSize: "0.75rem"}}>
              {initials}
            </div>
            <span style={{color: "var(--text-primary)", fontSize: "0.875rem", fontWeight: 500}}>
              {user.name}
            </span>
          </div>
        </header>

        <main style={{flex: 1, padding: "1.5rem", overflowY: "auto"}}>
          {children}
        </main>
      </div>
    </div>
  );
}
