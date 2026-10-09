// GET /api/releases — the installers a signed-in user can download.
import { admin, fail, listInstallers, requireUser, send } from "./_supabase.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "Use GET" });
  try {
    const sb = admin();
    await requireUser(req, sb);
    send(res, 200, { installers: await listInstallers(sb) });
  } catch (err) {
    fail(res, err);
  }
}
