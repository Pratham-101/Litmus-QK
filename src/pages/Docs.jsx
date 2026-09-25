import React, { useState } from "react";
import { T } from "../theme.js";
import { Container } from "../components/ui.jsx";

// Documentation, modeled on a developer-docs layout: left sidebar groups,
// center article, right table-of-contents. Content drawn from the
// AI Agent Evaluation & Governance Framework SOP.

const NAV = [
  { group: "Get started", items: [
    { id: "overview", label: "Overview" },
    { id: "why", label: "Why evaluation" },
    { id: "lifecycle", label: "The evaluation lifecycle" },
  ]},
  { group: "Evaluate", items: [
    { id: "catalog", label: "Evaluation catalog" },
    { id: "judge", label: "LLM-as-a-Judge" },
    { id: "scoring", label: "Scoring & tiers" },
  ]},
  { group: "Govern", items: [
    { id: "gates", label: "Deployment gates" },
    { id: "guardrails", label: "Guardrails" },
  ]},
  { group: "Methodology", items: [
    { id: "how-scores", label: "How Litmus scores" },
    { id: "fail-loud", label: "Fail-loud philosophy" },
    { id: "calibration", label: "Judge calibration" },
    { id: "closed-loop", label: "The closed loop" },
    { id: "reproducibility", label: "Reproducibility" },
  ]},
];

const DOC = {
  overview: {
    title: "Overview",
    toc: ["What this is", "Who it's for"],
    body: [
      ["h", "What this is"],
      ["p", "A complete reference for evaluating, deploying, and governing AI agents in production. It defines a reusable vocabulary, a catalog of evaluation types with methodology and ideal score ranges, and the operational standards for gating, monitoring, and incident response."],
      ["p", "Quality is not a property of the model. Quality is the output of a disciplined evaluation program — and this documents that program."],
      ["callout", "57% of organizations now run AI agents in production, yet 32% cite quality as the top barrier to deployment. The gap between deploying an agent and deploying one that is safe, reliable, and compliant is the gap that decides whether AI investments succeed."],
      ["h", "Who it's for"],
      ["p", "AI engineering, product, and quality teams shipping conversational agents — customer support, sales, internal operations, or autonomous workflows. The framework is generic and reusable: adopt it as the baseline, then customise to your risk profile."],
    ],
  },
  why: {
    title: "Why evaluation",
    toc: ["Agents aren't deterministic", "Three new problems"],
    body: [
      ["h", "Agents aren't deterministic"],
      ["p", "Traditional software testing assumes identical inputs produce identical outputs. AI agents assume the opposite — the same input can produce different outputs on different runs, even with identical configuration. This single difference rewrites every assumption about how QA works."],
      ["h", "Three new problems"],
      ["list", [
        "Test stability — a case that passes nine times may fail on the tenth. Reliable evaluation measures pass rate over repeated runs, not a single pass/fail.",
        "Failure-mode discovery — the failure surface is unbounded. Any unseen input is a potential failure, so evaluation suites must continuously expand.",
        "Behavioral drift — the agent's behavior changes silently when the underlying model is updated. The most insidious failure mode, because nothing in your code changed.",
      ]],
    ],
  },
  lifecycle: {
    title: "The evaluation lifecycle",
    toc: ["Four phases", "Twelve stages"],
    body: [
      ["h", "Four phases"],
      ["p", "Evaluation is a structured sequence of stages across four phases. Skipping a phase creates a documented risk of downstream failure. The lifecycle aligns with NIST's MAP–MEASURE–MANAGE structure and quality-management requirements."],
      ["steps", [
        ["Definition", "Capture requirements, define correct behavior per category, classify risk. The most under-invested and most consequential phase."],
        ["Construction", "Build datasets — golden answers, edge cases, adversarial probes — and wire up evaluators."],
        ["Measurement", "Run the suite, score every dimension, aggregate into a composite, and check gates."],
        ["Management", "Gate the deployment, monitor in production, and feed failures back into the suite."],
      ]],
    ],
  },
  catalog: {
    title: "Evaluation catalog",
    toc: ["Severity classes", "Core dimensions"],
    body: [
      ["h", "Severity classes"],
      ["p", "Every evaluation type is classified by how it affects the deployment decision:"],
      ["list", [
        "CRITICAL GATE — must pass at or near 100%. Failure blocks deployment regardless of all other scores; cannot be overridden by averaging.",
        "HIGH PRIORITY — must meet a minimum threshold. Below-threshold requires remediation before deployment.",
        "STANDARD — weighted into the composite. Below-target triggers a warning but doesn't block alone.",
        "OPERATIONAL — infrastructure concerns like latency. Tracked, rarely blocking unless severe.",
      ]],
      ["h", "Core dimensions"],
      ["table", [
        ["Dimension", "Class", "What it measures"],
        ["Correctness", "High priority", "Factual accuracy and completeness against the source of truth."],
        ["Hallucination", "Critical gate", "Rate of confident claims unsupported by knowledge or context."],
        ["Policy compliance", "Critical gate", "Adherence to mandatory rules and prohibited actions."],
        ["Escalation accuracy", "Critical gate", "Correct detection and routing of high-risk triggers."],
        ["Groundedness", "High priority", "Whether claims are traceable to verified sources."],
        ["Tone & CX quality", "Standard", "Empathy, brand alignment, and resolution quality."],
        ["Latency", "Operational", "Time-to-first-token and end-to-end response time."],
      ]],
    ],
  },
  judge: {
    title: "LLM-as-a-Judge",
    toc: ["What it is", "Why it's the standard", "Claim decomposition"],
    body: [
      ["h", "What it is"],
      ["p", "LLM-as-a-Judge uses a capable model to evaluate another model's output against a structured rubric. The judge receives the input, the output, any context, and a scoring rubric, and returns a structured score with an explanation."],
      ["callout", "Well-designed LLM-as-a-Judge frameworks achieve over 90% alignment with human judgments across pointwise, pairwise, and pass/fail evaluation — the empirical basis for the method's adoption."],
      ["h", "Why it's the standard"],
      ["p", "It scales infinitely — a single judge evaluates thousands of interactions per day for a few dollars per thousand evaluations — while staying consistent and explainable in a way human panels can't match at volume."],
      ["h", "Claim decomposition"],
      ["p", "For correctness and hallucination, a first pass decomposes the response into discrete factual claims; a second pass verifies each claim against the source of truth and scores it individually. A 0.7 means 70% of claims were verified — interpretable, not a fuzzy impression. Any response inventing a specific detail not in the source receives accuracy ≤ 0.2 regardless of how plausible it looks."],
    ],
  },
  scoring: {
    title: "Scoring & tiers",
    toc: ["How scores are produced", "Deployment tiers"],
    body: [
      ["h", "How scores are produced"],
      ["p", "The same numerical value means different things depending on the evaluator that produced it:"],
      ["list", [
        "Deterministic scores — produced by code. Binary or formula-based (e.g. brevity = 1.0 if within the word limit; tool accuracy = correct calls / expected calls). Perfectly reliable and reproducible.",
        "LLM-judge scores — continuous 0.0–1.0 from a rubric, with an explanation. Used where correctness can't be reduced to a formula.",
      ]],
      ["h", "Deployment tiers"],
      ["table", [
        ["Tier", "Threshold", "Meaning"],
        ["Not ready", "< 0.70 or any gate failed", "Blocked from deployment."],
        ["Alpha", "≥ 0.70 · all gates pass", "Candidate — internal only."],
        ["Beta", "≥ 0.80 · all gates pass", "Pilot — limited production."],
        ["GA", "≥ 0.85 · all gates pass", "Production-ready."],
      ]],
    ],
  },
  gates: {
    title: "Deployment gates",
    toc: ["What a gate is", "Why averaging fails"],
    body: [
      ["h", "What a gate is"],
      ["p", "A gate is a critical evaluation that must pass at or near 100%. Gates are checked independently of the composite score — a failed gate blocks deployment no matter how high the average."],
      ["h", "Why averaging fails"],
      ["callout", "An agent can score a composite above the Beta threshold and still be unsafe to deploy. A single failed safety gate outweighs a strong average — because one mishandled emergency or one bypassed hard-stop is an incident, not a rounding error."],
      ["p", "Typical blocking gates: safety escalation, prompt-injection resistance, banned-phrase violation rate, and hallucination rate. All must pass before any tier above Not Ready is awarded."],
    ],
  },
  guardrails: {
    title: "Guardrails",
    toc: ["Alignment vs guardrails", "The principle"],
    body: [
      ["h", "Alignment vs guardrails"],
      ["p", "Alignment shapes the model's default behavior during training; guardrails enforce specific rules at inference time. A well-aligned model still needs guardrails because alignment doesn't know your data-residency rules, your access tiers, or which records an agent should never retrieve."],
      ["h", "The principle"],
      ["callout", "Guardrails define boundaries so AI can operate with freedom inside them, not recklessly outside them."],
      ["p", "They are both technical and procedural — constraining, guiding, and validating how the agent operates so responses stay accurate, safe, and aligned with business and compliance standards."],
    ],
  },

  "how-scores": {
    title: "How Litmus scores",
    toc: ["The 15 dimensions", "How each is scored", "Deployment verdict"],
    body: [
      ["p", "Litmus evaluates an agent against a structured suite, scores each response across 15 dimensions, applies blocking gates, and returns a deployment verdict — plus concrete, human-approved fixes. It works on any agent, on any platform."],
      ["callout", "A reliability tool you can't audit isn't reliability. This section documents exactly how a verdict is produced."],
      ["h", "The 15 dimensions"],
      ["p", "Dimensions are grouped into three regions, each answering one question. Only the dimensions that matter for the agent type are scored — a coding agent isn't judged on CX quality; a RAG bot isn't penalised for correctly saying \"I don't know.\""],
      ["table", [
        ["Region", "Question", "Covers"],
        ["CLAMP", "Is it safe to deploy?", "Safety, escalation, banned-phrase clean, hallucination, refusal quality"],
        ["PEST", "Does it work correctly?", "Intent, policy, correctness, consistency, context retention, follow-up handling"],
        ["GHTPWR", "Can it operate at scale?", "Groundedness, tone & brand, support quality, brevity, language"],
      ]],
      ["h", "How each is scored"],
      ["list", [
        "Deterministic checks (brevity, banned phrases) are computed in code — perfectly reproducible.",
        "LLM-as-judge dimensions return a 0–1 score with an explanation against a rubric.",
        "Multi-turn cases are played turn-by-turn in one session and judged on context retention and consistency.",
      ]],
      ["p", "The per-case composite weighting is agent-type-aware: brevity is weighted for support and sales agents, while for coding, RAG, and workflow agents that weight moves to groundedness and hallucination — where those agents actually live. Weights are normalised over the signals that apply, so a disabled check never inflates a score."],
      ["h", "Deployment verdict"],
      ["table", [
        ["Composite", "Verdict"],
        ["≥ 0.90 · all gates pass", "GA (Production)"],
        ["≥ 0.80 · all gates pass", "Beta (Pilot)"],
        ["< 0.80 · all gates pass", "Alpha (Candidate)"],
        ["any gate fails", "Blocked (Not Ready)"],
      ]],
    ],
  },
  "fail-loud": {
    title: "Fail-loud philosophy",
    toc: ["The rule", "What it means"],
    body: [
      ["h", "The rule"],
      ["callout", "If we didn't measure it, we say so. We never fabricate a score."],
      ["h", "What it means"],
      ["list", [
        "A dimension the judge didn't return is recorded as \"not measured\" and excluded from averages — never given a flattering default like 0.8.",
        "A blocking gate we couldn't measure FAILS — it never silently passes. An unmeasured safety gate blocks deployment, loudly.",
        "If the judge's quota or rate limit is hit mid-run, the run is marked INCOMPLETE and the partial verdict says so — never presented as finished.",
      ]],
    ],
  },
  calibration: {
    title: "Judge calibration",
    toc: ["Why trust the judge", "What we report"],
    body: [
      ["h", "Why trust the judge"],
      ["p", "We hold a gold set of expert-style cases tagged across support, RAG, coding, sales, and workflow agents, balanced between grounded and hallucinated responses. We run the judge over it and report how often it agrees with the human verdict."],
      ["h", "What we report"],
      ["p", "Agreement overall and per agent type, a confusion matrix, and hallucination recall — of real hallucinations, how many the judge caught."],
      ["callout", "We surface this honestly, including where the judge is weak. A small free demo model is materially worse than a frontier judge — which is why production scoring uses a frontier model (GPT-4o / Claude)."],
    ],
  },
  "closed-loop": {
    title: "The closed loop",
    toc: ["Suggest → approve → verify", "Human-in-the-loop"],
    body: [
      ["h", "Suggest → approve → verify"],
      ["steps", [
        ["Suggest", "Failures become concrete edits — a prompt clause, a missing skill, a workflow gap — grounded in your agent's real config when you provide it."],
        ["Approve", "You tick the changes you want; a before/after diff is shown. Nothing is applied automatically."],
        ["Export", "An importable, copy-paste change-set (or a payload for platforms with a config API) you apply in your own console."],
        ["Re-evaluate", "Re-run on the identical cases and show the before/after delta (e.g. 62% → 89%). The report states \"re-evaluated on the same N cases.\""],
      ]],
      ["h", "Human-in-the-loop"],
      ["callout", "Litmus never mutates a production agent without a human approving the exact change. The approval gate is the product, not friction to remove."],
    ],
  },
  reproducibility: {
    title: "Reproducibility",
    toc: ["Every verdict is auditable", "What we won't do"],
    body: [
      ["h", "Every verdict is auditable"],
      ["p", "Each report pins how it was produced — judge provider and model, agent type, dataset, thresholds, temperature — so re-running with the same inputs reproduces the verdict, and you can defend a result months later."],
      ["h", "What we won't do"],
      ["list", [
        "Auto-apply changes to a live agent.",
        "Reverse-engineer a platform's internal APIs to write to production config.",
        "Fabricate scores for things we couldn't measure.",
        "Present a partial or interrupted run as a complete verdict.",
      ]],
    ],
  },
};

export default function Docs() {
  const [active, setActive] = useState("overview");
  const doc = DOC[active];
  return (
    <Container style={{ paddingTop: 28, paddingBottom: 72 }}>
      <div style={{ display: "grid", gridTemplateColumns: "232px 1fr 188px", gap: 40, alignItems: "start" }} className="docs-grid">
        {/* sidebar */}
        <aside style={{ position: "sticky", top: 96, alignSelf: "start" }} className="docs-side">
          <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 800, fontSize: 18, marginBottom: 20 }}>Documentation</div>
          {NAV.map((g) => (
            <div key={g.group} style={{ marginBottom: 22 }}>
              <div style={{ fontFamily: "IBM Plex Mono", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: T.ink3, marginBottom: 10 }}>{g.group}</div>
              {g.items.map((it) => {
                const on = active === it.id;
                return (
                  <button key={it.id} onClick={() => { setActive(it.id); window.scrollTo({ top: 0 }); }} style={{
                    display: "block", width: "100%", textAlign: "left", background: on ? T.paper : "none",
                    border: on ? `1px solid ${T.line}` : "1px solid transparent", borderRadius: 8,
                    padding: "7px 11px", marginBottom: 3, cursor: "pointer",
                    fontFamily: "Inter", fontSize: 14, fontWeight: on ? 600 : 450,
                    color: on ? T.ink : T.ink2,
                  }}>{it.label}</button>
                );
              })}
            </div>
          ))}
        </aside>

        {/* article */}
        <article style={{ minWidth: 0, maxWidth: 720 }}>
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.ink3, marginBottom: 12 }}>Docs</div>
          <h1 style={{ fontFamily: "Schibsted Grotesk", fontSize: 38, fontWeight: 800, letterSpacing: -1, marginBottom: 22 }}>{doc.title}</h1>
          {doc.body.map((b, i) => <Block key={i} b={b} />)}
        </article>

        {/* toc */}
        <aside style={{ position: "sticky", top: 96, alignSelf: "start" }} className="docs-toc">
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: T.ink3, marginBottom: 12 }}>On this page</div>
          {doc.toc.map((t) => (
            <div key={t} style={{ fontSize: 13, color: T.ink2, marginBottom: 9, lineHeight: 1.4 }}>{t}</div>
          ))}
        </aside>
      </div>
      <style>{`@media (max-width: 940px){ .docs-grid{ grid-template-columns: 1fr !important; } .docs-toc{ display:none !important; } .docs-side{ position: static !important; } }`}</style>
    </Container>
  );
}

function Block({ b }) {
  const [kind, val] = b;
  if (kind === "h") return <h2 style={{ fontFamily: "Schibsted Grotesk", fontSize: 22, fontWeight: 700, letterSpacing: -0.4, margin: "34px 0 12px" }}>{val}</h2>;
  if (kind === "p") return <p style={{ fontSize: 16, color: T.ink2, lineHeight: 1.7, marginBottom: 14 }}>{val}</p>;
  if (kind === "code") return <CodeBlock lang={b[1]} code={b[2]} />;
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

function CodeBlock({ lang, code }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(code).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1400); });
  };
  return (
    <div style={{ margin: "16px 0 20px", borderRadius: 12, overflow: "hidden", border: "1px solid #2a2620", background: "#16130f" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 14px", borderBottom: "1px solid #2a2620", background: "#1c1813" }}>
        <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: "#8a7d6b", letterSpacing: 0.5 }}>{lang}</span>
        <button onClick={copy} style={{ background: "none", border: "none", cursor: "pointer", fontFamily: "IBM Plex Mono", fontSize: 11, color: copied ? "#8fc0a3" : "#8a7d6b" }}>
          {copied ? "✓ copied" : "copy"}
        </button>
      </div>
      <pre style={{ margin: 0, padding: "16px 18px", overflowX: "auto", fontFamily: "IBM Plex Mono", fontSize: 12.5, lineHeight: 1.7, color: "#e8dcc8" }}>
        <code>{highlight(code)}</code>
      </pre>
    </div>
  );
}

// lightweight token coloring — keywords, strings, comments, numbers.
function highlight(code) {
  const KW = /\b(async|await|def|return|from|import|with|for|in|if|else|class|curl|pip|source|uvicorn|python3|true|false)\b/;
  const out = [];
  code.split("\n").forEach((line, li) => {
    const parts = [];
    let rest = line, key = 0;
    // full-line comment
    if (/^\s*#/.test(line) && !line.includes("://")) {
      parts.push(<span key={key++} style={{ color: "#6f6555", fontStyle: "italic" }}>{line}</span>);
    } else {
      const re = /("[^"]*"|'[^']*'|\/\/[^\n]*|\b\d+\.?\d*\b)/g;
      let m, last = 0;
      while ((m = re.exec(rest)) !== null) {
        const before = rest.slice(last, m.index);
        if (before) parts.push(<KwSpan key={key++} text={before} kw={KW} />);
        const tok = m[0];
        const col = tok.startsWith('"') || tok.startsWith("'") ? "#a3c98a" : tok.startsWith("//") ? "#6f6555" : "#d8a657";
        parts.push(<span key={key++} style={{ color: col }}>{tok}</span>);
        last = m.index + tok.length;
      }
      const tail = rest.slice(last);
      if (tail) parts.push(<KwSpan key={key++} text={tail} kw={KW} />);
    }
    out.push(<div key={li}>{parts.length ? parts : " "}</div>);
  });
  return out;
}
function KwSpan({ text, kw }) {
  const segs = text.split(/(\s+)/).map((w, i) =>
    kw.test(w) ? <span key={i} style={{ color: "#e78a8a" }}>{w}</span> : <span key={i}>{w}</span>
  );
  return <>{segs}</>;
}
