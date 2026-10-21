import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getLesson } from '../data';
import type { Week, WeekStatus } from '../types';
import { cn } from '../utils/cn';
import { getLessonStatus } from '../utils/progress';
import { LessonCard } from './LessonCard';
import { Badge } from './ui/Badge';
import { Card } from './ui/Card';
import { ProgressBar } from './ui/ProgressBar';

interface WeekCardProps {
  week: Week;
  status: WeekStatus;
  progress: number;
  completedLessons: string[];
  /** Compact cards are single rows that link to the course page. */
  compact?: boolean;
  defaultOpen?: boolean;
}

export function WeekNode({ number, status }: { number: number; status: WeekStatus }) {
  return (
    <span
      className={cn(
        'inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold',
        status === 'completed' && 'bg-emerald-500 text-white',
        status === 'current' && 'animate-glow bg-path-600 text-white',
        status === 'upcoming' && 'bg-ink-100 text-ink-700',
      )}
      aria-hidden="true"
    >
      {status === 'completed' ? <Check size={18} strokeWidth={3} /> : number}
    </span>
  );
}

function StatusBadge({ status }: { status: WeekStatus }) {
  if (status === 'completed') return <Badge tone="success">Completed</Badge>;
  if (status === 'current') return <Badge tone="accent">In progress</Badge>;
  return <Badge>Not started</Badge>;
}

export function WeekCard({
  week,
  status,
  progress,
  completedLessons,
  compact,
  defaultOpen,
}: WeekCardProps) {
  const [open, setOpen] = useState(Boolean(defaultOpen));

  if (compact) {
    return (
      <Link to="/course" className="block rounded-2xl focus-visible:outline-offset-4">
        <Card
          interactive
          className={cn('flex items-center gap-4 p-4', status === 'current' && 'border-path-300 bg-path-50/40')}
        >
          <WeekNode number={week.number} status={status} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <p className="truncate font-semibold text-ink-950">
                Week {week.number}: {week.title}
              </p>
              <StatusBadge status={status} />
            </div>
            <ProgressBar
              value={progress}
              size="sm"
              tone={status === 'completed' ? 'success' : 'accent'}
              label={`Week ${week.number} progress`}
              className="mt-2.5"
            />
          </div>
        </Card>
      </Link>
    );
  }

  const panelId = `week-${week.number}-lessons`;
  return (
    <Card
      className={cn(
        'overflow-hidden',
        status === 'current' && 'border-path-300 shadow-[0_0_0_4px_rgba(93,208,230,0.16)]',
        
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
      >
        <span className="hidden sm:block">
          <WeekNode number={week.number} status={status} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-display text-lg font-bold text-ink-950">
              Week {week.number}: {week.title}
            </span>
            <StatusBadge status={status} />
          </span>
          <span className="mt-0.5 block text-sm text-ink-600">{week.summary}</span>
          <ProgressBar
            value={progress}
            size="sm"
            tone={status === 'completed' ? 'success' : 'accent'}
            label={`Week ${week.number} progress`}
            className="mt-3 max-w-xs"
          />
        </span>
        <ChevronDown
          size={20}
          className={cn('shrink-0 text-ink-400 transition-transform', open && 'rotate-180')}
          aria-hidden="true"
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="border-t border-ink-100 p-2 sm:p-3">
              {week.lessonIds.map((id) => {
                const lesson = getLesson(id);
                if (!lesson) return null;
                return (
                  <LessonCard
                    key={id}
                    lesson={lesson}
                    status={getLessonStatus(lesson, completedLessons)}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
