// POST /api/auth/email {email} — sends a one-time sign-in link (15 minutes) through Resend.
// Available only when RESEND_API_KEY and EMAIL_FROM are set; /api/me tells the page.
import { allow } from "../_lib/db.js";
import { clientIp, env, fail, httpError, origin, readBody, send } from "../_lib/http.js";
import { sign } from "../_lib/session.js";

const EMAIL = /^[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[a-z]{2,}$/i;

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST" });
  try {
    const email = String(readBody(req).email || "").trim().toLowerCase();
    if (!EMAIL.test(email) || email.length > 254) throw httpError(400, "Enter a valid email address");
    const key = env("RESEND_API_KEY");
    const from = env("EMAIL_FROM");
    if (!(await allow("email-link", email, 3)) || !(await allow("email-link-ip", clientIp(req), 10))) {
      throw httpError(429, "Too many sign-in emails. Wait an hour, or sign in with Google or Microsoft.");
    }
    const link = `${origin(req)}/api/auth/email-callback?token=${encodeURIComponent(sign({ kind: "email", email }, 900))}`;
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [email],
        subject: "Your Litmus sign-in link",
        text: `Open this link to sign in and download Litmus (it works for 15 minutes):\n\n${link}\n\nIf you didn't ask for this, ignore this email.`,
        html: `<p>Open this link to sign in and download Litmus. It works for 15 minutes.</p><p><a href="${link}">Sign in to Litmus</a></p><p style="color:#888">If you didn't ask for this, ignore this email.</p>`,
      }),
    });
    if (!resp.ok) throw httpError(502, `The email service refused to send (HTTP ${resp.status}): ${(await resp.text()).slice(0, 300)}`);
    send(res, 200, { sent: email });
  } catch (err) {
    fail(res, err);
  }
}
