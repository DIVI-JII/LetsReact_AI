import type { Achievement } from '../types';

export const achievements: Achievement[] = [
  { id: 'first-lesson', title: 'First Lesson', description: 'Finish your first lesson.', icon: 'Flag' },
  { id: 'jsx-explorer', title: 'JSX Explorer', description: 'Complete JSX Fundamentals.', icon: 'Braces' },
  { id: 'component-builder', title: 'Component Builder', description: 'Complete Building Components.', icon: 'Boxes' },
  { id: 'state-starter', title: 'State Starter', description: 'Complete Understanding React State.', icon: 'Zap' },
  { id: 'challenge-accepted', title: 'Challenge Accepted', description: 'Pass the Build a Counter challenge.', icon: 'Target' },
  { id: 'quiz-ace', title: 'Quiz Ace', description: 'Get every answer right on the first try.', icon: 'Trophy' },
];

export function getAchievement(id: string): Achievement | undefined {
  return achievements.find((a) => a.id === id);
}
