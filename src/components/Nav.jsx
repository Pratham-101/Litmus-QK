import React, { useState, useEffect } from "react";
import { T, MAXW } from "../theme.js";
import { Button } from "./ui.jsx";
import { useMe } from "../lib/auth.js";

const LINKS = [
  { label: "Platform", to: "home", hash: "#platform" },
  { label: "Framework", to: "framework" },
  { label: "Observability", to: "observability" },
  { label: "Case Studies", to: "cases" },
  { label: "Docs", to: "docs" },
];

export default function Nav({ route, go }) {
  const { user } = useMe();
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 50 }}>
      <button onClick={() => go("roadmap")} style={{
        width: "100%", border: "none", cursor: "pointer", background: T.ink, color: "#f3ede2",
        fontFamily: "IBM Plex Mono", fontSize: 12.5, letterSpacing: 0.3, padding: "9px 16px",
      }}>
        ✦ Next on the roadmap — ElevenLabs voice agents, under the same framework &nbsp;→
      </button>

      <header style={{
        background: scrolled ? "rgba(247,244,238,0.86)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: `1px solid ${scrolled ? T.line : "transparent"}`,
        transition: "all .25s ease",
      }}>
        <div style={{ maxWidth: MAXW, margin: "0 auto", padding: "15px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
          <button onClick={() => go("home")} style={{ display: "flex", alignItems: "center", gap: 11, background: "none", border: "none", cursor: "pointer" }}>
            <Logo />
            <span style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", lineHeight: 1.25 }}>
              <span style={{ fontFamily: "Schibsted Grotesk", fontWeight: 800, fontSize: 18, color: T.ink, letterSpacing: -0.4 }}>
                Litmus
              </span>
              <span style={{ fontFamily: "Inter", fontSize: 10, color: T.ink3, marginTop: 2 }}>
                By <strong style={{ color: T.ink2, fontWeight: 700 }}>QK AI Labs</strong>
              </span>
            </span>
          </button>

          <nav style={{ display: "flex", alignItems: "center", gap: 2 }} className="nav-links">
            {LINKS.map((l) => (
              <button key={l.label} onClick={() => go(l.to, l.hash)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "Schibsted Grotesk", fontSize: 14.5, fontWeight: 500,
                color: route === l.to ? T.ink : T.ink2, padding: "8px 12px", borderRadius: 8,
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = T.ink)}
                onMouseLeave={(e) => (e.currentTarget.style.color = route === l.to ? T.ink : T.ink2)}
              >{l.label}</button>
            ))}
          </nav>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Button onClick={() => go("contact")} variant="secondary" style={{ padding: "10px 18px", fontSize: 14 }}>
              Talk to our FDE
            </Button>
            <Button onClick={() => go(user ? "download" : "signup")} style={{ padding: "10px 20px", fontSize: 14 }}>
              {user ? "Download" : "Sign up"}
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
}

function Logo() {
  return (
    <img src="/assets/qk-mark.png" alt="QK AI Labs" style={{ height: 30, width: "auto", objectFit: "contain" }} />
  );
}
