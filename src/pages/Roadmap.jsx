import React from "react";
import { T } from "../theme.js";
import { Container, Section, Eyebrow, H2, Lead, Card, Pill, Button } from "../components/ui.jsx";

const PHASES = [
  { tag: "Shipped", color: T.green, title: "Text & chat agent evaluation",
    items: ["CLAMP · PEST · GHTPWR framework", "Auto dataset generation (10+ domains)", "LLM-as-judge scoring & deployment gating", "Aviation & mobility agents evaluated"] },
  { tag: "Live", color: T.blue, title: "Production observability",
    items: ["Arize traces, spans & sessions", "Agent graph & path visualization", "Drift detection & worst-slice analysis", "Telemetry → eval feedback loop"] },
  { tag: "Next", color: T.amber, title: "ElevenLabs voice-agent evaluation",
    items: ["Voice agent intake & transcription", "Speech-specific eval dimensions", "Latency & barge-in SLAs", "Voice ↔ text unified scoring"] },
  { tag: "Planned", color: T.red, title: "Multi-agent & autonomous systems",
    items: ["System-level evaluation", "Agent-to-agent handoff scoring", "Autonomous workflow gating", "Continuous compliance reporting"] },
];

const PIPE = [
  { t: "Capture", d: "ElevenLabs Conversational AI streams the live call. Audio plus the agent's tool calls are captured per turn." },
  { t: "Transcribe", d: "Speech-to-text aligns caller and agent turns into an evaluable transcript with word-level timing." },
  { t: "Evaluate", d: "The same 15 CLAMP·PEST·GHTPWR dimensions run on the transcript, plus voice-only dimensions: latency, interruption, prosody." },
  { t: "Gate & Observe", d: "Voice results join text results in one report. Calls stream into Arize as traces for the same drift & slice analysis." },
];

const VOICE_DIMS = [
  ["Response latency", "Time from caller end-of-speech to agent first word — the voice equivalent of TTFT."],
  ["Interruption handling", "Whether the agent yields gracefully when the caller barges in mid-response."],
  ["Transcription fidelity", "How accurately the agent acts on what was actually said versus misheard."],
  ["Prosody & tone", "Warmth, pacing, and empathy in the synthesized voice under stress."],
  ["Turn-taking", "Natural conversational rhythm without awkward gaps or overlaps."],
  ["Fallback to human", "Correct, timely handoff to a live agent when the call exceeds scope."],
];

export default function Roadmap({ go }) {
  return (
    <>
      <section style={{ padding: "84px 0 40px" }}>
        <Container>
          <Eyebrow>Path forward</Eyebrow>
          <H2 style={{ maxWidth: 820 }}>From text agents to voice and beyond</H2>
          <Lead>
            The platform already evaluates and governs chat agents end-to-end. The next frontier is voice —
            bringing ElevenLabs conversational agents under the same framework, gates, and observability.
          </Lead>
        </Container>
      </section>

      <Section style={{ paddingTop: 16 }}>
        <div className="grid-2" style={{ display: "grid", gap: 18 }}>
          {PHASES.map((p) => (
            <Card key={p.title} hover style={{ borderLeft: `4px solid ${p.color}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <Pill color={p.color}>{p.tag}</Pill>
                <span style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 18 }}>{p.title}</span>
              </div>
              {p.items.map((it) => (
                <div key={it} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 9, fontSize: 14, color: T.ink2 }}>
                  <span style={{ color: p.color }}>›</span>{it}
                </div>
              ))}
            </Card>
          ))}
        </div>
      </Section>

      <Section style={{ background: T.bgWarm, borderTop: `1px solid ${T.line}`, borderBottom: `1px solid ${T.line}` }}>
        <Eyebrow color={T.amber}>Deep dive · next</Eyebrow>
        <H2>How ElevenLabs voice evaluation will work</H2>
        <Lead>
          Voice agents fail differently — interruptions, latency, mishearing, and tone. The pipeline reuses the
          existing evaluation core and adds a voice-aware front end, so voice and text agents are scored on one scale.
        </Lead>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0, marginTop: 44 }} className="grid-pipeline">
          {PIPE.map((s, i) => (
            <div key={s.t} style={{ position: "relative", padding: "0 16px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ width: 30, height: 30, borderRadius: "50%", background: `${T.amber}18`, border: `1px solid ${T.amber}66`, color: T.amber, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Schibsted Grotesk", fontWeight: 800, fontSize: 14 }}>{i + 1}</span>
                <span style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 16.5 }}>{s.t}</span>
              </div>
              <p style={{ fontSize: 13.5, color: T.ink2, lineHeight: 1.6 }}>{s.d}</p>
              {i < PIPE.length - 1 && <span className="pipe-arrow" style={{ position: "absolute", top: 6, right: -6, color: T.ink3, fontSize: 18 }}>→</span>}
            </div>
          ))}
        </div>

        <Card style={{ marginTop: 44 }}>
          <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 17, marginBottom: 18 }}>New voice-specific dimensions</div>
          <div className="grid-3" style={{ display: "grid", gap: 14 }}>
            {VOICE_DIMS.map(([t, d]) => (
              <div key={t} style={{ padding: 16, background: T.bgWarm, border: `1px solid ${T.line}`, borderRadius: 12 }}>
                <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 14.5, color: T.amber, marginBottom: 7 }}>{t}</div>
                <p style={{ fontSize: 13, color: T.ink2, lineHeight: 1.55 }}>{d}</p>
              </div>
            ))}
          </div>
        </Card>
        <style>{`@media (max-width: 900px){ .grid-pipeline{ grid-template-columns:1fr !important; gap:18px !important;} .pipe-arrow{ display:none !important;} }`}</style>
      </Section>

      <Section style={{ textAlign: "center" }}>
        <H2 style={{ margin: "0 auto", maxWidth: 620 }}>One framework. Every agent. Text and voice.</H2>
        <Lead style={{ margin: "14px auto 0", textAlign: "center" }}>
          As new agents and modalities come online, they all flow through the same evaluation, gating, and
          observability pipeline — so quality stays comparable across the entire fleet.
        </Lead>
        <div className="hero-cta" style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 30 }}>
          <Button onClick={() => go("cases")}>Read the case studies →</Button>
        </div>
      </Section>
    </>
  );
}
