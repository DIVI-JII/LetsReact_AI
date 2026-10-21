import { ErrorNote, StatTile } from '../../components/admin/bits';
import { getLesson } from '../../data/lessons';
import { useFetch } from '../../hooks/useFetch';
import type { AdminOverview as Overview } from '../../types/api';

export default function AdminOverview() {
  const { data, error, loading, reload } = useFetch<Overview>('/api/admin/overview');

  if (error) return <ErrorNote message={error} onRetry={reload} />;
  if (loading || !data) return <p className="text-ink-600">Loading…</p>;

  const t = data.totals;
  const maxDaily = Math.max(1, ...data.dailyActive.map((d) => d.users));
  const maxBucket = Math.max(1, ...data.completionBuckets.map((b) => b.count));

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        <StatTile label="Learners" value={t.learners} />
        <StatTile label="Active, 7 days" value={t.active7} />
        <StatTile label="New, 7 days" value={t.new7} />
        <StatTile label="Disabled" value={t.disabled} />
        <StatTile label="Lessons completed" value={t.lessonsCompleted} />
        <StatTile label="Avg. quiz score" value={t.quizAverage ? `${Math.round(t.quizAverage)}%` : '—'} />
      </div>

      <section className="card p-6">
        <h2 className="text-lg font-bold">Daily active learners</h2>
        <p className="text-sm text-ink-600">Last 14 days</p>
        <div className="mt-5 flex h-40 items-end gap-1.5" role="img" aria-label="Bar chart of daily active learners">
          {data.dailyActive.map((d) => (
            <div key={d.day} className="flex flex-1 flex-col items-center justify-end gap-1">
              <span className="text-[11px] tabular-nums text-ink-500">{d.users}</span>
              <div
                className="w-full rounded-t-md bg-path-500"
                style={{ height: `${Math.max(3, (d.users / maxDaily) * 100)}%` }}
              />
              <span className="text-[10px] text-ink-500">{d.day.slice(5)}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-lg font-bold">Lesson funnel</h2>
          <p className="text-sm text-ink-600">Learners who opened a lesson vs. completed it</p>
          <ul className="mt-4 space-y-4">
            {data.funnel.length === 0 && <li className="text-sm text-ink-600">No activity yet.</li>}
            {data.funnel.map((f) => (
              <li key={f.lessonId}>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{getLesson(f.lessonId)?.title ?? f.lessonId}</span>
                  <span className="tabular-nums text-ink-600">
                    {f.completers} / {f.viewers}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-ink-100">
                  <div
                    className="h-full rounded-full bg-path-600"
                    style={{ width: `${f.viewers ? Math.round((f.completers / f.viewers) * 100) : 0}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-bold">Lessons completed per learner</h2>
          <ul className="mt-4 space-y-3">
            {data.completionBuckets.map((b) => (
              <li key={b.bucket} className="flex items-center gap-3 text-sm">
                <span className="w-12 text-ink-600">{b.bucket}</span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                  <div className="h-full rounded-full bg-path-300" style={{ width: `${(b.count / maxBucket) * 100}%` }} />
                </div>
                <span className="w-8 text-right tabular-nums">{b.count}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
