import { config } from '../config.js';
import { query } from '../db.js';
import { generateToken, hashToken } from '../security/tokens.js';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: 'learner' | 'admin';
  createdAt: Date;
}

export interface ActiveSession {
  sessionId: string;
  user: SessionUser;
}

export async function createSession(
  userId: string,
  ip: string | undefined,
  userAgent: string | undefined,
): Promise<{ token: string; expiresAt: Date }> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + config.sessionTtlMs);

  await query(
    `INSERT INTO sessions (user_id, token_hash, expires_at, ip, user_agent)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, hashToken(token), expiresAt, ip ?? null, (userAgent ?? '').slice(0, 300) || null],
  );

  // Keep only the newest sessions so abandoned logins don't pile up.
  await query(
    `DELETE FROM sessions
     WHERE id IN (
       SELECT id FROM sessions WHERE user_id = $1 ORDER BY created_at DESC OFFSET $2
     )`,
    [userId, config.maxSessionsPerUser],
  );

  return { token, expiresAt };
}

const TOUCH_AFTER_MS = 5 * 60 * 1000;

/**
 * Looks a session up by its cookie token. Disabled accounts, expired sessions and
 * idle sessions all return null. Every request re-reads the user's role and status
 * from the database, so demoting or disabling someone takes effect immediately.
 */
export async function findSession(token: string): Promise<ActiveSession | null> {
  const { rows } = await query<{
    session_id: string;
    last_seen_at: Date;
    id: string;
    email: string;
    name: string;
    role: 'learner' | 'admin';
    created_at: Date;
  }>(
    `SELECT s.id AS session_id, s.last_seen_at, u.id, u.email, u.name, u.role, u.created_at
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1
       AND s.expires_at > now()
       AND s.last_seen_at > now() - make_interval(hours => $2::int)
       AND u.status = 'active'`,
    [hashToken(token), config.SESSION_IDLE_HOURS],
  );
  const row = rows[0];
  if (!row) return null;

  if (Date.now() - row.last_seen_at.getTime() > TOUCH_AFTER_MS) {
    // Best effort: a failure here should not log the user out.
    query(`UPDATE sessions SET last_seen_at = now() WHERE id = $1`, [row.session_id]).catch(() => undefined);
    query(`UPDATE users SET last_active_at = now() WHERE id = $1`, [row.id]).catch(() => undefined);
  }

  return {
    sessionId: row.session_id,
    user: { id: row.id, email: row.email, name: row.name, role: row.role, createdAt: row.created_at },
  };
}

export async function deleteSessionByToken(token: string): Promise<void> {
  await query(`DELETE FROM sessions WHERE token_hash = $1`, [hashToken(token)]);
}

export async function deleteSessionsForUser(userId: string, exceptSessionId?: string): Promise<number> {
  const result = await query(
    `DELETE FROM sessions WHERE user_id = $1 AND ($2::uuid IS NULL OR id <> $2::uuid)`,
    [userId, exceptSessionId ?? null],
  );
  return result.rowCount ?? 0;
}
