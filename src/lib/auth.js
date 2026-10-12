// The browser side of sign-in. The session lives in an httpOnly cookie the page can't read;
// /api/me says who is signed in and which sign-in methods this deployment offers.
import { useCallback, useEffect, useState } from "react";

export async function api(path, { method = "GET", body } = {}) {
  const resp = await fetch(path, {
    method,
    credentials: "same-origin",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await resp.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(`${path} answered HTTP ${resp.status} with something that is not JSON: ${text.slice(0, 200)}`);
  }
  if (!resp.ok) throw new Error(data.error || `${path} answered HTTP ${resp.status}`);
  return data;
}

// { loading, user, methods, error, refresh }
export function useMe() {
  const [state, setState] = useState({ loading: true, user: null, methods: null, error: null });
  const refresh = useCallback(() => {
    api("/api/me")
      .then((d) => setState({ loading: false, user: d.user, methods: d.methods, error: null }))
      .catch((e) => setState({ loading: false, user: null, methods: null, error: e.message }));
  }, []);
  useEffect(refresh, [refresh]);
  return { ...state, refresh };
}

// Email codes through Supabase Auth: Supabase sends a 6-digit code to the address and confirms it;
// the confirmed session is then handed to our /api/session, which asks Supabase again.
import { createClient } from "@supabase/supabase-js";

const SB_URL = import.meta.env.VITE_SUPABASE_URL;
const SB_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
let sb;
function supabase() {
  if (!SB_URL || !SB_KEY) throw new Error("Sign-up is not configured on this deployment yet.");
  sb ??= createClient(SB_URL, SB_KEY, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  return sb;
}

// Supabase's error objects don't always carry their text in `message` (a 500 from the email
// sender arrives as "{}"); find the words it did send, or say what we know.
function sbError(error, doing) {
  const words = [error?.message, error?.msg, error?.error_description, error?.code]
    .find((m) => typeof m === "string" && m.trim() && m.trim() !== "{}");
  const status = error?.status ? ` (HTTP ${error.status})` : "";
  return new Error(words ? `${words}${status}` : `Supabase could not ${doing}${status}`);
}

export async function sendCode({ name, email, company }) {
  const { error } = await supabase().auth.signInWithOtp({
    email: email.trim(),
    options: { shouldCreateUser: true, data: { name: name.trim(), company: company.trim() } },
  });
  if (error) {
    const err = sbError(error, "send the code email");
    if (error.status === 500) err.message = `The code email could not be sent: ${err.message}. Please try again in a few minutes.`;
    throw err;
  }
}

export async function verifyCode({ name, email, company }, code) {
  const { data, error } = await supabase().auth.verifyOtp({ email: email.trim(), token: code, type: "email" });
  if (error) throw sbError(error, "check the code");
  const accessToken = data.session?.access_token;
  if (!accessToken) throw new Error("Supabase confirmed the code but returned no session.");
  return api("/api/session", { method: "POST", body: { accessToken, name, company } });
}

export function signOut() {
  return api("/api/logout", { method: "POST" });
}
