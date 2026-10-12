// POST /api/auth/verify {email, code} — the code from the email; signs the visitor in.
import { checkCode, recordSignIn } from "../_lib/db.js";
import { hashCode } from "../_lib/codes.js";
import { email as validEmail } from "../_lib/forms.js";
import { fail, httpError, readBody, send } from "../_lib/http.js";
import { sessionCookie } from "../_lib/session.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST" });
  try {
    const body = readBody(req);
    const email = validEmail(body.email);
    const code = String(body.code || "").replace(/\s+/g, "");
    if (!/^\d{6}$/.test(code)) throw httpError(400, "Enter the 6-digit code from the email");
    const result = await checkCode(email, hashCode(email, code));
    if (!result.ok) throw httpError(400, result.reason);
    await recordSignIn(email, "email-code", { name: result.name, company: result.company });
    res.setHeader("Set-Cookie", [sessionCookie({ email, provider: "email-code" })]);
    send(res, 200, { user: { email, provider: "email-code" } });
  } catch (err) {
    fail(res, err);
  }
}
