// POST /api/session {accessToken, company?} — after "Continue with Google" (through Supabase) in the
// page. Supabase itself is asked who the token belongs to; only a confirmed email signs in.
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
    const meta = user.user_metadata || {};
    const name = text(String(body.name ?? meta.full_name ?? meta.name ?? "").slice(0, 120), "Name", { max: 120 });
    const company = text(body.company ?? meta.company, "Company", { max: 160 });
    const provider = String(user.app_metadata?.provider || "supabase");
    await recordSignIn(email, provider, { name, company });
    res.setHeader("Set-Cookie", [sessionCookie({ email, provider })]);
    send(res, 200, { user: { email, provider } });
  } catch (err) {
    fail(res, err);
  }
}
