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

// "Continue with Google", through Supabase Auth: Google's own sign-in page, back to this site with
// a one-time code (PKCE), which Supabase turns into a session; our /api/session then asks Supabase
// who it is before signing the visitor in.
import { createClient } from "@supabase/supabase-js";

let sb;
function supabase() {
  const url = import.meta.env.VITE_SUPABASE_URL, key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) throw new Error("Google sign-in is not configured on this deployment yet.");
  sb ??= createClient(url, key, { auth: { flowType: "pkce", persistSession: true, autoRefreshToken: false, detectSessionInUrl: false } });
  return sb;
}

// provider: "google" or "azure" (Microsoft). Both go through Supabase's OAuth; the return is
// handled by finishOAuthSignIn below, the same way for either provider.
const PROVIDER_LABEL = { google: "Google", azure: "Microsoft" };

export async function signInWith(provider, company) {
  try { sessionStorage.setItem("litmus.company", company || ""); } catch { /* private mode */ }
  const options = { redirectTo: window.location.origin, queryParams: { prompt: "select_account" } };
  // Microsoft personal accounts only return an email when it is asked for explicitly.
  if (provider === "azure") options.scopes = "openid email profile";
  const { error } = await supabase().auth.signInWithOAuth({ provider, options });
  if (error) throw new Error(`${PROVIDER_LABEL[provider] || provider} sign-in could not start: ${error.message || error.code || error.status}`);
}

// Called once at start-up: if a provider just sent the visitor back (?code=…), finish the sign-in.
// Returns true when a session was made, throws with Supabase's or the provider's words when not.
export async function finishOAuthSignIn() {
  const q = new URLSearchParams(window.location.search);
  const code = q.get("code"), err = q.get("error_description") || q.get("error");
  if (!code && !err) return false;
  window.history.replaceState(null, "", window.location.pathname + window.location.hash);
  if (err) throw new Error(`Sign-in was not completed: ${err}`);
  const { data, error } = await supabase().auth.exchangeCodeForSession(code);
  if (error) throw new Error(`Sign-in could not be confirmed: ${error.message || error.code || error.status}`);
  let company = "";
  try { company = sessionStorage.getItem("litmus.company") || ""; sessionStorage.removeItem("litmus.company"); } catch { /* ignore */ }
  await api("/api/session", { method: "POST", body: { accessToken: data.session.access_token, company } });
  await supabase().auth.signOut({ scope: "local" }); // our own cookie is the session from here on
  return true;
}

export function signOut() {
  return api("/api/logout", { method: "POST" });
}
