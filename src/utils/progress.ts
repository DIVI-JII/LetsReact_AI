import { lessons } from '../data/lessons';
import { weeks } from '../data/course';
import type { Lesson, LessonStatus, Progress, Week, WeekStatus } from '../types';
import { dateKey, daysAgo } from './date';

export const SECTION_COUNT = 5;

export function isPlayable(lesson: Lesson): boolean {
  return Boolean(lesson.content);
}

/** The first lesson with content that the learner has not finished yet. */
export function getNextLesson(completed: string[]): Lesson | null {
  return lessons.find((l) => isPlayable(l) && !completed.includes(l.id)) ?? null;
}

export function getLessonStatus(lesson: Lesson, completed: string[]): LessonStatus {
  if (completed.includes(lesson.id)) return 'completed';
  if (!isPlayable(lesson)) return 'soon';
  // Every lesson with content is open, so learners can jump around and revisit earlier ones.
  return getNextLesson(completed)?.id === lesson.id ? 'current' : 'available';
}

export function isLessonOpen(status: LessonStatus): boolean {
  return status === 'completed' || status === 'current' || status === 'available';
}

function firstIncompleteLesson(completed: string[]): Lesson | undefined {
  return lessons.find((l) => !completed.includes(l.id));
}

export function getWeekStatus(week: Week, completed: string[]): WeekStatus {
  if (week.lessonIds.every((id) => completed.includes(id))) return 'completed';
  const first = firstIncompleteLesson(completed);
  return first && first.weekNumber === week.number ? 'current' : 'upcoming';
}

export function getWeekProgress(week: Week, completed: string[]): number {
  if (week.lessonIds.length === 0) return 0;
  const done = week.lessonIds.filter((id) => completed.includes(id)).length;
  return Math.round((done / week.lessonIds.length) * 100);
}

export function getOverallPercent(completed: string[]): number {
  return Math.round((completed.length / lessons.length) * 100);
}

export function getCurrentWeek(completed: string[]): Week {
  const first = firstIncompleteLesson(completed);
  const number = first ? first.weekNumber : weeks[weeks.length - 1].number;
  return weeks.find((w) => w.number === number) ?? weeks[0];
}

export function getLessonLabel(lesson: Lesson): string {
  return `Week ${lesson.weekNumber} · Lesson ${lesson.number}`;
}

export function getNextPlayableAfter(lesson: Lesson, completed: string[]): Lesson | null {
  return (
    lessons.find(
      (l) => l.number > lesson.number && isPlayable(l) && !completed.includes(l.id),
    ) ?? null
  );
}

export function getCurrentStreak(minutesByDay: Progress['minutesByDay']): number {
  let streak = 0;
  // If nothing has been done today yet, the streak is still alive until midnight.
  let offset = (minutesByDay[dateKey(daysAgo(0))] ?? 0) > 0 ? 0 : 1;
  while ((minutesByDay[dateKey(daysAgo(offset))] ?? 0) > 0) {
    streak++;
    offset++;
  }
  return streak;
}

export function getQuizAverage(quizResults: Progress['quizResults']): number {
  const values = Object.values(quizResults).map((r) => r.percent);
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}
