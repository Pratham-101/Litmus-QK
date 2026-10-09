// Server-side helpers shared by /api/releases and /api/download (Vercel functions).
// The service-role key lives only here, in Vercel's environment; it never reaches the browser.
import { createClient } from "@supabase/supabase-js";

export const BUCKET = process.env.INSTALLERS_BUCKET || "installers";
export const PREFIX = (process.env.INSTALLERS_PREFIX || "beta").replace(/^\/+|\/+$/g, "");
const LINK_SECONDS = 600; // a download link works for 10 minutes

export function admin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw httpError(500, "Server not configured: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in Vercel");
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

export function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// The signed-in user, from the page's access token. Supabase checks the token; we never trust the
// page's word for who it is.
export async function requireUser(req, sb) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (!token) throw httpError(401, "Sign in to download Litmus");
  const { data, error } = await sb.auth.getUser(token);
  if (error || !data?.user) throw httpError(401, `Your sign-in has expired or is not valid: ${error?.message || "no user"}`);
  return data.user;
}

// Installer names follow electron-builder's artifactName: Litmus-<version>-<os>-<arch>.<ext>
const NAME = /^Litmus-(\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?)-(mac|win|linux)-(arm64|x64|x86_64)\.(dmg|exe|AppImage)$/;
const LABEL = {
  "mac-arm64": "macOS · Apple silicon (M1–M4)",
  "mac-x64": "macOS · Intel",
  "win-x64": "Windows · x64",
  "win-arm64": "Windows · ARM",
  "linux-x86_64": "Linux · x64 (AppImage)",
  "linux-x64": "Linux · x64 (AppImage)",
  "linux-arm64": "Linux · ARM (AppImage)",
};

export async function listInstallers(sb) {
  const { data, error } = await sb.storage.from(BUCKET).list(PREFIX, { limit: 100 });
  if (error) throw httpError(502, `Supabase Storage refused the listing of ${BUCKET}/${PREFIX}: ${error.message}`);
  return (data || [])
    .map((o) => {
      const m = NAME.exec(o.name);
      if (!m) return null;
      const [, version, os, arch] = m;
      return {
        file: o.name,
        version,
        os,
        arch,
        label: LABEL[`${os}-${arch}`] || `${os} ${arch}`,
        bytes: o.metadata?.size ?? null,
      };
    })
    .filter(Boolean)
    .sort((a, b) => a.file.localeCompare(b.file));
}

export async function signedLink(sb, file) {
  const { data, error } = await sb.storage
    .from(BUCKET)
    .createSignedUrl(`${PREFIX}/${file}`, LINK_SECONDS, { download: file });
  if (error) throw httpError(502, `Supabase Storage could not sign ${file}: ${error.message}`);
  return data.signedUrl;
}

export function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export function fail(res, err) {
  send(res, err.status || 500, { error: err.message || String(err) });
}
