// POST /api/auth/code {name, email, company?} — emails a 6-digit code to prove the address is real.
import { allow, saveCode } from "../_lib/db.js";
import { hashCode, newCode, sendCode } from "../_lib/codes.js";
import { email as validEmail, text } from "../_lib/forms.js";
import { clientIp, fail, httpError, readBody, send } from "../_lib/http.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST" });
  try {
    const body = readBody(req);
    const name = text(body.name, "Name", { max: 120, required: true });
    const email = validEmail(body.email);
    const company = text(body.company, "Company", { max: 160 });
    if (!(await allow("code-email", email, 3)) || !(await allow("code-ip", clientIp(req), 10))) {
      throw httpError(429, "Too many codes requested. Wait an hour, or continue with Google.");
    }
    const code = newCode();
    await saveCode(email, hashCode(email, code), { name, company });
    await sendCode(email, code);
    send(res, 200, { sent: email });
  } catch (err) {
    fail(res, err);
  }
}
