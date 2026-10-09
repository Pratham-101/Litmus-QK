// Small helpers shared by the /api functions. Files under api/_lib are not routes.

export function httpError(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

export function send(res, status, body) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(body));
}

export function fail(res, err) {
  if (!err.status) console.error(err);
  send(res, err.status || 500, { error: err.message || String(err) });
}

export function redirect(res, location, cookies = []) {
  res.statusCode = 302;
  if (cookies.length) res.setHeader("Set-Cookie", cookies);
  res.setHeader("Location", location);
  res.setHeader("Cache-Control", "no-store");
  res.end();
}

export function env(name) {
  const value = process.env[name];
  if (!value) throw httpError(500, `Server not configured: ${name} is not set`);
  return value;
}

// The site's own origin, for redirect URIs. SITE_URL pins it in production; otherwise it comes
// from the request (preview deployments, local `vercel dev`).
export function origin(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, "");
  const proto = req.headers["x-forwarded-proto"] || "https";
  return `${proto}://${req.headers["x-forwarded-host"] || req.headers.host}`;
}

export function clientIp(req) {
  return String(req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "").split(",")[0].trim();
}

export function readBody(req) {
  if (req.body && typeof req.body === "object") return req.body;
  if (typeof req.body === "string") return JSON.parse(req.body || "{}");
  return {};
}

export function cookies(req) {
  const out = {};
  for (const part of String(req.headers.cookie || "").split(";")) {
    const i = part.indexOf("=");
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

export function cookie(name, value, maxAgeSeconds) {
  const secure = process.env.NODE_ENV === "development" ? "" : "; Secure";
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secure}`;
}
