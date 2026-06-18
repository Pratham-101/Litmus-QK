import React from "react";
import { T, MAXW } from "../theme.js";

export default function Footer({ go }) {
  const cols = [
    { title: "Platform", links: [
      ["Evaluation framework", () => go("framework")],
      ["System architecture", () => go("architecture")],
      ["Observability", () => go("observability")],
      ["Case studies", () => go("cases")],
      ["Roadmap", () => go("roadmap")],
    ]},
    { title: "Framework", links: [
      ["CLAMP — Safety & gates", () => go("framework")],
      ["PEST — Correctness", () => go("framework")],
      ["GHTPWR — Production", () => go("framework")],
      ["LLM-as-a-Judge", () => go("framework")],
    ]},
    { title: "Resources", links: [
      ["Documentation", () => go("docs")],
      ["Evaluation lifecycle", () => go("docs")],
      ["LLM-as-a-Judge", () => go("docs")],
      ["Talk to an engineer", () => go("contact")],
    ]},
  ];

  return (
    <footer style={{ borderTop: `1px solid ${T.line}`, background: T.bgWarm, padding: "64px 0 40px" }}>
      <div style={{ maxWidth: MAXW, margin: "0 auto", padding: "0 28px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr 1fr 1fr", gap: 36 }} className="footer-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 11, marginBottom: 16 }}>
              <img src="/assets/qk-logo.jpeg" alt="QualityKiosk" style={{ width: 30, height: 30, borderRadius: 7, objectFit: "cover" }} />
              <span style={{ fontFamily: "Schibsted Grotesk", fontWeight: 800, fontSize: 17 }}>Litmus</span>
            </div>
            <p style={{ fontSize: 14.5, color: T.ink2, maxWidth: 340, lineHeight: 1.65 }}>
              The definitive test for production AI agents — evaluation, observability, and governance,
              built on DevRev Agent Studio and Arize AX, grounded in CLAMP · PEST · GHTPWR.
            </p>
            <p style={{ fontSize: 13.5, color: T.ink, marginTop: 16, fontWeight: 600 }}>
              Built by Pratham Chintrate.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div style={{ fontFamily: "IBM Plex Mono", fontSize: 11.5, letterSpacing: 1, textTransform: "uppercase", color: T.ink3, marginBottom: 16 }}>{c.title}</div>
              {c.links.map(([label, action]) => (
                <button key={label} onClick={action} style={{
                  display: "block", background: "none", border: "none", textAlign: "left", padding: 0,
                  fontSize: 14, color: T.ink2, marginBottom: 11, cursor: action ? "pointer" : "default",
                }}
                  onMouseEnter={(e) => action && (e.currentTarget.style.color = T.ink)}
                  onMouseLeave={(e) => action && (e.currentTarget.style.color = T.ink2)}
                >{label}</button>
              ))}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 48, paddingTop: 24, borderTop: `1px solid ${T.line}`, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
          <span style={{ fontSize: 13, color: T.ink3 }}>© 2026 Litmus · QualityKiosk Technologies · Built by Pratham Chintrate.</span>
          <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12.5, color: T.ink3 }}>CLAMP · PEST · GHTPWR</span>
        </div>
      </div>
    </footer>
  );
}
