// The research papers offered on the site, and the signed-link helper. The PDFs live in a private
// Supabase Storage bucket; a link is handed out only after the lead form is filled.
import { createClient } from "@supabase/supabase-js";
import { env, httpError } from "./http.js";

export const PAPERS = [
  {
    slug: "production-eval",
    file: "production-eval.pdf",
    kind: "Working paper",
    date: "September 2026",
    title: "Evaluating AI Agents in Production",
    tagline: "Aggregate scores rank deployed agents correctly — and still cannot decide whether to ship them.",
    abstract:
      "Seven commissioned assessments of live production agents, each scored on two independent axes: a weighted "
      + "composite across quality dimensions, and pass/fail blocking criteria set from the client's own policy before "
      + "testing. Six of seven were blocked by a failed criterion while scoring at or near the top of the composite "
      + "range — every failure in a class where the cost is legal, safety or contractual, not answer quality. The case "
      + "for why an average is not a deployment decision, with the numbers to back it.",
    pages: 20,
  },
  {
    slug: "bridge-observability",
    file: "bridge-observability.pdf",
    kind: "Field report",
    date: "October 2026",
    title: "The Bridge Pattern for AI Observability",
    tagline: "Production agents fail in ways their own replies never disclose.",
    abstract:
      "Across 91,747 production tool calls, the dominant failures — exhausted context, missing resources, timeouts, "
      + "stale state — are invisible in the answer the agent returns, and the agents run inside vendor runtimes that "
      + "emit no telemetry of their own. We place a proxy in front of the runtime rather than inside it, reconstruct an "
      + "OpenInference trace from what an external observer can see, and surface failures the agent's own reply hid.",
    pages: 10,
  },
];

export function paperBySlug(slug) {
  return PAPERS.find((p) => p.slug === slug) || null;
}

export async function signedPaperUrl(file) {
  const url = env("SUPABASE_URL"), key = env("SUPABASE_SERVICE_ROLE_KEY");
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const { data, error } = await sb.storage.from("papers").createSignedUrl(file, 600, { download: file });
  if (error) throw httpError(502, `Could not prepare the paper link: ${error.message}`);
  return data.signedUrl;
}
