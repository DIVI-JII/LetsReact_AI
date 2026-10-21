import { createApp } from './app.js';
import { config } from './config.js';
import { pool, query } from './db.js';
import { log } from './lib/logger.js';

if (config.isProd && !config.cookieSecure) {
  log.warn('COOKIE_SECURE is false in production: session cookies will travel over plain HTTP');
}

if (config.isProd && config.TRUST_PROXY === 0) {
  log.warn('TRUST_PROXY is 0 in production: behind Render every learner will look like one IP address to the rate limiter');
}

const app = createApp();
const server = app.listen(config.PORT, '0.0.0.0', () => {
  log.info('api listening', { port: config.PORT, env: config.NODE_ENV });
});

server.on('error', (err: Error) => {
  // Port in use, permission denied, etc. Exit non-zero so the host restarts or reports the failure.
  log.error('server error', { error: err.message });
  process.exit(1);
});

// Defensive timeouts against slow-connection attacks.
server.headersTimeout = 20_000;
server.requestTimeout = 30_000;
server.keepAliveTimeout = 65_000; // longer than typical proxy idle timeouts

// Hourly housekeeping: expired sessions, stale rate-limit counters, old activity.
async function maintenance(): Promise<void> {
  try {
    await query(`DELETE FROM sessions WHERE expires_at < now()`);
    await query(`DELETE FROM rate_limits WHERE window_start < now() - interval '1 day'`);
    if (config.EVENT_RETENTION_DAYS > 0) {
      await query(`DELETE FROM activity_events WHERE created_at < now() - make_interval(days => $1::int)`, [
        config.EVENT_RETENTION_DAYS,
      ]);
    }
  } catch (err) {
    log.error('maintenance failed', { error: (err as Error).message });
  }
}
void maintenance();
const timer = setInterval(() => void maintenance(), 60 * 60 * 1000);
timer.unref();

let stopping = false;
async function shutdown(signal: string): Promise<void> {
  if (stopping) return;
  stopping = true;
  log.info('shutting down', { signal });
  clearInterval(timer);
  server.close(async () => {
    await pool.end().catch(() => undefined);
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref(); // don't hang forever on stuck connections
}
process.on('SIGTERM', () => void shutdown('SIGTERM'));
process.on('SIGINT', () => void shutdown('SIGINT'));

// Crash loudly on programmer errors so the host restarts the service into a clean state.
process.on('unhandledRejection', (reason) => {
  log.error('unhandled rejection', { reason: reason instanceof Error ? reason.message : String(reason) });
  process.exit(1);
});
process.on('uncaughtException', (err) => {
  log.error('uncaught exception', { error: err.message });
  process.exit(1);
});
