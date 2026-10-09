// POST /api/contact — "Talk to our FDE". Saved as a lead in the website database.
import { AGENT_KINDS } from "./_lib/agentKinds.js";
import { allow, recordLead } from "./_lib/db.js";
import { email as validEmail, oneOf, text } from "./_lib/forms.js";
import { clientIp, fail, httpError, readBody, send } from "./_lib/http.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return send(res, 405, { error: "Use POST" });
  try {
    const body = readBody(req);
    const lead = {
      name: text(body.name, "Name", { max: 120, required: true }),
      email: validEmail(body.email),
      company: text(body.company, "Company", { max: 160 }),
      agent_kind: oneOf(body.agent_kind, "Kind of agent", AGENT_KINDS),
      agent: text(body.agent, "Agent", { max: 300 }),
      message: text(body.message, "Message", { max: 4000, multiline: true }),
    };
    if (!(await allow("contact", clientIp(req), 10))) {
      throw httpError(429, "Too many requests from this network in the last hour. Try again later.");
    }
    await recordLead(lead);
    send(res, 200, { ok: true });
  } catch (err) {
    fail(res, err);
  }
}
