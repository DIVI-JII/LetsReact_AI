import { Download, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorNote, Pagination, StatusPill, fmtDate } from '../../components/admin/bits';
import { useFetch } from '../../hooks/useFetch';
import type { AdminUsersResponse } from '../../types/api';
import { timeAgo } from '../../utils/date';

export default function AdminUsers() {
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [status, setStatus] = useState('');
  const [role, setRole] = useState('');
  const [sort, setSort] = useState('last_active');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => {
      setDebounced(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [search]);

  const params = new URLSearchParams({ sort, dir: sort === 'name' ? 'asc' : 'desc', page: String(page), pageSize: '25' });
  if (debounced) params.set('search', debounced);
  if (status) params.set('status', status);
  if (role) params.set('role', role);

  const { data, error, loading, reload } = useFetch<AdminUsersResponse>(`/api/admin/users?${params}`);
  const sel = 'field !w-auto !py-2 text-sm';

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[14rem] flex-1">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" aria-hidden="true" />
          <input
            className="field !pl-10"
            placeholder="Search name or email"
            aria-label="Search learners"
            maxLength={100}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select className={sel} aria-label="Status" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="disabled">Disabled</option>
        </select>
        <select className={sel} aria-label="Role" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
          <option value="">All roles</option>
          <option value="learner">Learners</option>
          <option value="admin">Admins</option>
        </select>
        <select className={sel} aria-label="Sort by" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}>
          <option value="last_active">Last active</option>
          <option value="created">Newest</option>
          <option value="progress">Most lessons</option>
          <option value="name">Name</option>
        </select>
        <a href="/api/admin/export/users.csv" className="btn btn-md btn-secondary">
          <Download size={16} aria-hidden="true" />
          <span>CSV</span>
        </a>
      </div>

      {error && <ErrorNote message={error} onRetry={reload} />}

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[40rem] text-left text-sm">
          <thead className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">Learner</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Lessons</th>
              <th className="px-4 py-3 text-right">Challenges</th>
              <th className="px-4 py-3 text-right">Quiz avg</th>
              <th className="px-4 py-3">Last active</th>
            </tr>
          </thead>
          <tbody className={loading ? 'opacity-60' : undefined}>
            {data?.users.map((u) => (
              <tr key={u.id} className="border-b border-ink-50 last:border-0 hover:bg-ink-50/60">
                <td className="px-4 py-3">
                  <Link to={`/admin/users/${u.id}`} className="font-semibold text-ink-950 hover:text-path-700">
                    {u.name}
                    {u.role === 'admin' && <span className="ml-2 rounded bg-path-50 px-1.5 py-0.5 text-[11px] font-bold text-path-800">ADMIN</span>}
                  </Link>
                  <div className="text-xs text-ink-500">{u.email}</div>
                </td>
                <td className="px-4 py-3"><StatusPill status={u.status} /></td>
                <td className="px-4 py-3 text-right tabular-nums">{u.lessonsCompleted}</td>
                <td className="px-4 py-3 text-right tabular-nums">{u.challengesCompleted}</td>
                <td className="px-4 py-3 text-right tabular-nums">{u.quizAverage == null ? '—' : `${Math.round(u.quizAverage)}%`}</td>
                <td className="px-4 py-3 text-ink-600" title={fmtDate(u.lastActiveAt)}>
                  {u.lastActiveAt ? timeAgo(u.lastActiveAt) : 'Never'}
                </td>
              </tr>
            ))}
            {data && data.users.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-10 text-center text-ink-600">No learners match.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {data && <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPage={setPage} />}
    </div>
  );
}
