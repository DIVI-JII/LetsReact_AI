# Security notes

## What the app does

| Area | Measure |
|---|---|
| Passwords | scrypt (N=2^15, r=8, p=3) with per-user salt; parameters stored with each hash and upgraded on login; NFKC-normalised; length 10-128; common-password and "contains your email/name" checks; constant-time compare; timing of unknown-email logins matched with a dummy hash |
| Sessions | Random 256-bit token in an `httpOnly`, `SameSite=Lax`, `Secure` cookie (`__Host-` prefix); only a SHA-256 hash is stored, so a database leak does not leak sessions; idle (7d) and absolute (14d) expiry; max 10 per user; password change/reset/disable revokes sessions; admins can sign a user out everywhere |
| CSRF | Origin / Sec-Fetch-Site check on every state-changing request, JSON-only bodies |
| Brute force | Postgres-backed rate limits per IP and per account on login, sign-up and sensitive actions; generic login errors |
| Authorization | Role and status are re-read from the database on every request; all `/api/admin` routes require an active admin; the UI guards are only convenience |
| Admin safety | Admins can only be created via the server CLI; role changes need the admin's password again; the last admin cannot be demoted or disabled; admins cannot change themselves in the UI |
| Accountability | Audit log of admin actions, failed logins and each time an admin opens a learner's record |
| Input | Strict zod schemas (unknown fields rejected), parameterised SQL only, LIKE-escaping, CSV formula-injection guard, 128 KB body limit |
| Transport/headers | HTTPS with HSTS (Vercel and Render terminate TLS); database connection over TLS when remote, strict CSP, nosniff, frame denial, no-store on API responses |
| Configuration | Environment validated at startup (zod); in production the API refuses to start with a non-https or localhost `APP_ORIGIN`; secrets only in Render/local env, never in Git or the browser bundle |
| AI tutor | Provider keys live only in server `.env`; the browser talks to `/api/tutor` which requires sign-in, is rate limited (8/min, 40/hour per learner by default), caps message size/history, and never logs message text. Scope is enforced server-side: the model returns a verdict, and refusals and "go learn module X" redirects are written by the server, not the model |
| Privacy | Learners are told activity is visible to admins; they can export and delete their data; activity events auto-expire (default 365 days) |

## What you still own

- **Keep `.env` files secret** and out of Git; keep keys only in Render's environment settings. Rotate any key that was ever exposed. Back up the database and test restores.
- **Keep dependencies current** (`npm audit`, Dependabot) and redeploy periodically.
- **Use a long, unique admin password**; restrict who can reach the database (Render's allowed-IP list).
- **No MFA yet.** For stronger admin protection, put the site behind a VPN or an SSO-aware proxy.

## Known limits (honest list)

- The tutor's scope control relies on an AI model following instructions. It is strong but not perfect: a determined user could occasionally coax an off-topic answer. It cannot access other users' data or your server, and cost is capped by rate limits. Learners' questions are sent to NVIDIA and Google, so mention that in your privacy notice and set spending limits on both keys.

- Progress is reported by the browser, so a technical learner could fake their own completions. Activity data is for coaching, not for certification or grading. Server-verified quizzes/challenges would be needed for that.
- No email, so no self-service password reset; admins reset via CLI. Sign-up reveals whether an email is already registered (a usability trade-off); rate limits reduce abuse.
- The CSP allows inline *styles* (needed by Framer Motion) but not inline scripts.
- Challenge code drafts are kept in the browser's local storage on that device.
- Review privacy obligations for your region (e.g. GDPR): publish a short privacy notice and decide your retention period.
- This code was written without being able to install dependencies or run the full stack in the build sandbox, so run `npm test` and click through the flows on a staging copy before real users arrive.
