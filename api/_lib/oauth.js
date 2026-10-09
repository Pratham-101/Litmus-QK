// Google and Microsoft sign-in: the OAuth 2.0 authorization-code flow with PKCE and a state check.
// The email comes from the provider's own token endpoint, server to server.
import crypto from "node:crypto";
import { cookie, cookies, env, httpError, origin } from "./http.js";
import { sign, verify } from "./session.js";

export const PROVIDERS = {
  google: {
    authorize: "https://accounts.google.com/o/oauth2/v2/auth",
    token: "https://oauth2.googleapis.com/token",
    scope: "openid email profile",
    id: "GOOGLE_CLIENT_ID",
    secret: "GOOGLE_CLIENT_SECRET",
    extra: { prompt: "select_account" },
  },
  // "common": work and school accounts and personal Outlook / Hotmail accounts alike.
  microsoft: {
    authorize: "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
    token: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
    scope: "openid email profile",
    id: "MICROSOFT_CLIENT_ID",
    secret: "MICROSOFT_CLIENT_SECRET",
    extra: { prompt: "select_account" },
  },
};

const FLOW_COOKIE = "litmus_oauth";

export function callbackUrl(req, name) {
  return `${origin(req)}/api/auth/${name}-callback`;
}

export function start(req, name) {
  const p = PROVIDERS[name];
  const verifier = crypto.randomBytes(32).toString("base64url");
  const state = crypto.randomBytes(16).toString("base64url");
  const challenge = crypto.createHash("sha256").update(verifier).digest("base64url");
  const url = new URL(p.authorize);
  url.search = new URLSearchParams({
    client_id: env(p.id),
    redirect_uri: callbackUrl(req, name),
    response_type: "code",
    scope: p.scope,
    state,
    code_challenge: challenge,
    code_challenge_method: "S256",
    ...p.extra,
  }).toString();
  // The verifier and state ride in a signed, 10-minute, httpOnly cookie: no server-side store.
  return { url: url.toString(), cookie: cookie(FLOW_COOKIE, sign({ kind: "oauth", name, state, verifier }, 600), 600) };
}

export async function finish(req, name) {
  const p = PROVIDERS[name];
  const q = new URL(req.url, "http://x").searchParams;
  if (q.get("error")) throw httpError(400, `${name} sign-in was not completed: ${q.get("error_description") || q.get("error")}`);
  const flow = verify(cookies(req)[FLOW_COOKIE]);
  if (!flow || flow.kind !== "oauth" || flow.name !== name || flow.state !== q.get("state")) {
    throw httpError(400, "This sign-in link has expired or was started in another browser. Start again from Sign up.");
  }
  const resp = await fetch(p.token, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json" },
    body: new URLSearchParams({
      client_id: env(p.id),
      client_secret: env(p.secret),
      code: q.get("code") || "",
      code_verifier: flow.verifier,
      grant_type: "authorization_code",
      redirect_uri: callbackUrl(req, name),
    }),
  });
  const text = await resp.text();
  if (!resp.ok) throw httpError(502, `${name} refused the sign-in (HTTP ${resp.status}): ${text.slice(0, 300)}`);
  const idToken = JSON.parse(text).id_token;
  if (!idToken) throw httpError(502, `${name} returned no ID token: ${text.slice(0, 300)}`);
  // Received directly from the provider's token endpoint over TLS, so its claims can be read as is
  // (OpenID Connect Core 3.1.3.7).
  const claims = JSON.parse(Buffer.from(idToken.split(".")[1], "base64url").toString());
  const email = name === "google"
    ? (claims.email_verified ? claims.email : null)
    : claims.email || (String(claims.preferred_username || "").includes("@") ? claims.preferred_username : null);
  if (!email) throw httpError(400, `${name} did not share a verified email address for this account`);
  return { email: email.toLowerCase(), provider: name, clearFlow: cookie(FLOW_COOKIE, "", 0) };
}
