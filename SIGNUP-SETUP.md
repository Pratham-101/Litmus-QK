# Sign-up and download: how it works and how to configure it

Visitors sign in with **Google**, **Microsoft** (Outlook / Office 365) or **an email link**. Their
email is recorded, and the download page opens. Each download is recorded too.

```
Sign up ─► /api/auth/google | /api/auth/microsoft | /api/auth/email   (Vercel functions in api/)
        ─► email recorded in Postgres on Railway (table: signups)
        ─► /download ─► /api/releases   lists the installers on the latest GitHub release
                     ─► /api/download   records it (table: downloads), returns GitHub's 5-minute link
```

- **Storage:** Railway holds only the Postgres tables, a few kilobytes. The installers stay on the
  GitHub release that CI publishes in `qk-snapin-org/ai-eval`; they are never copied.
- **Missing settings:** a sign-in method appears only when its settings are present (see `/api/me`).
  With none set, the page says sign-up opens shortly. Nothing breaks.

## Settings (Vercel → project litmus-qk → Settings → Environment Variables)

| Name | What it is |
|---|---|
| `DATABASE_URL` | Railway Postgres → Variables → `DATABASE_PUBLIC_URL` |
| `SESSION_SECRET` | 64 random hex characters (`openssl rand -hex 32`); signs the session cookie |
| `SITE_URL` | the live site, e.g. `https://litmus-qk.vercel.app` (no trailing slash) |
| `GITHUB_REPO` | `qk-snapin-org/ai-eval` |
| `GITHUB_TOKEN` | fine-grained token: repository `qk-snapin-org/ai-eval`, permission **Contents: Read-only** |
| `RELEASE_TAG` *(optional)* | pin one release; default is the newest non-draft release with installers |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth client (below) |
| `MICROSOFT_CLIENT_ID` / `MICROSOFT_CLIENT_SECRET` | Microsoft app registration (below) |
| `RESEND_API_KEY` / `EMAIL_FROM` *(optional)* | turns on the email-link option, e.g. `Litmus <signup@yourdomain>` |

Redeploy after changing any of them. The functions need Node 22 or later, which `package.json`
sets.

## Google sign-in
<https://console.cloud.google.com> → APIs & Services.
1. **OAuth consent screen:** External, app name "Litmus", your support email. Publish it.
2. **Credentials → Create credentials → OAuth client ID.**
   - Type: Web application.
   - Authorized redirect URI: `<SITE_URL>/api/auth/google-callback`
3. Copy the client ID and secret.

## Microsoft sign-in
<https://entra.microsoft.com> → App registrations → **New registration**.
1. **Supported account types:** "Accounts in any organizational directory and personal Microsoft
   accounts".
2. **Redirect URI:** Web, `<SITE_URL>/api/auth/microsoft-callback`.
3. **Certificates & secrets → New client secret.** Copy its *Value*. The client ID is the
   *Application (client) ID*.

## Email link (optional)
1. Create a <https://resend.com> account.
2. Verify a domain you own, so the email can go to any address.
3. Create an API key, then set `RESEND_API_KEY` and `EMAIL_FROM`.

Each address can get 3 links an hour, and each IP address 10.

## Who signed up
Open Railway → the Postgres service → **Data**, or connect with any SQL client:

```sql
select count(*) from signups;                                            -- total sign-ups
select email, provider, first_seen from signups order by first_seen desc; -- the list
select file, count(*) from downloads group by file order by 2 desc;       -- downloads per installer
```

## A new build
Nothing to do. When Teja's workflow publishes a new release with installers, the download page
lists it within a minute.
