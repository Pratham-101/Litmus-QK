// GET /api/auth/microsoft — off to Microsoft to sign in.
import { start } from "../_lib/oauth.js";
import { fail, redirect } from "../_lib/http.js";

export default function handler(req, res) {
  try {
    const { url, cookie } = start(req, "microsoft");
    redirect(res, url, [cookie]);
  } catch (err) {
    fail(res, err);
  }
}
