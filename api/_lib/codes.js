// Six-digit email codes, sent from a Gmail account (GMAIL_USER + GMAIL_APP_PASSWORD).
import crypto from "node:crypto";
import nodemailer from "nodemailer";
import { env, httpError } from "./http.js";

export function newCode() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

// Keyed with SESSION_SECRET, so a leaked table row can't be brute-forced offline.
export function hashCode(email, code) {
  return crypto.createHmac("sha256", env("SESSION_SECRET")).update(`${email}:${code}`).digest("hex");
}

let transport;
export function _useTransportForTests(t) { transport = t; }
export async function sendCode(email, code) {
  transport ??= nodemailer.createTransport({
    service: "gmail",
    auth: { user: env("GMAIL_USER"), pass: env("GMAIL_APP_PASSWORD") },
  });
  try {
    await transport.sendMail({
      from: `Litmus <${env("GMAIL_USER")}>`,
      to: email,
      subject: `${code} is your Litmus download code`,
      text: `Your Litmus download code is ${code}\n\nEnter it on the download page. It works for 10 minutes.\nIf you didn't ask for this, ignore this email.`,
      html: `<p>Your Litmus download code is</p><p style="font-size:28px;font-weight:700;letter-spacing:6px;font-family:monospace">${code}</p><p>Enter it on the download page. It works for 10 minutes.</p><p style="color:#888">If you didn't ask for this, ignore this email.</p>`,
    });
  } catch (err) {
    throw httpError(502, `The email could not be sent: ${err.message}`);
  }
}
