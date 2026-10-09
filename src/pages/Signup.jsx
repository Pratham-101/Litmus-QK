import React, { useEffect, useState } from "react";
import { T } from "../theme.js";
import { Container, Eyebrow, H2, Lead } from "../components/ui.jsx";
import { emailLink, signInWith, useMe } from "../lib/auth.js";

// A sign-in that went wrong comes back as /signup?error=…; show it as the provider worded it.
function returnedError() {
  const e = new URLSearchParams(window.location.search).get("error");
  if (e) window.history.replaceState(null, "", window.location.pathname + window.location.hash);
  return e;
}

// Sign up = sign in: the first sign-in records the email (api/_lib/db.js).
export default function Signup({ go }) {
  const { loading, user, methods, error: meError } = useMe();
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(null);
  const [sent, setSent] = useState(null);
  const [error, setError] = useState(returnedError);

  useEffect(() => {
    if (user) go("download");
  }, [user, go]);

  const run = async (what, fn) => {
    setBusy(what);
    setError(null);
    try {
      await fn();
    } catch (e) {
      setError(e.message || String(e));
      setBusy(null);
    }
  };

  const onEmail = (e) => {
    e.preventDefault();
    const address = email.trim();
    run("email", async () => {
      await emailLink(address);
      setSent(address);
      setBusy(null);
    });
  };

  const disabled = loading || !!busy;
  const oauth = methods && (methods.google || methods.microsoft);
  const none = methods && !methods.google && !methods.microsoft && !methods.email;

  return (
    <section style={{ padding: "88px 0 120px" }}>
      <Container style={{ maxWidth: 520 }}>
        <Eyebrow>Litmus beta · free download</Eyebrow>
        <H2 style={{ fontSize: "clamp(30px, 4vw, 42px)" }}>Sign up to download Litmus</H2>
        <Lead style={{ fontSize: 17, marginBottom: 36 }}>
          Use your work account or any email address. The download page opens as soon as you are signed in.
        </Lead>

        {loading && <p style={{ color: T.ink3 }}>Loading…</p>}
        {none && (
          <p style={{ color: T.ink2, lineHeight: 1.6 }}>
            Sign-up opens shortly. Meanwhile, <button onClick={() => go("contact")} style={{ ...linkBtn, display: "inline", marginTop: 0, fontSize: 16 }}>talk to our team</button> for early access.
          </p>
        )}

        {oauth && (
          <div style={{ display: "grid", gap: 12 }}>
            {methods.google && (
              <Provider onClick={() => run("google", () => signInWith("google"))} disabled={disabled} busy={busy === "google"}
                icon={<GoogleIcon />}>Continue with Google</Provider>
            )}
            {methods.microsoft && (
              <Provider onClick={() => run("microsoft", () => signInWith("microsoft"))} disabled={disabled} busy={busy === "microsoft"}
                icon={<MicrosoftIcon />}>Continue with Microsoft (Outlook)</Provider>
            )}
          </div>
        )}

        {oauth && methods.email && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, margin: "28px 0", color: T.ink3, fontSize: 13 }}>
            <span style={{ flex: 1, height: 1, background: T.line }} />or use any email<span style={{ flex: 1, height: 1, background: T.line }} />
          </div>
        )}

        {!methods?.email ? null : sent ? (
          <div role="status" style={{ border: `1px solid ${T.green}40`, background: `${T.green}0d`, borderRadius: 12, padding: "16px 18px", color: T.ink, lineHeight: 1.55 }}>
            We sent a sign-in link to <strong>{sent}</strong>. Open it on this device to reach the download page.
            <button onClick={() => setSent(null)} style={linkBtn}>Use a different email</button>
          </div>
        ) : (
          <form onSubmit={onEmail} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <input
              type="email" required autoComplete="email" placeholder="you@company.com"
              value={email} onChange={(e) => setEmail(e.target.value)} disabled={disabled}
              aria-label="Email address"
              style={{ flex: "1 1 240px", fontSize: 15, padding: "13px 16px", borderRadius: 999, border: `1px solid ${T.line}`, background: T.paper, color: T.ink, fontFamily: "Inter" }}
            />
            <button type="submit" disabled={disabled} style={{ ...pill, background: T.ink, color: "#f7f4ee", opacity: disabled ? 0.55 : 1 }}>
              {busy === "email" ? "Sending…" : "Email me a link"}
            </button>
          </form>
        )}

        {(error || meError) && (
          <div role="alert" style={{ marginTop: 20, border: `1px solid ${T.red}40`, background: `${T.red}0d`, color: T.red, borderRadius: 12, padding: "12px 16px", fontSize: 14, lineHeight: 1.5 }}>
            {error || meError}
          </div>
        )}

        <p style={{ marginTop: 32, fontSize: 13, color: T.ink3, lineHeight: 1.6 }}>
          We keep your email address and which installer you download, to know how many people use Litmus.
          Nothing else, and we don't share it.
        </p>
      </Container>
    </section>
  );
}

function Provider({ children, icon, onClick, disabled, busy }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      ...pill, justifyContent: "center", gap: 12, width: "100%", background: T.paper, color: T.ink,
      border: `1px solid ${T.line}`, opacity: disabled && !busy ? 0.55 : 1,
    }}>
      {icon}{busy ? "Opening…" : children}
    </button>
  );
}

const pill = {
  display: "inline-flex", alignItems: "center", cursor: "pointer", fontFamily: "Schibsted Grotesk",
  fontWeight: 600, fontSize: 15, padding: "13px 24px", borderRadius: 999, border: "1px solid transparent",
};
const linkBtn = { display: "block", marginTop: 8, background: "none", border: "none", padding: 0, color: T.ink2, textDecoration: "underline", cursor: "pointer", fontSize: 14 };

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  );
}

function MicrosoftIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 21 21" aria-hidden>
      <rect x="1" y="1" width="9" height="9" fill="#f25022" /><rect x="11" y="1" width="9" height="9" fill="#7fba00" />
      <rect x="1" y="11" width="9" height="9" fill="#00a4ef" /><rect x="11" y="11" width="9" height="9" fill="#ffb900" />
    </svg>
  );
}
