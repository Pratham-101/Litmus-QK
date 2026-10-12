// Verifies a Firebase ID token (Google sign-in) against Google's published keys. No service
// account needed: the token's signature, issuer, audience and expiry are all checked here.
import { createRemoteJWKSet, jwtVerify } from "jose";
import { env, httpError } from "./http.js";

let keys = createRemoteJWKSet(new URL("https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com"));
export function _useKeysForTests(k) { keys = k; }

export async function verifyIdToken(token) {
  const project = env("FIREBASE_PROJECT_ID");
  let payload;
  try {
    ({ payload } = await jwtVerify(String(token || ""), keys, {
      issuer: `https://securetoken.google.com/${project}`,
      audience: project,
      algorithms: ["RS256"],
    }));
  } catch (err) {
    throw httpError(401, `Google sign-in could not be verified: ${err.message}`);
  }
  if (!payload.email || payload.email_verified !== true) {
    throw httpError(401, "This Google account has no verified email address");
  }
  return { email: String(payload.email).toLowerCase(), name: payload.name || null, provider: payload.firebase?.sign_in_provider || "google.com" };
}
