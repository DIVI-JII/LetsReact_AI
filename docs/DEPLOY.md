# Deploying LetsReact_AI: GitHub + PostgreSQL + Render + Vercel

```
Browser ──► Vercel (React site, static files)
               └─ /api/*  rewritten ──► Render (Node + Express API) ──► Render PostgreSQL
```

The browser only ever talks to your Vercel address. Vercel forwards `/api/...` to Render, so the
session cookie stays first-party and the CSRF origin check keeps working. No code contains a backend URL.
Docker is not used anywhere.

## Folder layout

```
LetsReact_AI/
├── src/ public/ index.html        React frontend (Vite)
├── scripts/                       checkVercelConfig.mjs, genCurriculum.ts, backup.sh, restore.sh
├── server/                        Express + TypeScript API  (Render root directory)
│   ├── src/  migrations/  package.json  tsconfig.json  .env.example
├── vercel.json                    Vercel build, /api rewrite, security headers
├── render.yaml                    Optional Render Blueprint (database + API)
├── .github/workflows/ci.yml       Optional CI: build frontend, test backend
├── .env.example                   Frontend: needs no variables
└── docs/                          DEPLOY.md, SECURITY.md
```

## Environment variables

**Vercel (frontend): none.** Do not create `VITE_*` variables; they are public.

**Render (backend):**

| Variable | Required | Value / default |
|---|---|---|
| `DATABASE_URL` | yes | Render PostgreSQL **Internal Database URL** |
| `APP_ORIGIN` | yes | Exact browser address of the frontend, e.g. `https://your-app.vercel.app` (https, no trailing slash or path; several allowed, comma-separated) |
| `NODE_ENV` | yes | `production` |
| `NODE_VERSION` | yes (Render) | `22` |
| `TRUST_PROXY` | yes | `2` (Vercel + Render's load balancer). Use `1` if you skip Vercel's rewrite |
| `PORT` | no | Render sets it. Default 3000. Server binds `0.0.0.0` |
| `COOKIE_SECURE` | no | Defaults to true in production. Leave unset |
| `ALLOW_REGISTRATION` | no | `true`. Set `false` to close sign-ups |
| `SESSION_TTL_HOURS` / `SESSION_IDLE_HOURS` | no | `336` / `168` |
| `EVENT_RETENTION_DAYS` | no | `365` (0 = forever) |
| `DB_SSL` | no | `auto` (default), `disable`, `require`, `verify` |
| `DB_POOL_MAX` | no | `10` |
| `NVIDIA_API_KEY`, `NVIDIA_MODEL`, `NVIDIA_BASE_URL` | no | AI tutor primary. Model default `meta/llama-3.3-70b-instruct` |
| `GEMINI_API_KEY`, `GEMINI_MODEL` | no | AI tutor fallback. Model default `gemini-2.5-flash` |
| `TUTOR_MAX_PER_HOUR` | no | `40` |

The API refuses to start in production if `DATABASE_URL` is not a postgres URL, or `APP_ORIGIN` is
missing, not https, or points at localhost.

## Order of setup

### 1. GitHub

```bash
git init
git add .
git status          # check: no .env files listed; package-lock.json files ARE listed
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USER/LetsReact_AI.git
git push -u origin main
```

Create the empty repository on GitHub first (private is fine). `.gitignore` already excludes `.env`,
`node_modules`, `dist` and backups, and keeps `.env.example` files. Commit both `package-lock.json`
files (root and `server/`): Render and Vercel install from them.

If a `.env` was ever committed: `git rm --cached .env server/.env`, commit, and **rotate every key in it**
(removing it from history is a separate step; rotating is what protects you).

### 2. PostgreSQL on Render

1. Render dashboard → **New → PostgreSQL**. Name `LetsReact_AI-db`, pick a region, choose a **paid plan** for real
   users (Render's free database expires after 30 days).
2. When it is ready, copy the **Internal Database URL**. Use the same region for the API so it can use it.

### 3. API on Render

1. **New → Web Service** → connect the GitHub repository.
2. Settings:
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm ci --include=dev && npm run build`
     (`--include=dev` matters: Render sets `NODE_ENV=production`, which would skip TypeScript and fail the build)
   - **Start Command:** `npm start`
   - **Health Check Path:** `/api/health`
3. Environment: add the Render variables above. For `APP_ORIGIN` use your Vercel address; if you do not
   know it yet, put a placeholder and come back after step 4.
4. Deploy. Copy the service address, e.g. `https://LetsReact_AI-api.onrender.com`.

`npm start` runs `node dist/migrate.js && node dist/index.js`. Migrations are applied **before** the API starts,
inside a transaction each, guarded by a database lock, and recorded in `schema_migrations`, so they run once and
never reset or drop data. **First deployment = just deploying:** the first start creates the schema. Nothing to run by hand.
If a migration fails, the service exits and Render keeps the previous version running.

Prefer infrastructure as code? `render.yaml` describes the database and API; use **New → Blueprint**, then fill in
`APP_ORIGIN` and the AI keys.

### 4. Frontend on Vercel

1. Edit `vercel.json` and replace the placeholder in the first rewrite with your Render address:
   ```json
   { "source": "/api/:path*", "destination": "https://LetsReact_AI-api.onrender.com/api/:path*" }
   ```
   (Vercel needs the literal address here; it cannot read an environment variable in `rewrites`.)
   The build runs `node scripts/checkVercelConfig.mjs` first and **fails on purpose** while the placeholder remains.
2. Commit and push.
3. Vercel → **Add New → Project** → import the repository. Framework: Vite. Root directory: the repository root.
   Build command `npm run build:vercel` and output `dist` come from `vercel.json`. Add no environment variables.
4. Deploy, then copy the address Vercel gives you (or add your custom domain).
5. Back in Render, set `APP_ORIGIN` to that exact address (e.g. `https://LetsReact_AI.vercel.app`) and let it redeploy.
   If you use both a custom domain and the `.vercel.app` address, list both, comma-separated.

### 5. Create the first admin

Admins are only created from the server CLI. Render's shell is a paid feature, so the portable way is from your own
machine, pointing at the database's **External Database URL** (Render → database → Connections; add your IP to the
allowed list if you restricted access):

```powershell
cd server
$env:DATABASE_URL = "<External Database URL>"
$env:DB_SSL = "require"
npm run create-admin -- --email you@example.com --name "Your Name"
Remove-Item Env:DATABASE_URL
```

Variables set in the shell win over `server/.env`, so your local `.env` is not touched. On a paid plan with Render's
Shell you can instead run `npm run create-admin:prod -- --email you@example.com --name "Your Name"` there.

## Verification checklist

- [ ] `https://<render-host>/api/health` returns `{"status":"ok"}` (and 503 if the database is down).
- [ ] `https://<vercel-host>/api/health` returns the same, proving the rewrite works.
- [ ] Open the site; deep links such as `/course` survive a browser refresh (SPA fallback).
- [ ] Register a learner. The registration succeeds and you land on the dashboard.
- [ ] Reload the page and close/reopen the browser: still signed in (cookie `__Host-rp_session`, Secure, HttpOnly).
- [ ] Complete a lesson, refresh: progress is kept; sign in from another browser: same progress.
- [ ] Sign out, then sign in again. Change the password in Account.
- [ ] Sign in as the admin: `/admin` lists the learner and their activity.
- [ ] Account → Download my data works; delete a throwaway account works.
- [ ] Open a lesson, click **Ask the tutor**, ask something about the lesson: you get an answer. Ask about another module: you get a "go to that lesson" link. If it says "not switched on", add an AI key in Render. Render logs show `tutor provider failed` with the reason if a provider rejects the request.
- [ ] Render logs show no `blocked request from untrusted origin` (that means `APP_ORIGIN` is wrong) and no `TRUST_PROXY is 0` warning.

## Troubleshooting

| Symptom | Cause |
|---|---|
| Registration/login returns "Request blocked." | `APP_ORIGIN` does not exactly match the address in the browser bar (scheme, host, no trailing slash) |
| Site loads, every API call fails, Vercel build failed | `vercel.json` still has the placeholder |
| First request after idle takes ~50 s or times out | Render free web services sleep; use a paid instance for real users |
| `SSL/TLS required` or `self-signed certificate` | Use the Internal URL from Render, or set `DB_SSL=require` |
| `The server does not support SSL connections` | Set `DB_SSL=disable` (internal host) |
| Everyone is rate-limited together | `TRUST_PROXY` is 0; set it to `2` |
| Render build says `tsc: not found` | Build command is missing `--include=dev` |

## Backups

- Paid Render databases have managed daily backups and point-in-time recovery: turn them on and test a restore.
- Your own copy: `DATABASE_URL="<external url>" ./scripts/backup.sh` (needs `pg_dump`; use Git Bash or WSL on Windows).
  Dumps go to `backups/` (git-ignored); copy them off the machine.
- Restore into an **empty** database: `DATABASE_URL=... ./scripts/restore.sh backups/<file>.sql.gz`. Suspend the API first.
  The script never drops tables; it refuses to overwrite an existing schema.
- Before any migration that changes existing data, take a backup first.

## Updating

Push to `main`: Vercel and Render both redeploy. New migrations in `server/migrations/` run automatically before the
new API version starts. After changing lessons, run `npm run curriculum` and commit `server/src/data/curriculum.ts`.
