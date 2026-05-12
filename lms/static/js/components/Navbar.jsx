import React, {useState, useEffect} from "react";
import {ThemeToggle} from "./ThemeToggle";

const NAV_LINKS = [
  {href: "/", label: "Home"},
  {href: "/#how-it-works", label: "How It Works"},
  {href: "/#subjects", label: "Subjects"},
  {href: "/kids/", label: "Kids Zone"},
];

export function Navbar({currentPath = window.location.pathname}) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lastY, setLastY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > lastY && y > 80);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, {passive: true});
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <nav
      className="navbar"
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: "transform 0.3s ease",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.3)" : "none",
      }}
    >
      <div className="nav-container">
        <a href="/" className="nav-logo">
          <div className="nav-logo-icon">⬢</div>
          <span style={{background: "linear-gradient(135deg,#1a7a3c,#f97316)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            fontWeight: 700, fontSize: "1.2rem"}}>
            MyTutor
          </span>
        </a>

        <div className="nav-links">
          {NAV_LINKS.map(link => (
            <a
              key={link.href} href={link.href}
              className={`nav-link ${currentPath === link.href ? "active" : ""}`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="nav-actions">
          <ThemeToggle />
          <a href="/login/" className="btn btn-outline">Log in</a>
          <a href="/register/" className="btn btn-primary">Get Started</a>
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="nav-mobile">
          {NAV_LINKS.map(link => (
            <a key={link.href} href={link.href} className="nav-mobile-link"
              onClick={() => setMenuOpen(false)}>
              {link.label}
            </a>
          ))}
          <div style={{display: "flex", flexDirection: "column", gap: "0.5rem", paddingTop: "0.5rem"}}>
            <a href="/login/" className="btn btn-secondary" style={{textAlign: "center"}}>Log in</a>
            <a href="/register/" className="btn btn-primary" style={{textAlign: "center"}}>Get Started</a>
          </div>
        </div>
      )}
    </nav>
  );
}
