// GET /api/me — who is signed in (or null), and which sign-in methods this deployment offers.
// Google counts as on when the Supabase project has its Google provider enabled.
import { fail, send } from "./_lib/http.js";
import { currentUser } from "./_lib/session.js";

let google = { at: 0, on: false };
async function googleEnabled() {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return false;
  if (Date.now() - google.at < 60_000) return google.on;
  try {
    const resp = await fetch(`${url.replace(/\/+$/, "")}/auth/v1/settings`, { headers: { apikey: key } });
    const on = resp.ok && (await resp.json())?.external?.google === true;
    google = { at: Date.now(), on };
  } catch {
    google = { at: Date.now(), on: false };
  }
  return google.on;
}

export default async function handler(req, res) {
  try {
    const has = (...names) => names.every((n) => !!process.env[n]);
    const base = has("SESSION_SECRET", "DATABASE_URL");
    send(res, 200, {
      user: process.env.SESSION_SECRET ? currentUser(req) : null,
      methods: { google: base && (await googleEnabled()) },
    });
  } catch (err) {
    fail(res, err);
  }
}
