// Domain models. Every shape here maps 1:1 to a future API resource,
// so swapping the mock data layer for a backend should not touch components.

export interface User {
  id: string;
  name: string;
  email: string;
  initials: string;
  goal: string;
  joinedAt: string;
}

export interface Month {
  id: string;
  label: string;
  title: string;
  summary: string;
  weekNumbers: number[];
}

export interface Week {
  number: number;
  title: string;
  summary: string;
  monthId: string;
  topics: string[];
  lessonIds: string[];
}

export interface Course {
  id: string;
  title: string;
  subtitle: string;
  months: Month[];
  weeks: Week[];
}

export type DemoKind = 'jsx' | 'component' | 'props' | 'events' | 'state';

export interface QuizOption {
  id: string;
  text: string;
  /** Shown when this option is picked. Always teaches, never just "wrong". */
  feedback: string;
}

export interface Question {
  id: string;
  prompt: string;
  options: QuizOption[];
  correctOptionId: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

export interface PracticeTask {
  prompt: string;
  instructions: string;
  codePrefix: string;
  codeSuffix: string;
  placeholder: string;
  initialValue?: string;
  /** Answers are compared with all whitespace removed. */
  accepted: string[];
  hint: string;
  success: string;
  nearMiss: string;
  /** Text shown in the preview when solved. */
  result: string;
  /** When true, the preview is a live counter that adds the typed number. */
  counterStep?: boolean;
}

export interface LessonContent {
  explanation: {
    lead: string;
    analogy: { title: string; body: string };
    points: string[];
  };
  visual: { kind: DemoKind; caption: string };
  demo: { kind: DemoKind; whatsHappening: string };
  practice: PracticeTask;
  quiz: Quiz;
}

export interface Lesson {
  id: string;
  weekNumber: number;
  /** Position in the whole course, starting at 1. */
  number: number;
  title: string;
  summary: string;
  minutes: number;
  /** Lessons without content are outlined in the roadmap but not playable yet. */
  content?: LessonContent;
}

export interface ChallengeTest {
  id: string;
  label: string;
  /** Regular expression source, run against the learner's code (comments are removed first). */
  pattern: string;
  failHint: string;
}

export interface Challenge {
  id: string;
  title: string;
  summary: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  concepts: string[];
  /** The lesson this challenge practises. The tutor helps with that lesson. */
  lessonId: string;
  filename: string;
  requirements: string[];
  /** For each requirement, the ids of the tests that must all pass. Defaults to one test per requirement. */
  requirementTests?: string[][];
  /** Plain-words description of how the finished result behaves. */
  expected: string[];
  hints: string[];
  starterCode: string;
  solution: string;
  tests: ChallengeTest[];
}

/** The coding workspace of a project: the same shape as a challenge, minus the page copy. */
export interface ProjectWorkspace {
  filename: string;
  starterCode: string;
  solution: string;
  hints: string[];
  /** Plain-words description of how the finished project behaves. */
  expected: string[];
  tests: ChallengeTest[];
}

export interface ProjectRequirement {
  id: string;
  label: string;
  /** Tests that must all pass for this requirement to count as done. */
  testIds: string[];
}

export interface ProjectStep {
  title: string;
  description: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  concepts: string[];
  /** Lucide icon name, resolved in utils/icons. */
  icon: string;
  /** The lesson whose ideas this project uses. The tutor helps with that lesson. */
  lessonId: string;
  requirements: ProjectRequirement[];
  steps: ProjectStep[];
  workspace: ProjectWorkspace;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface QuizResult {
  percent: number;
  completedAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'lesson' | 'challenge' | 'badge' | 'project';
  title: string;
  detail: string;
  at: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  at: string;
}

export interface Progress {
  completedLessons: string[];
  /** Sections finished per lesson (0–5). */
  lessonSections: Record<string, number>;
  quizResults: Record<string, QuizResult>;
  completedChallenges: string[];
  challengeAttempts: Record<string, number>;
  projectRequirements: Record<string, string[]>;
  earnedAchievements: string[];
  activity: ActivityItem[];
  /** Minutes studied per day, keyed by yyyy-mm-dd. */
  minutesByDay: Record<string, number>;
  notificationsRead: boolean;
}

export type LessonStatus = 'completed' | 'current' | 'available' | 'soon' | 'locked';
export type WeekStatus = 'completed' | 'current' | 'upcoming';
