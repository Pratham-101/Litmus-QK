# Sign-up and download: how it works and how to configure it

**Sign up** opens "Download Litmus". The visitor must prove their email before the download opens:
- **Continue with Google**: Firebase Authentication shows Google's own sign-in, and the server
  verifies the token it returns.
- **Any other email** (Outlook, company): a 6-digit code is emailed from a Gmail account. It works
  once, for 10 minutes, with 5 tries.

**Talk to our FDE** saves the request as a lead. Sign-ups, downloads, leads and pending codes live
in a Postgres on Railway (project `litmus-website`).

## Settings (Vercel → project litmus-qk → Settings → Environment Variables)

| Name | What it is |
|---|---|
| `DATABASE_URL` | Railway Postgres → Variables → `DATABASE_PUBLIC_URL` |
| `SESSION_SECRET` | 64 random hex characters (`openssl rand -hex 32`); signs the session cookie |
| `SITE_URL` | the live site, e.g. `https://litmus-qk.vercel.app` (no trailing slash) |
| `GITHUB_REPO` | `qk-snapin-org/ai-eval` |
| `GITHUB_TOKEN` | fine-grained token: repository `qk-snapin-org/ai-eval`, permission **Contents: Read-only** |
| `RELEASE_TAG` *(optional)* | pin one release; default is the newest non-draft release with installers |
| `GMAIL_USER` / `GMAIL_APP_PASSWORD` | the Gmail that sends codes, and its 16-character app password |
| `FIREBASE_PROJECT_ID` | the Firebase project (server side, to verify Google sign-ins) |
| `VITE_FIREBASE_API_KEY` / `VITE_FIREBASE_AUTH_DOMAIN` / `VITE_FIREBASE_PROJECT_ID` / `VITE_FIREBASE_APP_ID` | the Firebase web app's config (public by design) |

Redeploy after changing any of them. The functions need Node 22 or later, which `package.json`
sets.

## Gmail for the codes
1. Use a Gmail account for Litmus, for example a new one such as `litmus.unitevals@gmail.com`.
2. Turn on **2-Step Verification**: <https://myaccount.google.com/signinoptions/twosv>
3. Create an **app password**: <https://myaccount.google.com/apppasswords>, name it "Litmus website".
4. Set `GMAIL_USER` (the address) and `GMAIL_APP_PASSWORD` (the 16 characters, spaces removed).

Gmail sends up to about 500 emails a day from one account.

## Google sign-in (Firebase)
1. Create a Firebase project and add a **Web app**. Its config gives the `VITE_FIREBASE_*` values.
2. Go to Authentication → **Sign-in method** → **Google** → Enable.
3. Go to Authentication → Settings → **Authorized domains**, and add `unitevals.com` and
   `www.unitevals.com`.

## Who signed up
Open Railway → the Postgres service → **Data**, or connect with any SQL client:

```sql
select name, email, company, agent_kind, agent, message, created_at from leads order by created_at desc; -- FDE requests
select count(*) from signups;                                            -- total sign-ups
select name, email, company, first_seen from signups order by first_seen desc; -- the list
select file, count(*) from downloads group by file order by 2 desc;       -- downloads per installer
```

## A new build
Nothing to do. When Teja's workflow publishes a new release with installers, the download page
lists it within a minute.
