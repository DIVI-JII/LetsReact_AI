import pg from 'pg';
import { config } from './config.js';
import { log } from './lib/logger.js';

/** TLS settings for the database connection. See DB_SSL in config.ts. */
function sslOption(): pg.PoolConfig['ssl'] {
  switch (config.DB_SSL) {
    case 'disable':
      return false;
    case 'require':
      return { rejectUnauthorized: false };
    case 'verify':
      return { rejectUnauthorized: true };
    default: {
      // The connection string already says what it wants (?sslmode=...): respect it.
      if (/[?&]sslmode=/.test(config.DATABASE_URL)) return undefined;
      let host = '';
      try {
        host = new URL(config.DATABASE_URL).hostname;
      } catch {
        return undefined;
      }
      const local = host === '' || host === 'localhost' || host === '::1' || host.startsWith('127.');
      // Render's internal hostname has no dots; its external one does, and requires TLS.
      return config.isProd && !local && host.includes('.') ? { rejectUnauthorized: false } : undefined;
    }
  }
}

export const pool = new pg.Pool({
  connectionString: config.DATABASE_URL,
  ssl: sslOption(),
  max: config.DB_POOL_MAX,
  idleTimeoutMillis: 30_000,
  connectionTimeoutMillis: 5_000,
  statement_timeout: 15_000,
  application_name: 'LetsReact_AI-api',
});

pool.on('error', (err) => {
  // An idle client dropped. The pool replaces it, so just record it.
  log.error('db pool error', { error: err.message });
});

export type Queryable = pg.Pool | pg.PoolClient;

export function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params?: unknown[],
): Promise<pg.QueryResult<T>> {
  return pool.query<T>(text, params);
}

/** Runs `fn` in a transaction. Rolls back if it throws. */
export async function withTx<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    try {
      await client.query('ROLLBACK');
    } catch {
      // The connection is already broken; releasing it below discards it.
    }
    throw err;
  } finally {
    client.release();
  }
}
