import { CheckCircle2, Circle, Clock, Lock, PlayCircle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Lesson, LessonStatus } from '../types';
import { isLessonOpen } from '../utils/progress';
import { cn } from '../utils/cn';

const icons: Record<LessonStatus, { icon: LucideIcon; className: string }> = {
  completed: { icon: CheckCircle2, className: 'text-emerald-500' },
  current: { icon: PlayCircle, className: 'text-path-600' },
  available: { icon: Circle, className: 'text-ink-300' },
  soon: { icon: Clock, className: 'text-ink-300' },
  locked: { icon: Lock, className: 'text-ink-300' },
};

const statusText: Partial<Record<LessonStatus, string>> = {
  current: 'Up next',
  soon: 'Coming soon',
  locked: 'Locked',
};

interface LessonCardProps {
  lesson: Lesson;
  status: LessonStatus;
  onNavigate?: () => void;
}

export function LessonCard({ lesson, status, onNavigate }: LessonCardProps) {
  const { icon: Icon, className: iconClass } = icons[status];
  // Finished outline lessons have no page to open.
  const open = isLessonOpen(status) && Boolean(lesson.content);

  const body = (
    <>
      <Icon size={20} className={cn('shrink-0', iconClass)} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span
          className={cn(
            'block truncate text-[15px] font-semibold',
            open ? 'text-ink-900' : 'text-ink-600',
          )}
        >
          {lesson.title}
        </span>
        <span className="block text-xs text-ink-500">
          {lesson.minutes} min
          {statusText[status] ? ` · ${statusText[status]}` : ''}
        </span>
      </span>
    </>
  );

  const base = 'flex items-center gap-3 rounded-xl px-3 py-2.5 transition';

  if (open) {
    return (
      <Link
        to={`/lessons/${lesson.id}`}
        onClick={onNavigate}
        className={cn(base, 'hover:bg-ink-50', status === 'current' && 'bg-path-50 hover:bg-path-50')}
      >
        {body}
      </Link>
    );
  }
  return (
    <div className={base} aria-disabled={status === 'locked' || status === 'soon' ? true : undefined}>
      {body}
    </div>
  );
}
