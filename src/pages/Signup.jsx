import React, { useEffect, useState } from "react";
import { T } from "../theme.js";
import { Container, Eyebrow, H2, Lead } from "../components/ui.jsx";
import { api, useMe } from "../lib/auth.js";

// A sign-in that went wrong comes back as /signup?error=…; show it as the provider worded it.
function returnedError() {
  const e = new URLSearchParams(window.location.search).get("error");
  if (e) window.history.replaceState(null, "", window.location.pathname + window.location.hash);
  return e;
}

// "Download our application": name and email (recorded in the website database), then the
// download page.
export default function Signup({ go }) {
  const { loading, user, methods, error: meError } = useMe();
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(returnedError);

  useEffect(() => {
    if (user) go("download");
  }, [user, go]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy("form");
    setError(null);
    try {
      await api("/api/signup", { method: "POST", body: form });
      go("download");
    } catch (err) {
      setError(err.message);
      setBusy(null);
    }
  };

  const disabled = loading || !!busy;
  const closed = methods && !methods.form;

  return (
    <section style={{ padding: "88px 0 120px" }}>
      <Container style={{ maxWidth: 560 }}>
        <Eyebrow>Litmus beta · free for evaluation teams</Eyebrow>
        <H2 style={{ fontSize: "clamp(30px, 4vw, 42px)" }}>Download Litmus</H2>
        <Lead style={{ fontSize: 17, marginBottom: 32 }}>
          Tell us who you are and the download opens straight away: macOS, Windows and Linux.
        </Lead>

        {loading && <p style={{ color: T.ink3 }}>Loading…</p>}
        {closed && (
          <p style={{ color: T.ink2, lineHeight: 1.6 }}>
            Downloads open shortly. Meanwhile, <button onClick={() => go("contact")} style={{ ...linkBtn, display: "inline", marginTop: 0, fontSize: 16 }}>talk to our team</button> for early access.
          </p>
        )}

        {methods?.form && (
          <form onSubmit={submit} style={{ display: "grid", gap: 14 }}>
            <label style={label}>Name
              <input style={field} required maxLength={120} autoComplete="name" placeholder="Jane Doe" value={form.name} onChange={set("name")} disabled={disabled} />
            </label>
            <label style={label}>Email
              <input style={field} type="email" required maxLength={254} autoComplete="email" placeholder="jane@company.com" value={form.email} onChange={set("email")} disabled={disabled} />
            </label>
            <label style={label}>Company <span style={{ color: T.ink3, fontWeight: 400 }}>(optional)</span>
              <input style={field} maxLength={160} autoComplete="organization" placeholder="Acme Inc." value={form.company} onChange={set("company")} disabled={disabled} />
            </label>
            <button type="submit" disabled={disabled} style={{ ...pill, justifyContent: "center", marginTop: 6, background: T.ink, color: "#f7f4ee", opacity: disabled ? 0.6 : 1 }}>
              {busy === "form" ? "Opening the download…" : "Continue to download →"}
            </button>
          </form>
        )}

        {(error || meError) && (
          <div role="alert" style={{ marginTop: 20, border: `1px solid ${T.red}40`, background: `${T.red}0d`, color: T.red, borderRadius: 12, padding: "12px 16px", fontSize: 14, lineHeight: 1.5 }}>
            {error || meError}
          </div>
        )}

      </Container>
    </section>
  );
}

const field = {
  display: "block", width: "100%", marginTop: 7, padding: "12px 14px", borderRadius: 10, border: `1px solid ${T.line}`,
  background: T.paper, color: T.ink, fontSize: 15, fontFamily: "Inter", fontWeight: 400, outline: "none",
};
const label = { fontFamily: "Schibsted Grotesk", fontSize: 13.5, fontWeight: 600, color: T.ink };


const pill = {
  display: "inline-flex", alignItems: "center", cursor: "pointer", fontFamily: "Schibsted Grotesk",
  fontWeight: 600, fontSize: 15, padding: "13px 24px", borderRadius: 999, border: "1px solid transparent",
};
const linkBtn = { display: "block", marginTop: 8, background: "none", border: "none", padding: 0, color: T.ink2, textDecoration: "underline", cursor: "pointer", fontSize: 14 };


