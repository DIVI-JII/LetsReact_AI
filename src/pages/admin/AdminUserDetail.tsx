import { ShieldCheck, UserCheck, UserX } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import { ErrorNote, StatTile, StatusPill, fmtDate } from '../../components/admin/bits';
import { Button } from '../../components/ui/Button';
import { FormField } from '../../components/ui/FormField';
import { Modal } from '../../components/ui/Modal';
import { PageHeader } from '../../components/ui/PageHeader';
import { weeks } from '../../data';
import { getLesson } from '../../data/lessons';
import { useAuth } from '../../hooks/useAuth';
import { useFetch } from '../../hooks/useFetch';
import { ApiError, api } from '../../lib/api';
import type { ActivityEvent, AdminUserDetail as Detail } from '../../types/api';
import { describeEvent } from '../../utils/describeEvent';
import { getWeekProgress } from '../../utils/progress';

const PAGE = 40;

function Timeline({ userId }: { userId: string }) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (before?: string) => {
      setLoading(true);
      setError(null);
      try {
        const q = `/api/admin/users/${userId}/events?limit=${PAGE}${before ? `&before=${before}` : ''}`;
        const res = await api.get<{ events: ActivityEvent[]; hasMore: boolean }>(q);
        setEvents((prev) => (before ? [...prev, ...res.events] : res.events));
        setHasMore(res.hasMore);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : 'Something went wrong.');
      } finally {
        setLoading(false);
      }
    },
    [userId],
  );

  useEffect(() => {
    setEvents([]);
    void load();
  }, [load]);

  return (
    <section className="card p-6">
      <h2 className="text-lg font-bold">Activity timeline</h2>
      {error && <div className="mt-3"><ErrorNote message={error} /></div>}
      <ol className="mt-4 divide-y divide-ink-100">
        {events.map((e) => (
          <li key={e.id} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-2.5 text-sm">
            <span>{describeEvent(e)}</span>
            <time className="text-ink-500" dateTime={e.createdAt}>{fmtDate(e.createdAt)}</time>
          </li>
        ))}
        {!loading && events.length === 0 && <li className="py-4 text-sm text-ink-600">No activity recorded yet.</li>}
      </ol>
      {hasMore && (
        <div className="mt-4">
          <Button variant="secondary" size="sm" disabled={loading} onClick={() => void load(events[events.length - 1]?.id)}>
            {loading ? 'Loading…' : 'Load older activity'}
          </Button>
        </div>
      )}
    </section>
  );
}

export default function AdminUserDetail() {
  const { id = '' } = useParams();
  const { user: me } = useAuth();
  const { data, error, loading, reload } = useFetch<Detail>(`/api/admin/users/${id}`);
  const [actionError, setActionError] = useState<string | null>(null);
  const [roleOpen, setRoleOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);

  if (error) return <ErrorNote message={error} onRetry={reload} />;
  if (loading && !data) return <p className="text-ink-600">Loading…</p>;
  if (!data) return null;

  const u = data.user;
  const p = data.progress;
  const isSelf = me?.id === u.id;

  const run = async (fn: () => Promise<unknown>) => {
    setBusy(true);
    setActionError(null);
    try {
      await fn();
      reload();
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  const toggleStatus = () => {
    const next = u.status === 'active' ? 'disabled' : 'active';
    if (next === 'disabled' && !window.confirm(`Disable ${u.name}? They'll be signed out everywhere and can't sign in.`)) return;
    void run(() => api.patch(`/api/admin/users/${u.id}`, { status: next }));
  };

  const changeRole = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setPwError(undefined);
    try {
      await api.patch(`/api/admin/users/${u.id}`, { role: u.role === 'admin' ? 'learner' : 'admin', adminPassword: password });
      setRoleOpen(false);
      setPassword('');
      reload();
    } catch (err) {
      setPwError(err instanceof ApiError ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title={u.name} description={u.email} back={{ to: '/admin/users', label: 'All learners' }}
        actions={
          isSelf ? undefined : (
            <>
              <Button variant="secondary" size="sm" disabled={busy} onClick={toggleStatus}
                icon={u.status === 'active' ? <UserX size={16} /> : <UserCheck size={16} />}>
                {u.status === 'active' ? 'Disable' : 'Enable'}
              </Button>
              <Button variant="secondary" size="sm" disabled={busy}
                onClick={() => void run(() => api.post(`/api/admin/users/${u.id}/revoke-sessions`))}>
                Sign out everywhere
              </Button>
              <Button variant="secondary" size="sm" disabled={busy} icon={<ShieldCheck size={16} />} onClick={() => setRoleOpen(true)}>
                {u.role === 'admin' ? 'Make learner' : 'Make admin'}
              </Button>
            </>
          )
        } />
      {actionError && <ErrorNote message={actionError} />}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Status" value={<StatusPill status={u.status} />} hint={u.role === 'admin' ? 'Administrator' : 'Learner'} />
        <StatTile label="Lessons completed" value={u.lessonsCompleted} />
        <StatTile label="Challenges solved" value={u.challengesCompleted} />
        <StatTile label="Avg. quiz score" value={u.quizAverage == null ? '—' : `${Math.round(u.quizAverage)}%`} />
      </div>

      <dl className="card grid gap-4 p-6 text-sm sm:grid-cols-3">
        <div><dt className="text-ink-600">Joined</dt><dd className="font-semibold">{fmtDate(u.createdAt)}</dd></div>
        <div><dt className="text-ink-600">Last sign-in</dt><dd className="font-semibold">{fmtDate(u.lastLoginAt)}</dd></div>
        <div><dt className="text-ink-600">Last active</dt><dd className="font-semibold">{fmtDate(u.lastActiveAt)}</dd></div>
      </dl>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card p-6">
          <h2 className="text-lg font-bold">Progress by week</h2>
          <ul className="mt-4 space-y-3">
            {weeks.map((w) => {
              const pct = getWeekProgress(w, p?.completedLessons ?? []);
              return (
                <li key={w.number}>
                  <div className="flex justify-between text-sm">
                    <span>Week {w.number}: {w.title}</span>
                    <span className="tabular-nums text-ink-600">{pct}%</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-ink-100">
                    <div className="h-full rounded-full bg-path-600" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="card p-6">
          <h2 className="text-lg font-bold">Quiz scores</h2>
          <ul className="mt-4 divide-y divide-ink-100 text-sm">
            {Object.entries(p?.quizResults ?? {}).map(([lessonId, r]) => (
              <li key={lessonId} className="flex justify-between py-2">
                <span>{getLesson(lessonId)?.title ?? lessonId}</span>
                <span className="font-semibold tabular-nums">{r.percent}%</span>
              </li>
            ))}
            {Object.keys(p?.quizResults ?? {}).length === 0 && <li className="py-2 text-ink-600">No quizzes taken yet.</li>}
          </ul>
        </section>
      </div>

      <Timeline userId={u.id} />

      <section className="card p-6">
        <h2 className="text-lg font-bold">Active sessions</h2>
        <ul className="mt-4 divide-y divide-ink-100 text-sm">
          {data.sessions.map((s) => (
            <li key={s.id} className="py-2.5">
              <div className="font-medium">{s.ip ?? 'Unknown IP'} · last seen {fmtDate(s.lastSeenAt)}</div>
              <div className="truncate text-xs text-ink-500">{s.userAgent ?? 'Unknown device'}</div>
            </li>
          ))}
          {data.sessions.length === 0 && <li className="py-2 text-ink-600">Not signed in anywhere.</li>}
        </ul>
      </section>

      <Modal open={roleOpen} onClose={() => setRoleOpen(false)} label="Change role">
        <form onSubmit={changeRole} className="p-6 sm:p-7" noValidate>
          <h2 className="pr-8 text-xl font-bold">{u.role === 'admin' ? 'Remove admin access?' : 'Make this person an admin?'}</h2>
          <p className="mt-2 text-ink-600">Admins can see every learner’s activity. Confirm with your own password.</p>
          <div className="mt-5">
            <FormField id="admin-password" label="Your password" type="password" autoComplete="current-password"
              value={password} onChange={(e) => setPassword(e.target.value)} error={pwError} />
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setRoleOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={busy || !password}>Confirm</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
