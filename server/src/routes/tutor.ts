import { Router } from 'express';
import { z } from 'zod';
import { config } from '../config.js';
import { HttpError } from '../lib/errors.js';
import { log } from '../lib/logger.js';
import { requireAuth } from '../middleware/auth.js';
import { enforce } from '../services/rateLimit.js';
import { findLesson, tutorReply } from '../services/tutor.js';

export const tutorRouter = Router();
tutorRouter.use(requireAuth);

const chatSchema = z
  .object({
    lessonId: z.string().min(1).max(64),
    // The last few turns are enough context. Limits keep cost and abuse bounded.
    messages: z
      .array(z.object({ role: z.enum(['user', 'assistant']), content: z.string().trim().min(1).max(1000) }).strict())
      .min(1)
      .max(10),
  })
  .strict()
  .refine((b) => b.messages[b.messages.length - 1].role === 'user', 'Last message must be from the learner');

tutorRouter.get('/status', (_req, res) => {
  res.json({ enabled: config.tutorEnabled });
});

tutorRouter.post('/chat', async (req, res) => {
  if (!config.tutorEnabled) throw new HttpError(503, 'tutor_disabled', 'The tutor isn’t set up on this server.');
  const userId = req.auth!.user.id;
  // Two limits: a short burst guard and an hourly budget, because each call costs money.
  await enforce(`tutor-burst:${userId}`, 8, 60);
  await enforce(`tutor:${userId}`, config.TUTOR_MAX_PER_HOUR, 3600);

  const body = chatSchema.parse(req.body);
  const lesson = findLesson(body.lessonId);
  if (!lesson) throw new HttpError(404, 'not_found', 'Lesson not found.');

  const reply = await tutorReply(lesson, body.messages);
  log.info('tutor reply', { kind: reply.kind, lesson: lesson.id });
  res.json(reply);
});
