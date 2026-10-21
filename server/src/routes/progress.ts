import { Router } from 'express';
import { query, withTx } from '../db.js';
import { HttpError } from '../lib/errors.js';
import { requireAuth } from '../middleware/auth.js';
import { eventSchema, progressPutSchema } from '../security/validate.js';
import type { ProgressData } from '../security/validate.js';
import { diffProgress } from '../services/events.js';
import { enforce } from '../services/rateLimit.js';

export const progressRouter = Router();
progressRouter.use(requireAuth);

progressRouter.get('/', async (req, res) => {
  const { rows } = await query<{ data: ProgressData; version: number }>(
    `SELECT data, version FROM progress WHERE user_id = $1`,
    [req.auth!.user.id],
  );
  res.json({ progress: rows[0]?.data ?? null, version: rows[0]?.version ?? 0 });
});

// Saves a full snapshot. `baseVersion` is the version the client last saw: if another
// device saved in between, the update is refused (409) instead of silently overwriting it.
progressRouter.put('/', async (req, res) => {
  const userId = req.auth!.user.id;
  await enforce(`progress:${userId}`, 120, 60);
  const body = progressPutSchema.parse(req.body);

  const version = await withTx(async (client) => {
    const prev =
      (await client.query<{ data: ProgressData }>(`SELECT data FROM progress WHERE user_id = $1 FOR UPDATE`, [userId]))
        .rows[0]?.data ?? null;

    const saved = await client.query<{ version: number }>(
      `INSERT INTO progress (user_id, data, version)
       VALUES ($1, $2::jsonb, 1)
       ON CONFLICT (user_id) DO UPDATE
         SET data = EXCLUDED.data, version = progress.version + 1, updated_at = now()
         WHERE progress.version = $3
       RETURNING version`,
      [userId, JSON.stringify(body.progress), body.baseVersion],
    );
    if (saved.rowCount === 0) {
      throw new HttpError(409, 'version_conflict', 'Your progress was updated on another device.');
    }

    const events = diffProgress(prev, body.progress);
    if (events.length > 0) {
      await client.query(
        `INSERT INTO activity_events (user_id, type, ref_id, detail)
         SELECT $1::uuid, e.t, e.r, e.d::jsonb
         FROM unnest($2::text[], $3::text[], $4::text[]) AS e(t, r, d)`,
        [userId, events.map((e) => e.type), events.map((e) => e.refId), events.map((e) => JSON.stringify(e.detail))],
      );
    }
    await client.query(`UPDATE users SET last_active_at = now() WHERE id = $1`, [userId]);
    return saved.rows[0].version;
  });

  res.json({ version });
});

export const eventsRouter = Router();
eventsRouter.use(requireAuth);

// Lightweight "the learner opened this" events. Types are a fixed whitelist.
eventsRouter.post('/', async (req, res) => {
  const userId = req.auth!.user.id;
  await enforce(`events:${userId}`, 120, 60);
  const body = eventSchema.parse(req.body);

  // Ignore repeats within 30 seconds so reloads and re-renders don't spam the feed.
  await query(
    `INSERT INTO activity_events (user_id, type, ref_id)
     SELECT $1::uuid, $2::text, $3::text
     WHERE NOT EXISTS (
       SELECT 1 FROM activity_events
       WHERE user_id = $1::uuid AND type = $2::text AND ref_id = $3::text
         AND created_at > now() - interval '30 seconds'
     )`,
    [userId, body.type, body.refId],
  );
  res.status(204).end();
});
