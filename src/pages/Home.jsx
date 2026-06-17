import React from "react";
import { T, BRANCH } from "../theme.js";
import { Container, Section, Eyebrow, H2, Lead, Button, Card, Pill, Frame, DotGrid } from "../components/ui.jsx";
import ArchDiagram from "../components/ArchDiagram.jsx";
import LiveEval from "../components/LiveEval.jsx";
import RaceBars from "../components/RaceBars.jsx";
import VideoShowcase from "../components/VideoShowcase.jsx";
import CursorField from "../components/CursorField.jsx";
import { Reveal, useCountUp, useMagnetic } from "../components/motion.jsx";

export default function Home({ go }) {
  return (
    <>
      <Hero go={go} />
      <WhatStrip />
      <Counters />
      <VideoShowcase />
      <Why />
      <RaceBars />
      <How go={go} />
      <ArchSection go={go} />
      <Platform />
      <Engine go={go} />
      <FinalCTA go={go} />
    </>
  );
}

/* animated counter band */
function Counters() {
  const items = [
    { to: 15, dec: 0, suffix: "", label: "evaluation dimensions" },
    { to: 14, dec: 0, suffix: "", label: "evaluators per response" },
    { to: 200, dec: 0, suffix: "+", label: "test cases auto-generated" },
    { to: 90, dec: 0, suffix: "%", label: "judge–human agreement" },
  ];
  return (
    <Section style={{ padding: "72px 0" }}>
      <div className="grid-4" style={{ display: "grid", gap: 24 }}>
        {items.map((it, i) => <Counter key={it.label} {...it} delay={i * 80} />)}
      </div>
    </Section>
  );
}
function Counter({ to, dec, suffix, label, delay }) {
  const [ref, val] = useCountUp(to, { decimals: dec });
  return (
    <Reveal delay={delay}>
      <div ref={ref} style={{ textAlign: "center" }}>
        <div style={{ fontFamily: "Schibsted Grotesk", fontSize: "clamp(40px,5vw,60px)", fontWeight: 800, letterSpacing: -2, lineHeight: 1, color: T.ink }}>
          {val}{suffix}
        </div>
        <div style={{ fontSize: 14, color: T.ink3, marginTop: 10 }}>{label}</div>
      </div>
    </Reveal>
  );
}

/* 1 — HERO */
function Hero({ go }) {
  const magnet = useMagnetic(4);
  return (
    <section style={{ position: "relative", overflow: "hidden", paddingTop: 84, paddingBottom: 72 }}>
      <CursorField color="41,40,98" accent="252,166,27" />
      <div aria-hidden style={{ position: "absolute", top: -120, left: "50%", transform: "translateX(-50%)", width: 900, height: 420, background: `radial-gradient(ellipse at center, ${T.brand}12, transparent 70%)`, pointerEvents: "none" }} />
      <Container style={{ position: "relative", textAlign: "center" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
            <Pill color={T.green}>● The evaluation platform for production AI agents</Pill>
          </div>
        </Reveal>
        <Reveal delay={70}>
          <h1 style={{
            fontFamily: "Schibsted Grotesk", fontSize: "clamp(44px, 6.6vw, 80px)", fontWeight: 800,
            lineHeight: 1.0, letterSpacing: -2.4, color: T.ink, maxWidth: 980, margin: "0 auto",
          }}>
            Ship AI agents the<br />enterprise can trust
          </h1>
        </Reveal>
        <Reveal delay={140}>
          <Lead style={{ margin: "28px auto 0", fontSize: 20.5, textAlign: "center" }}>
            An AI agent has no native unit test. Our platform evaluates every response against a 15-dimension
            framework, gates every release, and turns production behavior into evidence you can defend.
          </Lead>
        </Reveal>
        <Reveal delay={210}>
          <div className="hero-cta" style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 38 }}>
            <Button onClick={() => go("contact")}>Sign up →</Button>
            <Button onClick={() => go("contact")} variant="secondary">Talk to an engineer</Button>
          </div>
        </Reveal>
        <Reveal delay={280}>
          <div ref={magnet} style={{ marginTop: 64, maxWidth: 1040, margin: "64px auto 0", transition: "transform .2s ease-out" }}>
            <LiveEval />
          </div>
          <div style={{ marginTop: 16, fontFamily: "IBM Plex Mono", fontSize: 11.5, color: T.ink3 }}>
            ↑ a live evaluation, running right now
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

/* 2 — SOCIAL PROOF / PARTNERS */
function WhatStrip() {
  return (
    <div style={{ borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}`, background: T.bgWarm, padding: "38px 0" }}>
      <Container>
        <div style={{ textAlign: "center", fontFamily: "IBM Plex Mono", fontSize: 12, letterSpacing: 1, color: T.ink3, marginBottom: 36, textTransform: "uppercase" }}>
          Engineered by <b style={{ color: T.ink }}>QualityKiosk Technologies</b> · built on DevRev × Arize
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap", alignItems: "stretch" }}>
          {[
            { src: "/assets/qk-logo.jpeg", alt: "QualityKiosk Technologies", h: 120 },
            { src: "/assets/devrev-logo.jpeg", alt: "DevRev", h: 92 },
            { src: "/assets/arize-logo.png", alt: "Arize AX", h: 92 },
          ].map((l) => (
            <div key={l.alt} style={{
              flex: "1 1 280px", maxWidth: 360, minHeight: 160, background: T.paper,
              border: `1px solid ${T.line}`, borderRadius: 16, display: "flex",
              alignItems: "center", justifyContent: "center", padding: "16px 24px",
            }}>
              <img src={l.src} alt={l.alt} style={{ height: l.h, maxWidth: "92%", objectFit: "contain", mixBlendMode: "multiply" }} />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}

/* 3 — WHY EVALUATION MATTERS */
function Why() {
  const cards = [
    ["Agents aren't deterministic", "The same input can produce different outputs run to run. A single pass is one data point, not proof — reliable evaluation measures pass rate over many runs."],
    ["The failure surface is unbounded", "Unlike traditional software, any unseen input is a potential failure. Evaluation suites must continuously expand to cover newly-discovered failure modes."],
    ["Behavior drifts silently", "When the underlying model updates, the agent changes — even though nothing in your code did. The most insidious failure mode, and invisible without continuous evaluation."],
  ];
  return (
    <Section style={{ paddingBottom: 56 }}>
      <div style={{ maxWidth: 800, margin: "0 auto 56px", textAlign: "center" }}>
        <Eyebrow>Why evaluation</Eyebrow>
        <H2 style={{ margin: "0 auto" }}>AI agents fail differently than normal software</H2>
        <Lead style={{ margin: "16px auto 0", textAlign: "center" }}>
          Traditional testing assumes identical inputs produce identical outputs. Agents assume the opposite —
          which rewrites every assumption about how quality works.
        </Lead>
      </div>
      <div className="grid-3" style={{ display: "grid", gap: 20 }}>
        {cards.map(([t, d], i) => (
          <Reveal key={t} delay={i * 90}>
            <Card hover style={{ height: "100%" }}>
              <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 15, fontWeight: 700, color: T.red }}>0{i + 1}</div>
              <div style={{ width: 38, height: 3, background: T.red, borderRadius: 2, margin: "14px 0 18px" }} />
              <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 20, fontWeight: 700, marginBottom: 11, letterSpacing: -0.4 }}>{t}</div>
              <p style={{ fontSize: 15, color: T.ink2, lineHeight: 1.6 }}>{d}</p>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 4 — HOW WE DO IT */
function How({ go }) {
  const steps = [
    ["Generate", "Describe the agent in plain English. We detect the domain and generate 200+ realistic test cases — core, edge, adversarial, and probe utterances."],
    ["Resolve", "Each case is sent to the live agent via the execute-sync API. We capture the response and every tool call — without modifying the agent."],
    ["Evaluate", "14 evaluators fan out across every response concurrently — 6 deterministic checks and 8 LLM-as-judge dimensions scored against structured rubrics."],
    ["Gate & report", "A weighted composite plus hard gates produce an Alpha → GA verdict, with per-dimension what-to-fix guidance."],
  ];
  return (
    <Section style={{ background: T.bgWarm, borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}` }}>
      <div style={{ maxWidth: 760, margin: "0 auto 52px", textAlign: "center" }}>
        <Eyebrow color={T.blue}>How it works</Eyebrow>
        <H2 style={{ margin: "0 auto" }}>From a plain-English ask to a deployment verdict</H2>
      </div>
      <div className="grid-4" style={{ display: "grid", gap: 16 }}>
        {steps.map(([t, d], i) => (
          <Reveal key={t} delay={i * 80}>
            <Card hover style={{ height: "100%" }}>
              <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${T.blue}14`, border: `1px solid ${T.blue}44`, color: T.blue, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Schibsted Grotesk", fontWeight: 800, marginBottom: 16 }}>{i + 1}</div>
              <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 17, fontWeight: 700, marginBottom: 9 }}>{t}</div>
              <p style={{ fontSize: 13.5, color: T.ink2, lineHeight: 1.58 }}>{d}</p>
            </Card>
          </Reveal>
        ))}
      </div>
      <div style={{ textAlign: "center", marginTop: 40 }}>
        <Button onClick={() => go("framework")} variant="secondary">Explore the framework →</Button>
      </div>
    </Section>
  );
}

/* 5 — THE ARCHITECTURE (inline diagram) */
function ArchSection({ go }) {
  return (
    <Section>
      <div style={{ maxWidth: 820, margin: "0 auto 48px", textAlign: "center" }}>
        <Eyebrow color={T.green}>The platform architecture</Eyebrow>
        <H2 style={{ margin: "0 auto" }}>How the evaluator is built</H2>
        <Lead style={{ margin: "16px auto 0", textAlign: "center" }}>
          A FastAPI middleware that observes and measures — it never modifies your agent. Three ingestion paths
          feed one evaluation engine that fans 14 evaluators across every response and streams results downstream.
        </Lead>
      </div>
      <ArchDiagram />
      <div style={{ textAlign: "center", marginTop: 44 }}>
        <Button onClick={() => go("architecture")}>See the full architecture →</Button>
      </div>
    </Section>
  );
}

/* 6 — THE FRAMEWORK (three branches) */
function Platform() {
  return (
    <Section style={{ background: T.bgWarm, borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}` }}>
      <div style={{ maxWidth: 780, margin: "0 auto 52px", textAlign: "center" }}>
        <Eyebrow color={T.red}>The framework</Eyebrow>
        <H2 style={{ margin: "0 auto" }}>Three branches. Fifteen dimensions. One verdict.</H2>
        <Lead style={{ margin: "16px auto 0", textAlign: "center" }}>
          Every agent is scored against the three questions that decide whether it ships.
        </Lead>
      </div>
      <div className="grid-3" style={{ display: "grid", gap: 20 }}>
        {Object.values(BRANCH).map((b, i) => (
          <Reveal key={b.label} delay={i * 90}>
            <Card hover style={{ borderTop: `3px solid ${b.color}`, height: "100%" }}>
              <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 30, fontWeight: 800, color: b.color, letterSpacing: -1 }}>{b.label}</div>
              <div style={{ fontSize: 15.5, fontWeight: 700, color: T.ink, margin: "12px 0 8px" }}>{b.full}</div>
              <div style={{ fontSize: 14.5, color: T.ink2 }}>{b.q}</div>
            </Card>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 7 — ENGINE (dark band) */
function Engine({ go }) {
  return (
    <Section style={{ background: T.ink, color: "#f3ede2" }}>
      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "center" }}>
        <div>
          <div style={{ fontFamily: "IBM Plex Mono", fontSize: 12, letterSpacing: 1.8, textTransform: "uppercase", color: "#b8aa97", marginBottom: 18 }}>The evaluation engine</div>
          <h2 style={{ fontFamily: "Schibsted Grotesk", fontSize: "clamp(30px,4vw,46px)", fontWeight: 700, lineHeight: 1.08, letterSpacing: -1, marginBottom: 20, color: "#faf6ef" }}>
            Fourteen evaluators, every response, in parallel
          </h2>
          <p style={{ fontSize: 17, color: "#cabba6", lineHeight: 1.6, maxWidth: 520 }}>
            A single conversation fans out into agent, tool, LLM, and evaluator spans. The engine runs every
            evaluator concurrently via asyncio — deterministic where it can be, LLM-judged where it must be —
            and produces an interpretable, gated verdict.
          </p>
          <div style={{ marginTop: 28 }}>
            <Button onClick={() => go("docs")} style={{ background: "#f3ede2", color: T.ink }}>Read the docs →</Button>
          </div>
        </div>
        <div className="grid-3" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
          {[["14", "evaluators / response"], ["8", "LLM judges in parallel"], ["6", "deterministic checks"], ["3", "ingestion paths"], ["1", "shared trace ID"], ["∞", "cases per run"]].map(([v, l]) => (
            <div key={l} style={{ background: "#241f1a", border: "1px solid #342d25", borderRadius: 14, padding: 20, textAlign: "center" }}>
              <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 32, fontWeight: 800, color: "#faf6ef", lineHeight: 1 }}>{v}</div>
              <div style={{ fontSize: 11.5, color: "#a99b87", marginTop: 8 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* 8 — FINAL CTA */
function FinalCTA({ go }) {
  return (
    <section style={{ position: "relative", overflow: "hidden", padding: "112px 0" }}>
      <DotGrid />
      <Container style={{ position: "relative", textAlign: "center" }}>
        <H2 style={{ fontSize: "clamp(34px,5vw,58px)", margin: "0 auto", maxWidth: 800 }}>
          Don't deploy an agent you haven't evaluated
        </H2>
        <Lead style={{ margin: "22px auto 0", textAlign: "center" }}>
          See the platform evaluate, gate, and report on a live agent — book a walkthrough with our team.
        </Lead>
        <div className="hero-cta" style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 36 }}>
          <Button onClick={() => go("contact")}>Sign up →</Button>
          <Button onClick={() => go("contact")} variant="secondary">Talk to an engineer</Button>
        </div>
      </Container>
    </section>
  );
}

function sc(v) {
  if (v >= 0.9) return T.green;
  if (v >= 0.75) return "#5a8f3c";
  if (v >= 0.5) return T.amber;
  return T.red;
}
