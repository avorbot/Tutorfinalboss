import React, {useState} from "react";
import {ScrollReveal, StaggerContainer, StaggerItem} from "./ScrollReveal";

const PLANETS = [
  {id: "math",    label: "Math",    emoji: "➕", color: "#f97316", glow: "rgba(249,115,22,0.6)"},
  {id: "english", label: "English", emoji: "📖", color: "#1a7a3c", glow: "rgba(26,122,60,0.6)"},
  {id: "science", label: "Science", emoji: "🔭", color: "#8b5cf6", glow: "rgba(139,92,246,0.6)"},
  {id: "art",     label: "Art",     emoji: "🎨", color: "#ec4899", glow: "rgba(236,72,153,0.6)"},
  {id: "music",   label: "Music",   emoji: "🎵", color: "#0891b2", glow: "rgba(8,145,178,0.6)"},
  {id: "history", label: "History", emoji: "🏛️", color: "#d97706", glow: "rgba(217,119,6,0.6)"},
];

const BADGES = [
  {id: "star", label: "Star Learner", emoji: "⭐", req: 50},
  {id: "rocket", label: "Rocket Scholar", emoji: "🚀", req: 100},
  {id: "crown", label: "Knowledge Crown", emoji: "👑", req: 200},
  {id: "diamond", label: "Diamond Mind", emoji: "💎", req: 500},
];

export function KidsZone({kidName = "Explorer", points = 0, level = 1}) {
  const [active, setActive] = useState(null);

  const earnedBadges = BADGES.filter(b => points >= b.req);

  return (
    <div style={{minHeight: "100vh", background: "linear-gradient(135deg,#0a0a2e 0%,#1a0a2e 50%,#0a1a0e 100%)",
      color: "white", padding: "2rem 1rem", fontFamily: "'Poppins',sans-serif"}}>

      {/* Header */}
      <ScrollReveal>
        <div style={{textAlign: "center", marginBottom: "2.5rem"}}>
          <div style={{fontSize: "3rem", marginBottom: "0.5rem"}}>🚀</div>
          <h1 style={{fontSize: "2.5rem", fontWeight: 800, margin: 0,
            background: "linear-gradient(135deg,#f97316,#1a7a3c)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
            Welcome, {kidName}!
          </h1>
          <p style={{color: "rgba(255,255,255,0.7)", marginTop: "0.5rem"}}>
            Level {level} Explorer • {points} Stars Collected
          </p>
          {/* XP bar */}
          <div style={{maxWidth: 300, margin: "1rem auto 0", background: "rgba(255,255,255,0.1)",
            borderRadius: 9999, height: 12, overflow: "hidden"}}>
            <div style={{height: "100%", width: `${Math.min((points % 100), 100)}%`,
              background: "linear-gradient(90deg,#1a7a3c,#f97316)",
              borderRadius: 9999, transition: "width 0.5s ease"}} />
          </div>
        </div>
      </ScrollReveal>

      {/* Planets */}
      <ScrollReveal delay={0.1}>
        <h2 style={{textAlign: "center", color: "rgba(255,255,255,0.9)", marginBottom: "1.5rem"}}>
          Choose Your Learning Planet 🌍
        </h2>
      </ScrollReveal>

      <StaggerContainer style={{display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
        gap: "1.5rem", maxWidth: 700, margin: "0 auto 3rem"}}>
        {PLANETS.map((planet, i) => (
          <StaggerItem key={planet.id} index={i}>
            <div
              onClick={() => setActive(active === planet.id ? null : planet.id)}
              style={{
                width: 120, height: 120, borderRadius: "50%", margin: "0 auto",
                background: planet.color,
                boxShadow: `0 0 ${active === planet.id ? 50 : 30}px ${planet.glow}`,
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", cursor: "pointer",
                transform: active === planet.id ? "scale(1.15) translateY(-8px)" : "scale(1)",
                transition: "all 0.3s ease",
                border: active === planet.id ? "3px solid white" : "3px solid transparent",
              }}
            >
              <div style={{fontSize: "2.5rem"}}>{planet.emoji}</div>
              <div style={{fontSize: "0.75rem", fontWeight: 700, marginTop: "0.25rem"}}>
                {planet.label}
              </div>
            </div>
            {active === planet.id && (
              <div style={{textAlign: "center", marginTop: "0.75rem"}}>
                <a
                  href={`/dashboard/?section=learn&subject=${planet.id}`}
                  style={{display: "inline-block", padding: "0.5rem 1.25rem",
                    background: "linear-gradient(135deg,#1a7a3c,#f97316)",
                    borderRadius: 9999, color: "white", fontWeight: 700,
                    fontSize: "0.875rem", textDecoration: "none"}}
                >
                  Start Learning! 🚀
                </a>
              </div>
            )}
          </StaggerItem>
        ))}
      </StaggerContainer>

      {/* Badges */}
      {earnedBadges.length > 0 && (
        <ScrollReveal delay={0.2}>
          <div style={{textAlign: "center", marginTop: "2rem"}}>
            <h2 style={{color: "rgba(255,255,255,0.9)", marginBottom: "1rem"}}>
              My Badges 🏆
            </h2>
            <div style={{display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center"}}>
              {earnedBadges.map(badge => (
                <div key={badge.id} style={{
                  background: "linear-gradient(135deg,#f97316,#d97706)",
                  borderRadius: "1rem", padding: "0.75rem 1.25rem",
                  display: "flex", flexDirection: "column", alignItems: "center",
                  boxShadow: "0 0 20px rgba(249,115,22,0.4)",
                }}>
                  <div style={{fontSize: "2rem"}}>{badge.emoji}</div>
                  <div style={{fontSize: "0.75rem", fontWeight: 700, marginTop: "0.25rem"}}>
                    {badge.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
