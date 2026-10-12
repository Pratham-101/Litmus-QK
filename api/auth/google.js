// POST /api/auth/google {idToken, company?} — after "Continue with Google" (Firebase) in the page.
import { recordSignIn } from "../_lib/db.js";
import { verifyIdToken } from "../_lib/firebase.js";
import { text } from "../_lib/forms.js";
import { fail, readBody, send } from "../_lib/http.js";
import { sessionCookie } from "../_lib/session.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST" });
  try {
    const body = readBody(req);
    const user = await verifyIdToken(body.idToken);
    const company = text(body.company, "Company", { max: 160 });
    await recordSignIn(user.email, "google", { name: user.name ? user.name.slice(0, 120) : null, company });
    res.setHeader("Set-Cookie", [sessionCookie({ email: user.email, provider: "google" })]);
    send(res, 200, { user: { email: user.email, provider: "google" } });
  } catch (err) {
    fail(res, err);
  }
}
