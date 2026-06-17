import React, { useState } from "react";
import { T } from "../theme.js";
import { Container, Section, Eyebrow, H2, Lead, Card, Pill, Frame, Button } from "../components/ui.jsx";
import DashboardMock from "../components/DashboardMock.jsx";

const TABS = [
  { id: "traces", label: "Traces", img: "/assets/arize-traces.png",
    blurb: "Every conversation captured as a trace — multilingual inputs, agent outputs, latency, and token cost across 1.8k+ traces and 4.5k+ spans. Trace-first debugging for any single response.",
    stats: [["1.807k", "Traces"], ["4.481k", "Spans"], ["AGENT", "Span kind"]] },
  { id: "graph", label: "Agent Graph", img: "/assets/arize-agent-graph.png",
    blurb: "The agent's decision flow, auto-reconstructed from spans — Start → DevRev agent → LLM response + skill/tool calls → End. Dead skills surface as unconnected nodes.",
    stats: [["1", "Agent node"], ["5", "Skill/tool nodes"], ["Start→End", "Flow"]] },
  { id: "path", label: "Agent Path", img: "/assets/arize-agent-path.png",
    blurb: "A Sankey view of execution volume — how spans flow from agent execution into Chat, tool executions, and LLM calls. Spot the heaviest paths instantly.",
    stats: [["55", "Chat spans"], ["26", "Top tool path"], ["CHAIN·LLM·TOOL", "Span types"]] },
  { id: "performance", label: "Performance", img: "/assets/arize-performance.png",
    blurb: "Prediction score average over time against traffic volume — track quality trends release-over-release and catch regressions before users do.",
    stats: [["0.7279", "Avg score"], ["Jun 4–12", "Window"], ["Production", "Environment"]] },
  { id: "drift", label: "Drift", img: "/assets/arize-drift.png",
    blurb: "PSI-based prediction drift versus a model baseline — detect when behavior silently shifts after a model update, the most insidious failure mode in production AI.",
    stats: [["PSI", "Metric"], ["72h", "Eval window"], ["Baseline", "Compared to"]] },
  { id: "slices", label: "Worst Slices", img: "/assets/arize-worst-slices.png",
    blurb: "Automatically surfaced worst-performing slices — the exact feature values dragging quality down, ranked by impact, with per-feature histograms.",
    stats: [["-31.2%", "Top slice impact"], ["15", "Features ranked"], ["overall_pass=0", "Worst slice"]] },
];

export default function Observability({ go }) {
  const [active, setActive] = useState(TABS[0]);
  return (
    <>
      <section style={{ padding: "84px 0 40px" }}>
        <Container>
          <Eyebrow color={T.green}>Observability · powered by Arize AX</Eyebrow>
          <H2 style={{ maxWidth: 860 }}>See everything your agent does in production</H2>
          <Lead>
            Evaluation tells you if an agent is ready. Observability tells you what it's doing once it's live —
            tracing every span, mapping every decision, and catching drift before it becomes an incident.
            A dual-path model shares one trace ID: OTLP spans for debugging, prediction records for monitoring.
          </Lead>
        </Container>
      </section>

      <Section style={{ paddingTop: 12 }}>
        <div style={{ display: "flex", gap: 2, flexWrap: "wrap", borderBottom: `1px solid ${T.line}`, marginBottom: 28 }}>
          {TABS.map((t) => {
            const on = active.id === t.id;
            return (
              <button key={t.id} onClick={() => setActive(t)} style={{
                fontFamily: "Schibsted Grotesk", fontSize: 14.5, fontWeight: 600, cursor: "pointer",
                padding: "13px 18px", background: "none", border: "none",
                color: on ? T.ink : T.ink3, borderBottom: `2px solid ${on ? T.green : "transparent"}`, marginBottom: -1,
              }}>{t.label}</button>
            );
          })}
        </div>

        <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1.7fr 1fr", gap: 30, alignItems: "start" }}>
          <Frame src={active.img} alt={active.label} label={`Arize AX · ${active.label}`} />
          <div>
            <Pill color={T.green}>{active.label}</Pill>
            <p style={{ fontSize: 16, color: T.ink2, lineHeight: 1.65, margin: "18px 0 24px" }}>{active.blurb}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {active.stats.map(([v, l]) => (
                <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "13px 16px", background: T.paper, border: `1px solid ${T.line}`, borderRadius: 10 }}>
                  <span style={{ fontSize: 13.5, color: T.ink3 }}>{l}</span>
                  <span style={{ fontFamily: "IBM Plex Mono", fontWeight: 600, fontSize: 14, color: T.green }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section style={{ background: T.bgWarm, borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}` }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: 16, marginBottom: 30 }}>
          <div>
            <Eyebrow color={T.blue}>The full dashboard</Eyebrow>
            <H2 style={{ marginBottom: 0 }}>One model card, every dimension scored</H2>
          </div>
          <div style={{ display: "flex", gap: 30 }}>
            <div><div style={{ fontFamily: "Schibsted Grotesk", fontSize: 30, fontWeight: 800 }}>1,471</div><div style={{ fontSize: 12.5, color: T.ink3 }}>predictions</div></div>
            <div><div style={{ fontFamily: "Schibsted Grotesk", fontSize: 30, fontWeight: 800, color: T.green }}>0.728</div><div style={{ fontSize: 12.5, color: T.ink3 }}>avg score</div></div>
          </div>
        </div>
        <DashboardMock />
      </Section>

      <Section>
        <div style={{ textAlign: "center", maxWidth: 720, margin: "0 auto 48px" }}>
          <Eyebrow>Closing the loop</Eyebrow>
          <H2 style={{ margin: "0 auto" }}>Production telemetry becomes your next eval</H2>
          <Lead style={{ margin: "14px auto 0", textAlign: "center" }}>
            Worst-performing slices and drifting cases flow straight back into the evaluation suite — so every
            production failure becomes a permanent test case.
          </Lead>
        </div>
        <div className="grid-3" style={{ display: "grid", gap: 18 }}>
          {[
            ["Observe", "Trace live traffic in Arize across spans, sessions, agent paths, and cost."],
            ["Detect", "Drift monitors and worst-slice analysis surface where quality is slipping."],
            ["Re-evaluate", "Failing slices become new eval cases, gated before the next release ships."],
          ].map((s, i) => (
            <Card key={s[0]} hover>
              <div style={{ fontFamily: "IBM Plex Mono", fontWeight: 600, color: T.blue, fontSize: 13, marginBottom: 10 }}>0{i + 1}</div>
              <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 18, marginBottom: 9 }}>{s[0]}</div>
              <p style={{ fontSize: 14, color: T.ink2, lineHeight: 1.6 }}>{s[1]}</p>
            </Card>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: 40 }}>
          <Button onClick={() => go("cases")}>See it produce a verdict →</Button>
        </div>
      </Section>
    </>
  );
}
