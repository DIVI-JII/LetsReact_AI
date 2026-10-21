import { Router } from 'express';
import type { Request, Response } from 'express';
import { config } from '../config.js';
import { query } from '../db.js';
import { HttpError } from '../lib/errors.js';
import { readSessionToken, requireAuth, sessionCookieOptions } from '../middleware/auth.js';
import { dummyHash, hashPassword, needsRehash, verifyPassword } from '../security/password.js';
import { checkPasswordPolicy } from '../security/passwordPolicy.js';
import { changePasswordSchema, loginSchema, registerSchema } from '../security/validate.js';
import { recordAudit } from '../services/audit.js';
import { enforce, resetLimit } from '../services/rateLimit.js';
import { createSession, deleteSessionByToken, deleteSessionsForUser } from '../services/sessions.js';

export const authRouter = Router();

interface UserRow {
  id: string;
  email: string;
  name: string;
  role: 'learner' | 'admin';
  status: 'active' | 'disabled';
  password_hash: string;
  created_at: Date;
}

function publicUser(u: Pick<UserRow, 'id' | 'email' | 'name' | 'role' | 'created_at'>) {
  return { id: u.id, email: u.email, name: u.name, role: u.role, createdAt: u.created_at };
}

async function startSession(req: Request, res: Response, userId: string): Promise<void> {
  const { token } = await createSession(userId, req.ip, req.get('user-agent'));
  res.cookie(config.cookieName, token, sessionCookieOptions(config.sessionTtlMs));
}

authRouter.post('/register', async (req, res) => {
  if (!config.ALLOW_REGISTRATION) {
    throw new HttpError(403, 'registration_closed', 'Sign-ups are closed. Ask your administrator for an account.');
  }
  await enforce(`register:ip:${req.ip}`, 10, 3600);

  const body = registerSchema.parse(req.body);
  const problem = checkPasswordPolicy(body.password, { email: body.email, name: body.name });
  if (problem) throw new HttpError(400, 'weak_password', problem, { password: problem });

  const hash = await hashPassword(body.password);
  let row: UserRow;
  try {
    // New accounts are always learners. There is no way to self-register as an admin.
    const result = await query<UserRow>(
      `INSERT INTO users (email, name, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, name, role, status, password_hash, created_at`,
      [body.email, body.name, hash],
    );
    row = result.rows[0];
  } catch (err) {
    if ((err as { code?: string }).code === '23505') {
      throw new HttpError(409, 'email_taken', 'An account with that email already exists. Try signing in.', {
        email: 'Already registered',
      });
    }
    throw err;
  }

  await query(`INSERT INTO activity_events (user_id, type) VALUES ($1, 'registered')`, [row.id]);
  await startSession(req, res, row.id);
  res.status(201).json({ user: publicUser(row) });
});

authRouter.post('/login', async (req, res) => {
  const { email, password } = loginSchema.parse(req.body);

  // Two independent limits: one per network address, one per target account.
  await enforce(`login:ip:${req.ip}`, 30, 900);
  await enforce(`login:email:${email}`, 10, 900);

  const row = (
    await query<UserRow>(
      `SELECT id, email, name, role, status, password_hash, created_at FROM users WHERE lower(email) = $1`,
      [email],
    )
  ).rows[0];

  // Always do the same amount of hashing work, whether or not the account exists.
  const passwordOk = await verifyPassword(password, row?.password_hash ?? (await dummyHash()));

  if (!row || !passwordOk || row.status !== 'active') {
    await recordAudit({
      actorId: row?.id ?? null,
      actorEmail: email,
      action: 'login_failed',
      targetUserId: row?.id ?? null,
      // Only an admin reading the audit log sees why. The caller always gets the same message.
      detail: { reason: !row ? 'unknown_email' : row.status !== 'active' ? 'disabled' : 'bad_password' },
      ip: req.ip,
    });
    throw new HttpError(401, 'invalid_credentials', 'Email or password is incorrect.');
  }

  if (needsRehash(row.password_hash)) {
    await query(`UPDATE users SET password_hash = $2 WHERE id = $1`, [row.id, await hashPassword(password)]);
  }

  await resetLimit(`login:email:${email}`);
  await query(`UPDATE users SET last_login_at = now(), last_active_at = now() WHERE id = $1`, [row.id]);
  await query(`INSERT INTO activity_events (user_id, type) VALUES ($1, 'login')`, [row.id]);
  await startSession(req, res, row.id); // always a fresh token, so session fixation is impossible

  res.json({ user: publicUser(row) });
});

authRouter.post('/logout', async (req, res) => {
  const token = readSessionToken(req);
  if (token) await deleteSessionByToken(token);
  res.clearCookie(config.cookieName, sessionCookieOptions());
  res.status(204).end();
});

authRouter.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.auth!.user });
});

authRouter.post('/change-password', requireAuth, async (req, res) => {
  const { user, sessionId } = req.auth!;
  await enforce(`chpw:${user.id}`, 5, 900);

  const body = changePasswordSchema.parse(req.body);
  const row = (await query<{ password_hash: string }>(`SELECT password_hash FROM users WHERE id = $1`, [user.id])).rows[0];
  if (!row || !(await verifyPassword(body.currentPassword, row.password_hash))) {
    throw new HttpError(403, 'bad_password', 'Your current password is incorrect.', {
      currentPassword: 'Incorrect password',
    });
  }
  if (body.newPassword === body.currentPassword) {
    throw new HttpError(400, 'same_password', 'Choose a password you haven’t used here before.', {
      newPassword: 'Must be different from your current password',
    });
  }
  const problem = checkPasswordPolicy(body.newPassword, { email: user.email, name: user.name });
  if (problem) throw new HttpError(400, 'weak_password', problem, { newPassword: problem });

  await query(`UPDATE users SET password_hash = $2, updated_at = now() WHERE id = $1`, [
    user.id,
    await hashPassword(body.newPassword),
  ]);
  // Sign out everywhere else, in case the old password was the thing that leaked.
  const revoked = await deleteSessionsForUser(user.id, sessionId);
  await recordAudit({
    actorId: user.id,
    actorEmail: user.email,
    action: 'password_changed',
    targetUserId: user.id,
    detail: { otherSessionsRevoked: revoked },
    ip: req.ip,
  });
  res.status(204).end();
});
