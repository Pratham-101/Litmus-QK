// POST /api/paper {slug, name, email, company?, role?} — the gate. Records the lead, then returns a
// 10-minute signed link to the PDF.
import { allow, recordPaperRequest } from "./_lib/db.js";
import { assertDeliverable } from "./_lib/emailCheck.js";
import { email as validEmail, text } from "./_lib/forms.js";
import { clientIp, fail, httpError, readBody, send } from "./_lib/http.js";
import { paperBySlug, signedPaperUrl } from "./_lib/papers.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST" });
  try {
    const body = readBody(req);
    const paper = paperBySlug(String(body.slug || ""));
    if (!paper) throw httpError(404, "Unknown paper");
    const lead = {
      paper: paper.slug,
      name: text(body.name, "Name", { max: 120, required: true }),
      email: validEmail(body.email),
      company: text(body.company, "Company", { max: 160 }),
      role: text(body.role, "Role", { max: 120 }),
    };
    await assertDeliverable(lead.email);
    if (!(await allow("paper", clientIp(req), 20))) {
      throw httpError(429, "Too many requests from this network in the last hour. Try again later.");
    }
    await recordPaperRequest(lead);
    send(res, 200, { url: await signedPaperUrl(paper.file), title: paper.title });
  } catch (err) {
    fail(res, err);
  }
}
