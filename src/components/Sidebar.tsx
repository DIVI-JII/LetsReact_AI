import { weeks } from '../data';
import { getLesson } from '../data';
import { useProgress } from '../hooks/useProgress';
import { getLessonStatus } from '../utils/progress';
import { LessonCard } from './LessonCard';

interface SidebarProps {
  /** Highlights the lesson being read. */
  activeLessonId?: string;
  onNavigate?: () => void;
}

/** Lesson navigation grouped by week. Used inline on desktop and inside a drawer on mobile. */
export function Sidebar({ activeLessonId, onNavigate }: SidebarProps) {
  const { progress } = useProgress();
  const active = activeLessonId ? getLesson(activeLessonId) : undefined;
  // Show the active week plus its neighbours so the list stays short.
  const focusWeek = active?.weekNumber ?? 1;
  const visible = weeks.filter((w) => Math.abs(w.number - focusWeek) <= 2);

  return (
    <nav aria-label="Lessons" className="p-3">
      {visible.map((week) => (
        <section key={week.number} className="mb-4">
          <h3 className="px-3 pb-1.5 pt-2 text-sm font-bold text-ink-950">
            Week {week.number}: {week.title}
          </h3>
          <ul>
            {week.lessonIds.map((id) => {
              const lesson = getLesson(id);
              if (!lesson) return null;
              return (
                <li
                  key={id}
                  className={id === activeLessonId ? 'rounded-xl ring-1 ring-path-300' : undefined}
                >
                  <LessonCard
                    lesson={lesson}
                    status={getLessonStatus(lesson, progress.completedLessons)}
                    onNavigate={onNavigate}
                  />
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </nav>
  );
}
