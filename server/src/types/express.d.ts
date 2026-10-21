import type { ActiveSession } from '../services/sessions.js';

declare global {
  namespace Express {
    interface Request {
      /** Set by the auth middleware when the request carries a valid session cookie. */
      auth?: ActiveSession;
    }
  }
}

export {};
