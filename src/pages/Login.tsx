import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { FormField } from '../components/ui/FormField';
import { Button } from '../components/ui/Button';
import { PageShell } from '../components/ui/PageShell';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../lib/api';

/** Only follow same-site paths, so a crafted link can't bounce someone to another website. */
function safeNext(value: unknown): string | null {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : null;
}

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = safeNext((location.state as { from?: string } | null)?.from);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={from ?? (user.role === 'admin' ? '/admin' : '/dashboard')} replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const signedIn = await login(email.trim(), password);
      navigate(from ?? (signedIn.role === 'admin' ? '/admin' : '/dashboard'), { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
      setBusy(false);
    }
  };

  return (
    <PageShell className="flex max-w-md flex-col py-12 sm:py-20">
      <h1 className="text-3xl font-extrabold">Welcome back</h1>
      <p className="mt-2 text-ink-600">Sign in to pick up where you left off.</p>

      <form onSubmit={onSubmit} className="card mt-8 space-y-5 p-6 sm:p-7" noValidate>
        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </p>
        )}
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <FormField
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="accent" size="lg" className="w-full" disabled={busy || !email || !password}>
          {busy ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-600">
        New to LetsReact_AI?{' '}
        <Link to="/register" className="font-semibold text-path-700 hover:underline">
          Create an account
        </Link>
      </p>
      <p className="mt-2 text-center text-sm text-ink-500">Forgot your password? Ask your administrator to reset it.</p>
    </PageShell>
  );
}
