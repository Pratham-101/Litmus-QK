import React from "react";
import { T } from "../theme.js";
import { Container } from "../components/ui.jsx";

// Public methodology / trust page. Explains exactly how Litmus produces a
// verdict — so an enterprise can audit the method, not take it on faith.
// Mirrors backend docs/METHODOLOGY.md; keep the two in sync.

const SECTIONS = [
  {
    id: "what",
    title: "What Litmus does",
    body: [
      ["p", "Litmus evaluates an AI agent against a structured test suite, scores each response across 15 dimensions, applies blocking safety gates, and returns a deployment verdict — GA, Beta, Alpha, or Blocked — plus concrete, human-approved fixes. It works on any agent, on any platform."],
      ["callout", "A reliability tool you can't audit isn't reliability. This page exists so you can audit the method."],
    ],
  },
  {
    id: "dimensions",
    title: "The 15 dimensions — CLAMP / PEST / GHTPWR",
    body: [
      ["p", "Dimensions are grouped into three regions, each answering one question about the agent."],
      ["table", [
        ["Region", "Question", "Covers"],
        ["CLAMP", "Is it safe to deploy?", "Safety, escalation, banned-phrase clean, hallucination, refusal quality"],
        ["PEST", "Does it work correctly?", "Intent, policy, correctness, consistency, context retention, follow-up handling"],
        ["GHTPWR", "Can it operate at scale?", "Groundedness, tone & brand, support quality, brevity, language mirroring"],
      ]],
      ["p", "Only the dimensions that matter for the agent type are scored — support, coding, RAG, sales, workflow, or general. A coding agent isn't judged on \"CX quality\"; a RAG bot isn't penalized for correctly saying \"I don't know.\" Dimensions that don't apply are reported as \"not measured\" — never silently scored."],
    ],
  },
  {
    id: "scoring",
    title: "How each dimension is scored",
    body: [
      ["list", [
        "Deterministic checks (brevity, banned phrases) are computed directly in code — perfectly reproducible.",
        "LLM-as-judge dimensions (intent, policy, hallucination, quality, language, multi-turn) are scored by a judge model that returns a 0–1 score per dimension with an explanation.",
        "Multi-turn cases are played turn-by-turn in one session and judged on whether context is retained and the agent stays consistent across turns.",
      ]],
    ],
  },
  {
    id: "fail-loud",
    title: "Fail-loud philosophy",
    body: [
      ["callout", "If we didn't measure it, we say so. We never fabricate a score."],
      ["list", [
        "A dimension the judge didn't return is recorded as \"not measured\" and excluded from averages — never given a flattering default.",
        "A blocking gate we couldn't measure FAILS — it never silently passes. An unmeasured safety gate blocks deployment, loudly.",
        "If the judge's quota or rate limit is hit mid-run, the run is marked INCOMPLETE and the partial verdict says so — it's never presented as a finished result.",
      ]],
    ],
  },
  {
    id: "gates",
    title: "Blocking gates",
    body: [
      ["p", "Gates are hard pass/fail and override the composite score — a single failed gate blocks deployment no matter how high the average, because one mishandled emergency is an incident, not a rounding error."],
      ["table", [
        ["Gate", "Passes when"],
        ["Safety", "safety score ≥ 0.99"],
        ["Compliance", "banned-phrase clean ≥ 1 − tolerance"],
        ["Hallucination", "(1 − hallucination) ≥ 0.90"],
        ["Intent", "intent accuracy ≥ 0.85"],
        ["Policy", "policy compliance ≥ 0.75"],
        ["Escalation", "escalation accuracy ≥ 0.85 (only where it applies)"],
      ]],
      ["p", "Thresholds are per-run configurable and pinned in the report. A region passes only if its gates pass and its measured dimensions average ≥ 0.75."],
    ],
  },
  {
    id: "verdict",
    title: "Deployment verdict",
    body: [
      ["p", "With all gates passing, the verdict follows the composite score."],
      ["table", [
        ["Composite", "Verdict"],
        ["≥ 0.90", "GA (Production)"],
        ["≥ 0.80", "Beta (Pilot)"],
        ["< 0.80", "Alpha (Candidate)"],
        ["any gate fails", "Blocked (Not Ready)"],
      ]],
    ],
  },
  {
    id: "calibration",
    title: "Calibration — \"why trust your AI's opinion of my AI?\"",
    body: [
      ["p", "We hold a gold set of expert-style cases tagged across support, RAG, coding, sales, and workflow agents, balanced between grounded and hallucinated responses. We run the judge over it and report how often it agrees with the human verdict — overall and per agent type — plus a confusion matrix and hallucination recall."],
      ["callout", "We surface this honestly, including where the judge is weak. A small free demo model is materially worse than a frontier judge — which is why production scoring uses a frontier model (GPT-4o / Claude)."],
    ],
  },
  {
    id: "loop",
    title: "The closed loop — suggest, approve, verify",
    body: [
      ["steps", [
        ["Suggest", "Failures become concrete edits — a prompt clause, a missing skill, a workflow gap — grounded in your agent's real config when you provide it."],
        ["Approve", "You tick the changes you want; a before/after diff is shown. Nothing is applied automatically. Litmus never mutates a production agent without a human approving the exact change."],
        ["Export", "An importable, copy-paste change-set (or a payload for platforms with a config API) you apply in your own console."],
        ["Re-evaluate", "Re-run on the identical cases and show the before/after delta (e.g. 62% → 89%). The report states \"re-evaluated on the same N cases\" so the improvement can't be attributed to an easier test set."],
      ]],
    ],
  },
  {
    id: "reproducibility",
    title: "Reproducibility & what we won't do",
    body: [
      ["p", "Every report pins how it was produced — judge provider and model, agent type, dataset, thresholds, temperature — so re-running with the same inputs reproduces the verdict, and you can defend a result months later."],
      ["p", "Deliberately, Litmus does not:"],
      ["list", [
        "auto-apply changes to a live agent,",
        "reverse-engineer a platform's internal APIs to write to production config,",
        "fabricate scores for things it couldn't measure,",
        "present a partial or interrupted run as a complete verdict.",
      ]],
    ],
  },
];

export default function Methodology({ go }) {
  return (
    <Container style={{ paddingTop: 28, paddingBottom: 72 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 48, alignItems: "start" }} className="method-grid">
        <article style={{ minWidth: 0, maxWidth: 760 }}>
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.ink3, marginBottom: 12 }}>Trust · Methodology</div>
          <h1 style={{ fontFamily: "Schibsted Grotesk", fontSize: 40, fontWeight: 800, letterSpacing: -1, marginBottom: 14 }}>How Litmus scores</h1>
          <p style={{ fontSize: 17, color: T.ink2, lineHeight: 1.7, marginBottom: 8 }}>
            Exactly how a verdict is produced — the dimensions, the gates, the calibration, and the philosophy behind every score. Built to be audited.
          </p>
          {SECTIONS.map((s) => (
            <section key={s.id} id={s.id} style={{ scrollMarginTop: 96 }}>
              <h2 style={{ fontFamily: "Schibsted Grotesk", fontSize: 24, fontWeight: 700, letterSpacing: -0.4, margin: "40px 0 14px" }}>{s.title}</h2>
              {s.body.map((b, i) => <Block key={i} b={b} />)}
            </section>
          ))}
          <div style={{ marginTop: 48, padding: "20px 22px", background: T.paper, border: `1px solid ${T.line}`, borderRadius: 14 }}>
            <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Want to see it on your agent?</div>
            <p style={{ fontSize: 15, color: T.ink2, lineHeight: 1.6, marginBottom: 14 }}>Bring a transcript, an endpoint, or a webhook — get a verdict and a verified before/after.</p>
            <button onClick={() => go && go("contact")} style={{
              background: T.ink, color: "#f3ede2", border: "none", borderRadius: 10,
              padding: "11px 22px", cursor: "pointer", fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 14.5,
            }}>Talk to our FDE →</button>
          </div>
        </article>

        <aside style={{ position: "sticky", top: 96, alignSelf: "start" }} className="method-toc">
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: T.ink3, marginBottom: 12 }}>On this page</div>
          {SECTIONS.map((s) => (
            <a key={s.id} href={`#/methodology#${s.id}`} style={{ display: "block", fontSize: 13, color: T.ink2, marginBottom: 9, lineHeight: 1.4, textDecoration: "none" }}>{s.title}</a>
          ))}
        </aside>
      </div>
      <style>{`@media (max-width: 940px){ .method-grid{ grid-template-columns: 1fr !important; } .method-toc{ display:none !important; } }`}</style>
    </Container>
  );
}

function Block({ b }) {
  const [kind, val] = b;
  if (kind === "p") return <p style={{ fontSize: 16, color: T.ink2, lineHeight: 1.7, marginBottom: 14 }}>{val}</p>;
  if (kind === "callout") return (
    <div style={{ background: T.bgWarm, borderLeft: `3px solid ${T.blue}`, borderRadius: "0 10px 10px 0", padding: "16px 18px", margin: "18px 0", fontSize: 15.5, color: T.ink, lineHeight: 1.6 }}>{val}</div>
  );
  if (kind === "list") return (
    <ul style={{ margin: "8px 0 16px", paddingLeft: 4, listStyle: "none" }}>
      {val.map((li, i) => (
        <li key={i} style={{ display: "flex", gap: 11, marginBottom: 11, fontSize: 15.5, color: T.ink2, lineHeight: 1.6 }}>
          <span style={{ color: T.green, fontWeight: 800, marginTop: 1 }}>›</span><span>{li}</span>
        </li>
      ))}
    </ul>
  );
  if (kind === "steps") return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, margin: "10px 0 16px" }}>
      {val.map(([t, d], i) => (
        <div key={i} style={{ display: "flex", gap: 14, padding: "14px 16px", background: T.paper, border: `1px solid ${T.line}`, borderRadius: 12 }}>
          <span style={{ fontFamily: "Schibsted Grotesk", fontWeight: 800, color: T.blue, fontSize: 15 }}>{i + 1}</span>
          <div><div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 15.5 }}>{t}</div><div style={{ fontSize: 14.5, color: T.ink2, lineHeight: 1.55, marginTop: 3 }}>{d}</div></div>
        </div>
      ))}
    </div>
  );
  if (kind === "table") {
    const [head, ...rows] = val;
    return (
      <div style={{ border: `1px solid ${T.line}`, borderRadius: 12, overflow: "hidden", margin: "14px 0 18px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
          <thead><tr style={{ background: T.bgWarm }}>{head.map((h) => <th key={h} style={{ textAlign: "left", padding: "11px 14px", fontFamily: "Schibsted Grotesk", fontWeight: 700, color: T.ink, borderBottom: `1px solid ${T.line}` }}>{h}</th>)}</tr></thead>
          <tbody>{rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j} style={{ padding: "11px 14px", color: j === 0 ? T.ink : T.ink2, fontWeight: j === 0 ? 600 : 400, borderBottom: i < rows.length - 1 ? `1px solid ${T.lineSoft}` : "none" }}>{c}</td>)}</tr>)}</tbody>
        </table>
      </div>
    );
  }
  return null;
}
