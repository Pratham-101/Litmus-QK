import React, { useState } from "react";
import { T, LIVE_TOOL_URL } from "../theme.js";
import { Container, Section, Eyebrow, H2, Lead, Card, Button } from "../components/ui.jsx";
import { api } from "../lib/auth.js";
import { AGENT_KINDS } from "../../api/_lib/agentKinds.js";

const field = {
  width: "100%", padding: "12px 14px", borderRadius: 10, border: `1px solid ${T.line}`,
  background: T.paper, color: T.ink, fontSize: 14.5, fontFamily: "Inter", outline: "none",
};
const label = { fontFamily: "Schibsted Grotesk", fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 7, display: "block" };

const EMPTY = { name: "", email: "", company: "", agent_kind: "", agent: "", message: "" };

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/api/contact", { method: "POST", body: form });
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <Section style={{ paddingTop: 76 }}>
      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56, alignItems: "start" }}>
        <div>
          <Eyebrow>Get started</Eyebrow>
          <H2>Talk to our FDE</H2>
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
            <form onSubmit={submit}>
              <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div><label style={label} htmlFor="c-name">Name</label><input id="c-name" style={field} required maxLength={120} autoComplete="name" placeholder="Jane Doe" value={form.name} onChange={set("name")} /></div>
                <div><label style={label} htmlFor="c-email">Work email</label><input id="c-email" style={field} type="email" required maxLength={254} autoComplete="email" placeholder="jane@company.com" value={form.email} onChange={set("email")} /></div>
              </div>
              <div style={{ marginBottom: 14 }}><label style={label} htmlFor="c-company">Company</label><input id="c-company" style={field} maxLength={160} autoComplete="organization" placeholder="Acme Inc." value={form.company} onChange={set("company")} /></div>
              <div style={{ marginBottom: 14 }}>
                <label style={label} htmlFor="c-kind">What kind of agent is it?</label>
                <select id="c-kind" style={{ ...field, appearance: "auto" }} required value={form.agent_kind} onChange={set("agent_kind")}>
                  <option value="" disabled>Choose one</option>
                  {AGENT_KINDS.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={label} htmlFor="c-agent">What agent do you want to evaluate?</label>
                <input id="c-agent" style={field} maxLength={300} placeholder="e.g. a customer-support agent on DevRev" value={form.agent} onChange={set("agent")} />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={label} htmlFor="c-msg">Anything else?</label>
                <textarea id="c-msg" style={{ ...field, resize: "vertical", minHeight: 90, fontFamily: "Inter" }} maxLength={4000} placeholder="Tell us about your use case…" value={form.message} onChange={set("message")} />
              </div>
              <button type="submit" disabled={busy} style={{
                width: "100%", display: "flex", justifyContent: "center", cursor: "pointer", fontFamily: "Schibsted Grotesk",
                fontWeight: 600, fontSize: 15, padding: "13px 24px", borderRadius: 999, border: "none",
                background: T.ink, color: "#f7f4ee", opacity: busy ? 0.6 : 1,
              }}>{busy ? "Sending…" : "Request a walkthrough →"}</button>
              {error && (
                <div role="alert" style={{ marginTop: 14, border: `1px solid ${T.red}40`, background: `${T.red}0d`, color: T.red, borderRadius: 10, padding: "10px 14px", fontSize: 13.5, lineHeight: 1.5 }}>{error}</div>
              )}
              <p style={{ fontSize: 12, color: T.ink3, marginTop: 14, textAlign: "center" }}>
                An engineer will reach out to schedule your walkthrough.
              </p>
            </form>
          )}
        </Card>
      </div>
    </Section>
  );
}
