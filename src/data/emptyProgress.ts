import type { Progress } from '../types';

/** What every new learner starts with. */
export function createEmptyProgress(): Progress {
  return {
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
}
