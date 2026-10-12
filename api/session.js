// POST /api/session {accessToken, name?, company?} — after Supabase has confirmed the email code in
// the page. Supabase itself is asked who the token belongs to; only a confirmed email signs in.
import { recordSignIn } from "./_lib/db.js";
import { text } from "./_lib/forms.js";
import { env, fail, httpError, readBody, send } from "./_lib/http.js";
import { sessionCookie } from "./_lib/session.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST" });
  try {
    const body = readBody(req);
    const token = String(body.accessToken || "");
    if (!token) throw httpError(401, "Sign in first");
    const resp = await fetch(`${env("SUPABASE_URL").replace(/\/+$/, "")}/auth/v1/user`, {
      headers: { apikey: env("SUPABASE_ANON_KEY"), Authorization: `Bearer ${token}` },
    });
    const raw = await resp.text();
    if (!resp.ok) throw httpError(401, `Supabase did not accept the sign-in (HTTP ${resp.status}): ${raw.slice(0, 200)}`);
    const user = JSON.parse(raw);
    if (!user.email || !user.email_confirmed_at) throw httpError(401, "This email address has not been confirmed");
    const email = String(user.email).toLowerCase();
    const name = text(body.name ?? user.user_metadata?.name, "Name", { max: 120 });
    const company = text(body.company ?? user.user_metadata?.company, "Company", { max: 160 });
    await recordSignIn(email, "email-code", { name, company });
    res.setHeader("Set-Cookie", [sessionCookie({ email, provider: "email-code" })]);
    send(res, 200, { user: { email, provider: "email-code" } });
  } catch (err) {
    fail(res, err);
  }
}
