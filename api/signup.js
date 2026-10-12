// POST /api/signup {name, email, company?} — the "Download our application" form. Records the
// sign-up and signs the visitor in, so the download page opens.
import { allow, recordSignIn } from "./_lib/db.js";
import { email as validEmail, text } from "./_lib/forms.js";
import { clientIp, fail, httpError, readBody, send } from "./_lib/http.js";
import { sessionCookie } from "./_lib/session.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST" });
  try {
    const body = readBody(req);
    const name = text(body.name, "Name", { max: 120, required: true });
    const email = validEmail(body.email);
    const company = text(body.company, "Company", { max: 160 });
    if (!(await allow("signup", clientIp(req), 20))) {
      throw httpError(429, "Too many sign-ups from this network in the last hour. Try again later.");
    }
    await recordSignIn(email, "form", { name, company });
    res.setHeader("Set-Cookie", [sessionCookie({ email, provider: "form" })]);
    send(res, 200, { user: { email, provider: "form" } });
  } catch (err) {
    fail(res, err);
  }
}
