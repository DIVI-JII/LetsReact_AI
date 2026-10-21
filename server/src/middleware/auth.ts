import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { config } from '../config.js';
import { HttpError } from '../lib/errors.js';
import { findSession } from '../services/sessions.js';

export function readSessionToken(req: Request): string | undefined {
  const header = req.headers.cookie;
  if (!header) return undefined;
  for (const part of header.split(';')) {
    const eq = part.indexOf('=');
    if (eq < 0) continue;
    if (part.slice(0, eq).trim() === config.cookieName) {
      const value = part.slice(eq + 1).trim();
      // Tokens are 43 base64url characters. Reject anything else before touching the database.
      return /^[A-Za-z0-9_-]{43}$/.test(value) ? value : undefined;
    }
  }
  return undefined;
}

export function sessionCookieOptions(maxAgeMs?: number) {
  return {
    httpOnly: true, // not readable from JavaScript, so XSS cannot steal it
    secure: config.cookieSecure,
    sameSite: 'lax' as const,
    path: '/',
    ...(maxAgeMs !== undefined ? { maxAge: maxAgeMs } : {}),
  };
}

/** Attaches `req.auth` when the cookie holds a valid session. Never rejects by itself. */
export const loadAuth: RequestHandler = async (req: Request, _res: Response, next: NextFunction) => {
  const token = readSessionToken(req);
  if (token) {
    req.auth = (await findSession(token)) ?? undefined;
  }
  next();
};

export const requireAuth: RequestHandler = (req, _res, next) => {
  if (!req.auth) return next(new HttpError(401, 'unauthenticated', 'Please sign in to continue.'));
  next();
};

/** Role is read from the database on every request. Nothing the client sends can grant it. */
export const requireAdmin: RequestHandler = (req, _res, next) => {
  if (!req.auth) return next(new HttpError(401, 'unauthenticated', 'Please sign in to continue.'));
  if (req.auth.user.role !== 'admin') return next(new HttpError(403, 'forbidden', 'You don’t have access to this.'));
  next();
};
