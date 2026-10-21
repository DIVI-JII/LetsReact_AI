import { query } from '../db.js';
import { HttpError } from '../lib/errors.js';

/**
 * Fixed-window counter stored in Postgres, so limits hold across restarts and across
 * several API instances. Counts this attempt, and throws 429 once `max` is exceeded.
 */
export async function enforce(key: string, max: number, windowSeconds: number): Promise<void> {
  const { rows } = await query<{ count: number; retry_after: number }>(
    `INSERT INTO rate_limits (key, count, window_start)
     VALUES ($1, 1, now())
     ON CONFLICT (key) DO UPDATE SET
       count = CASE
         WHEN rate_limits.window_start < now() - make_interval(secs => $2::double precision) THEN 1
         ELSE rate_limits.count + 1 END,
       window_start = CASE
         WHEN rate_limits.window_start < now() - make_interval(secs => $2::double precision) THEN now()
         ELSE rate_limits.window_start END
     RETURNING count,
       GREATEST(1, ceil(extract(epoch FROM (window_start + make_interval(secs => $2::double precision) - now()))))::int AS retry_after`,
    [key, windowSeconds],
  );
  const row = rows[0];
  if (row && row.count > max) {
    throw new HttpError(
      429,
      'rate_limited',
      'Too many attempts. Please wait a little and try again.',
      undefined,
      { 'Retry-After': String(row.retry_after) },
    );
  }
}

/** Forget a counter, e.g. after a successful login. */
export async function resetLimit(key: string): Promise<void> {
  await query(`DELETE FROM rate_limits WHERE key = $1`, [key]);
}
