// POST /api/logout
import { send } from "./_lib/http.js";
import { clearSessionCookie } from "./_lib/session.js";

export default function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST" });
  res.setHeader("Set-Cookie", [clearSessionCookie()]);
  send(res, 200, { ok: true });
}
