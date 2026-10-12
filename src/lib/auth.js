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

// "Continue with Google": Firebase opens Google's own sign-in popup; our server then verifies the
// ID token it returns. Firebase is loaded only when the button is pressed.
const FIREBASE = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};
export const googleConfigured = !!(FIREBASE.apiKey && FIREBASE.authDomain && FIREBASE.projectId);

export async function signInWithGoogle(company) {
  const [{ initializeApp, getApps }, { getAuth, GoogleAuthProvider, signInWithPopup, signOut: fbSignOut }] =
    await Promise.all([import("firebase/app"), import("firebase/auth")]);
  const app = getApps()[0] || initializeApp(FIREBASE);
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  let result;
  try {
    result = await signInWithPopup(auth, provider);
  } catch (e) {
    if (e.code === "auth/popup-closed-by-user" || e.code === "auth/cancelled-popup-request") return null;
    if (e.code === "auth/popup-blocked") throw new Error("Your browser blocked the Google window. Allow pop-ups for this site and try again.");
    throw new Error(`Google sign-in failed: ${e.message}`);
  }
  const idToken = await result.user.getIdToken();
  await fbSignOut(auth); // our own cookie is the session from here on
  return api("/api/auth/google", { method: "POST", body: { idToken, company } });
}

export function sendCode({ name, email, company }) {
  return api("/api/auth/code", { method: "POST", body: { name, email, company } });
}

export function verifyCode(email, code) {
  return api("/api/auth/verify", { method: "POST", body: { email, code } });
}

export function signOut() {
  return api("/api/logout", { method: "POST" });
}
