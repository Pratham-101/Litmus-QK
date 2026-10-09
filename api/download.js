// POST /api/download {file} — records the download, then returns a 10-minute signed link.
// Only a file that is in the listing can be asked for, so the name can't reach outside the folder.
import { PREFIX, admin, fail, httpError, listInstallers, requireUser, send, signedLink } from "./_supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST" });
  try {
    const sb = admin();
    const user = await requireUser(req, sb);
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const file = String(body.file || "");
    const installers = await listInstallers(sb);
    if (!installers.some((i) => i.file === file)) throw httpError(404, `No installer named ${file || "(none)"}`);

    const { error } = await sb.from("downloads").insert({ user_id: user.id, email: user.email || "", file: `${PREFIX}/${file}` });
    if (error) throw httpError(502, `Could not record the download: ${error.message}`);

    send(res, 200, { url: await signedLink(sb, file) });
  } catch (err) {
    fail(res, err);
  }
}
