import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { pool } from './db.js';
import { log } from './lib/logger.js';

const MIGRATIONS_DIR = fileURLToPath(new URL('../migrations/', import.meta.url));
// Arbitrary constant so two API instances starting together don't migrate at once.
const LOCK_ID = 727274;

export async function runMigrations(): Promise<number> {
  const client = await pool.connect();
  let applied = 0;
  try {
    await client.query('SELECT pg_advisory_lock($1)', [LOCK_ID]);
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        name       text PRIMARY KEY,
        applied_at timestamptz NOT NULL DEFAULT now()
      )`);

    const done = new Set(
      (await client.query<{ name: string }>('SELECT name FROM schema_migrations')).rows.map((r) => r.name),
    );
    const files = (await readdir(MIGRATIONS_DIR)).filter((f) => f.endsWith('.sql')).sort();

    for (const file of files) {
      if (done.has(file)) continue;
      const sql = await readFile(MIGRATIONS_DIR + file, 'utf8');
      try {
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
        await client.query('COMMIT');
        applied++;
        log.info('migration applied', { file });
      } catch (err) {
        await client.query('ROLLBACK');
        throw new Error(`Migration ${file} failed: ${(err as Error).message}`);
      }
    }
  } finally {
    try {
      await client.query('SELECT pg_advisory_unlock($1)', [LOCK_ID]);
    } finally {
      client.release();
    }
  }
  return applied;
}

// Run directly: `node dist/migrate.js`
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  runMigrations()
    .then(async (n) => {
      log.info(n === 0 ? 'database is up to date' : `applied ${n} migration(s)`);
      await pool.end();
    })
    .catch(async (err: Error) => {
      log.error('migration failed', { error: err.message });
      await pool.end().catch(() => undefined);
      process.exit(1);
    });
}
