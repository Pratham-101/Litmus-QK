# Litmus

**The definitive test for production AI agents.** — by QualityKiosk

The marketing & product site for Litmus, the evaluation, observability, and
governance platform for production AI agents. Built on the CLAMP · PEST · GHTPWR
framework.

## Stack

- Vite + React (static SPA, hash routing)
- No backend — fully static, deploys anywhere

## Develop

```bash
npm install
npm run dev      # http://localhost:5190
```

## Build

```bash
npm run build    # outputs to dist/
```

## Deploy (Vercel)

Push to `main` — Vercel auto-builds. Settings:
- Framework preset: **Vite**
- Build command: `npm run build`
- Output directory: `dist`

`vercel.json` rewrites all routes to `index.html` for client-side routing.

## Config

The live evaluation tool URL (surfaced only via the Contact page "Launch live
demo" button) is set in `src/theme.js` → `LIVE_TOOL_URL`. Point it at the hosted
evaluation engine once deployed.
