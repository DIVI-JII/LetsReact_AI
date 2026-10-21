import type { Progress } from './index';

export type Role = 'learner' | 'admin';
export type AccountStatus = 'active' | 'disabled';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface ProgressResponse {
  progress: Progress | null;
  version: number;
}

// ---------- Admin ----------

export interface AdminOverview {
  totals: {
    learners: number;
    active7: number;
    new7: number;
    disabled: number;
    lessonsCompleted: number;
    quizAverage: number;
  };
  dailyActive: { day: string; users: number }[];
  funnel: { lessonId: string; viewers: number; completers: number }[];
  completionBuckets: { bucket: string; count: number }[];
}

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: AccountStatus;
  createdAt: string;
  lastLoginAt: string | null;
  lastActiveAt: string | null;
  lessonsCompleted: number;
  challengesCompleted: number;
  quizAverage: number | null;
}

export interface AdminUsersResponse {
  users: AdminUserRow[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SessionInfo {
  id: string;
  createdAt: string;
  lastSeenAt: string;
  ip: string | null;
  userAgent: string | null;
}

export interface AdminUserDetail {
  user: AdminUserRow;
  progress: Progress | null;
  progressUpdatedAt: string | null;
  sessions: SessionInfo[];
}

export interface ActivityEvent {
  id: string;
  type: string;
  refId: string | null;
  detail: Record<string, unknown>;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  actorEmail: string | null;
  action: string;
  targetUserId: string | null;
  targetEmail: string | null;
  detail: Record<string, unknown>;
  ip: string | null;
  createdAt: string;
}
