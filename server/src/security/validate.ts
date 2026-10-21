import { z } from 'zod';
import { PASSWORD_MAX } from './passwordPolicy.js';

// ---------- Shared pieces ----------

export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .max(254, 'Email is too long')
  .email('Enter a valid email address');

export const nameSchema = z
  .string()
  .trim()
  .min(1, 'Enter your name')
  .max(80, 'Name is too long')
  // Reject control characters, which have no business in a display name.
  .refine((v) => !/[\u0000-\u001F\u007F]/.test(v), 'Name contains invalid characters');

/** Passwords are never trimmed or altered. Length is capped to bound hashing cost. */
export const passwordInput = z.string().min(1, 'Enter your password').max(PASSWORD_MAX, 'Password is too long');

export const uuidSchema = z.string().uuid();

// ---------- Auth ----------

export const registerSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: passwordInput,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordInput,
});

export const changePasswordSchema = z.object({
  currentPassword: passwordInput,
  newPassword: passwordInput,
});

export const deleteAccountSchema = z.object({ password: passwordInput });

// ---------- Progress (mirrors the frontend's Progress type) ----------

const id = z.string().regex(/^[a-z0-9][a-z0-9-]{0,63}$/, 'Invalid id');
const iso = z.string().max(40);

const quizResult = z.object({
  percent: z.number().min(0).max(100),
  completedAt: iso,
});

const activityItem = z.object({
  id: z.string().max(64),
  type: z.enum(['lesson', 'challenge', 'badge', 'project']),
  title: z.string().max(120),
  detail: z.string().max(120),
  at: iso,
});

const MAX_KEYS = 1000;

export const progressSchema = z
  .object({
    completedLessons: z.array(id).max(300),
    lessonSections: z.record(id, z.number().int().min(0).max(5)),
    quizResults: z.record(id, quizResult),
    completedChallenges: z.array(id).max(300),
    challengeAttempts: z.record(id, z.number().int().min(0).max(100_000)),
    projectRequirements: z.record(id, z.array(id).max(50)),
    earnedAchievements: z.array(id).max(200),
    activity: z.array(activityItem).max(50),
    minutesByDay: z.record(z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.number().min(0).max(1440)),
    notificationsRead: z.boolean(),
  })
  .strict()
  .refine(
    (p) =>
      [p.lessonSections, p.quizResults, p.challengeAttempts, p.projectRequirements, p.minutesByDay].every(
        (rec) => Object.keys(rec).length <= MAX_KEYS,
      ),
    'Too many entries',
  );

export type ProgressData = z.infer<typeof progressSchema>;

export const progressPutSchema = z.object({
  progress: progressSchema,
  baseVersion: z.number().int().min(0),
});

export const eventSchema = z.object({
  type: z.enum(['lesson_viewed', 'challenge_viewed', 'project_viewed']),
  refId: id,
});

// ---------- Admin ----------

export const adminListQuery = z.object({
  search: z.string().trim().max(100).optional(),
  status: z.enum(['active', 'disabled']).optional(),
  role: z.enum(['learner', 'admin']).optional(),
  sort: z.enum(['created', 'last_active', 'name', 'progress']).default('created'),
  dir: z.enum(['asc', 'desc']).default('desc'),
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
});

export const eventsQuery = z.object({
  before: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(40),
});

export const pageQuery = z.object({
  page: z.coerce.number().int().min(1).max(10_000).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(50),
});

export const patchUserSchema = z
  .object({
    status: z.enum(['active', 'disabled']).optional(),
    role: z.enum(['learner', 'admin']).optional(),
    /** The acting admin's own password. Required when changing a role. */
    adminPassword: passwordInput.optional(),
  })
  .refine((b) => b.status !== undefined || b.role !== undefined, 'Nothing to change');
