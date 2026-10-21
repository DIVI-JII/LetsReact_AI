import { pool } from '../db.js';
import type { Queryable } from '../db.js';
import { log } from '../lib/logger.js';

export interface AuditEntry {
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  targetUserId?: string | null;
  detail?: Record<string, unknown>;
  ip?: string | null;
}

/**
 * Appends to the audit trail. Pass a transaction client to make the entry commit or
 * roll back together with the change it describes. Failures are logged, not thrown,
 * when using the shared pool so an audit hiccup never blocks a login.
 */
export async function recordAudit(entry: AuditEntry, db: Queryable = pool): Promise<void> {
  const run = () =>
    db.query(
      `INSERT INTO audit_log (actor_id, actor_email, action, target_user_id, detail, ip)
       VALUES ($1, $2, $3, $4, $5::jsonb, $6)`,
      [
        entry.actorId ?? null,
        entry.actorEmail ?? null,
        entry.action,
        entry.targetUserId ?? null,
        JSON.stringify(entry.detail ?? {}),
        entry.ip ?? null,
      ],
    );

  if (db !== pool) {
    await run(); // inside a transaction: let errors roll everything back
    return;
  }
  try {
    await run();
  } catch (err) {
    log.error('audit write failed', { action: entry.action, error: (err as Error).message });
  }
}
