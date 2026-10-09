// GET /api/auth/google — off to Google to sign in.
import { start } from "../_lib/oauth.js";
import { fail, redirect } from "../_lib/http.js";

export default function handler(req, res) {
  try {
    const { url, cookie } = start(req, "google");
    redirect(res, url, [cookie]);
  } catch (err) {
    fail(res, err);
  }
}
