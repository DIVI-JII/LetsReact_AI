import { z } from 'zod';

const bool = z.enum(['true', 'false']).transform((v) => v === 'true');

const schema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  /** Comma-separated list of browser origins allowed to call the API. */
  APP_ORIGIN: z.string().default('http://localhost:5173'),
  /** Number of reverse proxies between the internet and the API. Render's load balancer is 1; Vercel rewriting to Render makes it 2. Needed for correct client IPs. */
  TRUST_PROXY: z.coerce.number().int().min(0).max(5).default(0),
  SESSION_TTL_HOURS: z.coerce.number().int().min(1).max(24 * 90).default(24 * 14),
  SESSION_IDLE_HOURS: z.coerce.number().int().min(1).max(24 * 90).default(24 * 7),
  ALLOW_REGISTRATION: bool.default('true'),
  /** Defaults to true in production. Set to "false" only for plain-HTTP LAN installs. */
  COOKIE_SECURE: bool.optional(),
  /** Delete activity events older than this many days. 0 keeps them forever. */
  EVENT_RETENTION_DAYS: z.coerce.number().int().min(0).max(3650).default(365),
  /** AI tutor. Primary provider is NVIDIA (OpenAI-compatible API); Gemini is the fallback. Either key alone is enough. */
  NVIDIA_API_KEY: z.string().trim().optional(),
  NVIDIA_MODEL: z.string().trim().default('meta/llama-3.3-70b-instruct'),
  NVIDIA_BASE_URL: z.string().trim().url().default('https://integrate.api.nvidia.com/v1'),
  GEMINI_API_KEY: z.string().trim().optional(),
  GEMINI_MODEL: z.string().trim().default('gemini-2.5-flash'),
  TUTOR_MAX_PER_HOUR: z.coerce.number().int().min(1).max(1000).default(40),
  /**
   * TLS to PostgreSQL. auto = off for localhost and Render's internal host (no dots), on for remote hosts in production.
   * require = encrypted, certificate not verified. verify = encrypted and certificate verified. disable = plain.
   */
  DB_SSL: z.enum(['auto', 'disable', 'require', 'verify']).default('auto'),
  DB_POOL_MAX: z.coerce.number().int().min(1).max(100).default(10),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  const problems = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
  console.error(`Invalid configuration:\n${problems}\nSee .env.example for the full list.`);
  process.exit(1);
}

const env = parsed.data;
const isProd = env.NODE_ENV === 'production';

// Fail fast on production settings that would break sign-in or leak data, rather than failing later at runtime.
if (isProd) {
  const problems: string[] = [];
  if (!/^postgres(ql)?:\/\//.test(env.DATABASE_URL)) problems.push('DATABASE_URL must start with postgres:// or postgresql://');
  const origins = env.APP_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
  if (origins.length === 0) problems.push('APP_ORIGIN must list the browser address of your frontend');
  for (const o of origins) {
    if (!/^https:\/\/[^/\s]+$/.test(o.replace(/\/+$/, ''))) problems.push(`APP_ORIGIN "${o}" must be an https origin without a path, e.g. https://your-app.vercel.app`);
    if (/localhost|127\.0\.0\.1/.test(o)) problems.push(`APP_ORIGIN "${o}" points at localhost`);
  }
  if (problems.length) {
    console.error(`Invalid production configuration:\n${problems.map((p) => `  - ${p}`).join('\n')}`);
    process.exit(1);
  }
}

export const config = {
  ...env,
  isProd,
  cookieSecure: env.COOKIE_SECURE ?? isProd,
  /** The `__Host-` prefix makes browsers refuse the cookie unless it is Secure and host-only. */
  cookieName: (env.COOKIE_SECURE ?? isProd) ? '__Host-rp_session' : 'rp_session',
  allowedOrigins: env.APP_ORIGIN.split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean),
  sessionTtlMs: env.SESSION_TTL_HOURS * 3600 * 1000,
  maxSessionsPerUser: 10,
  tutorEnabled: Boolean(env.NVIDIA_API_KEY || env.GEMINI_API_KEY),
} as const;
