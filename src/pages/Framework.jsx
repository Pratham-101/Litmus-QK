import React from "react";
import { T, BRANCH } from "../theme.js";
import { Container, Section, Eyebrow, H2, Lead, Card, Pill, Button } from "../components/ui.jsx";
import FrameworkExplorer from "../components/FrameworkExplorer.jsx";

export default function Framework({ go }) {

  return (
    <>
      <section style={{ padding: "84px 0 40px" }}>
        <Container>
          <Eyebrow color={T.red}>Evaluation framework</Eyebrow>
          <H2 style={{ maxWidth: 820 }}>CLAMP · PEST · GHTPWR</H2>
          <Lead>
            A complete, reusable evaluation vocabulary for AI agents — grounded in current industry research and
            production experience. Fifteen dimensions across three branches that answer the three questions that
            decide whether an agent ships.
          </Lead>
        </Container>
      </section>

      <Section style={{ paddingTop: 16 }}>
        <div className="grid-3" style={{ display: "grid", gap: 20, marginBottom: 60 }}>
          {Object.values(BRANCH).map((b) => (
            <Card key={b.label} style={{ borderTop: `3px solid ${b.color}` }}>
              <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 30, fontWeight: 800, color: b.color, letterSpacing: -1 }}>{b.label}</div>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: T.ink, margin: "10px 0 6px" }}>{b.full}</div>
              <div style={{ fontSize: 14, color: T.ink3 }}>{b.q}</div>
            </Card>
          ))}
        </div>

        <div style={{ marginBottom: 8 }}>
          <Eyebrow color={T.brand}>Interactive · click any dimension</Eyebrow>
          <h3 style={{ fontFamily: "Schibsted Grotesk", fontSize: 24, fontWeight: 700, letterSpacing: -0.5, marginBottom: 20 }}>
            Explore all 15 dimensions
          </h3>
        </div>
        <FrameworkExplorer />
      </Section>

      <Section style={{ background: T.bgWarm, borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}` }}>
        <Eyebrow color={T.blue}>How scoring works</Eyebrow>
        <H2>LLM-as-a-Judge, gated for deployment</H2>
        <Lead>Each case is scored 0–1 per dimension. Deterministic checks run instantly; LLM judges run concurrently. A weighted composite plus hard gates produce the deployment verdict.</Lead>
        <div className="grid-3" style={{ display: "grid", gap: 18, marginTop: 40 }}>
          {[
            ["Generate", "200+ domain test cases — core, edge, adversarial, and probe utterances — auto-built from a plain-English requirement."],
            ["Judge", "Provider-agnostic LLM-as-judge scores intent, policy, hallucination, quality, and language per case."],
            ["Gate", "Blocking gates on safety, escalation, hallucination & compliance map to an Alpha → Beta → GA verdict."],
          ].map((s, i) => (
            <Card key={s[0]}>
              <div style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.ink3, marginBottom: 10 }}>STEP {i + 1}</div>
              <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 19, fontWeight: 700, marginBottom: 9 }}>{s[0]}</div>
              <p style={{ fontSize: 14, color: T.ink2, lineHeight: 1.6 }}>{s[1]}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section style={{ textAlign: "center" }}>
        <H2 style={{ margin: "0 auto", maxWidth: 620 }}>See the framework score a real agent</H2>
        <Lead style={{ margin: "14px auto 0", textAlign: "center" }}>Two production agents, fifteen dimensions, six gates — and two correctly-blocked verdicts.</Lead>
        <div className="hero-cta" style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 30 }}>
          <Button onClick={() => go("cases")}>Read the case studies →</Button>
        </div>
      </Section>
    </>
  );
}
