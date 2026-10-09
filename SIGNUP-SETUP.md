# Sign-up and download: one-time setup

Visitors sign in with Google, Microsoft (Outlook / Office 365) or a one-time email link. Their email is
recorded, and the download page opens. Each download is recorded too, and is served through a link
that expires after 10 minutes. Everything runs on **Supabase** (sign-in, database, file storage) and
two small **Vercel functions** in `api/`.

```
Sign up ─► Supabase Auth (Google | Microsoft | email link)
        ─► trigger records the email in public.signups
        ─► /download ─► /api/releases (lists installers)
                     ─► /api/download (records it in public.downloads, returns a signed link)
```

Until the environment variables in step 6 are set, the sign-up page says sign-in is not configured.
The rest of the site works as before.

## 1. Create the Supabase project
1. Go to <https://supabase.com>, then **New project**. A Mumbai region is closest to India.
2. **Plan:** the installers are about 150 MB each, and the **free plan caps any one file at 50 MB**.
   The project must be on **Pro**, which costs $25/month and allows files up to 500 GB.
3. Note three values. The first is under Project Settings → General, the other two under Project
   Settings → API Keys:
   - **Project URL**: `https://<ref>.supabase.co`
   - **anon / publishable key**: safe to put in the browser.
   - **service_role / secret key**: server only. Never commit it and never give it a `VITE_` prefix.

## 2. Create the tables
SQL Editor → New query → paste [`supabase/schema.sql`](supabase/schema.sql) → **Run**.

This creates:
- `signups` and `downloads`, both locked by row-level security so the browser can't read them.
- The trigger that records every new account.
- Two views, `signup_stats` and `downloads_by_file`.

## 3. Upload the installers
1. Storage → **New bucket**, named `installers`.
2. Leave **Public** off: downloads go through signed links only.
3. Create a folder `beta` and upload the installers from the GitHub release without renaming them.
   Names must follow `Litmus-<version>-<os>-<arch>.<ext>`, for example `Litmus-1.0.0-mac-arm64.dmg`,
   `Litmus-1.0.0-win-x64.exe` or `Litmus-1.0.0-linux-x86_64.AppImage`. Files named any other way are
   ignored.
4. **For a new build:** upload the new files and delete the old ones. The download page lists
   everything in `installers/beta`.

## 4. Sign-in settings
Authentication → **URL Configuration**:
- **Site URL:** the live site, for example `https://litmus-qk.vercel.app`.
- **Redirect URLs:** add the following:
  - `https://<live domain>/download`
  - `https://*-<vercel-team-slug>.vercel.app/download`, for preview deployments
  - `http://localhost:5190/download`, for local development

Authentication → Sign In / Providers → **Email**:
- Leave it enabled.
- **Before launch,** set up custom SMTP under Authentication → Emails → SMTP Settings, for example
  Resend, SendGrid or the company's Microsoft 365. Supabase's built-in sender only sends a few
  emails an hour and is meant for testing.

## 5. Google and Microsoft
Both providers use the same callback URL: `https://<ref>.supabase.co/auth/v1/callback`.

**Google** (<https://console.cloud.google.com>):
1. APIs & Services → **OAuth consent screen**. Choose External, give it the app name "Litmus" and a
   support email, then publish it.
2. Credentials → **Create credentials → OAuth client ID**, type Web application.
   - Authorized JavaScript origins: the live domain.
   - Authorized redirect URI: the callback URL above.
3. Copy the Client ID and Client secret into Supabase → Authentication → Providers → **Google**, then
   enable it.

**Microsoft** (<https://entra.microsoft.com>):
1. App registrations → **New registration**.
   - Supported account types: **Accounts in any organizational directory and personal Microsoft
     accounts**. This covers Outlook.com as well as work accounts.
   - Redirect URI: Web, set to the callback URL above.
2. Certificates & secrets → **New client secret**. Copy the secret's **Value** (not its ID).
3. Token configuration → **Add optional claim** → ID → `email`.
4. In Supabase → Authentication → Providers → **Azure**:
   - Client ID: the *Application (client) ID*.
   - Secret: the value from step 2.
   - Tenant URL: leave blank, so any Microsoft account can sign in.
   - Enable the provider.

## 6. Vercel environment variables
Vercel → project **litmus-qk** → Settings → Environment Variables. Set each for Production and
Preview:

| Name | Value | Where it is used |
|---|---|---|
| `VITE_SUPABASE_URL` | Project URL | browser |
| `VITE_SUPABASE_ANON_KEY` | anon / publishable key | browser |
| `SUPABASE_URL` | Project URL | `/api` functions |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role / secret key | `/api` functions only |
| `INSTALLERS_BUCKET` *(optional)* | `installers` | `/api` |
| `INSTALLERS_PREFIX` *(optional)* | `beta` | `/api` |

Then **redeploy**: `VITE_` values are baked in at build time. The functions need Node 22 or later,
which `package.json` already sets with `"engines": {"node": ">=22"}`. Under Node 20, supabase-js
refuses to start.

## 7. Check it end to end
1. In a private window, open the live site and click **Sign up**, then sign in with Google. You
   should land on the download page with your Mac's build first.
2. Click Download. The installer should start downloading.
3. Repeat with Microsoft, and with an email link.
4. In Supabase → SQL Editor, run `select * from signup_stats;`. It should show 3 signups and the
   downloads.

## Who signed up
- **Counts:** `select * from signup_stats;`
- **The list:** `select email, provider, created_at from signups order by created_at desc;`
  Use the Table Editor's **Export to CSV** to get it as a file.
- **Per installer:** `select * from downloads_by_file;`
