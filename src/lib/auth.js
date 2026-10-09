// Sign-in for the download page: Google, Microsoft (Outlook / Office 365) or a one-time email link,
// all through Supabase Auth. The anon key is public by design; the tables it could touch are
// locked by row-level security (supabase/schema.sql).
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

const url = import.meta.env.VITE_SUPABASE_URL;
const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const authConfigError = url && anon
  ? null
  : "Sign-in is not configured on this deployment (VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are missing).";

// PKCE: the provider sends the user back with ?code=… in the query string, which leaves the
// site's #/hash routes alone.
export const supabase = authConfigError
  ? null
  : createClient(url, anon, { auth: { flowType: "pkce", detectSessionInUrl: true, persistSession: true } });

// Where every sign-in method returns to: a real path, served by the SPA rewrite in vercel.json.
const returnTo = () => `${window.location.origin}/download`;

export async function signInWith(provider) {
  const options = { redirectTo: returnTo() };
  // Microsoft: ask for the email explicitly, or personal Outlook accounts can come back without one.
  if (provider === "azure") options.scopes = "email";
  const { error } = await supabase.auth.signInWithOAuth({ provider, options });
  if (error) throw error;
}

export async function emailLink(email) {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: returnTo(), shouldCreateUser: true },
  });
  if (error) throw error;
}

export async function signOut() {
  if (supabase) await supabase.auth.signOut();
}

// { loading, session } — follows sign-in and sign-out as they happen.
export function useSession() {
  const [state, setState] = useState({ loading: !!supabase, session: null });
  useEffect(() => {
    if (!supabase) return undefined;
    let live = true;
    supabase.auth.getSession().then(({ data }) => {
      if (live) setState({ loading: false, session: data.session });
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (live) setState({ loading: false, session });
    });
    return () => {
      live = false;
      sub.subscription.unsubscribe();
    };
  }, []);
  return state;
}

// Calls our own /api with the user's access token.
export async function api(path, { method = "GET", body, session }) {
  const resp = await fetch(path, {
    method,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
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
