import React, { useState } from "react";
import { T } from "../theme.js";
import { Container, Section, Eyebrow, H2, Lead, Card, Pill, Button, Frame } from "../components/ui.jsx";

const CASES = {
  aviation: {
    tab: "Aviation",
    name: "India's largest low-cost airline",
    meta: "Aviation customer support · evaluated on DevRev × Arize",
    color: T.amber,
    summary: "India's largest carrier by market share — a high-frequency, low-cost airline renowned for on-time performance and operational efficiency at massive scale. A single DevRev Agent Studio agent serves passengers, travel agents, and corporate users across a web chat widget and support portal: 20 intents, 10 skills, 22 knowledge-base articles, mirroring 9 regional languages plus English in concise, WhatsApp-style replies under 30 words.",
    arch_stats: [["20", "intents"], ["10", "skills"], ["22", "KB articles"], ["7", "hard-stops"]],
    headline: ["149", "cases evaluated", "0.805", "composite score", "3 of 6", "gates failed", "NOT READY", "verdict"],
    gates: [
      { n: "OTA Routing hard-stop", s: 0.0, pass: false },
      { n: "Group Booking hard-stop", s: 0.625, pass: false },
      { n: "Prompt Injection resistance", s: 0.9, pass: false },
      { n: "Safety escalation", s: 0.99, pass: true },
      { n: "Banned phrases (0 matches)", s: 1.0, pass: true },
      { n: "Hallucination rate (<10%)", s: 0.93, pass: true },
    ],
    finding: "Composite 0.805 cleared the 0.80 Beta line — but OTA routing scored 0.00, meaning the agent would mishandle an entire booking channel (travel-agent legs that must redirect to source). A passing average cannot override a failed gate.",
    roles: ["passenger", "travel agent", "corporate user"],
    skills: ["PNR lookup", "web check-in", "boarding pass", "flight status", "create ticket", "mark urgent", "assign conversation", "GST invoice", "rewards lookup", "feedback ticket"],
  },
  mobility: {
    tab: "Mobility",
    name: "An airport-focused ride-hailing platform",
    meta: "Mobility customer support · evaluated on DevRev × Arize",
    color: T.red,
    summary: "A specialist airport-mobility and ride-hailing service built for time-critical, pre-booked airport transfers — a two-sided marketplace serving riders, drivers, and travel-partner channels. Front-line support runs on a 5-layer architecture with a FastAPI evaluation middleware: 14 evaluators (8 LLM-judge + 6 deterministic) streaming to Arize over OTLP, sharing one trace ID.",
    arch_stats: [["5", "system layers"], ["18", "intents"], ["7", "skills"], ["14", "evaluators"]],
    headline: ["690", "cases evaluated", "0.82", "avg composite", "3 of 5", "gates failed", "NOT READY", "verdict"],
    gates: [
      { n: "Skill-based suite", s: 0.555, pass: false, note: "233 / 420" },
      { n: "Intent-based suite", s: 0.426, pass: false, note: "115 / 270" },
      { n: "Safety escalation path", s: 0.0, pass: false, note: "complete failure" },
      { n: "Language understanding", s: 0.92, pass: true },
      { n: "Policy comprehension", s: 0.88, pass: true },
    ],
    finding: "The agent understood users and policy well (composite 0.82), but execution broke down: skill invocation and parameter handling failed, and the safety-escalation path failed completely — the single most critical gate in any support agent.",
    roles: ["passenger", "driver", "partner-channel customer"],
    skills: ["classify customer type", "update passenger profile", "update driver profile", "assign conversation", "create ticket", "mark conversation urgent", "create feedback ticket"],
  },
};

export default function Cases({ go }) {
  const [tab, setTab] = useState("aviation");
  const c = CASES[tab];
  return (
    <>
      <section style={{ padding: "84px 0 36px" }}>
        <Container>
          <Eyebrow color={T.amber}>Case studies</Eyebrow>
          <H2 style={{ maxWidth: 860 }}>Real agents. Real verdicts.</H2>
          <Lead>
            Two production-grade conversational agents — anonymized for confidentiality — put through the complete
            evaluation suite. Both scored respectably on average, and both were correctly blocked from deployment.
            This is exactly what gating catches.
          </Lead>
        </Container>
      </section>

      <Container>
        <div style={{ display: "flex", gap: 10, marginBottom: 26 }}>
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
            <Pill color={c.color}>NOT READY</Pill>
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
            <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 16.5, marginBottom: 18 }}>Deployment gate results</div>
            {c.gates.map((g) => (
              <div key={g.n} style={{ marginBottom: 15 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13.5, marginBottom: 6 }}>
                  <span style={{ color: T.ink2 }}>
                    {g.pass ? "✅" : "❌"} {g.n}
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
            <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${c.color}33`, fontSize: 13.5, color: T.ink2, lineHeight: 1.6 }}>
              <strong style={{ color: T.ink }}>The lesson:</strong> a high average is not a deployment decision.
              One failed safety gate outweighs a strong composite — exactly the failure mode gating exists to catch.
            </div>
          </Card>
        </div>

        <AgentFlow c={c} />
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <Button onClick={() => go("architecture")} variant="secondary">See the full evaluation architecture →</Button>
        </div>
      </Section>

      <Section style={{ background: T.bgWarm, borderTop: `1px solid ${T.line}`, textAlign: "center" }}>
        <H2 style={{ margin: "0 auto", maxWidth: 660 }}>Want your agent evaluated like this?</H2>
        <Lead style={{ margin: "14px auto 0", textAlign: "center" }}>
          Every report here was generated by the platform end-to-end — dataset, scoring, gating, observability, and findings.
        </Lead>
        <div className="hero-cta" style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 30 }}>
          <Button onClick={() => go("architecture")}>See the architecture →</Button>
          <Button onClick={() => go("framework")} variant="secondary">Explore the framework</Button>
        </div>
      </Section>
    </>
  );
}

/* Code-built per-agent flow: two-phase reasoning → skills.
   Replaces the (incorrect) Arize screenshots. */
function AgentFlow({ c }) {
  return (
    <Card style={{ padding: 26 }}>
      <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 17, marginBottom: 20 }}>
        Agent reasoning flow
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", marginBottom: 22 }}>
        <FNode label="User message" sub="PLuG / portal" col={T.ink3} />
        <FArrow />
        <FNode label="Phase 1 · Role ID" sub={c.roles.join(" / ")} col={T.blue} />
        <FArrow />
        <FNode label="Phase 2 · Intent" sub={`1 of ${c.arch_stats[0][0]} intents`} col={c.color} />
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
