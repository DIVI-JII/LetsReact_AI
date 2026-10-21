import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';
import { HttpError } from '../lib/errors.js';
import { log } from '../lib/logger.js';

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ error: { code: 'not_found', message: 'Not found.' } });
};

// Express 5 passes rejected promises from async handlers here automatically.
export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof HttpError) {
    if (err.headers) for (const [k, v] of Object.entries(err.headers)) res.setHeader(k, v);
    res.status(err.status).json({ error: { code: err.code, message: err.message, fields: err.fields } });
    return;
  }

  if (err instanceof ZodError) {
    const fields: Record<string, string> = {};
    for (const issue of err.issues) {
      const key = issue.path.join('.') || 'body';
      if (!(key in fields)) fields[key] = issue.message;
    }
    res.status(400).json({ error: { code: 'invalid_input', message: 'Please check the highlighted fields.', fields } });
    return;
  }

  // body-parser errors carry a status and a type.
  const known = err as { type?: string; status?: number };
  if (known.type === 'entity.too.large') {
    res.status(413).json({ error: { code: 'too_large', message: 'That request is too large.' } });
    return;
  }
  if (known.type === 'entity.parse.failed') {
    res.status(400).json({ error: { code: 'bad_json', message: 'The request body is not valid JSON.' } });
    return;
  }

  // Anything else is a bug or an outage. Log the detail, tell the caller nothing.
  log.error('unhandled error', {
    method: req.method,
    path: req.path,
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error && !process.env.NODE_ENV?.startsWith('prod') ? err.stack : undefined,
  });
  res.status(500).json({ error: { code: 'server_error', message: 'Something went wrong on our side. Please try again.' } });
};
