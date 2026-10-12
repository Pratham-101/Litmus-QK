// GET /api/me — who is signed in (or null), and which sign-in methods this deployment offers.
// A provider counts as on when the Supabase project has that provider enabled (its auth settings
// are read once a minute and cached).
import { fail, send } from "./_lib/http.js";
import { currentUser } from "./_lib/session.js";

let cache = { at: 0, external: {} };
async function externalProviders() {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_ANON_KEY;
  if (!url || !key) return {};
  if (Date.now() - cache.at < 60_000) return cache.external;
  try {
    const resp = await fetch(`${url.replace(/\/+$/, "")}/auth/v1/settings`, { headers: { apikey: key } });
    cache = { at: Date.now(), external: (resp.ok && (await resp.json())?.external) || {} };
  } catch {
    cache = { at: Date.now(), external: {} };
  }
  return cache.external;
}

export default async function handler(req, res) {
  try {
    const base = ["SESSION_SECRET", "DATABASE_URL"].every((n) => !!process.env[n]);
    const external = base ? await externalProviders() : {};
    send(res, 200, {
      user: process.env.SESSION_SECRET ? currentUser(req) : null,
      methods: {
        google: base && external.google === true,
        microsoft: base && external.azure === true,  // Supabase calls the Microsoft provider "azure"
      },
    });
  } catch (err) {
    fail(res, err);
  }
}
