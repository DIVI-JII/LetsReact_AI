import type { ProgressData } from '../security/validate.js';

export interface NewEvent {
  type: string;
  refId: string | null;
  detail: Record<string, unknown>;
}

const MAX_EVENTS_PER_SAVE = 100;

/**
 * Works out what changed between two saves of a learner's progress.
 * Deriving events on the server (instead of trusting a separate client-sent log) means
 * the activity feed always agrees with the progress data and has one less endpoint to abuse.
 */
export function diffProgress(prev: ProgressData | null, next: ProgressData): NewEvent[] {
  const events: NewEvent[] = [];
  const before: ProgressData = prev ?? {
    completedLessons: [],
    lessonSections: {},
    quizResults: {},
    completedChallenges: [],
    challengeAttempts: {},
    projectRequirements: {},
    earnedAchievements: [],
    activity: [],
    minutesByDay: {},
    notificationsRead: false,
  };

  const newlyCompleted = next.completedLessons.filter((id) => !before.completedLessons.includes(id));
  for (const id of newlyCompleted) {
    events.push({ type: 'lesson_completed', refId: id, detail: { quizPercent: next.quizResults[id]?.percent ?? null } });
  }

  for (const [id, count] of Object.entries(next.lessonSections)) {
    const was = before.lessonSections[id] ?? 0;
    // Finishing a lesson sets sections to 5; that is already covered by lesson_completed.
    if (count > was && !newlyCompleted.includes(id)) {
      events.push({ type: 'section_completed', refId: id, detail: { sections: count } });
    }
  }

  for (const [id, result] of Object.entries(next.quizResults)) {
    if (before.quizResults[id]?.completedAt !== result.completedAt) {
      events.push({ type: 'quiz_completed', refId: id, detail: { percent: result.percent } });
    }
  }

  for (const id of next.completedChallenges) {
    if (!before.completedChallenges.includes(id)) events.push({ type: 'challenge_completed', refId: id, detail: {} });
  }

  for (const [id, attempts] of Object.entries(next.challengeAttempts)) {
    const was = before.challengeAttempts[id] ?? 0;
    if (attempts > was) events.push({ type: 'challenge_attempt', refId: id, detail: { attempts } });
  }

  for (const [project, ids] of Object.entries(next.projectRequirements)) {
    const was = before.projectRequirements[project] ?? [];
    for (const req of ids.filter((r) => !was.includes(r))) {
      events.push({ type: 'project_requirement_done', refId: project, detail: { requirement: req } });
    }
    for (const req of was.filter((r) => !ids.includes(r))) {
      events.push({ type: 'project_requirement_undone', refId: project, detail: { requirement: req } });
    }
  }

  for (const id of next.earnedAchievements) {
    if (!before.earnedAchievements.includes(id)) events.push({ type: 'badge_earned', refId: id, detail: {} });
  }

  return events.slice(0, MAX_EVENTS_PER_SAVE);
}
