import React, { useEffect, useRef, useState } from "react";
import { T } from "../theme.js";

/* A dark-green comparison band: big multipliers with animated racing bars,
   manual QA vs. the platform. Bars fill when scrolled into view. */

const ROWS = [
  { mult: "300×", label: "More cases per release", a: ["Manual QA", "~0.7", "cases / hr"], b: ["Platform", "210", "cases / run"], aFrac: 0.04, bFrac: 1 },
  { mult: "1,400×", label: "Faster to a verdict", a: ["Manual QA", "~3", "days"], b: ["Platform", "~9", "seconds"], aFrac: 0.05, bFrac: 1 },
  { mult: "15×", label: "More dimensions scored", a: ["Manual QA", "1", "gut-check"], b: ["Platform", "15", "dimensions"], aFrac: 0.067, bFrac: 1 },
];

export default function RaceBars() {
  const ref = useRef(null);
  const [go, setGo] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGo(true); io.disconnect(); } }, { threshold: 0.3 });
    io.observe(el); return () => io.disconnect();
  }, []);

  const GREEN = "#0e3b24", LIME = "#b8f24a", DGREEN = "#0a2e1c";
  return (
    <section ref={ref} style={{ background: GREEN, color: "#eaf6ea", padding: "96px 0", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", inset: 0, backgroundImage: `radial-gradient(#ffffff09 1px, transparent 1px)`, backgroundSize: "26px 26px", opacity: 0.5 }} />
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 28px", position: "relative" }}>
        <h2 style={{ fontFamily: "Schibsted Grotesk", fontSize: "clamp(30px,4.2vw,48px)", fontWeight: 700, letterSpacing: -1.2, lineHeight: 1.08, maxWidth: 760 }}>
          Vibe-checking doesn't scale.{" "}
          <span style={{ color: LIME }}>Systematic evaluation does.</span>
        </h2>
        <p style={{ fontSize: 17, color: "#a9c9b3", marginTop: 18, maxWidth: 620, lineHeight: 1.6 }}>
          Eyeballing a handful of conversations can't cover an unbounded failure surface or catch silent drift.
          The platform runs the full suite, every release, in seconds.
        </p>

        <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 38 }}>
          {ROWS.map((r, i) => (
            <div key={r.label} style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 28, alignItems: "center" }} className="race-row">
              <div>
                <div style={{ fontFamily: "Schibsted Grotesk", fontSize: "clamp(36px,4vw,52px)", fontWeight: 800, color: "#fff", letterSpacing: -1.5, lineHeight: 1 }}>{r.mult}</div>
                <div style={{ fontSize: 14, color: "#a9c9b3", marginTop: 6 }}>{r.label}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <Bar legend={r.a} frac={r.aFrac} go={go} delay={i * 120} color="#3c5a47" track={DGREEN} muted />
                <Bar legend={r.b} frac={r.bFrac} go={go} delay={i * 120 + 120} color={LIME} track={DGREEN} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`@media (max-width:760px){ .race-row{ grid-template-columns:1fr !important; gap:14px !important; } }`}</style>
    </section>
  );
}

function Bar({ legend, frac, go, delay, color, track, muted }) {
  const [who, num, unit] = legend;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width: 96, flexShrink: 0, fontFamily: "IBM Plex Mono", fontSize: 11, color: muted ? "#7fa089" : "#cdeaa0", textTransform: "uppercase", letterSpacing: 0.5 }}>{who}</div>
      <div style={{ flex: 1, height: 18, borderRadius: 6, background: track, overflow: "hidden", position: "relative" }}>
        <div style={{
          height: "100%", borderRadius: 6, background: color,
          width: go ? `${Math.max(frac * 100, 3)}%` : "0%",
          transition: `width 1.1s cubic-bezier(.22,.61,.36,1) ${delay}ms`,
          backgroundImage: muted ? "repeating-linear-gradient(45deg, transparent, transparent 6px, #ffffff0c 6px, #ffffff0c 12px)" : "none",
        }} />
      </div>
      <div style={{ width: 120, flexShrink: 0, textAlign: "right", fontFamily: "Schibsted Grotesk" }}>
        <span style={{ fontWeight: 800, fontSize: 18, color: muted ? "#9fbca8" : "#fff" }}>{num}</span>
        <span style={{ fontSize: 11.5, color: "#88a892", marginLeft: 5 }}>{unit}</span>
      </div>
    </div>
  );
}
