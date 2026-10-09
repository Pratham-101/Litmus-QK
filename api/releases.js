// GET /api/releases — the installers a signed-in visitor can download.
import { latestRelease } from "./_lib/github.js";
import { fail, send } from "./_lib/http.js";
import { requireUser } from "./_lib/session.js";

export default async function handler(req, res) {
  if (req.method !== "GET") return send(res, 405, { error: "Use GET" });
  try {
    requireUser(req);
    const { tag, installers } = await latestRelease();
    send(res, 200, { tag, installers: installers.map(({ id, ...rest }) => rest) });
  } catch (err) {
    fail(res, err);
  }
}
