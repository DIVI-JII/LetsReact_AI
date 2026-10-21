import { motion } from 'framer-motion';
import { ClipboardCheck } from 'lucide-react';
import { AchievementCard } from '../components/AchievementCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { CircularProgress } from '../components/ui/CircularProgress';
import { EmptyState } from '../components/ui/EmptyState';
import { PageHeader } from '../components/ui/PageHeader';
import { PageShell } from '../components/ui/PageShell';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ease } from '../animations/variants';
import { achievements, getLesson, lessons, projects, weeks } from '../data';
import { useCountUp } from '../hooks/useCountUp';
import { useProgress } from '../hooks/useProgress';
import { lastNDays } from '../utils/date';
import {
  getCurrentStreak,
  getOverallPercent,
  getQuizAverage,
  getWeekProgress,
  getWeekStatus,
} from '../utils/progress';

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <Card className="p-5">
      <p className="font-display text-3xl font-extrabold text-ink-950">{value}</p>
      <p className="mt-0.5 text-sm text-ink-600">{label}</p>
    </Card>
  );
}

export default function ProgressPage() {
  const { progress } = useProgress();
  const completed = progress.completedLessons;
  const percent = getOverallPercent(completed);
  const shown = useCountUp(percent);
  const streak = getCurrentStreak(progress.minutesByDay);
  const quizAverage = getQuizAverage(progress.quizResults);
  const projectsDone = projects.filter(
    (p) => (progress.projectRequirements[p.id]?.length ?? 0) >= p.requirements.length,
  ).length;

  const days = lastNDays(7);
  const minutes = days.map((d) => progress.minutesByDay[d.key] ?? 0);
  const maxMinutes = Math.max(30, ...minutes);
  const totalMinutes = minutes.reduce((a, b) => a + b, 0);

  const quizRows = Object.entries(progress.quizResults)
    .map(([id, result]) => ({ lesson: getLesson(id), result }))
    .filter((row) => row.lesson !== undefined);

  return (
    <PageShell>
      <PageHeader
        title="Your progress"
        description="Every lesson, quiz and challenge adds up. Here is where you stand."
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-8 lg:row-span-2">
          <CircularProgress value={percent} size={168} stroke={13} label="Overall course progress">
            <span className="text-center">
              <span className="block font-display text-5xl font-extrabold tabular-nums text-ink-950">
                {shown}%
              </span>
              <span className="block text-sm text-ink-600">complete</span>
            </span>
          </CircularProgress>
          <p className="mt-5 text-center text-sm text-ink-600">
            {completed.length} of {lessons.length} lessons finished
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-5 lg:col-span-2 lg:grid-cols-4">
          <Stat value={`${streak} ${streak === 1 ? 'day' : 'days'}`} label="Current streak" />
          <Stat value={progress.completedChallenges.length} label="Challenges completed" />
          <Stat value={projectsDone} label="Projects completed" />
          <Stat value={Object.keys(progress.quizResults).length > 0 ? `${quizAverage}%` : '–'} label="Average quiz score" />
        </div>

        <Card className="p-6 lg:col-span-2">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-lg font-bold">Study time this week</h2>
            <p className="text-sm text-ink-600">{totalMinutes} min total</p>
          </div>
          <div
            className="mt-5 flex h-44 items-end gap-3"
            role="img"
            aria-label={`Minutes studied per day: ${days.map((d, i) => `${d.label} ${minutes[i]}`).join(', ')}`}
          >
            {days.map((d, i) => (
              <div key={d.key} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-xs font-medium text-ink-600">{minutes[i] > 0 ? minutes[i] : ''}</span>
                <div className="flex w-full flex-1 items-end">
                  <motion.div
                    className="w-full rounded-t-lg bg-path-500"
                    initial={{ height: 0 }}
                    animate={{ height: `${Math.max((minutes[i] / maxMinutes) * 100, minutes[i] > 0 ? 4 : 1)}%` }}
                    transition={{ duration: 0.8, ease, delay: i * 0.05 }}
                    style={{ opacity: minutes[i] > 0 ? 1 : 0.25 }}
                  />
                </div>
                <span className="text-xs text-ink-600">{d.label}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card className="p-6">
          <h2 className="text-lg font-bold">Weekly progress</h2>
          <ul className="mt-5 space-y-4">
            {weeks.map((w) => {
              const p = getWeekProgress(w, completed);
              const status = getWeekStatus(w, completed);
              return (
                <li key={w.number}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-ink-900">
                      Week {w.number}: {w.title}
                    </span>
                    <span className="shrink-0 text-ink-600">{p}%</span>
                  </div>
                  <ProgressBar
                    value={p}
                    size="sm"
                    tone={status === 'completed' ? 'success' : 'accent'}
                    label={`Week ${w.number} progress`}
                  />
                </li>
              );
            })}
          </ul>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-bold">Quiz performance</h2>
          {quizRows.length === 0 ? (
            <div className="mt-4">
              <EmptyState
                icon={ClipboardCheck}
                title="No quizzes taken yet"
                description="Finish a lesson’s quick check and your score lands here."
                action={<Button to="/dashboard">Continue learning</Button>}
              />
            </div>
          ) : (
            <ul className="mt-5 space-y-4">
              {quizRows.map(({ lesson, result }) => (
                <li key={lesson?.id}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate font-medium text-ink-900">{lesson?.title}</span>
                    <span className="shrink-0 font-semibold text-ink-900">{result.percent}%</span>
                  </div>
                  <ProgressBar value={result.percent} size="sm" label={`${lesson?.title} quiz score`} />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <section className="mt-10" aria-labelledby="progress-achievements">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 id="progress-achievements" className="text-xl font-bold">
            Achievements
          </h2>
          <p className="text-sm text-ink-600">
            {progress.earnedAchievements.length} of {achievements.length} earned
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {achievements.map((a) => (
            <AchievementCard key={a.id} achievement={a} earned={progress.earnedAchievements.includes(a.id)} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}
