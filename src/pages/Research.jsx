import React, { useEffect, useState } from "react";
import { T } from "../theme.js";
import { Container, Section, Eyebrow, H2, Lead } from "../components/ui.jsx";
import { api } from "../lib/auth.js";

// Research papers, each gated behind a short form (lead capture). Fill it → the PDF opens.
export default function Research() {
  const [papers, setPapers] = useState(null);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    api("/api/papers").then((d) => setPapers(d.papers)).catch((e) => setError(e.message));
  }, []);

  return (
    <>
      <style>{`
        @media (max-width: 760px) {
          .paper-row { grid-template-columns: 1fr !important; }
          .paper-row > div:first-child { min-height: 180px !important; }
          .paper-row > div:last-child { padding: 24px 22px !important; }
        }
      `}</style>
      <section style={{ padding: "88px 0 20px" }}>
        <Container style={{ maxWidth: 1000 }}>
          <Eyebrow color={T.brand}>Research</Eyebrow>
          <H2 style={{ maxWidth: 820 }}>Field notes from evaluating real agents</H2>
          <Lead>
            Working papers and field reports from assessing live production agents — the evidence behind how
            Litmus scores, gates and observes. Each is free; tell us who you are and it opens.
          </Lead>
        </Container>
      </section>

      <Section style={{ paddingTop: 36 }}>
        <Container style={{ maxWidth: 1000, padding: 0 }}>
          {error && <p style={{ color: T.red }}>{error}</p>}
          {!papers && !error && <p style={{ color: T.ink3 }}>Loading…</p>}
          <div style={{ display: "grid", gap: 26 }}>
            {papers?.map((p, i) => (
              <PaperRow key={p.slug} paper={p} index={i} open={open === p.slug} setOpen={setOpen} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}

function PaperRow({ paper, index, open, setOpen }) {
  return (
    <div className="paper-row" style={{
      display: "grid", gridTemplateColumns: "250px 1fr", gap: 34, alignItems: "stretch",
      background: T.paper, border: `1px solid ${T.line}`, borderRadius: 16, overflow: "hidden",
    }}>
      <Cover paper={paper} />
      <div style={{ padding: "30px 32px 30px 0", display: "flex", flexDirection: "column" }}>
        <div style={{ fontFamily: "IBM Plex Mono", fontSize: 12, letterSpacing: 0.4, color: T.ink3, marginBottom: 12 }}>{paper.date} · {paper.pages} pages</div>
        <h3 style={{ fontFamily: "Schibsted Grotesk", fontSize: 25, fontWeight: 800, color: T.ink, letterSpacing: -0.5, lineHeight: 1.15, margin: 0 }}>{paper.title}</h3>
        <p style={{ fontSize: 16.5, color: T.ink2, fontStyle: "italic", margin: "10px 0 14px", lineHeight: 1.45 }}>{paper.tagline}</p>
        <p style={{ fontSize: 14.5, color: T.ink2, lineHeight: 1.65, margin: 0, flex: 1 }}>{paper.abstract}</p>
        <div style={{ marginTop: 20 }}>
          {open
            ? <PaperForm paper={paper} onClose={() => setOpen(null)} />
            : <button onClick={() => setOpen(paper.slug)} style={cta}>Get the paper →</button>}
        </div>
      </div>
    </div>
  );
}

// A code-built journal cover for each paper, so the list reads like a research shelf.
function Cover({ paper }) {
  return (
    <div style={{
      position: "relative", background: `linear-gradient(155deg, ${T.brand} 0%, #1a1842 100%)`,
      padding: "26px 24px", display: "flex", flexDirection: "column", minHeight: 300, color: "#efeafd",
    }}>
      <div aria-hidden style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: 4, background: T.brandGold }} />
      <div style={{ fontFamily: "IBM Plex Mono", fontSize: 10.5, letterSpacing: 1.4, textTransform: "uppercase", color: T.brandGold }}>
        {paper.kind}
      </div>
      <div style={{ fontFamily: "Schibsted Grotesk", fontSize: 20, fontWeight: 700, lineHeight: 1.2, marginTop: 14, color: "#fff", letterSpacing: -0.3 }}>
        {paper.title}
      </div>
      <div aria-hidden style={{ marginTop: 18, display: "grid", gap: 7, opacity: 0.5 }}>
        {[100, 92, 96, 70, 88, 60].map((w, n) => (
          <span key={n} style={{ height: 3, borderRadius: 2, width: `${w}%`, background: "#efeafd" }} />
        ))}
      </div>
      <div style={{ marginTop: "auto", paddingTop: 18, display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontFamily: "IBM Plex Mono", fontSize: 10, fontWeight: 600, color: T.brand, background: T.brandGold, padding: "4px 7px", borderRadius: 5 }}>PDF</span>
        <span style={{ fontFamily: "IBM Plex Mono", fontSize: 11, color: "#c9c2e8" }}>{paper.date} · {paper.pages}pp</span>
      </div>
    </div>
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
    <form onSubmit={submit} style={{ paddingTop: 20, borderTop: `1px solid ${T.line}`, display: "grid", gap: 12 }}>
      <div className="grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <input style={field} required maxLength={120} autoComplete="name" placeholder="Name" value={form.name} onChange={set("name")} />
        <input style={field} type="email" required maxLength={254} autoComplete="email" placeholder="Work email" value={form.email} onChange={set("email")} />
        <input style={field} maxLength={160} autoComplete="organization" placeholder="Company (optional)" value={form.company} onChange={set("company")} />
        <input style={field} maxLength={120} placeholder="Role (optional)" value={form.role} onChange={set("role")} />
      </div>
      <div style={{ display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
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
  background: T.paperAlt, color: T.ink, fontSize: 14.5, fontFamily: "Inter", outline: "none",
};
const cta = {
  display: "inline-flex", alignItems: "center", cursor: "pointer", fontFamily: "Schibsted Grotesk",
  fontWeight: 600, fontSize: 15, padding: "12px 24px", borderRadius: 999, border: "none",
  background: T.ink, color: "#f7f4ee",
};
