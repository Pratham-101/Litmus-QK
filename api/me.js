// GET /api/me — who is signed in (or null), and whether sign-up is open on this deployment.
import { fail, send } from "./_lib/http.js";
import { currentUser } from "./_lib/session.js";

export default function handler(req, res) {
  try {
    const has = (...names) => names.every((n) => !!process.env[n]);
    send(res, 200, {
      user: process.env.SESSION_SECRET ? currentUser(req) : null,
      methods: { code: has("SESSION_SECRET", "DATABASE_URL", "SUPABASE_URL", "SUPABASE_ANON_KEY") },
    });
  } catch (err) {
    fail(res, err);
  }
}
