import type { Progress } from '../types';

type Rule = (p: Progress) => boolean;

const rules: Record<string, Rule> = {
  'first-lesson': (p) => p.completedLessons.length > 0,
  'jsx-explorer': (p) => p.completedLessons.includes('jsx-fundamentals'),
  'component-builder': (p) => p.completedLessons.includes('building-components'),
  'state-starter': (p) => p.completedLessons.includes('understanding-state'),
  'challenge-accepted': (p) => p.completedChallenges.includes('build-a-counter'),
  'quiz-ace': (p) => Object.values(p.quizResults).some((r) => r.percent === 100),
};

/** Returns every achievement id the learner has earned for the given progress. */
export function evaluateAchievements(progress: Progress): string[] {
  return Object.entries(rules)
    .filter(([, rule]) => rule(progress))
    .map(([id]) => id);
}
