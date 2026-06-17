import React, { useState } from "react";
import { T, LIVE_TOOL_URL } from "../theme.js";
import { Container, Section, Eyebrow, H2, Lead, Card, Button } from "../components/ui.jsx";

const field = {
  width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${T.line}`,
  background: T.paper, color: T.ink, fontSize: 14.5, fontFamily: "Inter", outline: "none",
};
const label = { fontFamily: "Schibsted Grotesk", fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 7, display: "block" };

export default function Contact() {
  const [sent, setSent] = useState(false);
  return (
    <Section style={{ paddingTop: 76 }}>
      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
        <div>
          <Eyebrow>Get started</Eyebrow>
          <H2>Talk to an engineer</H2>
          <Lead>
            See the platform evaluate one of your agents end-to-end — dataset, scoring, gating, and a deployment
            verdict. We'll walk through the framework, the architecture, and how it maps onto your stack.
          </Lead>
          <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              ["Bring your own agent", "We evaluate any DevRev agent via the execute-sync API — no changes to your agent."],
              ["See a live verdict", "Watch 15 dimensions score in real time and produce an Alpha → GA deployment tier."],
              ["Full observability", "Every run streams to Arize as traces and predictions, sharing one trace ID."],
            ].map(([t, d]) => (
              <div key={t} style={{ display: "flex", gap: 14 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: T.green, marginTop: 8, flexShrink: 0 }} />
                <div>
                  <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 700, fontSize: 16 }}>{t}</div>
                  <div style={{ fontSize: 14, color: T.ink2, lineHeight: 1.55 }}>{d}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Discreet access to the live tool — not linked anywhere else on the site. */}
          <div style={{ marginTop: 30, paddingTop: 22, borderTop: `1px dashed ${T.line}` }}>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: 11, letterSpacing: 1, textTransform: "uppercase", color: T.ink3, marginBottom: 10 }}>
              Private preview
            </div>
            <a href={LIVE_TOOL_URL} target="_blank" rel="noopener noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "Schibsted Grotesk",
              fontWeight: 600, fontSize: 13.5, color: T.brand, padding: "9px 16px", borderRadius: 999,
              border: `1px solid ${T.brand}55`, background: `${T.brand}0c`, textDecoration: "none",
            }}>▶ Launch the live demo</a>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 8 }}>
              Internal access for guided walkthroughs.
            </div>
          </div>
        </div>

        <Card style={{ padding: 32 }}>
          {sent ? (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 22, fontWeight: 800, marginBottom: 10 }}>Thanks — we'll be in touch.</div>
              <p style={{ fontSize: 15, color: T.ink2 }}>An engineer will reach out to schedule your walkthrough.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div><label style={label}>Name</label><input style={field} required placeholder="Jane Doe" /></div>
                <div><label style={label}>Work email</label><input style={field} type="email" required placeholder="jane@company.com" /></div>
              </div>
              <div style={{ marginBottom: 14 }}><label style={label}>Company</label><input style={field} placeholder="Acme Inc." /></div>
              <div style={{ marginBottom: 14 }}>
                <label style={label}>What agent do you want to evaluate?</label>
                <input style={field} placeholder="e.g. a customer-support agent on DevRev" />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={label}>Anything else?</label>
                <textarea style={{ ...field, resize: "vertical", minHeight: 90, fontFamily: "Inter" }} placeholder="Tell us about your use case…" />
              </div>
              <Button onClick={() => {}} style={{ width: "100%", justifyContent: "center" }}>Request a walkthrough →</Button>
              <p style={{ fontSize: 12, color: T.ink3, marginTop: 14, textAlign: "center" }}>
                Prefer email? Reach the team directly — we respond within one business day.
              </p>
            </form>
          )}
        </Card>
      </div>
    </Section>
  );
}
