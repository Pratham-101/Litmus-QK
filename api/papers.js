// GET /api/papers — the public catalogue (metadata only, no files).
import { PAPERS } from "./_lib/papers.js";
import { fail, send } from "./_lib/http.js";

export default function handler(req, res) {
  try {
    if (req.method !== "GET") return send(res, 405, { error: "Use GET" });
    send(res, 200, { papers: PAPERS.map(({ file, ...rest }) => rest) });
  } catch (err) {
    fail(res, err);
  }
}
