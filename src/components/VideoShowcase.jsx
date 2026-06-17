import React, { useRef, useState } from "react";
import { T } from "../theme.js";
import { Section, Eyebrow, H2, Lead } from "./ui.jsx";
import { Reveal } from "./motion.jsx";

/* Cinematic product video — the real eval platform running. Click-to-play
   over a poster, with a soft window frame and glow. */
export default function VideoShowcase() {
  const vidRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const v = vidRef.current;
    if (!v) return;
    if (v.paused) { v.playbackRate = 1.6; v.play(); setPlaying(true); } else { v.pause(); setPlaying(false); }
  };

  return (
    <Section style={{ background: T.ink, color: "#f3ede2", position: "relative", overflow: "hidden" }}>
      <div aria-hidden style={{ position: "absolute", top: -100, left: "50%", transform: "translateX(-50%)", width: 900, height: 500, background: `radial-gradient(ellipse at center, ${T.green}22, transparent 70%)`, pointerEvents: "none" }} />
      <div style={{ position: "relative", textAlign: "center", maxWidth: 780, margin: "0 auto 44px" }}>
        <Reveal>
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 12, letterSpacing: 1.8, textTransform: "uppercase", color: "#8fc0a3", marginBottom: 16 }}>See it live</div>
          <h2 style={{ fontFamily: "Schibsted Grotesk", fontSize: "clamp(30px,4.2vw,48px)", fontWeight: 700, letterSpacing: -1, lineHeight: 1.08, color: "#faf6ef" }}>
            The platform, evaluating a real agent
          </h2>
          <p style={{ fontSize: 18, color: "#cabba6", marginTop: 16, lineHeight: 1.6 }}>
            Watch a full run end-to-end — dataset generation, live scoring across 15 dimensions, deployment gates,
            and the final verdict. No edits, no mockups.
          </p>
        </Reveal>
      </div>

      <Reveal delay={120}>
        <div style={{ position: "relative", maxWidth: 1040, margin: "0 auto" }}>
          <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid #342d25", boxShadow: "0 60px 120px -50px #000", background: "#0a0d12", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", borderBottom: "1px solid #342d25", background: "#12100c" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e0867a" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e3bd7a" }} />
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#8fc0a3" }} />
              <span style={{ marginLeft: 10, fontFamily: "IBM Plex Mono", fontSize: 11.5, color: "#a99b87" }}>agent-eval · screen recording</span>
            </div>
            <div style={{ position: "relative", cursor: playing ? "default" : "pointer" }} onClick={() => { if (!playing) toggle(); }}>
              <video
                ref={vidRef}
                poster="/assets/evals-poster.png"
                preload="metadata"
                playsInline
                controls={playing}
                onPlay={() => setPlaying(true)}
                onPause={() => setPlaying(false)}
                onEnded={() => setPlaying(false)}
                style={{ width: "100%", display: "block" }}
              >
                <source src="/assets/evals-demo.mp4" type="video/mp4" />
              </video>
              {!playing && (
                <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,10,14,0.32)", transition: "opacity .3s" }}>
                  <div style={{ width: 84, height: 84, borderRadius: "50%", background: "rgba(255,255,255,0.96)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 12px 50px #0008", transition: "transform .2s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.08)")}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
                    <span style={{ marginLeft: 6, borderStyle: "solid", borderWidth: "15px 0 15px 24px", borderColor: `transparent transparent transparent ${T.ink}` }} />
                  </div>
                  <span style={{ position: "absolute", bottom: 16, right: 18, fontFamily: "IBM Plex Mono", fontSize: 11, color: "#cabba6", background: "rgba(0,0,0,0.45)", padding: "4px 9px", borderRadius: 6 }}>1.6× speed · 50s run</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
