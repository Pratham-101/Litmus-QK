import React, { useState } from "react";
import { T } from "../theme.js";
import { Container, Section, Eyebrow, H2, Lead, Card, Pill, Button, Frame } from "../components/ui.jsx";
import { CASES } from "../data/cases.js";


export default function Cases({ go }) {
  const [tab, setTab] = useState(Object.keys(CASES)[0]);
  const c = CASES[tab];
  const count = Object.keys(CASES).length;
  return (
    <>
      <section style={{ padding: "84px 0 36px" }}>
        <Container>
          <Eyebrow color={T.amber}>Case studies</Eyebrow>
          <H2 style={{ maxWidth: 860 }}>Real agents. Real verdicts.</H2>
          <Lead>
            {count} agents across aviation, mobility, payments, banking, healthcare, education and the public
            sector, anonymized for confidentiality and put through the evaluation suite. Each shows its scores,
            its gates and the verdict its own report reached.
          </Lead>
        </Container>
      </section>

      <Container>
        <div style={{ display: "flex", gap: 10, marginBottom: 26, flexWrap: "wrap" }}>
          {Object.entries(CASES).map(([id, v]) => {
            const on = tab === id;
            return (
              <button key={id} onClick={() => setTab(id)} style={{
                fontFamily: "Schibsted Grotesk", fontSize: 14.5, fontWeight: 700, cursor: "pointer",
                padding: "11px 24px", borderRadius: 999,
                background: on ? v.color : T.paper, color: on ? "#fff" : T.ink2,
                border: `1px solid ${on ? v.color : T.line}`,
              }}>{v.tab}</button>
            );
          })}
        </div>
      </Container>

      <Section style={{ paddingTop: 0 }}>
        <Card style={{ borderLeft: `4px solid ${c.color}`, marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 25, fontWeight: 800 }}>{c.name}</div>
              <div style={{ fontFamily: "IBM Plex Mono", fontSize: 12.5, color: T.ink3, marginTop: 4 }}>{c.meta}</div>
            </div>
            <Pill color={verdictColor(c.verdict, c.color)}>{c.verdict || "NOT READY"}</Pill>
          </div>
          <p style={{ fontSize: 15.5, color: T.ink2, lineHeight: 1.65, marginTop: 16, maxWidth: 900 }}>{c.summary}</p>
          <div style={{ display: "flex", gap: 28, marginTop: 22, flexWrap: "wrap" }}>
            {c.arch_stats.map(([v, l]) => (
              <div key={l} style={{ borderLeft: `2px solid ${c.color}44`, paddingLeft: 14 }}>
                <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 24, fontWeight: 800, color: c.color, lineHeight: 1 }}>{v}</div>
                <div style={{ fontSize: 12, color: T.ink3, marginTop: 5 }}>{l}</div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid-4" style={{ display: "grid", gap: 14, marginBottom: 22 }}>
          {[0, 2, 4, 6].map((i) => (
            <Card key={i} style={{ textAlign: "center", padding: 22 }}>
              <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 30, fontWeight: 800, color: i === 6 ? c.color : T.ink, lineHeight: 1 }}>{c.headline[i]}</div>
              <div style={{ fontSize: 12.5, color: T.ink3, marginTop: 9 }}>{c.headline[i + 1]}</div>
            </Card>
          ))}
        </div>

        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 22, alignItems: "start", marginBottom: 24 }}>
          <Card>
            <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 16.5, marginBottom: 18 }}>{c.gates.some((g) => g.pass !== null && g.pass !== undefined) ? "Deployment gate results" : "Scores by dimension"}</div>
            {c.gates.map((g) => (
              <div key={g.n} style={{ marginBottom: 15 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6 }}>
                  <span style={{ color: T.ink2 }}>
                    {g.pass === true ? "✅" : g.pass === false ? "❌" : "·"} {g.n}
                    {g.note && <span style={{ color: T.ink3, fontSize: 12 }}> · {g.note}</span>}
                  </span>
                  <span style={{ fontWeight: 700, fontFamily: "IBM Plex Mono", color: sc(g.s) }}>{g.s.toFixed(3)}</span>
                </div>
                <div style={{ height: 6, borderRadius: 99, background: T.lineSoft, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${g.s * 100}%`, background: sc(g.s) }} />
                </div>
              </div>
            ))}
          </Card>
          <Card style={{ background: `${c.color}0c`, border: `1px solid ${c.color}44` }}>
            <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 16.5, marginBottom: 12, color: c.color }}>Headline finding</div>
            <p style={{ fontSize: 15, color: T.ink, lineHeight: 1.7 }}>{c.finding}</p>
            {c.verdict === "NOT READY" && (
              <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${c.color}33`, fontSize: 13.5, color: T.ink2, lineHeight: 1.6 }}>
                <strong style={{ color: T.ink }}>The lesson:</strong> a high average is not a deployment decision.
                A failed gate outweighs a strong composite, which is exactly the failure mode gating exists to catch.
              </div>
            )}
          </Card>
        </div>

        {c.skills?.length > 0 && <AgentFlow c={c} />}
      </Section>

      <Section style={{ background: T.bgWarm, borderTop: `1px solid ${T.line}`, textAlign: "center" }}>
        <H2 style={{ margin: "0 auto", maxWidth: 660 }}>Want your agent evaluated like this?</H2>
        <Lead style={{ margin: "14px auto 0", textAlign: "center" }}>
          Every report here was generated by the platform end-to-end — dataset, scoring, gating, observability, and findings.
        </Lead>
        <div className="hero-cta" style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 30 }}>
          <Button onClick={() => go("framework")}>Explore the framework →</Button>
        </div>
      </Section>
    </>
  );
}

/* Code-built per-agent flow: two-phase reasoning → skills.
   Replaces the (incorrect) Arize screenshots. */
function AgentFlow({ c }) {
  const intents = c.arch_stats.find(([, l]) => l === "intents")?.[0];
  return (
    <Card style={{ padding: 26 }}>
      <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 17, marginBottom: 20 }}>
        Agent reasoning flow
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 22 }}>
        <FNode label="User message" sub="PLuG / portal" col={T.ink3} />
        <FArrow />
        {c.roles?.length > 0 && <><FNode label="Phase 1 · Role ID" sub={c.roles.join(" / ")} col={T.blue} /><FArrow /></>}
        <FNode label={c.roles?.length > 0 ? "Phase 2 · Intent" : "Intent"} sub={intents ? `1 of ${intents} intents` : "intent routing"} col={c.color} />
        <FArrow />
        <FNode label="KB-grounded reply" sub="RAG + skill call" col={T.green} />
      </div>
      <div style={{ fontFamily: "IBM Plex Mono", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: T.ink3, marginBottom: 12 }}>
        Connected skills · {c.skills.length}
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {c.skills.map((s) => (
          <span key={s} style={{ fontFamily: "IBM Plex Mono", fontSize: 11.5, color: T.ink2, background: T.bgWarm, border: `1px solid ${T.line}`, padding: "6px 11px", borderRadius: 8 }}>{s}</span>
        ))}
      </div>
    </Card>
  );
}
function FNode({ label, sub, col }) {
  return (
    <div style={{ flex: "1 1 150px", minWidth: 140, background: T.bgWarm, border: `1px solid ${T.line}`, borderTop: `3px solid ${col}`, borderRadius: 12, padding: "13px 15px" }}>
      <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 14 }}>{label}</div>
      <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 3 }}>{sub}</div>
    </div>
  );
}
function FArrow() { return <span style={{ color: T.ink3, fontSize: 18 }}>→</span>; }

function sc(v) {
  if (v >= 0.9) return T.green;
  if (v >= 0.75) return "#5a8f3c";
  if (v >= 0.5) return T.amber;
  return T.red;
}

function verdictColor(v, fallback) {
  const u = String(v || "").toUpperCase();
  if (u === "READY" || u.startsWith("GA") || u.includes("PASS") || u.includes("VALIDATED")) return T.green;
  if (u.includes("CONDITIONAL") || u.includes("BETA")) return T.amber;
  if (u.includes("NO VERDICT")) return T.ink3;
  return fallback;
}
