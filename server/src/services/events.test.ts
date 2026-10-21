import assert from 'node:assert/strict';
import { test } from 'node:test';
import type { ProgressData } from '../security/validate.js';
import { diffProgress } from './events.js';

function empty(): ProgressData {
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

const types = (events: { type: string }[]) => events.map((e) => e.type).sort();

test('no changes means no events', () => {
  assert.deepEqual(diffProgress(empty(), empty()), []);
});

test('a first save from nothing reports what is in it', () => {
  const next = { ...empty(), completedLessons: ['jsx-fundamentals'], earnedAchievements: ['first-lesson'] };
  assert.deepEqual(types(diffProgress(null, next)), ['badge_earned', 'lesson_completed']);
});

test('completing a lesson reports the quiz score and not a redundant section event', () => {
  const prev = { ...empty(), lessonSections: { 'a-lesson': 4 } };
  const next: ProgressData = {
    ...empty(),
    completedLessons: ['a-lesson'],
    lessonSections: { 'a-lesson': 5 },
    quizResults: { 'a-lesson': { percent: 92, completedAt: '2026-01-01T00:00:00Z' } },
  };
  const events = diffProgress(prev, next);
  assert.deepEqual(types(events), ['lesson_completed', 'quiz_completed']);
  assert.equal(events.find((e) => e.type === 'lesson_completed')?.detail.quizPercent, 92);
});

test('progress through sections is reported once per increase', () => {
  const prev = { ...empty(), lessonSections: { 'a-lesson': 1 } };
  const next = { ...empty(), lessonSections: { 'a-lesson': 3 } };
  const events = diffProgress(prev, next);
  assert.equal(events.length, 1);
  assert.deepEqual(events[0].detail, { sections: 3 });
});

test('retaking a quiz is a new event, an unchanged quiz is not', () => {
  const quiz = (at: string) => ({ 'a-lesson': { percent: 80, completedAt: at } });
  const prev = { ...empty(), quizResults: quiz('2026-01-01T00:00:00Z') };
  assert.equal(diffProgress(prev, { ...prev }).length, 0);
  assert.deepEqual(types(diffProgress(prev, { ...prev, quizResults: quiz('2026-01-02T00:00:00Z') })), ['quiz_completed']);
});

test('challenge attempts and completion', () => {
  const prev = { ...empty(), challengeAttempts: { 'build-a-counter': 2 } };
  const next = { ...prev, challengeAttempts: { 'build-a-counter': 3 }, completedChallenges: ['build-a-counter'] };
  assert.deepEqual(types(diffProgress(prev, next)), ['challenge_attempt', 'challenge_completed']);
});

test('project requirements report both ticking and unticking', () => {
  const prev = { ...empty(), projectRequirements: { 'task-manager': ['add', 'remove'] } };
  const next = { ...empty(), projectRequirements: { 'task-manager': ['add', 'filter'] } };
  assert.deepEqual(types(diffProgress(prev, next)), ['project_requirement_done', 'project_requirement_undone']);
});

test('a huge forged payload cannot flood the activity feed', () => {
  const ids = Array.from({ length: 300 }, (_, i) => `lesson-${i}`);
  assert.equal(diffProgress(empty(), { ...empty(), completedLessons: ids }).length, 100);
});
