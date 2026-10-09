// POST /api/download {file} — records the download, then returns GitHub's short-lived link to it.
// Only a file in the current release's listing can be asked for.
import { recordDownload } from "./_lib/db.js";
import { assetLink, latestRelease } from "./_lib/github.js";
import { fail, httpError, readBody, send } from "./_lib/http.js";
import { requireUser } from "./_lib/session.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST" });
  try {
    const user = requireUser(req);
    const file = String(readBody(req).file || "");
    const { tag, installers } = await latestRelease();
    const installer = installers.find((i) => i.file === file);
    if (!installer) throw httpError(404, `No installer named ${file || "(none)"} in the current release`);
    await recordDownload(user.email, `${tag}/${file}`);
    send(res, 200, { url: await assetLink(installer.id) });
  } catch (err) {
    fail(res, err);
  }
}
