import React, { useEffect, useState } from "react";
import { T } from "../theme.js";
import { Container, Section, Eyebrow, H2, Lead, Card, Pill } from "../components/ui.jsx";
import { api } from "../lib/auth.js";

// Research papers, each gated behind a short form (lead capture). Fill it → the PDF opens.
export default function Research() {
  const [papers, setPapers] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(null); // slug of the paper whose form is open

  useEffect(() => {
    api("/api/papers").then((d) => setPapers(d.papers)).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <section style={{ padding: "84px 0 36px" }}>
        <Container style={{ maxWidth: 860 }}>
          <Eyebrow color={T.blue}>Research</Eyebrow>
          <H2 style={{ maxWidth: 760 }}>Field notes from evaluating real agents</H2>
          <Lead>
            Working papers and field reports from assessing live production agents — the evidence behind how Litmus
            scores, gates and observes. Each is free; tell us who you are and it opens.
          </Lead>
        </Container>
      </section>

      <Section style={{ paddingTop: 0 }}>
        {error && <p style={{ color: T.red }}>{error}</p>}
        {!papers && !error && <p style={{ color: T.ink3 }}>Loading…</p>}
        <div style={{ display: "grid", gap: 20, maxWidth: 860 }}>
          {papers?.map((p) => (
            <Card key={p.slug} style={{ borderLeft: `4px solid ${T.blue}` }}>
              <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
                <Pill color={T.blue}>{p.kind}</Pill>
                <span style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.ink3 }}>{p.date} · {p.pages} pages</span>
              </div>
              <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 24, fontWeight: 800, color: T.ink, letterSpacing: -0.4 }}>{p.title}</div>
              <div style={{ fontSize: 16, color: T.ink2, fontStyle: "italic", margin: "8px 0 14px" }}>{p.tagline}</div>
              <p style={{ fontSize: 15, color: T.ink2, lineHeight: 1.65 }}>{p.abstract}</p>
              {open === p.slug
                ? <PaperForm paper={p} onClose={() => setOpen(null)} />
                : (
                  <button onClick={() => setOpen(p.slug)} style={cta}>Get the paper →</button>
                )}
            </Card>
          ))}
        </div>
      </Section>
    </>
  );
}

function PaperForm({ paper, onClose }) {
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const { url } = await api("/api/paper", { method: "POST", body: { slug: paper.slug, ...form } });
      window.open(url, "_blank", "noopener");
      onClose();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ marginTop: 18, paddingTop: 18, borderTop: `1px solid ${T.line}`, display: "grid", gap: 12 }}>
      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <input style={field} required maxLength={120} autoComplete="name" placeholder="Name" value={form.name} onChange={set("name")} />
        <input style={field} type="email" required maxLength={254} autoComplete="email" placeholder="Work email" value={form.email} onChange={set("email")} />
        <input style={field} maxLength={160} autoComplete="organization" placeholder="Company (optional)" value={form.company} onChange={set("company")} />
        <input style={field} maxLength={120} placeholder="Role (optional)" value={form.role} onChange={set("role")} />
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button type="submit" disabled={busy} style={{ ...cta, opacity: busy ? 0.6 : 1 }}>{busy ? "Opening…" : "Read the paper →"}</button>
        <button type="button" onClick={onClose} style={{ background: "none", border: "none", color: T.ink2, textDecoration: "underline", cursor: "pointer", fontSize: 14 }}>Cancel</button>
      </div>
      {error && <div role="alert" style={{ color: T.red, fontSize: 14 }}>{error}</div>}
      <p style={{ fontSize: 12.5, color: T.ink3, margin: 0 }}>We use this to understand who's reading our research. We don't share it.</p>
    </form>
  );
}

const field = {
  width: "100%", padding: "11px 14px", borderRadius: 10, border: `1px solid ${T.line}`,
  background: T.paper, color: T.ink, fontSize: 14.5, fontFamily: "Inter", outline: "none",
};
const cta = {
  display: "inline-flex", alignItems: "center", cursor: "pointer", fontFamily: "Schibsted Grotesk",
  fontWeight: 600, fontSize: 15, padding: "11px 22px", borderRadius: 999, border: "none",
  background: T.ink, color: "#f7f4ee",
};
