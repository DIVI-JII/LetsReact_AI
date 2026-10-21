import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import { WeekCard } from '../components/WeekCard';
import { PageHeader } from '../components/ui/PageHeader';
import { PageShell } from '../components/ui/PageShell';
import { ProgressBar } from '../components/ui/ProgressBar';
import { stagger, fadeUp } from '../animations/variants';
import { lessons, months, weeks } from '../data';
import { useProgress } from '../hooks/useProgress';
import { getCurrentWeek, getOverallPercent, getWeekProgress, getWeekStatus } from '../utils/progress';

export default function Course() {
  const { progress } = useProgress();
  const completed = progress.completedLessons;
  const currentWeek = getCurrentWeek(completed);
  const percent = getOverallPercent(completed);

  return (
    <PageShell>
      <PageHeader
        title="Your 12-week roadmap"
        description="Three months, one clear path. Every lesson is open: jump to any week, or revisit earlier ones."
      />

      <div className="mb-10 flex flex-wrap items-center gap-x-8 gap-y-4 rounded-2xl border border-ink-100 bg-white p-5">
        <div className="min-w-[14rem] flex-1">
          <div className="mb-2 flex items-baseline justify-between text-sm">
            <span className="font-semibold text-ink-900">Overall progress</span>
            <span className="text-ink-600">
              {completed.length} of {lessons.length} lessons
            </span>
          </div>
          <ProgressBar value={percent} label="Overall course progress" />
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-700" aria-label="Legend">
          <li className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Check size={12} strokeWidth={3} />
            </span>
            Completed
          </li>
          <li className="flex items-center gap-2">
            <span className="h-5 w-5 animate-glow rounded-full bg-path-600" /> Current
          </li>
          <li className="flex items-center gap-2">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-ink-100 text-ink-500">
              <Lock size={11} />
            </span>
            Coming soon
          </li>
        </ul>
      </div>

      <div className="space-y-14">
        {months.map((month) => {
          const monthWeeks = weeks.filter((w) => month.weekNumbers.includes(w.number));
          return (
            <section key={month.id} aria-labelledby={`${month.id}-title`}>
              <div className="mb-5 max-w-2xl">
                <p className="text-sm font-semibold text-path-700">{month.label}</p>
                <h2 id={`${month.id}-title`} className="mt-0.5 text-2xl font-extrabold sm:text-3xl">
                  {month.title}
                </h2>
                <p className="mt-1.5 text-ink-600">{month.summary}</p>
              </div>
              <motion.div
                variants={stagger}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                className="space-y-3"
              >
                {monthWeeks.map((week) => (
                  <motion.div key={week.number} variants={fadeUp}>
                    <WeekCard
                      week={week}
                      status={getWeekStatus(week, completed)}
                      progress={getWeekProgress(week, completed)}
                      completedLessons={completed}
                      defaultOpen={week.number === currentWeek.number}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          );
        })}
      </div>
    </PageShell>
  );
}
