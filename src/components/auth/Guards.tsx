import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProgress } from '../../hooks/useProgress';

export function FullPageSpinner({ label = 'Loading' }: { label?: string }) {
  return (
    <div role="status" className="flex min-h-[50vh] items-center justify-center">
      <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-ink-200 border-t-path-600" />
      <span className="sr-only">{label}</span>
    </div>
  );
}

/**
 * Keeps signed-out visitors out of the learning app. This is a convenience for the user:
 * the real protection is the server, which refuses every API call without a valid session.
 */
export function RequireAuth() {
  const { user, status } = useAuth();
  const { ready } = useProgress();
  const location = useLocation();

  if (status === 'loading' || (user && !ready)) return <FullPageSpinner />;
  if (!user) {
    return <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
  }
  return <Outlet />;
}

/** Hides the admin screens from non-admins. The server enforces the same rule on every /api/admin call. */
export function RequireAdmin() {
  const { user } = useAuth();
  if (user?.role !== 'admin') return <Navigate to="/dashboard" replace />;
  return <Outlet />;
}
