// Validation for the public forms: trimmed, length-capped, and no control characters (so nothing
// typed here can break a header, a CSV export or a log line).
import { httpError } from "./http.js";

const EMAIL = /^[^\s@<>()"',;:]+@[^\s@<>()"',;:]+\.[a-z]{2,}$/i;
const CONTROL = /[\u0000-\u0008\u000b-\u001f\u007f]/;

export function text(value, label, { max = 200, required = false, multiline = false } = {}) {
  const s = String(value ?? "").trim();
  if (!s) {
    if (required) throw httpError(400, `${label} is required`);
    return null;
  }
  if (s.length > max) throw httpError(400, `${label} is too long (at most ${max} characters)`);
  if (CONTROL.test(s) || (!multiline && /[\r\n]/.test(s))) throw httpError(400, `${label} contains characters that aren't allowed`);
  return s;
}

export function email(value) {
  const s = text(value, "Email", { max: 254, required: true }).toLowerCase();
  if (!EMAIL.test(s)) throw httpError(400, "Enter a valid email address");
  return s;
}

export function oneOf(value, label, options) {
  const s = text(value, label, { max: 60 });
  if (s && !options.includes(s)) throw httpError(400, `${label}: choose one of the options`);
  return s;
}
