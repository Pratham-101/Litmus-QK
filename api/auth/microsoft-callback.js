// GET /api/auth/microsoft-callback — Microsoft sends the visitor back here.
import { finish } from "../_lib/oauth.js";
import { recordSignIn } from "../_lib/db.js";
import { sessionCookie } from "../_lib/session.js";
import { redirect } from "../_lib/http.js";

export default async function handler(req, res) {
  try {
    const user = await finish(req, "microsoft");
    await recordSignIn(user.email, user.provider);
    redirect(res, "/download", [sessionCookie(user), user.clearFlow]);
  } catch (err) {
    if (!err.status) console.error(err);
    redirect(res, `/signup?error=${encodeURIComponent(err.message || String(err))}`);
  }
}
