import { useState } from 'react';
import { ErrorNote, Pagination, fmtDate } from '../../components/admin/bits';
import { useFetch } from '../../hooks/useFetch';
import type { AuditEntry } from '../../types/api';

interface AuditResponse {
  entries: AuditEntry[];
  total: number;
  page: number;
  pageSize: number;
}

export default function AdminAudit() {
  const [page, setPage] = useState(1);
  const { data, error, loading, reload } = useFetch<AuditResponse>(`/api/admin/audit?page=${page}&pageSize=50`);

  return (
    <div>
      <p className="mb-4 text-sm text-ink-600">
        Every admin action, failed sign-in and view of a learner’s record is listed here. Entries can’t be edited from the app.
      </p>
      {error && <ErrorNote message={error} onRetry={reload} />}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[44rem] text-left text-sm">
          <thead className="border-b border-ink-100 text-xs uppercase tracking-wide text-ink-500">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Who</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">IP</th>
            </tr>
          </thead>
          <tbody className={loading ? 'opacity-60' : undefined}>
            {data?.entries.map((e) => (
              <tr key={e.id} className="border-b border-ink-50 align-top last:border-0">
                <td className="whitespace-nowrap px-4 py-3 text-ink-600">{fmtDate(e.createdAt)}</td>
                <td className="px-4 py-3">{e.actorEmail ?? '—'}</td>
                <td className="px-4 py-3 font-medium">{e.action.replace(/_/g, ' ')}</td>
                <td className="px-4 py-3">{e.targetEmail ?? e.targetUserId ?? '—'}</td>
                <td className="px-4 py-3 text-ink-600">{e.ip ?? '—'}</td>
              </tr>
            ))}
            {data && data.entries.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-ink-600">Nothing logged yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {data && <Pagination page={data.page} pageSize={data.pageSize} total={data.total} onPage={setPage} />}
    </div>
  );
}
