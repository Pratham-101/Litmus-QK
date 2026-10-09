// Signed, httpOnly session cookie: who is signed in, nothing else. HMAC-SHA256 with SESSION_SECRET;
// the browser can neither read nor forge it.
import crypto from "node:crypto";
import { cookie, cookies, env, httpError } from "./http.js";

const NAME = "litmus_session";
const DAYS = 30;

function mac(data) {
  return crypto.createHmac("sha256", env("SESSION_SECRET")).update(data).digest("base64url");
}

// A signed, expiring token: used for the session and for email sign-in links.
export function sign(payload, seconds) {
  const data = Buffer.from(JSON.stringify({ ...payload, exp: Math.floor(Date.now() / 1000) + seconds })).toString("base64url");
  return `${data}.${mac(data)}`;
}

export function verify(token) {
  const [data, sig] = String(token || "").split(".");
  if (!data || !sig) return null;
  const want = Buffer.from(mac(data));
  const got = Buffer.from(sig);
  if (want.length !== got.length || !crypto.timingSafeEqual(want, got)) return null;
  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString());
    return payload.exp > Date.now() / 1000 ? payload : null;
  } catch {
    return null;
  }
}

export function sessionCookie(user) {
  return cookie(NAME, sign({ kind: "session", email: user.email, provider: user.provider }, DAYS * 86400), DAYS * 86400);
}

export function clearSessionCookie() {
  return cookie(NAME, "", 0);
}

export function currentUser(req) {
  const payload = verify(cookies(req)[NAME]);
  return payload?.kind === "session" ? { email: payload.email, provider: payload.provider } : null;
}

export function requireUser(req) {
  const user = currentUser(req);
  if (!user) throw httpError(401, "Sign in to download Litmus");
  return user;
}
