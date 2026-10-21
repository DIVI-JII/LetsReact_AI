import { ArrowRight, CheckCircle2, Swords } from 'lucide-react';
import { LessonCard } from '../components/LessonCard';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';
import { PageShell } from '../components/ui/PageShell';
import { challenges, lessons } from '../data';
import { useProgress } from '../hooks/useProgress';
import { getLessonStatus, isPlayable } from '../utils/progress';

export default function Practice() {
  const { progress } = useProgress();
  const playable = lessons.filter(isPlayable);

  return (
    <PageShell>
      <PageHeader
        title="Practice"
        description="Coding challenges and lesson practice. Try, fail, adjust, and try again."
      />

      <section aria-labelledby="challenges-title">
        <h2 id="challenges-title" className="mb-4 text-xl font-bold">
          Challenges ({challenges.length})
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {challenges.map((c) => {
            const solved = progress.completedChallenges.includes(c.id);
            const attempts = progress.challengeAttempts[c.id] ?? 0;
            return (
              <Card key={c.id} interactive className="flex flex-col p-6">
                <div className="flex items-start justify-between gap-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-path-50 text-path-700">
                    <Swords size={22} aria-hidden="true" />
                  </span>
                  {solved ? (
                    <Badge tone="success" icon={<CheckCircle2 size={13} />}>
                      Completed
                    </Badge>
                  ) : (
                    <Badge tone="accent">Ready to try</Badge>
                  )}
                </div>
                <h3 className="mt-5 text-xl font-bold">{c.title}</h3>
                <p className="mt-1.5 text-sm leading-6 text-ink-600">{c.summary}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <Badge tone={c.difficulty === 'Beginner' ? 'success' : c.difficulty === 'Intermediate' ? 'warning' : 'dark'}>
                    {c.difficulty}
                  </Badge>
                  {c.concepts.map((k) => (
                    <span key={k} className="rounded-md bg-ink-100 px-2 py-1 text-xs font-medium text-ink-700">
                      {k}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-sm text-ink-600">
                  {attempts === 0 ? 'Not attempted yet' : `${attempts} ${attempts === 1 ? 'attempt' : 'attempts'} so far`}
                </p>
                <Button
                  to={`/challenges/${c.id}`}
                  className="mt-6 w-full sm:w-auto sm:self-start"
                  iconRight={<ArrowRight size={16} />}
                >
                  {solved ? 'Open again' : 'Start challenge'}
                </Button>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="lessons-title">
        <h2 id="lessons-title" className="mb-1 text-xl font-bold">
          Revisit a lesson
        </h2>
        <p className="mb-4 text-ink-600">Every lesson includes a practice step and a quick quiz.</p>
        <Card className="grid gap-1 p-2 sm:grid-cols-2">
          {playable.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              status={getLessonStatus(lesson, progress.completedLessons)}
            />
          ))}
        </Card>
      </section>
    </PageShell>
  );
}
