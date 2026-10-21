import { motion } from 'framer-motion';
import { ArrowRight, Award, BookOpen, Clock, Code2, FolderKanban } from 'lucide-react';
import { AchievementCard } from '../components/AchievementCard';
import { WeekCard } from '../components/WeekCard';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageShell } from '../components/ui/PageShell';
import { ProgressBar } from '../components/ui/ProgressBar';
import { stagger, fadeUp } from '../animations/variants';
import { achievements, lessons, projects, weeks } from '../data';
import { useCountUp } from '../hooks/useCountUp';
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';
import { timeAgo } from '../utils/date';
import {
  getCurrentWeek,
  getLessonLabel,
  getNextLesson,
  getOverallPercent,
  getWeekProgress,
  getWeekStatus,
} from '../utils/progress';

const activityIcon = {
  lesson: BookOpen,
  challenge: Code2,
  badge: Award,
  project: FolderKanban,
} as const;

export default function Dashboard() {
  const { user } = useAuth();
  const { progress } = useProgress();
  const completed = progress.completedLessons;
  const percent = getOverallPercent(completed);
  const shownPercent = useCountUp(percent);
  const next = getNextLesson(completed);
  const currentWeek = getCurrentWeek(completed);
  const visibleWeeks = weeks.filter(
    (w) => w.number >= currentWeek.number - 1 && w.number <= currentWeek.number + 2,
  );
  const projectsInProgress = projects.filter((p) => {
    const done = progress.projectRequirements[p.id]?.length ?? 0;
    return done > 0 && done < p.requirements.length;
  }).length;

  const stats = [
    { value: completed.length, label: `of ${lessons.length} lessons completed` },
    { value: Object.keys(progress.quizResults).length, label: 'quizzes completed' },
    { value: progress.completedChallenges.length, label: 'challenges completed' },
    { value: projectsInProgress, label: projectsInProgress === 1 ? 'project in progress' : 'projects in progress' },
  ];

  return (
    <PageShell>
      <header className="mb-8 sm:mb-10">
        <h1 className="text-3xl font-extrabold sm:text-4xl">Welcome back{user ? `, ${user.name.split(' ')[0]}` : ''} 👋</h1>
        <p className="mt-2 text-lg text-ink-600">Continue your React journey.</p>
      </header>

      <motion.div variants={stagger} initial="hidden" animate="show" className="grid gap-5 lg:grid-cols-3">
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <Card className="h-full p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-ink-600">Your course</p>
                <h2 className="mt-1 text-2xl font-extrabold sm:text-3xl">React Foundations</h2>
              </div>
              <p className="font-display text-5xl font-extrabold tabular-nums text-ink-950 sm:text-6xl">
                {shownPercent}%
              </p>
            </div>
            <ProgressBar value={percent} size="lg" label="Overall course progress" className="mt-6" />
            <dl className="mt-8 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-4">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt className="sr-only">{s.label}</dt>
                  <dd>
                    <span className="block font-display text-3xl font-extrabold text-ink-950">{s.value}</span>
                    <span className="mt-0.5 block text-sm text-ink-600">{s.label}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        </motion.div>

        <motion.div variants={fadeUp}>
          <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-ink-950 p-6 text-white sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-path-500/30 blur-3xl"
            />
            <h2 className="relative text-sm font-semibold text-path-300">Continue Learning</h2>
            {next ? (
              <>
                <p className="relative mt-4 font-display text-2xl font-extrabold leading-tight text-white">
                  {next.title}
                </p>
                <p className="relative mt-2 text-ink-300">{getLessonLabel(next)}</p>
                <p className="relative mt-1 inline-flex items-center gap-1.5 text-sm text-ink-300">
                  <Clock size={14} aria-hidden="true" /> Estimated time: {next.minutes} minutes
                </p>
                <div className="relative mt-auto pt-8">
                  <Button
                    to={`/lessons/${next.id}`}
                    variant="light"
                    size="lg"
                    className="w-full"
                    iconRight={<ArrowRight size={18} />}
                  >
                    Continue Lesson
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="relative mt-4 font-display text-2xl font-extrabold leading-tight text-white">
                  You’ve finished every lesson that’s open.
                </p>
                <p className="relative mt-2 text-ink-300">More lessons are on the way. Meanwhile, build something.</p>
                <div className="relative mt-auto pt-8">
                  <Button to="/practice" variant="light" size="lg" className="w-full">
                    Go to practice
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>

        <motion.section variants={fadeUp} className="lg:col-span-2" aria-labelledby="current-course">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="current-course" className="text-xl font-bold">
              Current course
            </h2>
            <Button to="/course" variant="ghost" size="sm" iconRight={<ArrowRight size={15} />}>
              Full roadmap
            </Button>
          </div>
          <div className="space-y-3">
            {visibleWeeks.map((w) => (
              <WeekCard
                key={w.number}
                week={w}
                compact
                status={getWeekStatus(w, completed)}
                progress={getWeekProgress(w, completed)}
                completedLessons={completed}
              />
            ))}
          </div>
        </motion.section>

        <motion.section variants={fadeUp} aria-labelledby="recent-activity">
          <h2 id="recent-activity" className="mb-4 text-xl font-bold">
            Recent activity
          </h2>
          <Card className="divide-y divide-ink-100">
            {progress.activity.slice(0, 5).map((item) => {
              const Icon = activityIcon[item.type];
              return (
                <div key={item.id} className="flex items-start gap-3 p-4">
                  <span className="mt-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-path-50 text-path-700">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm text-ink-600">
                      {item.type === 'badge' ? 'Earned' : 'Completed'}
                    </p>
                    <p className="truncate font-semibold text-ink-950">{item.title}</p>
                    <p className="text-sm text-ink-600">
                      {item.detail !== 'Completed' && item.detail !== 'Badge earned' ? `${item.detail} · ` : ''}
                      {timeAgo(item.at)}
                    </p>
                  </div>
                </div>
              );
            })}
            {progress.activity.length === 0 && (
              <p className="p-5 text-sm text-ink-600">Finish a lesson and it shows up here.</p>
            )}
          </Card>
        </motion.section>

        <motion.section variants={fadeUp} className="lg:col-span-3" aria-labelledby="achievements">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="achievements" className="text-xl font-bold">
              Achievements
            </h2>
            <p className="text-sm text-ink-600">
              {progress.earnedAchievements.length} of {achievements.length} earned
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {achievements.map((a) => (
              <AchievementCard
                key={a.id}
                achievement={a}
                earned={progress.earnedAchievements.includes(a.id)}
              />
            ))}
          </div>
        </motion.section>
      </motion.div>
    </PageShell>
  );
}
