// The installers stay on the GitHub release where CI publishes them; nothing is copied or stored.
// After sign-in the server asks GitHub for the asset, and GitHub answers with a short-lived
// download link that the browser follows. The token never leaves the server.
import { env, httpError } from "./http.js";

// electron-builder's artifactName: Litmus-<version>-<os>-<arch>.<ext>
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

let cache = { at: 0, release: null };

async function gh(path, init = {}) {
  const resp = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${env("GITHUB_TOKEN")}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "litmus-website",
      ...(init.headers || {}),
    },
  });
  return resp;
}

// The newest release (pre-releases included) that carries installers, or RELEASE_TAG if pinned.
export async function latestRelease() {
  if (cache.release && Date.now() - cache.at < 60_000) return cache.release;
  const repo = env("GITHUB_REPO");
  const tag = process.env.RELEASE_TAG;
  const resp = await gh(tag ? `/repos/${repo}/releases/tags/${encodeURIComponent(tag)}` : `/repos/${repo}/releases?per_page=20`);
  const text = await resp.text();
  if (!resp.ok) throw httpError(502, `GitHub refused the release listing for ${repo} (HTTP ${resp.status}): ${text.slice(0, 300)}`);
  const body = JSON.parse(text);
  const releases = (Array.isArray(body) ? body : [body]).filter((r) => !r.draft);
  const release = releases.find((r) => r.assets.some((a) => NAME.test(a.name))) || null;
  const installers = release
    ? release.assets
      .map((a) => {
        const m = NAME.exec(a.name);
        if (!m) return null;
        const [, version, os, arch] = m;
        return { id: a.id, file: a.name, version, os, arch, label: LABEL[`${os}-${arch}`] || `${os} ${arch}`, bytes: a.size };
      })
      .filter(Boolean)
      .sort((x, y) => x.file.localeCompare(y.file))
    : [];
  cache = { at: Date.now(), release: { tag: release?.tag_name || null, installers } };
  return cache.release;
}

// GitHub's own short-lived link to the file (it answers the asset request with a redirect).
export async function assetLink(id) {
  const resp = await gh(`/repos/${env("GITHUB_REPO")}/releases/assets/${id}`, {
    headers: { Accept: "application/octet-stream" },
    redirect: "manual",
  });
  const location = resp.headers.get("location");
  if (resp.status >= 300 && resp.status < 400 && location) return location;
  const text = await resp.text();
  throw httpError(502, `GitHub did not hand out a download link (HTTP ${resp.status}): ${text.slice(0, 300)}`);
}
