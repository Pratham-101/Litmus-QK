import React, { useEffect, useState } from "react";
import { T } from "../theme.js";
import { Container, Eyebrow, H2, Lead } from "../components/ui.jsx";
import { signInWithGoogle, useMe } from "../lib/auth.js";

// A sign-in that went wrong comes back as /signup?error=…; show it as the provider worded it.
function returnedError() {
  const e = new URLSearchParams(window.location.search).get("error");
  if (e) window.history.replaceState(null, "", window.location.pathname + window.location.hash);
  return e;
}

// "Download Litmus": sign in with Google (through Supabase), then the download page.
export default function Signup({ go }) {
  const { loading, user, methods, error: meError } = useMe();
  const [busy, setBusy] = useState(null);
  const [error, setError] = useState(returnedError);

  useEffect(() => {
    if (user) go("download");
  }, [user, go]);

  const disabled = loading || !!busy;
  const closed = methods && !methods.google;

  return (
    <section style={{ padding: "88px 0 120px" }}>
      <Container style={{ maxWidth: 560 }}>
        <Eyebrow>Litmus beta · free for evaluation teams</Eyebrow>
        <H2 style={{ fontSize: "clamp(30px, 4vw, 42px)" }}>Download Litmus</H2>
        <Lead style={{ fontSize: 17, marginBottom: 32 }}>
          Sign in with Google and the download opens straight away: macOS, Windows and Linux.
        </Lead>

        {loading && <p style={{ color: T.ink3 }}>Loading…</p>}
        {closed && (
          <p style={{ color: T.ink2, lineHeight: 1.6 }}>
            Downloads open shortly. Meanwhile, <button onClick={() => go("contact")} style={{ ...linkBtn, display: "inline", marginTop: 0, fontSize: 16 }}>talk to our team</button> for early access.
          </p>
        )}

        {methods?.google && (
          <button onClick={() => { setBusy("google"); setError(null); signInWithGoogle("").catch((e) => { setError(e.message); setBusy(null); }); }}
            disabled={disabled} style={{ ...pill, justifyContent: "center", gap: 12, width: "100%", background: T.paper, color: T.ink, border: `1px solid ${T.line}`, opacity: disabled && busy !== "google" ? 0.55 : 1 }}>
            <GoogleIcon />{busy === "google" ? "Opening Google…" : "Continue with Google"}
          </button>
        )}

        {methods?.google && (
          <p style={{ marginTop: 18, fontSize: 13.5, color: T.ink3, textAlign: "center" }}>
            More sign-up options are coming soon.
          </p>
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
