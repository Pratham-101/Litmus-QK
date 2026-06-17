import React, { useEffect, useRef, useState } from "react";
import { T } from "../theme.js";

/* A clean, code-built model dashboard — not a cropped screenshot. Mirrors the
   Arize model card: KPI tiles, a score-over-time sparkline, prediction-class
   split, and per-dimension feature bars. Animates in on scroll. */

const FEATURES = [
  ["correctness", 0.88], ["hallucination", 0.94], ["policy", 0.83], ["groundedness", 0.91],
  ["intent", 0.96], ["escalation", 0.9], ["safety", 0.99], ["tone", 0.92],
  ["brevity", 0.86], ["consistency", 0.89], ["cx_quality", 0.84], ["refusal", 0.95],
  ["banned_phrases", 1.0], ["language", 0.93], ["latency", 0.7],
];

function sc(v) { return v >= 0.9 ? T.green : v >= 0.75 ? "#5a8f3c" : v >= 0.5 ? T.amber : T.red; }

export default function DashboardMock() {
  const ref = useRef(null);
  const [go, setGo] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setGo(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el); return () => io.disconnect();
  }, []);

  // sparkline path
  const pts = [0.61, 0.66, 0.64, 0.7, 0.69, 0.73, 0.72, 0.78, 0.74, 0.8, 0.79, 0.83];
  const W = 320, H = 70;
  const path = pts.map((p, i) => `${(i / (pts.length - 1)) * W},${H - p * H}`).join(" ");

  return (
    <div ref={ref} style={{ border: `1px solid ${T.line}`, borderRadius: 16, overflow: "hidden", background: T.paper, boxShadow: "0 30px 80px -50px #1a161555" }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "13px 18px", borderBottom: `1px solid ${T.lineSoft}`, background: T.paperAlt }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e0867a" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e3bd7a" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#8fc0a3" }} />
        <span style={{ marginLeft: 8, fontFamily: "IBM Plex Mono", fontSize: 11.5, color: T.ink3 }}>arize · model dashboard · production</span>
      </div>

      <div style={{ padding: 22 }}>
        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 22 }} className="dash-kpi">
          {[["Predictions", "1,471", T.ink], ["Avg score", "0.728", T.green], ["Gates passing", "6 / 6", T.green], ["P99 latency", "1.2s", T.ink]].map(([l, v, c]) => (
            <div key={l} style={{ background: T.bgWarm, border: `1px solid ${T.line}`, borderRadius: 12, padding: "14px 16px" }}>
              <div style={{ fontSize: 11.5, color: T.ink3 }}>{l}</div>
              <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 26, fontWeight: 800, color: c, marginTop: 4, letterSpacing: -0.5 }}>{v}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 18, marginBottom: 22 }} className="dash-mid">
          {/* sparkline */}
          <div style={{ border: `1px solid ${T.line}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, color: T.ink3, marginBottom: 12 }}>Prediction score · 12-day trend</div>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 70, overflow: "visible" }}>
              <defs><linearGradient id="spark" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={T.green} stopOpacity="0.25" /><stop offset="100%" stopColor={T.green} stopOpacity="0" /></linearGradient></defs>
              <polyline points={`0,${H} ${path} ${W},${H}`} fill="url(#spark)" stroke="none" style={{ opacity: go ? 1 : 0, transition: "opacity .8s .3s" }} />
              <polyline points={path} fill="none" stroke={T.green} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                style={{ strokeDasharray: 900, strokeDashoffset: go ? 0 : 900, transition: "stroke-dashoffset 1.4s cubic-bezier(.22,.61,.36,1)" }} />
            </svg>
          </div>
          {/* prediction class split */}
          <div style={{ border: `1px solid ${T.line}`, borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 12, color: T.ink3, marginBottom: 14 }}>Prediction class</div>
            {[["Pass", 0.78, T.green], ["Warn", 0.14, T.amber], ["Fail", 0.08, T.red]].map(([l, f, c], i) => (
              <div key={l} style={{ marginBottom: 11 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: T.ink2 }}>{l}</span><span style={{ fontFamily: "IBM Plex Mono", color: c }}>{Math.round(f * 100)}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: T.lineSoft, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: c, width: go ? `${f * 100}%` : 0, transition: `width 1s ${i * 120}ms cubic-bezier(.22,.61,.36,1)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* feature bars */}
        <div style={{ border: `1px solid ${T.line}`, borderRadius: 12, padding: 16 }}>
          <div style={{ fontSize: 12, color: T.ink3, marginBottom: 14 }}>Per-dimension scores · 15 evaluators</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "10px 22px" }} className="dash-feat">
            {FEATURES.map(([n, v], i) => (
              <div key={n}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                  <span style={{ fontFamily: "IBM Plex Mono", color: T.ink2 }}>{n}</span>
                  <span style={{ fontFamily: "IBM Plex Mono", color: sc(v) }}>{Math.round(v * 100)}</span>
                </div>
                <div style={{ height: 5, borderRadius: 99, background: T.lineSoft, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: sc(v), width: go ? `${v * 100}%` : 0, transition: `width .9s ${i * 45}ms cubic-bezier(.22,.61,.36,1)` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @media (max-width:720px){
          .dash-kpi{ grid-template-columns:1fr 1fr !important; }
          .dash-mid{ grid-template-columns:1fr !important; }
          .dash-feat{ grid-template-columns:1fr 1fr !important; }
        }
      `}</style>
    </div>
  );
}
