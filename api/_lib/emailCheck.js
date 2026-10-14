// Beyond "looks like an email": reject throwaway domains and domains that cannot receive mail.
// This stops temp-mail (mailinator, 10minutemail…) and typo/fake domains (@asdf123.com) — the
// obvious junk. It cannot prove the specific mailbox exists at a real domain (e.g. a made-up name
// at gmail.com); only sending a code/link or requiring sign-in proves that.
import dns from "node:dns/promises";
import { httpError } from "./http.js";

// Common disposable / test domains. Not exhaustive; it catches the usual ones.
const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com", "temp-mail.org",
  "yopmail.com", "trashmail.com", "throwawaymail.com", "getnada.com", "dispostable.com",
  "maildrop.cc", "mailnesia.com", "fakeinbox.com", "sharklasers.com", "grr.la", "spam4.me",
  "mohmal.com", "emailondeck.com", "mintemail.com", "mytemp.email", "burnermail.io",
  "example.com", "example.org", "test.com", "test.org", "email.com", "domain.com", "mail.com",
  "fake.com", "fakemail.com", "nomail.com", "none.com", "invalid.com", "asdf.com",
]);

export async function assertDeliverable(email) {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) throw httpError(400, "Enter a valid email address");
  if (DISPOSABLE.has(domain)) {
    throw httpError(400, "Please use a permanent work or personal email, not a temporary one.");
  }
  // The domain must be able to receive mail: an MX record, or at least a resolvable host.
  try {
    const mx = await dns.resolveMx(domain);
    if (mx && mx.length > 0) return;
  } catch { /* no MX — fall through to an A/AAAA check */ }
  try {
    await dns.resolve(domain); // A/AAAA; some small domains accept mail without a dedicated MX
  } catch {
    throw httpError(400, "That email domain can't receive mail — check the address.");
  }
}
