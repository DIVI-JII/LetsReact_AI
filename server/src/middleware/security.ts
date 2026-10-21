import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { config } from '../config.js';
import { HttpError } from '../lib/errors.js';
import { log } from '../lib/logger.js';

/** The API only returns JSON, so the strictest possible policy applies. */
export const securityHeaders: RequestHandler = (_req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'none'; frame-ancestors 'none'");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  // Responses hold personal data and must never be cached by a browser or proxy.
  res.setHeader('Cache-Control', 'no-store');
  if (config.cookieSecure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
};

const UNSAFE_METHODS = new Set(['POST', 'PUT', 'PATCH', 'DELETE']);

/**
 * CSRF defence, layered on top of SameSite=Lax cookies:
 *  1. If the browser sent an Origin header, it must be one we trust.
 *  2. Otherwise, if it sent Sec-Fetch-Site, the request must be same-origin (or user-initiated).
 * Requests with neither header come from non-browser clients, which cannot ride on a
 * victim's cookies. JSON-only bodies add a third layer, since a cross-site HTML form
 * cannot send application/json.
 */
export const originGuard: RequestHandler = (req: Request, _res: Response, next: NextFunction) => {
  if (!UNSAFE_METHODS.has(req.method)) return next();

  const origin = req.get('origin');
  if (origin) {
    if (!config.allowedOrigins.includes(origin.replace(/\/+$/, ''))) {
      log.warn('blocked request from untrusted origin', { origin, path: req.path });
      return next(new HttpError(403, 'bad_origin', 'Request blocked.'));
    }
    return next();
  }

  const site = req.get('sec-fetch-site');
  if (site && site !== 'same-origin' && site !== 'none') {
    return next(new HttpError(403, 'bad_origin', 'Request blocked.'));
  }
  next();
};

export const requestLogger: RequestHandler = (req, res, next) => {
  const started = process.hrtime.bigint();
  res.on('finish', () => {
    if (req.path === '/api/health') return;
    const ms = Number(process.hrtime.bigint() - started) / 1e6;
    log.info('request', {
      method: req.method,
      // Path only: query strings can contain search terms we don't need in logs.
      path: req.path,
      status: res.statusCode,
      ms: Math.round(ms),
      user: req.auth?.user.id,
    });
  });
  next();
};
