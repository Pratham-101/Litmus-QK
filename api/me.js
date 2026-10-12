// GET /api/me — who is signed in (or null), and which sign-in methods this deployment offers.
import { fail, send } from "./_lib/http.js";
import { currentUser } from "./_lib/session.js";

export default function handler(req, res) {
  try {
    const has = (...names) => names.every((n) => !!process.env[n]);
    send(res, 200, {
      user: process.env.SESSION_SECRET ? currentUser(req) : null,
      methods: { form: has("SESSION_SECRET", "DATABASE_URL") },
    });
  } catch (err) {
    fail(res, err);
  }
}
