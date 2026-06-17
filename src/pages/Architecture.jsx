import React, { useState } from "react";
import { T, BRANCH } from "../theme.js";
import { Container, Section, Eyebrow, H2, Lead, Card, Pill, Button } from "../components/ui.jsx";
import ArchDiagram from "../components/ArchDiagram.jsx";

export default function Architecture({ go }) {
  return (
    <>
      <section style={{ position: "relative", padding: "84px 0 40px" }}>
        <Container>
          <Eyebrow color={T.blue}>System architecture</Eyebrow>
          <H2 style={{ maxWidth: 860 }}>How the platform evaluates a live agent</H2>
          <Lead>
            The evaluator never modifies the agent — it observes and measures. A FastAPI middleware calls the
            live agent via the execute-sync API, runs 14 evaluators per response, and streams scored predictions
            downstream over a shared trace ID. Below: the full data flow, the five-layer model, and the pipeline.
          </Lead>
        </Container>
      </section>

      <Section style={{ paddingTop: 16 }}>
        <div style={{ maxWidth: 720, margin: "0 auto 40px", textAlign: "center" }}>
          <Eyebrow color={T.green}>End-to-end data flow</Eyebrow>
          <H2 style={{ margin: "0 auto", fontSize: "clamp(26px,3.4vw,38px)" }}>Ingestion to observability</H2>
        </div>
        <ArchDiagram />
      </Section>

      <Section style={{ background: T.bgWarm, borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}` }}>
        <FiveLayerStack />
      </Section>

      <Section>
        <PipelineFlow />
      </Section>

      <Section style={{ background: T.bgWarm, borderTop: `1px solid ${T.line}`, textAlign: "center" }}>
        <H2 style={{ margin: "0 auto", maxWidth: 640 }}>From architecture to verdict</H2>
        <Lead style={{ margin: "14px auto 0", textAlign: "center" }}>
          See how this architecture scores every dimension and produces a gated deployment decision.
        </Lead>
        <div className="hero-cta" style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 30 }}>
          <Button onClick={() => go("framework")}>Explore the framework →</Button>
          <Button onClick={() => go("observability")} variant="secondary">See observability</Button>
        </div>
      </Section>
    </>
  );
}

/* ── The five-layer reference stack ── */
const LAYERS = [
  { id: "L1", title: "Customer channels", color: T.ink3, items: ["PLuG web widget", "DevRev support portal"], note: "Where passengers, drivers & agents talk to the bot" },
  { id: "L2", title: "DevRev Agent Studio", color: T.blue, items: ["Conversational agent", "Skills engine", "Queue routing"], note: "Managed agent runtime — configuration over code" },
  { id: "L3", title: "LLM reasoning & knowledge", color: T.blue, items: ["GPT-4o-class reasoning", "Vector knowledge base (RAG)"], note: "Two-phase reasoning: role → intent" },
  { id: "L4", title: "Agent Evaluator  ·  this platform", color: T.green, items: ["FastAPI middleware :8000", "3 ingestion paths", "14 evaluators (8 LLM + 6 deterministic)", "OpenTelemetry + Arize SDK"], note: "Observes & measures — never modifies the agent", highlight: true },
  { id: "L5", title: "Arize AX", color: T.red, items: ["OTLP traces endpoint", "Predictions & dashboards", "Drift monitors & gates"], note: "The quality & observability surface" },
];

function FiveLayerStack() {
  return (
    <>
      <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 44px" }}>
        <Eyebrow>Reference architecture</Eyebrow>
        <H2 style={{ margin: "0 auto", fontSize: "clamp(26px,3.4vw,38px)" }}>The five-layer model</H2>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {LAYERS.map((l, i) => (
          <div key={l.id}>
            <Card style={{
              padding: 0, overflow: "hidden",
              border: l.highlight ? `2px solid ${T.green}` : `1px solid ${T.line}`,
              boxShadow: l.highlight ? "0 16px 50px -30px #2f7d5266" : "none",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "120px 1fr", alignItems: "stretch" }} className="grid-2">
                <div style={{ background: l.highlight ? T.green : T.bgWarm, color: l.highlight ? "#fff" : l.color, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", padding: "20px 0", borderRight: `1px solid ${T.lineSoft}` }}>
                  <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 26, fontWeight: 800 }}>{l.id}</div>
                </div>
                <div style={{ padding: "18px 24px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: 14, justifyContent: "space-between" }}>
                  <div style={{ minWidth: 220 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                      <span style={{ fontFamily: "Schibsted Grotesk", fontSize: 18, fontWeight: 700 }}>{l.title}</span>
                      {l.highlight && <Pill color={T.green}>This platform</Pill>}
                    </div>
                    <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>{l.note}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {l.items.map((it) => (
                      <span key={it} style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.ink2, background: T.bgWarm, border: `1px solid ${T.line}`, padding: "5px 10px", borderRadius: 7 }}>{it}</span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            {i < LAYERS.length - 1 && (
              <div style={{ textAlign: "center", color: T.ink3, fontSize: 18, lineHeight: 1, padding: "2px 0" }}>↓</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

/* ── The evaluation pipeline (ingestion → fan-out → aggregate → Arize) ── */
function PipelineFlow() {
  const stages = [
    { t: "Ingest", c: T.blue, items: ["API · on-demand", "Webhook · real-time (HMAC)", "Poller · 60s background"] },
    { t: "Resolve", c: T.ink2, items: ["execute-sync → live agent", "SSE response + tool calls", "Build EvalInput"] },
    { t: "Evaluate", c: T.green, items: ["14 evaluators via asyncio.gather", "8 LLM judges · 6 deterministic", "Self-register via @register"] },
    { t: "Aggregate", c: T.amber, items: ["Weighted composite", "Gate checks", "Tier: Alpha → GA"] },
    { t: "Observe", c: T.red, items: ["OTLP spans → Arize", "Prediction records", "Shared trace ID"] },
  ];
  return (
    <>
      <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 48px" }}>
        <Eyebrow color={T.green}>Evaluation pipeline</Eyebrow>
        <H2 style={{ margin: "0 auto", fontSize: "clamp(26px,3.4vw,38px)" }}>One response, fourteen evaluators, in parallel</H2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 0, alignItems: "stretch" }} className="grid-pipeline">
        {stages.map((s, i) => (
          <div key={s.t} style={{ position: "relative", padding: "0 8px" }}>
            <Card style={{ height: "100%", padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 14 }}>
                <span style={{ width: 26, height: 26, borderRadius: "50%", background: `${s.c}18`, color: s.c, border: `1px solid ${s.c}55`, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Schibsted Grotesk", fontWeight: 800, fontSize: 13 }}>{i + 1}</span>
                <span style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 16 }}>{s.t}</span>
              </div>
              {s.items.map((it) => (
                <div key={it} style={{ fontSize: 12.5, color: T.ink2, lineHeight: 1.5, marginBottom: 7, display: "flex", gap: 7 }}>
                  <span style={{ color: s.c }}>›</span>{it}
                </div>
              ))}
            </Card>
            {i < stages.length - 1 && <span className="pipe-arrow" style={{ position: "absolute", top: 30, right: -7, color: T.ink3, fontSize: 16, zIndex: 2 }}>→</span>}
          </div>
        ))}
      </div>
      <style>{`@media (max-width: 900px){ .grid-pipeline{ grid-template-columns:1fr !important; gap:10px !important;} .pipe-arrow{ display:none !important;} }`}</style>
    </>
  );
}

/* ── The two real agent architectures, switchable ── */
const AGENTS = {
  aviation: {
    tab: "Aviation", name: "India's largest low-cost airline", color: T.amber,
    org: "Aviation customer support · DevRev × Arize", region: "DevRev Agent Studio",
    persona: "India's largest carrier by market share, known for on-time performance and lean efficiency at scale. Front-line support across a web chat widget + portal — concise, WhatsApp-style replies under 30 words, mirrored across 9 regional languages + English.",
    stats: [["20", "intents"], ["10", "skills"], ["22", "KB articles"], ["7", "hard-stops"], ["14", "evaluators"], ["149", "cases run"]],
    roles: ["Passenger", "Travel agent", "Corporate user"],
    intents: ["PNR / Booking lookup", "Web check-in (48h)", "Boarding pass", "Flight status", "Cancellation ·H3", "Reschedule ·H3", "Name correction ·H5", "Baggage allowance", "Excess baggage", "Seat selection", "Add-ons", "Special assistance", "Tax invoice", "Loyalty rewards", "Refund status ·H3", "Lost baggage", "Group booking ·H2", "Feedback", "Safety/Emergency ·H1", "Out of scope"],
    skills: ["PNR lookup", "web check-in", "boarding pass", "flight status", "create ticket", "mark urgent", "assign conversation", "tax invoice", "rewards lookup", "feedback ticket"],
    hardstops: ["H1 Safety emergency", "H2 Group booking 10+", "H3 Travel-agent leg", "H4 Payment data (no CVV/OTP)", "H5 Full name change", "H6 Authority override", "H7 Prompt extraction"],
  },
  mobility: {
    tab: "Mobility", name: "An airport-focused ride-hailing platform", color: T.red,
    org: "Mobility customer support · DevRev × Arize", region: "DevRev Agent Studio",
    persona: "A specialist airport-mobility service for time-critical, pre-booked transfers — a two-sided marketplace of riders, drivers, and travel-partner channels. Front-line support across the post-booking journey, built on a 5-layer architecture with a FastAPI evaluation middleware.",
    stats: [["18", "intents"], ["7", "skills"], ["5", "layers"], ["14", "evaluators"], ["113", "dataset cases"], ["690", "v2 cases run"]],
    roles: ["Passenger", "Driver", "Partner-channel customer"],
    intents: ["Ride amendment ·prohibited", "Fare query", "Ride status", "Driver location", "Payment issue", "Cancellation", "Lost item", "Service quality", "Driver feedback", "New booking ·prohibited", "Account help", "Safety / emergency", "Refund request", "Promo / coupon", "Driver pay / earnings", "Driver vehicle issue", "Document upload", "General FAQ"],
    skills: ["classify customer type", "update passenger profile", "update driver profile", "assign conversation", "create ticket", "mark conversation urgent", "create feedback ticket"],
    hardstops: ["Ride amendment → route to human", "New booking → route to human", "Safety/emergency → mark urgent + assign"],
  },
};

function AgentArchitectures() {
  const [tab, setTab] = useState("aviation");
  const a = AGENTS[tab];
  return (
    <>
      <div style={{ textAlign: "center", maxWidth: 760, margin: "0 auto 40px" }}>
        <Eyebrow color={T.amber}>The agents we've evaluated</Eyebrow>
        <H2 style={{ margin: "0 auto", fontSize: "clamp(26px,3.4vw,38px)" }}>Two production agent architectures, in full</H2>
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 30 }}>
        {Object.entries(AGENTS).map(([id, v]) => {
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

      {/* overview */}
      <Card style={{ borderTop: `3px solid ${a.color}`, marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 14 }}>
          <div>
            <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 24, fontWeight: 800 }}>{a.name}</div>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: 12.5, color: T.ink3, marginTop: 4 }}>{a.org} · {a.region}</div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "flex-start" }}>
            {a.roles.map((r) => <Pill key={r} color={a.color}>{r}</Pill>)}
          </div>
        </div>
        <p style={{ fontSize: 15.5, color: T.ink2, lineHeight: 1.6, maxWidth: 860 }}>{a.persona}</p>
        <div style={{ display: "flex", gap: 26, marginTop: 22, flexWrap: "wrap" }}>
          {a.stats.map(([v, l]) => (
            <div key={l} style={{ borderLeft: `2px solid ${a.color}44`, paddingLeft: 13 }}>
              <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 24, fontWeight: 800, color: a.color, lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 5 }}>{l}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* two-phase flow */}
      <Card style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 17, marginBottom: 18 }}>Two-phase reasoning</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <Node label="User message" sub="PLuG / portal" c={T.ink3} />
          <Arrow />
          <Node label="Phase 1 · Role ID" sub={a.roles.join(" / ")} c={T.blue} />
          <Arrow />
          <Node label="Phase 2 · Intent routing" sub={`1 of ${a.intents.length} intents`} c={a.color} />
          <Arrow />
          <Node label="KB-grounded answer" sub="RAG + skill call" c={T.green} />
        </div>
      </Card>

      {/* intents + skills + hard-stops */}
      <div className="grid-3" style={{ display: "grid", gap: 18 }}>
        <Card>
          <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Intents <span style={{ color: T.ink3, fontWeight: 500 }}>· {a.intents.length}</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            {a.intents.map((it, i) => (
              <div key={it} style={{ fontSize: 12.5, color: it.includes("·H") || it.includes("prohibit") ? a.color : T.ink2, display: "flex", gap: 8 }}>
                <span style={{ fontFamily: "IBM Plex Mono", color: T.ink3, fontSize: 11 }}>{String(i + 1).padStart(2, "0")}</span>{it}
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Skills <span style={{ color: T.ink3, fontWeight: 500 }}>· {a.skills.length}</span></div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {a.skills.map((s) => (
              <span key={s} style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.ink2, background: T.bgWarm, border: `1px solid ${T.line}`, padding: "7px 11px", borderRadius: 8 }}>{s}</span>
            ))}
          </div>
        </Card>
        <Card style={{ borderTop: `3px solid ${a.color}` }}>
          <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 16, marginBottom: 6 }}>Hard-stops</div>
          <div style={{ fontSize: 12.5, color: T.ink3, marginBottom: 14 }}>Must decline & route to a human</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {a.hardstops.map((h) => (
              <div key={h} style={{ fontSize: 12.5, color: T.ink, display: "flex", gap: 8, alignItems: "flex-start" }}>
                <span style={{ color: a.color, fontWeight: 800 }}>■</span>{h}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}

function Node({ label, sub, c }) {
  return (
    <div style={{ flex: "1 1 150px", minWidth: 140, background: T.bgWarm, border: `1px solid ${T.line}`, borderTop: `3px solid ${c}`, borderRadius: 12, padding: "14px 16px" }}>
      <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 14 }}>{label}</div>
      <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 3 }}>{sub}</div>
    </div>
  );
}
function Arrow() {
  return <span style={{ color: T.ink3, fontSize: 18 }}>→</span>;
}
