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

// Google and Microsoft are full-page redirects through our own /api.
export function signInWith(provider) {
  window.location.assign(`/api/auth/${provider}`);
}

export function emailLink(email) {
  return api("/api/auth/email", { method: "POST", body: { email } });
}

export function signOut() {
  return api("/api/logout", { method: "POST" });
}
