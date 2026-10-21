import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ClipboardCheck,
  Clock,
  Code2,
  Eye,
  Lock,
  Menu,
  MousePointerClick,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { PracticeArea } from '../components/PracticeArea';
import { Quiz } from '../components/Quiz';
import { demos } from '../components/demos';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { CircularProgress } from '../components/ui/CircularProgress';
import { Drawer } from '../components/ui/Drawer';
import { EmptyState } from '../components/ui/EmptyState';
import { PageShell } from '../components/ui/PageShell';
import { SuccessBurst } from '../components/ui/SuccessBurst';
import { getLesson } from '../data';
import { useProgress } from '../hooks/useProgress';
import { TutorChat } from '../components/tutor/TutorChat';
import { trackEvent } from '../lib/api';
import type { Lesson, LessonContent } from '../types';
import { cn } from '../utils/cn';
import {
  SECTION_COUNT,
  getLessonLabel,
  getLessonStatus,
  getNextPlayableAfter,
  isLessonOpen,
} from '../utils/progress';
import NotFound from './NotFound';

interface SectionDef {
  id: string;
  title: string;
  icon: LucideIcon;
}

const SECTIONS: SectionDef[] = [
  { id: 'explain', title: 'Simple explanation', icon: BookOpen },
  { id: 'observe', title: 'See it work', icon: Eye },
  { id: 'try', title: 'Try it yourself', icon: MousePointerClick },
  { id: 'practice', title: 'Practice', icon: Code2 },
  { id: 'quiz', title: 'Quick check', icon: ClipboardCheck },
];

export default function LessonPage() {
  const { lessonId } = useParams();
  const { progress } = useProgress();
  const lesson = lessonId ? getLesson(lessonId) : undefined;

  if (!lesson) {
    return (
      <NotFound
        title="We couldn’t find that lesson"
        description="It may have moved. Your roadmap lists every lesson in the course."
      />
    );
  }

  const status = getLessonStatus(lesson, progress.completedLessons);
  if (!lesson.content || !isLessonOpen(status)) {
    return (
      <PageShell className="max-w-2xl">
        <EmptyState
          icon={Lock}
          title={status === 'soon' ? 'This lesson is still being written' : 'Finish the earlier lessons first'}
          description={
            status === 'soon'
              ? `“${lesson.title}” will appear here when it’s ready. The roadmap shows what is open now.`
              : `“${lesson.title}” opens once the lessons before it are done. Your next lesson is waiting on the roadmap.`
          }
          action={<Button to="/course">Back to roadmap</Button>}
        />
      </PageShell>
    );
  }

  return <LessonView lesson={lesson} content={lesson.content} />;
}

function Explanation({ data }: { data: LessonContent['explanation'] }) {
  return (
    <div>
      <p className="max-w-prose font-display text-2xl font-semibold leading-snug text-ink-950 sm:text-[28px]">
        {data.lead}
      </p>
      <div className="mt-7 max-w-prose rounded-2xl bg-path-50 p-5">
        <p className="font-bold text-path-900">{data.analogy.title}</p>
        <p className="mt-1 leading-7 text-path-900/90">{data.analogy.body}</p>
      </div>
      <ul className="mt-7 max-w-prose space-y-3.5">
        {data.points.map((point) => (
          <li key={point} className="flex gap-3 leading-7 text-ink-800">
            <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <Check size={12} strokeWidth={3} aria-hidden="true" />
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LessonView({ lesson, content }: { lesson: Lesson; content: LessonContent }) {
  const { progress, setSectionsDone, saveQuiz, completeLesson } = useProgress();
  const completed = progress.completedLessons.includes(lesson.id);
  const reached = completed ? SECTION_COUNT : progress.lessonSections[lesson.id] ?? 0;
  const sectionsDone = Math.min(reached, SECTION_COUNT);

  const [active, setActive] = useState(() => (completed ? 0 : Math.min(reached, SECTION_COUNT - 1)));
  const [practiceSolved, setPracticeSolved] = useState(completed);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    trackEvent('lesson_viewed', lesson.id);
  }, [lesson.id]);

  const demo = demos[content.demo.kind];
  const visual = demos[content.visual.kind];
  const nextLesson = getNextPlayableAfter(lesson, progress.completedLessons);
  const bestScore = progress.quizResults[lesson.id]?.percent;
  const percent = Math.round((sectionsDone / SECTION_COUNT) * 100);

  const advance = () => {
    setSectionsDone(lesson.id, active + 1);
    setActive((a) => Math.min(a + 1, SECTION_COUNT - 1));
  };

  const onQuizComplete = (result: number) => {
    saveQuiz(lesson.id, result);
    completeLesson(lesson.id);
    setScore(result);
    setFinished(true);
  };

  const renderSection = () => {
    switch (SECTIONS[active].id) {
      case 'explain':
        return <Explanation data={content.explanation} />;
      case 'observe':
        return (
          <div>
            <p className="mb-5 max-w-prose text-ink-600">{content.visual.caption}</p>
            <visual.Visual />
          </div>
        );
      case 'try':
        return (
          <div>
            <demo.Interactive />
            <div className="mt-5 flex gap-3 rounded-2xl border border-path-200 bg-path-50 p-4">
              <span className="mt-0.5 text-path-700" aria-hidden="true">
                <Eye size={18} />
              </span>
              <div>
                <p className="font-bold text-path-900">What’s happening?</p>
                <p className="mt-0.5 text-path-900/90">{content.demo.whatsHappening}</p>
              </div>
            </div>
          </div>
        );
      case 'practice':
        return (
          <PracticeArea
            task={content.practice}
            solved={practiceSolved}
            onSolved={() => setPracticeSolved(true)}
          />
        );
      default:
        return <Quiz quiz={content.quiz} onComplete={onQuizComplete} />;
    }
  };

  const isQuiz = SECTIONS[active].id === 'quiz';
  const isPractice = SECTIONS[active].id === 'practice';

  return (
    <PageShell className="max-w-[88rem]">
      <div className="grid gap-8 lg:grid-cols-[17rem_minmax(0,1fr)] xl:grid-cols-[17rem_minmax(0,1fr)_16rem]">
        {/* Left: lesson navigation */}
        <aside className="hidden lg:block">
          <div className="card sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
            <Sidebar activeLessonId={lesson.id} />
          </div>
        </aside>

        {/* Center: lesson content */}
        <div className="min-w-0">
          <header className="mb-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <Link
                to="/course"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 transition hover:text-ink-950"
              >
                <ArrowLeft size={15} /> Roadmap
              </Link>
              <Button
                variant="secondary"
                size="sm"
                className="lg:hidden"
                icon={<Menu size={15} />}
                onClick={() => setMenuOpen(true)}
              >
                Lessons
              </Button>
            </div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">{lesson.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-600">
              <span>{getLessonLabel(lesson)}</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={15} aria-hidden="true" /> {lesson.minutes} min
              </span>
              <Badge tone="accent">{sectionsDone} / {SECTION_COUNT} sections</Badge>
              {completed && <Badge tone="success">Completed</Badge>}
            </div>
          </header>

          {!finished && (
            <ol className="mb-6 flex flex-wrap gap-2" aria-label="Lesson sections">
              {SECTIONS.map((s, i) => {
                const unlocked = completed || i <= reached;
                const done = i < sectionsDone;
                const Icon = s.icon;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      disabled={!unlocked}
                      onClick={() => setActive(i)}
                      aria-current={i === active ? 'step' : undefined}
                      className={cn(
                        'inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition',
                        i === active
                          ? 'border-ink-950 bg-ink-950 text-white'
                          : unlocked
                            ? 'border-ink-200 bg-white text-ink-800 hover:border-ink-300'
                            : 'border-ink-100 bg-ink-50 text-ink-400',
                      )}
                    >
                      {done && i !== active ? (
                        <Check size={15} className="text-emerald-500" aria-hidden="true" />
                      ) : (
                        <Icon size={15} aria-hidden="true" />
                      )}
                      <span className="hidden sm:inline">{s.title}</span>
                      <span className="sm:hidden">{i + 1}</span>
                    </button>
                  </li>
                );
              })}
            </ol>
          )}

          <AnimatePresence mode="wait">
            {finished ? (
              <motion.section
                key="complete"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="card flex flex-col items-center px-6 py-14 text-center sm:px-10"
              >
                <SuccessBurst />
                <h2 className="mt-6 text-3xl font-extrabold sm:text-4xl">Lesson Complete 🎉</h2>
                <p className="mt-2 max-w-md text-lg text-ink-600">
                  You’ve finished {lesson.title}
                  {score !== null ? ` and scored ${score}% on the first try` : ''}. Your progress is saved.
                </p>
                <div className="mt-8 flex flex-wrap justify-center gap-3">
                  {nextLesson ? (
                    <Button
                      to={`/lessons/${nextLesson.id}`}
                      variant="accent"
                      size="lg"
                      iconRight={<ArrowRight size={18} />}
                    >
                      Continue to Next Lesson
                    </Button>
                  ) : (
                    <Button to="/practice" variant="accent" size="lg" iconRight={<ArrowRight size={18} />}>
                      Try the counter challenge
                    </Button>
                  )}
                  <Button to="/dashboard" variant="secondary" size="lg">
                    Back to dashboard
                  </Button>
                </div>
              </motion.section>
            ) : (
              <motion.section
                key={SECTIONS[active].id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="card p-5 sm:p-8"
                aria-labelledby="section-title"
              >
                <h2 id="section-title" className="mb-6 flex items-center gap-2.5 text-sm font-semibold text-ink-600">
                  {(() => {
                    const Icon = SECTIONS[active].icon;
                    return <Icon size={16} aria-hidden="true" />;
                  })()}
                  {SECTIONS[active].title}
                </h2>
                {renderSection()}

                {!isQuiz && (
                  <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-ink-100 pt-5">
                    <Button
                      variant="ghost"
                      size="sm"
                      icon={<ArrowLeft size={15} />}
                      disabled={active === 0}
                      onClick={() => setActive((a) => Math.max(a - 1, 0))}
                    >
                      Back
                    </Button>
                    <Button
                      variant={isPractice && !practiceSolved ? 'secondary' : 'accent'}
                      iconRight={<ArrowRight size={16} />}
                      onClick={advance}
                    >
                      {isPractice && !practiceSolved ? 'Skip for now' : 'Continue'}
                    </Button>
                  </div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Right: progress and lesson information */}
        <aside className="hidden xl:block">
          <div className="card sticky top-24 p-5">
            <div className="flex justify-center">
              <CircularProgress value={percent} size={112} stroke={9} label="Lesson progress">
                <span className="font-display text-2xl font-extrabold text-ink-950">{percent}%</span>
              </CircularProgress>
            </div>
            <p className="mt-3 text-center text-sm text-ink-600">
              {sectionsDone} of {SECTION_COUNT} sections done
            </p>
            <dl className="mt-5 space-y-3 border-t border-ink-100 pt-5 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-600">Position</dt>
                <dd className="font-semibold text-ink-900">{getLessonLabel(lesson)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-600">Time</dt>
                <dd className="font-semibold text-ink-900">{lesson.minutes} min</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-600">Best quiz score</dt>
                <dd className="font-semibold text-ink-900">{bestScore !== undefined ? `${bestScore}%` : 'Not taken'}</dd>
              </div>
            </dl>
            {nextLesson && (
              <div className="mt-5 border-t border-ink-100 pt-5">
                <p className="text-sm text-ink-600">Up next</p>
                <p className="mt-0.5 font-semibold text-ink-950">{nextLesson.title}</p>
              </div>
            )}
          </div>
        </aside>
      </div>

      <TutorChat key={lesson.id} lessonId={lesson.id} lessonTitle={lesson.title} />

      <Drawer open={menuOpen} onClose={() => setMenuOpen(false)} title="Lessons" side="left">
        <Sidebar activeLessonId={lesson.id} onNavigate={() => setMenuOpen(false)} />
      </Drawer>
    </PageShell>
  );
}
