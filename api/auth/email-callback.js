// GET /api/auth/email-callback?token=… — the link in the sign-in email.
import { recordSignIn } from "../_lib/db.js";
import { redirect } from "../_lib/http.js";
import { sessionCookie, verify } from "../_lib/session.js";

export default async function handler(req, res) {
  try {
    const token = new URL(req.url, "http://x").searchParams.get("token");
    const payload = verify(token);
    if (!payload || payload.kind !== "email") {
      return redirect(res, `/signup?error=${encodeURIComponent("This sign-in link has expired or is not valid. Ask for a new one.")}`);
    }
    const user = { email: payload.email, provider: "email" };
    await recordSignIn(user.email, user.provider);
    redirect(res, "/download", [sessionCookie(user)]);
  } catch (err) {
    if (!err.status) console.error(err);
    redirect(res, `/signup?error=${encodeURIComponent(err.message || String(err))}`);
  }
}
