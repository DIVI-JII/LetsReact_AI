import express from 'express';
import { config } from './config.js';
import { query } from './db.js';
import { loadAuth } from './middleware/auth.js';
import { errorHandler, notFound } from './middleware/errors.js';
import { originGuard, requestLogger, securityHeaders } from './middleware/security.js';
import { accountRouter } from './routes/account.js';
import { tutorRouter } from './routes/tutor.js';
import { adminRouter } from './routes/admin.js';
import { authRouter } from './routes/auth.js';
import { eventsRouter, progressRouter } from './routes/progress.js';

export function createApp(): express.Express {
  const app = express();

  app.disable('x-powered-by');
  // Trust exactly N proxy hops for the client IP (and no more), so X-Forwarded-For can't be spoofed.
  app.set('trust proxy', config.TRUST_PROXY);

  app.use(securityHeaders);
  app.use(requestLogger);
  app.use(originGuard);
  app.use(express.json({ limit: '128kb' }));
  app.use(loadAuth);

  app.get('/api/health', async (_req, res) => {
    try {
      await query('SELECT 1');
      res.json({ status: 'ok' });
    } catch {
      res.status(503).json({ status: 'unavailable' });
    }
  });

  app.use('/api/auth', authRouter);
  app.use('/api/progress', progressRouter);
  app.use('/api/events', eventsRouter);
  app.use('/api/account', accountRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/tutor', tutorRouter);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
