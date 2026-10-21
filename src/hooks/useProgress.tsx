import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { createEmptyProgress } from '../data/emptyProgress';
import { getAchievement, getLesson } from '../data';
import { ApiError, api } from '../lib/api';
import type { ActivityItem, Progress } from '../types';
import type { ProgressResponse } from '../types/api';
import { evaluateAchievements } from '../utils/achievements';
import { todayKey } from '../utils/date';
import { useAuth } from './useAuth';

export type SyncStatus = 'idle' | 'saving' | 'saved' | 'error' | 'conflict';

interface ProgressContextValue {
  progress: Progress;
  /** False until the signed-in learner's saved progress has been loaded. */
  ready: boolean;
  syncStatus: SyncStatus;
  setSectionsDone: (lessonId: string, count: number) => void;
  saveQuiz: (lessonId: string, percent: number) => void;
  completeLesson: (lessonId: string) => void;
  recordChallengeAttempt: (challengeId: string) => void;
  completeChallenge: (challengeId: string, title: string) => void;
  toggleRequirement: (projectId: string, requirementId: string) => void;
  /** Replace the finished requirements of a project. Pass completedTitle when every requirement is met. */
  setRequirementsDone: (projectId: string, ids: string[], completedTitle?: string) => void;
  markNotificationsRead: () => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

const SAVE_DELAY_MS = 800;
const RETRY_DELAY_MS = 5000;

function uid(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function addMinutes(p: Progress, minutes: number): Progress {
  const key = todayKey();
  return { ...p, minutesByDay: { ...p.minutesByDay, [key]: (p.minutesByDay[key] ?? 0) + minutes } };
}

function addActivity(p: Progress, item: Omit<ActivityItem, 'id' | 'at'>): Progress {
  const entry: ActivityItem = { ...item, id: uid(), at: new Date().toISOString() };
  return { ...p, activity: [entry, ...p.activity].slice(0, 30) };
}

/** After any change, award badges the learner has newly earned. */
function withAchievements(next: Progress): Progress {
  const fresh = evaluateAchievements(next).filter((id) => !next.earnedAchievements.includes(id));
  if (fresh.length === 0) return next;
  let result: Progress = { ...next, earnedAchievements: [...next.earnedAchievements, ...fresh] };
  for (const id of fresh) {
    result = addActivity(result, {
      type: 'badge',
      title: `${getAchievement(id)?.title ?? id} Badge`,
      detail: 'Badge earned',
    });
  }
  return result;
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, status } = useAuth();
  const userId = user?.id ?? null;

  const [progress, setProgress] = useState<Progress>(createEmptyProgress);
  const [ready, setReady] = useState(false);
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');

  // Mutable bookkeeping for saving. Refs, because changing them must not re-render.
  const latest = useRef(progress);
  latest.current = progress;
  const userIdRef = useRef(userId);
  userIdRef.current = userId;
  const version = useRef(0); // the server version this tab last saw
  const savedJson = useRef(''); // what the server currently has, to skip no-op saves
  const dirty = useRef(false);
  const inFlight = useRef(false);
  const timer = useRef<number | undefined>(undefined);
  const flushRef = useRef<(keepalive?: boolean) => Promise<void>>(async () => undefined);

  const schedule = useCallback((delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => void flushRef.current(), delay);
  }, []);

  flushRef.current = async (keepalive = false) => {
    if (!userIdRef.current || !dirty.current || inFlight.current) return;

    const snapshot = latest.current;
    const json = JSON.stringify(snapshot);
    if (json === savedJson.current) {
      dirty.current = false;
      return;
    }

    dirty.current = false;
    inFlight.current = true;
    setSyncStatus('saving');
    let retryIn = SAVE_DELAY_MS;
    try {
      const res = await api.put<{ version: number }>(
        '/api/progress',
        { progress: snapshot, baseVersion: version.current },
        { keepalive },
      );
      version.current = res.version;
      savedJson.current = json;
      setSyncStatus(dirty.current ? 'saving' : 'saved');
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        // Another device saved first. The server's copy wins; adopt it instead of overwriting.
        try {
          const res = await api.get<ProgressResponse>('/api/progress');
          const next = res.progress ?? createEmptyProgress();
          version.current = res.version;
          savedJson.current = JSON.stringify(next);
          dirty.current = false;
          setProgress(next);
          setSyncStatus('conflict');
        } catch {
          dirty.current = true;
          setSyncStatus('error');
          retryIn = RETRY_DELAY_MS;
        }
      } else {
        dirty.current = true;
        setSyncStatus('error');
        retryIn = RETRY_DELAY_MS;
      }
    } finally {
      inFlight.current = false;
      if (dirty.current) schedule(retryIn);
    }
  };

  // Load the learner's saved progress whenever the signed-in user changes.
  useEffect(() => {
    if (status !== 'ready') return;
    window.clearTimeout(timer.current);
    dirty.current = false;

    if (!userId) {
      setProgress(createEmptyProgress());
      version.current = 0;
      savedJson.current = '';
      setSyncStatus('idle');
      setReady(true);
      return;
    }

    let cancelled = false;
    setReady(false);
    api
      .get<ProgressResponse>('/api/progress')
      .then((res) => {
        if (cancelled) return;
        const data = res.progress ?? createEmptyProgress();
        version.current = res.version;
        savedJson.current = JSON.stringify(data);
        setProgress(data);
        setSyncStatus('idle');
        setReady(true);
      })
      .catch(() => {
        if (cancelled) return;
        // Let the app open. If the server later reports a newer version, saving will adopt it.
        setSyncStatus('error');
        setReady(true);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, status]);

  // Don't lose the last few seconds of work when the tab is hidden or closed.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === 'hidden') {
        window.clearTimeout(timer.current);
        void flushRef.current(true);
      }
    };
    const onPageHide = () => void flushRef.current(true);
    document.addEventListener('visibilitychange', onHide);
    window.addEventListener('pagehide', onPageHide);
    return () => {
      document.removeEventListener('visibilitychange', onHide);
      window.removeEventListener('pagehide', onPageHide);
      window.clearTimeout(timer.current);
    };
  }, []);

  const update = useCallback(
    (fn: (p: Progress) => Progress) => {
      dirty.current = true;
      setProgress((prev) => withAchievements(fn(prev)));
      schedule(SAVE_DELAY_MS);
    },
    [schedule],
  );

  const setSectionsDone = useCallback(
    (lessonId: string, count: number) =>
      update((p) => {
        const current = p.lessonSections[lessonId] ?? 0;
        if (count <= current) return p;
        return addMinutes({ ...p, lessonSections: { ...p.lessonSections, [lessonId]: count } }, 2);
      }),
    [update],
  );

  const saveQuiz = useCallback(
    (lessonId: string, percent: number) =>
      update((p) => {
        const best = Math.max(percent, p.quizResults[lessonId]?.percent ?? 0);
        return {
          ...p,
          quizResults: {
            ...p.quizResults,
            [lessonId]: { percent: best, completedAt: new Date().toISOString() },
          },
        };
      }),
    [update],
  );

  const completeLesson = useCallback(
    (lessonId: string) =>
      update((p) => {
        if (p.completedLessons.includes(lessonId)) return p;
        const lesson = getLesson(lessonId);
        const score = p.quizResults[lessonId]?.percent;
        const next: Progress = {
          ...p,
          completedLessons: [...p.completedLessons, lessonId],
          lessonSections: { ...p.lessonSections, [lessonId]: 5 },
        };
        return addActivity(addMinutes(next, lesson?.minutes ?? 10), {
          type: 'lesson',
          title: lesson?.title ?? lessonId,
          detail: score !== undefined ? `Score ${score}%` : 'Completed',
        });
      }),
    [update],
  );

  const recordChallengeAttempt = useCallback(
    (challengeId: string) =>
      update((p) => ({
        ...p,
        challengeAttempts: {
          ...p.challengeAttempts,
          [challengeId]: (p.challengeAttempts[challengeId] ?? 0) + 1,
        },
      })),
    [update],
  );

  const completeChallenge = useCallback(
    (challengeId: string, title: string) =>
      update((p) => {
        if (p.completedChallenges.includes(challengeId)) return p;
        const next: Progress = { ...p, completedChallenges: [...p.completedChallenges, challengeId] };
        return addActivity(addMinutes(next, 10), { type: 'challenge', title, detail: 'Completed' });
      }),
    [update],
  );

  const toggleRequirement = useCallback(
    (projectId: string, requirementId: string) =>
      update((p) => {
        const current = p.projectRequirements[projectId] ?? [];
        const next = current.includes(requirementId)
          ? current.filter((id) => id !== requirementId)
          : [...current, requirementId];
        return { ...p, projectRequirements: { ...p.projectRequirements, [projectId]: next } };
      }),
    [update],
  );

  const setRequirementsDone = useCallback(
    (projectId: string, ids: string[], completedTitle?: string) =>
      update((p) => {
        const current = p.projectRequirements[projectId] ?? [];
        // Never lose ground: a requirement once met stays met.
        const merged = Array.from(new Set([...current, ...ids]));
        const unchanged = merged.length === current.length;
        if (unchanged && !completedTitle) return p;
        let next: Progress = unchanged
          ? p
          : { ...p, projectRequirements: { ...p.projectRequirements, [projectId]: merged } };
        if (completedTitle && !p.activity.some((a) => a.type === 'project' && a.title === completedTitle)) {
          next = addActivity(addMinutes(next, 20), { type: 'project', title: completedTitle, detail: 'Completed' });
        }
        return next;
      }),
    [update],
  );

  const markNotificationsRead = useCallback(
    () => update((p) => (p.notificationsRead ? p : { ...p, notificationsRead: true })),
    [update],
  );

  const resetProgress = useCallback(() => update(() => createEmptyProgress()), [update]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      ready,
      syncStatus,
      setSectionsDone,
      saveQuiz,
      completeLesson,
      recordChallengeAttempt,
      completeChallenge,
      toggleRequirement,
      setRequirementsDone,
      markNotificationsRead,
      resetProgress,
    }),
    [
      progress,
      ready,
      syncStatus,
      setSectionsDone,
      saveQuiz,
      completeLesson,
      recordChallengeAttempt,
      completeChallenge,
      toggleRequirement,
      setRequirementsDone,
      markNotificationsRead,
      resetProgress,
    ],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error('useProgress must be used inside <ProgressProvider>');
  return ctx;
}
