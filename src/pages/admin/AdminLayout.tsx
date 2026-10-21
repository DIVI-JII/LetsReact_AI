import { NavLink, Outlet } from 'react-router-dom';
import { PageShell } from '../../components/ui/PageShell';
import { cn } from '../../utils/cn';

const tabs = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/users', label: 'Learners', end: false },
  { to: '/admin/audit', label: 'Audit log', end: false },
];

export default function AdminLayout() {
  return (
    <PageShell>
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-path-700">Admin portal</p>
        <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">Learner activity</h1>
        <nav aria-label="Admin" className="mt-5 flex gap-1 overflow-x-auto border-b border-ink-100">
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                cn(
                  '-mb-px whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-semibold transition',
                  isActive ? 'border-path-600 text-ink-950' : 'border-transparent text-ink-600 hover:text-ink-950',
                )
              }
            >
              {t.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <Outlet />
    </PageShell>
  );
}
