import React, { useEffect, useMemo, useState } from "react";
import { T } from "../theme.js";
import { Button, Container, Eyebrow, H2, Lead } from "../components/ui.jsx";
import { api, authConfigError, signOut, useSession } from "../lib/auth.js";

// What to do once, because the beta builds are unsigned. Same steps as the GitHub release notes.
const INSTALL = {
  mac: [
    "Open the .dmg and drag Litmus to Applications.",
    "If macOS says the app is damaged or can't be verified, run this once in Terminal:",
    { code: "xattr -dr com.apple.quarantine /Applications/Litmus.app" },
    "Then open Litmus from Applications.",
  ],
  win: [
    "Run the installer.",
    "If SmartScreen says it protected your PC, choose More info → Run anyway.",
    "Litmus installs for your user only; no administrator prompt.",
  ],
  linux: [
    { code: "chmod +x Litmus-*.AppImage && ./Litmus-*.AppImage" },
    "It needs FUSE 2 (libfuse2 on Ubuntu and Debian). Without FUSE, run it with --appimage-extract-and-run.",
    "Saved keys need a keyring such as GNOME Keyring or KDE Wallet.",
  ],
};

function detectOs() {
  const p = (navigator.userAgentData?.platform || navigator.platform || navigator.userAgent || "").toLowerCase();
  if (p.includes("mac")) return "mac";
  if (p.includes("win")) return "win";
  if (p.includes("linux") || p.includes("x11")) return "linux";
  return null;
}

function size(bytes) {
  return bytes ? `${(bytes / 1048576).toFixed(0)} MB` : "";
}

export default function Download({ go }) {
  const { loading, session } = useSession();
  const [installers, setInstallers] = useState(null);
  const [error, setError] = useState(authConfigError);
  const [busy, setBusy] = useState(null);
  const os = useMemo(detectOs, []);

  useEffect(() => {
    if (!loading && !session && !authConfigError) go("signup");
  }, [loading, session, go]);

  useEffect(() => {
    if (!session) return;
    api("/api/releases", { session })
      .then((d) => setInstallers(d.installers))
      .catch((e) => setError(e.message));
  }, [session]);

  const download = async (file) => {
    setBusy(file);
    setError(null);
    try {
      const { url } = await api("/api/download", { method: "POST", body: { file }, session });
      window.location.assign(url);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(null);
    }
  };

  // Apple silicon first among Macs: every Mac sold since 2021.
  const rank = (i) => (i.os === os ? 0 : 1) * 10 + (i.arch === "arm64" && i.os === "mac" ? 0 : 1);
  const sorted = installers ? [...installers].sort((a, b) => rank(a) - rank(b)) : [];
  const mine = sorted.filter((i) => i.os === os);
  const others = sorted.filter((i) => i.os !== os);
  const version = installers?.[0]?.version;

  return (
    <section style={{ padding: "88px 0 120px" }}>
      <Container style={{ maxWidth: 760 }}>
        <Eyebrow>Litmus beta{version ? ` · v${version}` : ""}</Eyebrow>
        <H2 style={{ fontSize: "clamp(30px, 4vw, 42px)" }}>Download Litmus</H2>
        {session && (
          <Lead style={{ fontSize: 16, marginBottom: 36 }}>
            Signed in as <strong style={{ color: T.ink }}>{session.user.email}</strong>
            {" · "}
            <button onClick={() => signOut().then(() => go("signup"))} style={{ background: "none", border: "none", padding: 0, color: T.ink2, textDecoration: "underline", cursor: "pointer", fontSize: 16 }}>
              Sign out
            </button>
          </Lead>
        )}

        {error && (
          <div role="alert" style={{ marginBottom: 24, border: `1px solid ${T.red}40`, background: `${T.red}0d`, color: T.red, borderRadius: 12, padding: "12px 16px", fontSize: 14, lineHeight: 1.5 }}>
            {error}
          </div>
        )}

        {session && !installers && !error && <p style={{ color: T.ink3 }}>Loading the installers…</p>}
        {installers && installers.length === 0 && (
          <p style={{ color: T.ink2 }}>No installers are published yet. Check back soon.</p>
        )}

        {mine.length > 0 && (
          <div style={{ display: "grid", gap: 12, marginBottom: 40 }}>
            {mine.map((i, n) => (
              <Row key={i.file} i={i} primary={n === 0} busy={busy === i.file} onClick={() => download(i.file)} />
            ))}
            <Steps os={os} />
          </div>
        )}

        {others.length > 0 && (
          <>
            <div style={{ fontFamily: "IBM Plex Mono", fontSize: 12, letterSpacing: 1.4, textTransform: "uppercase", color: T.ink3, margin: "8px 0 12px" }}>
              {mine.length ? "Other platforms" : "All platforms"}
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              {others.map((i) => (
                <Row key={i.file} i={i} busy={busy === i.file} onClick={() => download(i.file)} />
              ))}
            </div>
          </>
        )}
      </Container>
    </section>
  );
}

function Row({ i, primary, busy, onClick }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", border: `1px solid ${T.line}`, background: T.paper, borderRadius: 14, padding: "14px 18px" }}>
      <div>
        <div style={{ fontFamily: "Schibsted Grotesk", fontWeight: 600, color: T.ink, fontSize: 16 }}>{i.label}</div>
        <div style={{ fontFamily: "IBM Plex Mono", fontSize: 12, color: T.ink3, marginTop: 3, fontVariantNumeric: "tabular-nums" }}>
          {i.file}{i.bytes ? ` · ${size(i.bytes)}` : ""}
        </div>
      </div>
      <Button onClick={onClick} variant={primary ? "primary" : "ghost"} style={{ padding: "10px 20px", fontSize: 14, opacity: busy ? 0.6 : 1 }}>
        {busy ? "Preparing…" : "Download"}
      </Button>
    </div>
  );
}

function Steps({ os }) {
  const steps = INSTALL[os];
  if (!steps) return null;
  return (
    <div style={{ marginTop: 8, padding: "18px 20px", borderRadius: 14, background: T.bgWarm, color: T.ink2, fontSize: 14.5, lineHeight: 1.6 }}>
      <div style={{ fontWeight: 600, color: T.ink, marginBottom: 6 }}>Installing the beta</div>
      {steps.map((s, n) =>
        typeof s === "string"
          ? <p key={n} style={{ margin: "4px 0" }}>{s}</p>
          : <code key={n} style={{ display: "block", margin: "6px 0", padding: "8px 12px", borderRadius: 8, background: T.paper, border: `1px solid ${T.line}`, fontFamily: "IBM Plex Mono", fontSize: 13, color: T.ink, overflowX: "auto", whiteSpace: "pre" }}>{s.code}</code>,
      )}
    </div>
  );
}
