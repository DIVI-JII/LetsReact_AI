import { Router } from 'express';
import { config } from '../config.js';
import { query, withTx } from '../db.js';
import { HttpError } from '../lib/errors.js';
import { requireAuth, sessionCookieOptions } from '../middleware/auth.js';
import { verifyPassword } from '../security/password.js';
import { deleteAccountSchema } from '../security/validate.js';
import { recordAudit } from '../services/audit.js';
import { enforce } from '../services/rateLimit.js';

export const accountRouter = Router();
accountRouter.use(requireAuth);

// Everything the platform holds about the signed-in learner, as a download.
accountRouter.get('/export', async (req, res) => {
  const { user } = req.auth!;
  await enforce(`export:${user.id}`, 5, 3600);

  const [progress, events] = await Promise.all([
    query(`SELECT data, version, updated_at FROM progress WHERE user_id = $1`, [user.id]),
    query(`SELECT type, ref_id, detail, created_at FROM activity_events WHERE user_id = $1 ORDER BY id`, [user.id]),
  ]);

  res.setHeader('Content-Disposition', 'attachment; filename="LetsReact_AI-my-data.json"');
  res.json({
    exportedAt: new Date().toISOString(),
    account: { id: user.id, email: user.email, name: user.name, createdAt: user.createdAt },
    progress: progress.rows[0] ?? null,
    activity: events.rows,
  });
});

// Permanently deletes the account and everything attached to it.
accountRouter.delete('/', async (req, res) => {
  const { user } = req.auth!;
  await enforce(`delete-account:${user.id}`, 5, 900);
  const { password } = deleteAccountSchema.parse(req.body);

  const row = (await query<{ password_hash: string }>(`SELECT password_hash FROM users WHERE id = $1`, [user.id])).rows[0];
  if (!row || !(await verifyPassword(password, row.password_hash))) {
    throw new HttpError(403, 'bad_password', 'Your password is incorrect.', { password: 'Incorrect password' });
  }

  await withTx(async (client) => {
    if (user.role === 'admin') {
      const { rows } = await client.query<{ n: number }>(
        `SELECT count(*)::int AS n FROM users WHERE role = 'admin' AND status = 'active' AND id <> $1`,
        [user.id],
      );
      if (rows[0].n < 1) {
        throw new HttpError(409, 'last_admin', 'You are the only admin. Promote someone else first.');
      }
    }
    await recordAudit({ actorEmail: user.email, action: 'account_deleted', targetUserId: user.id, ip: req.ip }, client);
    await client.query(`DELETE FROM users WHERE id = $1`, [user.id]); // cascades to sessions, progress, activity
  });

  res.clearCookie(config.cookieName, sessionCookieOptions());
  res.status(204).end();
});
