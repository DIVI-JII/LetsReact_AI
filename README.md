# LetsReact_AI

An interactive 12-week React learning platform for beginners. The flow in every lesson is
**Learn → Observe → Practice → Test → Feedback → Progress**.

Built with React, Vite, TypeScript, Tailwind CSS, Framer Motion, React Router and Lucide.
No backend and no authentication yet. Progress is saved in LocalStorage and course content
lives in plain data files.

## Install and run (development)

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # TypeScript, no emit
npm run build      # type-check + production build into dist/
npm run preview    # serve the production build
```

Requires Node 18 or newer.

## What's in this first version

Landing page, learner dashboard, course roadmap, five working lessons (JSX, Components,
Props, Events, State) each with an explanation, visual demo, interactive demo, practice step
and quiz, one coding challenge (Build a Counter), one project workspace (Task Manager with a
working mini-app), a progress page, achievements, search (Ctrl/Cmd + K), notifications and a
responsive navbar with a mobile drawer.

The other 20 lessons are outlined in the roadmap and show as "Coming soon". Learner state is
seeded with mock data (8 lessons done, "Understanding React State" up next). Use the avatar
menu, then "Reset demo progress", to return to that starting point.

## Project structure

```
src/
  animations/   Shared Framer Motion variants and easing
  components/
    ui/           Design system: Button, Card, Badge, ProgressBar, CircularProgress,
                  Modal, Drawer, CodeBlock, CodePreview, PageHeader, EmptyState, ...
    navigation/   Navbar, Logo, SearchPalette, NotificationsMenu, UserMenu
    landing/      Hero, HowItWorks, WhatYouWillLearn, ProjectsSection, FinalCta
    demos/        Visual + interactive demos for each lesson topic
    LessonCard, WeekCard, Sidebar, Quiz, QuizOption, PracticeArea,
    ChallengePanel, CodeEditor, CounterPreview, TestResults,
    AchievementCard, ProjectCard, TaskManagerDemo
  data/           Mock content: course, lessons (+ content/), challenges, projects,
                  achievements, user, seed progress. Import everything via data/index.ts
  hooks/          useProgress (context + persistence), useLocalStorage, useDismiss, useCountUp
  layouts/        AppLayout (navbar, page transition, footer)
  pages/          Landing, Dashboard, Course, LessonPage, Practice, ChallengePage,
                  Projects, ProjectPage, ProgressPage, NotFound
  styles/         index.css (Tailwind layers, buttons, cards, code tokens)
  types/          Domain models: User, Course, Week, Lesson, Quiz, Question,
                  Challenge, Project, Achievement, Progress
  utils/          Progress maths, unlock rules, achievement rules, challenge tests, icons
```

## Major pieces

- **`useProgress`** is the single source of truth for learner state. It exposes actions
  (`completeLesson`, `saveQuiz`, `completeChallenge`, `toggleRequirement`, ...), persists to
  LocalStorage under `LetsReact_AI:progress:v1`, awards achievements automatically and logs activity.
- **`utils/progress.ts`** holds the unlock rules. A lesson is `completed`, `current`,
  `available`, `locked` (an earlier open lesson isn't finished) or `soon` (no content yet).
  Weeks are `completed`, `current` or `locked`.
- **Lesson page** walks five sections (explanation, see it work, try it, practice, quick
  check). Sections unlock in order, practice can be skipped, and finishing the quiz completes
  the lesson with a success animation.
- **Quiz** gives teaching feedback on every option, allows retries, and scores on the first try.
- **Challenge page** checks code by pattern-matching what the learner wrote (`utils/challenge.ts`).
  No learner code is executed. Swap in a sandbox or backend runner later.
- **Demos** are looked up by kind in `components/demos/index.ts`, so lesson data stays serialisable.

## Adding a lesson

1. **Outline it.** Add an entry to `outline` in `src/data/lessons/index.ts` with an `id`,
   `weekNumber`, `title`, `summary` and `minutes`. It appears in the roadmap right away.
2. **Write its content.** Copy a file in `src/data/lessons/content/` and fill in the
   explanation, demo kinds, practice task and quiz. Every wrong quiz option needs a `feedback`
   that teaches.
3. **Register it.** Add it to `contentById` in the same `index.ts`, keyed by the lesson `id`.
4. **New demo?** Build `Visual` and `Interactive` components in `components/demos/`, add a
   value to `DemoKind` in `types/index.ts`, and register it in `components/demos/index.ts`.
5. **Badges.** To award a badge, add it to `data/achievements.ts` and a rule to
   `utils/achievements.ts`.

Unlocking, progress percentages, the sidebar, search and the dashboard update automatically.

## Accounts, database and admin portal

LetsReact_AI now has real accounts backed by PostgreSQL, and an admin portal where you can see each learner's activity separately.

- `server/`: Express 5 + Postgres API (auth, progress sync, activity events, admin endpoints, CLI tools, tests).
- `src/pages/admin/`: the admin portal (overview, learners list, per-learner detail with activity timeline, audit log).
- Learners sign up at `/register`. Admins are created only from the server command line, never through the website.

### Develop locally

1. Create a Postgres database and a user for it.
2. `cd server && cp ../.env.example .env`, then set `DATABASE_URL=postgres://user:pass@localhost:5432/LetsReact_AI`, `NODE_ENV=development`, `APP_ORIGIN=http://localhost:5173`.
3. `npm install && npm run migrate && npm run dev` (API on :3000).
4. In the project root: `npm install && npm run dev` (site on :5173; `/api` is proxied to :3000).
5. Create your admin: `cd server && npm run create-admin -- --email you@example.com --name "You"`.

### Deploy on your own server

See [docs/DEPLOY.md](docs/DEPLOY.md) (GitHub + Render PostgreSQL + Render API + Vercel frontend) and [docs/SECURITY.md](docs/SECURITY.md) (what is protected, and what you still own as the operator).

### Tests

`cd server && npm test` runs the unit tests for password hashing and policy, CSV safety, and activity-event diffing.

### AI tutor

Each lesson has an "Ask the tutor" chat. It only answers about the open lesson, sends learners to the right lesson for other modules, and declines anything unrelated. Set `NVIDIA_API_KEY` (primary) and/or `GEMINI_API_KEY` (fallback) in `server/.env`. After changing lessons, run `npm run curriculum` from the project root.
