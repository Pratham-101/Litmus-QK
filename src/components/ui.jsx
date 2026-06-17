import React from "react";
import { T, MAXW } from "../theme.js";

export function Container({ children, style }) {
  return <div style={{ maxWidth: MAXW, margin: "0 auto", padding: "0 28px", ...style }}>{children}</div>;
}

export function Section({ children, style, id }) {
  return (
    <section id={id} style={{ padding: "104px 0", position: "relative", ...style }}>
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children, color = T.ink3 }) {
  return (
    <div style={{
      fontFamily: "IBM Plex Mono", fontSize: 12, fontWeight: 500, letterSpacing: 1.8,
      textTransform: "uppercase", color, marginBottom: 18,
    }}>{children}</div>
  );
}

export function H2({ children, style }) {
  return (
    <h2 style={{
      fontFamily: "Schibsted Grotesk", fontSize: "clamp(32px, 4.4vw, 50px)", fontWeight: 700,
      lineHeight: 1.06, letterSpacing: -1.2, color: T.ink, marginBottom: 20, ...style,
    }}>{children}</h2>
  );
}

export function Lead({ children, style }) {
  return (
    <p style={{ fontSize: 19, color: T.ink2, maxWidth: 660, lineHeight: 1.6, ...style }}>{children}</p>
  );
}

export function Button({ children, href, onClick, variant = "primary", external, style }) {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer",
    fontFamily: "Schibsted Grotesk", fontWeight: 600, fontSize: 15, padding: "13px 24px",
    borderRadius: 999, border: "1px solid transparent", transition: "all .18s ease",
    textDecoration: "none", whiteSpace: "nowrap",
  };
  const variants = {
    primary: { background: T.ink, color: "#f7f4ee" },
    secondary: { background: "transparent", color: T.ink, border: `1px solid ${T.ink}33` },
    ghost: { background: T.paper, color: T.ink, border: `1px solid ${T.line}` },
  };
  const props = href ? { href, ...(external ? { target: "_blank", rel: "noopener noreferrer" } : {}) } : { onClick };
  const Tag = href ? "a" : "button";
  return <Tag {...props} style={{ ...base, ...variants[variant], ...style }}>{children}</Tag>;
}

export function Card({ children, style, hover }) {
  const ref = React.useRef(null);
  return (
    <div ref={ref} style={{
      background: T.paper, border: `1px solid ${T.line}`, borderRadius: 18,
      padding: 28, transition: "all .2s ease", ...style,
    }}
      onMouseEnter={hover ? () => { const e = ref.current; e.style.boxShadow = "0 18px 50px -24px #1a161333"; e.style.transform = "translateY(-3px)"; e.style.borderColor = "#d8cfc0"; } : undefined}
      onMouseLeave={hover ? () => { const e = ref.current; e.style.boxShadow = "none"; e.style.transform = "none"; e.style.borderColor = T.line; } : undefined}
    >{children}</div>
  );
}

export function Stat({ value, label, color = T.ink }) {
  return (
    <div>
      <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 40, fontWeight: 800, color, lineHeight: 1, letterSpacing: -1 }}>{value}</div>
      <div style={{ fontSize: 13.5, color: T.ink3, marginTop: 9 }}>{label}</div>
    </div>
  );
}

export function Pill({ children, color = T.ink }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "IBM Plex Mono",
      fontSize: 11, fontWeight: 500, letterSpacing: 0.6, color, background: `${color}12`,
      border: `1px solid ${color}28`, padding: "5px 11px", borderRadius: 7, textTransform: "uppercase",
    }}>{children}</span>
  );
}

// Framed product screenshot with a soft window chrome — for the Arize visuals.
export function Frame({ src, alt, label, style }) {
  return (
    <div style={{
      borderRadius: 16, overflow: "hidden", border: `1px solid ${T.line}`,
      background: T.paper, boxShadow: "0 40px 90px -50px #1a161355", ...style,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "11px 15px", borderBottom: `1px solid ${T.lineSoft}`, background: T.paperAlt }}>
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e0867a" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#e3bd7a" }} />
        <span style={{ width: 10, height: 10, borderRadius: "50%", background: "#8fc0a3" }} />
        {label && <span style={{ marginLeft: 10, fontFamily: "IBM Plex Mono", fontSize: 11.5, color: T.ink3 }}>{label}</span>}
      </div>
      <img src={src} alt={alt} style={{ width: "100%", display: "block" }} loading="lazy" />
    </div>
  );
}

// Decorative dotted-grid backdrop for editorial sections.
export function DotGrid({ style }) {
  return (
    <div aria-hidden style={{
      position: "absolute", inset: 0, pointerEvents: "none",
      backgroundImage: `radial-gradient(${T.ink}0e 1px, transparent 1px)`,
      backgroundSize: "22px 22px", maskImage: "radial-gradient(ellipse at center, #000 30%, transparent 75%)",
      ...style,
    }} />
  );
}
