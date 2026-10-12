import React, { useEffect, useState } from "react";
import { T } from "../theme.js";
import { Container, Eyebrow, H2, Lead } from "../components/ui.jsx";
import { sendCode, useMe, verifyCode } from "../lib/auth.js";

// "Download Litmus": the email must be proven before the download opens: Supabase emails a 6-digit
// code to the address, and only the code from that inbox signs the visitor in.
export default function Signup({ go }) {
  const { loading, user, methods, error: meError } = useMe();
  const [form, setForm] = useState({ name: "", email: "", company: "" });
  const [step, setStep] = useState("details"); // details | code
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (user) go("download");
  }, [user, go]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const run = async (what, fn) => {
    setBusy(what);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(null);
    }
  };

  const requestCode = (e) => {
    e.preventDefault();
    run("send", async () => {
      await sendCode(form);
      setStep("code");
      setCode("");
      setNotice(`We emailed a 6-digit code to ${form.email.trim()}. It works for 10 minutes; check spam if it isn't there.`);
    });
  };
  const confirm = (e) => {
    e.preventDefault();
    run("verify", async () => {
      await verifyCode(form, code);
      go("download");
    });
  };

  const showCode = methods?.code;
  const closed = methods && !showCode;
  const disabled = loading || !!busy;

  return (
    <section style={{ padding: "88px 0 120px" }}>
      <Container style={{ maxWidth: 560 }}>
        <Eyebrow>Litmus beta · free for evaluation teams</Eyebrow>
        <H2 style={{ fontSize: "clamp(30px, 4vw, 42px)" }}>Download Litmus</H2>
        <Lead style={{ fontSize: 17, marginBottom: 32 }}>
          Enter your details and we'll email you a 6-digit code. Confirm it and the download opens:
          macOS, Windows and Linux.
        </Lead>

        {loading && <p style={{ color: T.ink3 }}>Loading…</p>}
        {closed && (
          <p style={{ color: T.ink2, lineHeight: 1.6 }}>
            Downloads open shortly. Meanwhile, <button onClick={() => go("contact")} style={linkBtn}>talk to our team</button> for early access.
          </p>
        )}



        {showCode && step === "details" && (
          <form onSubmit={requestCode} style={{ display: "grid", gap: 14 }}>
            <label style={label}>Name
              <input style={field} required maxLength={120} autoComplete="name" placeholder="Jane Doe" value={form.name} onChange={set("name")} disabled={disabled} />
            </label>
            <label style={label}>Email
              <input style={field} type="email" required maxLength={254} autoComplete="email" placeholder="jane@company.com" value={form.email} onChange={set("email")} disabled={disabled} />
            </label>
            <label style={label}>Company <span style={{ color: T.ink3, fontWeight: 400 }}>(optional)</span>
              <input style={field} maxLength={160} autoComplete="organization" placeholder="Acme Inc." value={form.company} onChange={set("company")} disabled={disabled} />
            </label>
            <button type="submit" disabled={disabled} style={{ ...pill, ...primaryBtn, opacity: disabled ? 0.6 : 1 }}>
              {busy === "send" ? "Sending the code…" : "Email me a code →"}
            </button>
          </form>
        )}

        {step === "code" && (
          <form onSubmit={confirm} style={{ display: "grid", gap: 14 }}>
            {notice && <div role="status" style={{ border: `1px solid ${T.green}40`, background: `${T.green}0d`, borderRadius: 12, padding: "12px 16px", color: T.ink, fontSize: 14.5, lineHeight: 1.55 }}>{notice}</div>}
            <label style={label}>6-digit code
              <input style={{ ...field, fontFamily: "IBM Plex Mono", fontSize: 22, letterSpacing: 8, textAlign: "center" }}
                inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" maxLength={6} required autoFocus
                placeholder="000000" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} disabled={disabled} />
            </label>
            <button type="submit" disabled={disabled || code.length !== 6} style={{ ...pill, ...primaryBtn, opacity: disabled || code.length !== 6 ? 0.6 : 1 }}>
              {busy === "verify" ? "Checking…" : "Confirm and download →"}
            </button>
            <div style={{ display: "flex", gap: 18, fontSize: 14 }}>
              <button type="button" onClick={requestCode} disabled={disabled} style={linkBtn}>Send a new code</button>
              <button type="button" onClick={() => { setStep("details"); setNotice(null); setError(null); }} disabled={disabled} style={linkBtn}>Use a different email</button>
            </div>
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
const primaryBtn = { justifyContent: "center", marginTop: 6, background: T.ink, color: "#f7f4ee" };
const linkBtn = { background: "none", border: "none", padding: 0, color: T.ink2, textDecoration: "underline", cursor: "pointer", fontSize: "inherit" };

