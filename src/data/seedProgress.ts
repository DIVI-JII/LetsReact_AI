import type { Progress } from '../types';
import { dateKey, daysAgo, hoursAgoISO } from '../utils/date';

/**
 * Mock learner: the first eight lessons are done and "Understanding React State"
 * is next. Replace this with a fetch from your API later.
 */
export function createSeedProgress(): Progress {
  const minutes = [0, 12, 28, 20, 35, 25, 15]; // last 7 days, today last
  const minutesByDay: Record<string, number> = {};
  minutes.forEach((m, i) => {
    if (m > 0) minutesByDay[dateKey(daysAgo(6 - i))] = m;
  });

  const done = (iso: string) => ({ completedAt: iso });

  return {
    completedLessons: [
      'why-react',
      'workspace-setup',
      'first-project',
      'reading-a-react-app',
      'jsx-fundamentals',
      'building-components',
      'passing-props',
      'handling-events',
    ],
    lessonSections: {
      'jsx-fundamentals': 5,
      'building-components': 5,
      'passing-props': 5,
      'handling-events': 5,
    },
    quizResults: {
      'jsx-fundamentals': { percent: 92, ...done(hoursAgoISO(96)) },
      'building-components': { percent: 100, ...done(hoursAgoISO(72)) },
      'passing-props': { percent: 85, ...done(hoursAgoISO(30)) },
    },
    // Earlier challenges that are not part of this first release.
    completedChallenges: ['components-challenge', 'props-challenge'],
    challengeAttempts: {},
    projectRequirements: {
      'task-manager': ['add', 'remove', 'complete', 'filter'],
    },
    earnedAchievements: ['first-lesson', 'jsx-explorer', 'component-builder', 'quiz-ace'],
    activity: [
      { id: 'a1', type: 'lesson', title: 'Handling Events', detail: 'Completed', at: hoursAgoISO(3) },
      { id: 'a2', type: 'lesson', title: 'Passing Data with Props', detail: 'Score 85%', at: hoursAgoISO(30) },
      { id: 'a3', type: 'badge', title: 'Component Builder Badge', detail: 'Badge earned', at: hoursAgoISO(52) },
      { id: 'a4', type: 'challenge', title: 'Components Challenge', detail: 'Completed', at: hoursAgoISO(52) },
      { id: 'a5', type: 'lesson', title: 'JSX Fundamentals', detail: 'Score 92%', at: hoursAgoISO(96) },
    ],
    minutesByDay,
    notificationsRead: false,
  };
}
