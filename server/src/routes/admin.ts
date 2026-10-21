import { Router } from 'express';
import { query, withTx } from '../db.js';
import { HttpError } from '../lib/errors.js';
import { toCsv } from '../lib/csv.js';
import { escapeLike } from '../lib/like.js';
import { requireAdmin } from '../middleware/auth.js';
import { verifyPassword } from '../security/password.js';
import {
  adminListQuery,
  eventsQuery,
  pageQuery,
  patchUserSchema,
  uuidSchema,
} from '../security/validate.js';
import { recordAudit } from '../services/audit.js';
import { enforce } from '../services/rateLimit.js';
import { deleteSessionsForUser } from '../services/sessions.js';

// Every route below requires a signed-in admin. The role is re-read from the database
// on each request, so a demoted or disabled admin loses access immediately.
export const adminRouter = Router();
adminRouter.use(requireAdmin);

// ---------- Overview ----------

adminRouter.get('/overview', async (_req, res) => {
  const [totals, lessons, quiz, daily, funnel, buckets] = await Promise.all([
    query<{ learners: number; active7: number; new7: number; disabled: number }>(
      `SELECT
         count(*) FILTER (WHERE role = 'learner')::int AS learners,
         count(*) FILTER (WHERE role = 'learner' AND last_active_at >= now() - interval '7 days')::int AS active7,
         count(*) FILTER (WHERE role = 'learner' AND created_at >= now() - interval '7 days')::int AS new7,
         count(*) FILTER (WHERE status = 'disabled')::int AS disabled
       FROM users`,
    ),
    query<{ n: number }>(
      `SELECT coalesce(sum(jsonb_array_length(data->'completedLessons')), 0)::int AS n FROM progress`,
    ),
    query<{ avg: number }>(
      `SELECT coalesce(round(avg((q.v->>'percent')::numeric)), 0)::int AS avg
       FROM progress p
       CROSS JOIN LATERAL jsonb_each(p.data->'quizResults') AS q(k, v)`,
    ),
    query<{ day: string; users: number }>(
      `SELECT to_char(d::date, 'YYYY-MM-DD') AS day, coalesce(c.users, 0)::int AS users
       FROM generate_series(current_date - 13, current_date, interval '1 day') AS d
       LEFT JOIN (
         SELECT created_at::date AS day, count(DISTINCT user_id) AS users
         FROM activity_events
         WHERE created_at >= current_date - 13
         GROUP BY 1
       ) c ON c.day = d::date
       ORDER BY d`,
    ),
    query<{ lesson_id: string; viewers: number; completers: number }>(
      `SELECT ref_id AS lesson_id,
              count(DISTINCT user_id) FILTER (WHERE type = 'lesson_viewed')::int AS viewers,
              count(DISTINCT user_id) FILTER (WHERE type = 'lesson_completed')::int AS completers
       FROM activity_events
       WHERE ref_id IS NOT NULL AND type IN ('lesson_viewed', 'lesson_completed')
       GROUP BY ref_id`,
    ),
    query<{ bucket: string; count: number }>(
      `SELECT bucket, count(*)::int AS count
       FROM (
         SELECT CASE
                  WHEN n = 0 THEN '0'
                  WHEN n <= 5 THEN '1-5'
                  WHEN n <= 10 THEN '6-10'
                  WHEN n <= 20 THEN '11-20'
                  ELSE '21+'
                END AS bucket
         FROM (
           SELECT coalesce(jsonb_array_length(p.data->'completedLessons'), 0) AS n
           FROM users u LEFT JOIN progress p ON p.user_id = u.id
           WHERE u.role = 'learner'
         ) x
       ) y
       GROUP BY bucket`,
    ),
  ]);

  res.json({
    totals: {
      ...totals.rows[0],
      lessonsCompleted: lessons.rows[0].n,
      quizAverage: quiz.rows[0].avg,
    },
    dailyActive: daily.rows,
    funnel: funnel.rows.map((r) => ({ lessonId: r.lesson_id, viewers: r.viewers, completers: r.completers })),
    completionBuckets: buckets.rows,
  });
});

// ---------- Users ----------

const USER_COLUMNS = `
  u.id, u.name, u.email, u.role, u.status, u.created_at, u.last_login_at, u.last_active_at,
  coalesce(jsonb_array_length(p.data->'completedLessons'), 0)::int AS lessons_completed,
  coalesce(jsonb_array_length(p.data->'completedChallenges'), 0)::int AS challenges_completed,
  (SELECT round(avg((q.v->>'percent')::numeric))::int
     FROM jsonb_each(coalesce(p.data->'quizResults', '{}'::jsonb)) AS q(k, v)) AS quiz_avg`;

interface UserListRow {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  created_at: Date;
  last_login_at: Date | null;
  last_active_at: Date | null;
  lessons_completed: number;
  challenges_completed: number;
  quiz_avg: number | null;
  total?: number;
}

function mapUser(r: UserListRow) {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    status: r.status,
    createdAt: r.created_at,
    lastLoginAt: r.last_login_at,
    lastActiveAt: r.last_active_at,
    lessonsCompleted: r.lessons_completed,
    challengesCompleted: r.challenges_completed,
    quizAverage: r.quiz_avg,
  };
}

function buildFilter(q: { search?: string; status?: string; role?: string }) {
  const where: string[] = [];
  const params: unknown[] = [];
  if (q.search) {
    params.push(`%${escapeLike(q.search)}%`);
    where.push(`(u.email ILIKE $${params.length} ESCAPE '\\' OR u.name ILIKE $${params.length} ESCAPE '\\')`);
  }
  if (q.status) {
    params.push(q.status);
    where.push(`u.status = $${params.length}`);
  }
  if (q.role) {
    params.push(q.role);
    where.push(`u.role = $${params.length}`);
  }
  return { sql: where.length ? `WHERE ${where.join(' AND ')}` : '', params };
}

const SORTS = {
  created: 'u.created_at',
  last_active: 'u.last_active_at',
  name: 'lower(u.name)',
  progress: 'lessons_completed',
} as const;

adminRouter.get('/users', async (req, res) => {
  const q = adminListQuery.parse(req.query);
  const { sql: whereSql, params } = buildFilter(q);
  const dir = q.dir === 'asc' ? 'ASC' : 'DESC';
  const nulls = q.sort === 'last_active' ? ' NULLS LAST' : '';

  params.push(q.pageSize, (q.page - 1) * q.pageSize);
  const { rows } = await query<UserListRow>(
    `SELECT ${USER_COLUMNS}, count(*) OVER()::int AS total
     FROM users u LEFT JOIN progress p ON p.user_id = u.id
     ${whereSql}
     ORDER BY ${SORTS[q.sort]} ${dir}${nulls}, u.id
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params,
  );

  res.json({ users: rows.map(mapUser), total: rows[0]?.total ?? 0, page: q.page, pageSize: q.pageSize });
});

adminRouter.get('/users/:id', async (req, res) => {
  const id = uuidSchema.parse(req.params.id);
  const { rows } = await query<UserListRow>(
    `SELECT ${USER_COLUMNS} FROM users u LEFT JOIN progress p ON p.user_id = u.id WHERE u.id = $1`,
    [id],
  );
  if (!rows[0]) throw new HttpError(404, 'not_found', 'User not found.');

  const [progress, sessions] = await Promise.all([
    query<{ data: unknown; updated_at: Date }>(`SELECT data, updated_at FROM progress WHERE user_id = $1`, [id]),
    query<{ id: string; created_at: Date; last_seen_at: Date; ip: string | null; user_agent: string | null }>(
      `SELECT id, created_at, last_seen_at, ip, left(user_agent, 200) AS user_agent
       FROM sessions WHERE user_id = $1 AND expires_at > now()
       ORDER BY last_seen_at DESC LIMIT 20`,
      [id],
    ),
  ]);

  // Opening a learner's record is itself recorded, so admin access is accountable.
  await recordAudit({
    actorId: req.auth!.user.id,
    actorEmail: req.auth!.user.email,
    action: 'view_user',
    targetUserId: id,
    ip: req.ip,
  });

  res.json({
    user: mapUser(rows[0]),
    progress: progress.rows[0]?.data ?? null,
    progressUpdatedAt: progress.rows[0]?.updated_at ?? null,
    sessions: sessions.rows.map((s) => ({
      id: s.id,
      createdAt: s.created_at,
      lastSeenAt: s.last_seen_at,
      ip: s.ip,
      userAgent: s.user_agent,
    })),
  });
});

// Keyset pagination: pass the smallest id you have as `before` to load older events.
adminRouter.get('/users/:id/events', async (req, res) => {
  const id = uuidSchema.parse(req.params.id);
  const q = eventsQuery.parse(req.query);
  const { rows } = await query<{ id: string; type: string; ref_id: string | null; detail: unknown; created_at: Date }>(
    `SELECT id, type, ref_id, detail, created_at
     FROM activity_events
     WHERE user_id = $1 AND ($2::bigint IS NULL OR id < $2::bigint)
     ORDER BY id DESC
     LIMIT $3`,
    [id, q.before ?? null, q.limit + 1],
  );
  const hasMore = rows.length > q.limit;
  res.json({
    events: rows.slice(0, q.limit).map((e) => ({
      id: e.id,
      type: e.type,
      refId: e.ref_id,
      detail: e.detail,
      createdAt: e.created_at,
    })),
    hasMore,
  });
});

adminRouter.patch('/users/:id', async (req, res) => {
  const id = uuidSchema.parse(req.params.id);
  const body = patchUserSchema.parse(req.body);
  const actor = req.auth!.user;

  if (id === actor.id) {
    throw new HttpError(400, 'self_change', 'You can’t change your own role or status here.');
  }

  // Changing a role needs the admin's own password again (step-up authentication),
  // so a hijacked browser session alone cannot mint new admins.
  if (body.role !== undefined) {
    await enforce(`stepup:${actor.id}`, 5, 900);
    if (!body.adminPassword) {
      throw new HttpError(400, 'password_required', 'Enter your password to change a role.', {
        adminPassword: 'Required',
      });
    }
    const row = (await query<{ password_hash: string }>(`SELECT password_hash FROM users WHERE id = $1`, [actor.id])).rows[0];
    if (!row || !(await verifyPassword(body.adminPassword, row.password_hash))) {
      await recordAudit({
        actorId: actor.id,
        actorEmail: actor.email,
        action: 'stepup_failed',
        targetUserId: id,
        ip: req.ip,
      });
      throw new HttpError(403, 'bad_password', 'Your password is incorrect.', { adminPassword: 'Incorrect password' });
    }
  }

  const result = await withTx(async (client) => {
    const current = (
      await client.query<{ id: string; role: 'learner' | 'admin'; status: 'active' | 'disabled' }>(
        `SELECT id, role, status FROM users WHERE id = $1 FOR UPDATE`,
        [id],
      )
    ).rows[0];
    if (!current) throw new HttpError(404, 'not_found', 'User not found.');

    const nextRole = body.role ?? current.role;
    const nextStatus = body.status ?? current.status;

    // Never allow the last active admin to be demoted or disabled.
    const losesAdmin =
      current.role === 'admin' && current.status === 'active' && (nextRole !== 'admin' || nextStatus !== 'active');
    if (losesAdmin) {
      const { rows } = await client.query<{ n: number }>(
        `SELECT count(*)::int AS n FROM users WHERE role = 'admin' AND status = 'active' AND id <> $1`,
        [id],
      );
      if (rows[0].n < 1) throw new HttpError(409, 'last_admin', 'At least one active admin must remain.');
    }

    await client.query(`UPDATE users SET role = $2, status = $3, updated_at = now() WHERE id = $1`, [
      id,
      nextRole,
      nextStatus,
    ]);
    if (nextStatus === 'disabled') await client.query(`DELETE FROM sessions WHERE user_id = $1`, [id]);

    await recordAudit(
      {
        actorId: actor.id,
        actorEmail: actor.email,
        action: nextRole !== current.role ? 'role_changed' : nextStatus === 'disabled' ? 'user_disabled' : 'user_enabled',
        targetUserId: id,
        detail: { from: { role: current.role, status: current.status }, to: { role: nextRole, status: nextStatus } },
        ip: req.ip,
      },
      client,
    );
    return { id, role: nextRole, status: nextStatus };
  });

  res.json(result);
});

adminRouter.post('/users/:id/revoke-sessions', async (req, res) => {
  const id = uuidSchema.parse(req.params.id);
  const exists = (await query(`SELECT 1 FROM users WHERE id = $1`, [id])).rowCount;
  if (!exists) throw new HttpError(404, 'not_found', 'User not found.');

  const revoked = await deleteSessionsForUser(id);
  await recordAudit({
    actorId: req.auth!.user.id,
    actorEmail: req.auth!.user.email,
    action: 'sessions_revoked',
    targetUserId: id,
    detail: { count: revoked },
    ip: req.ip,
  });
  res.json({ revoked });
});

// ---------- Export and audit ----------

adminRouter.get('/export/users.csv', async (req, res) => {
  await enforce(`export-csv:${req.auth!.user.id}`, 10, 3600);
  const { rows } = await query<UserListRow>(
    `SELECT ${USER_COLUMNS}
     FROM users u LEFT JOIN progress p ON p.user_id = u.id
     ORDER BY u.created_at
     LIMIT 50000`,
  );

  const csv = toCsv(
    ['Name', 'Email', 'Role', 'Status', 'Joined', 'Last login', 'Last active', 'Lessons completed', 'Challenges completed', 'Average quiz score'],
    rows.map((r) => [
      r.name,
      r.email,
      r.role,
      r.status,
      r.created_at,
      r.last_login_at,
      r.last_active_at,
      r.lessons_completed,
      r.challenges_completed,
      r.quiz_avg,
    ]),
  );

  await recordAudit({
    actorId: req.auth!.user.id,
    actorEmail: req.auth!.user.email,
    action: 'export_users',
    detail: { rows: rows.length },
    ip: req.ip,
  });

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', `attachment; filename="LetsReact_AI-users-${new Date().toISOString().slice(0, 10)}.csv"`);
  res.send(csv);
});

adminRouter.get('/audit', async (req, res) => {
  const q = pageQuery.parse(req.query);
  const { rows } = await query<{
    id: string;
    actor_email: string | null;
    action: string;
    target_user_id: string | null;
    target_email: string | null;
    detail: unknown;
    ip: string | null;
    created_at: Date;
    total: number;
  }>(
    `SELECT a.id, a.actor_email, a.action, a.target_user_id, t.email AS target_email,
            a.detail, a.ip, a.created_at, count(*) OVER()::int AS total
     FROM audit_log a
     LEFT JOIN users t ON t.id = a.target_user_id
     ORDER BY a.id DESC
     LIMIT $1 OFFSET $2`,
    [q.pageSize, (q.page - 1) * q.pageSize],
  );

  res.json({
    entries: rows.map((r) => ({
      id: r.id,
      actorEmail: r.actor_email,
      action: r.action,
      targetUserId: r.target_user_id,
      targetEmail: r.target_email,
      detail: r.detail,
      ip: r.ip,
      createdAt: r.created_at,
    })),
    total: rows[0]?.total ?? 0,
    page: q.page,
    pageSize: q.pageSize,
  });
});
