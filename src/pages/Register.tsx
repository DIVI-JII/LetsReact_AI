import { useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { FormField } from '../components/ui/FormField';
import { Button } from '../components/ui/Button';
import { PageShell } from '../components/ui/PageShell';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../lib/api';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setFields({});
    setBusy(true);
    try {
      await register(name.trim(), email.trim(), password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      if (err instanceof ApiError) {
        setFields(err.fields ?? {});
        // Field-level messages are shown beside the inputs; show the summary only when there are none.
        setError(err.fields && Object.keys(err.fields).length > 0 ? null : err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
      setBusy(false);
    }
  };

  return (
    <PageShell className="flex max-w-md flex-col py-12 sm:py-20">
      <h1 className="text-3xl font-extrabold">Create your account</h1>
      <p className="mt-2 text-ink-600">Your progress is saved, so you can continue on any device.</p>

      <form onSubmit={onSubmit} className="card mt-8 space-y-5 p-6 sm:p-7" noValidate>
        {error && (
          <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {error}
          </p>
        )}
        <FormField
          id="name"
          label="Name"
          autoComplete="name"
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={fields.name}
        />
        <FormField
          id="email"
          label="Email"
          type="email"
          autoComplete="username"
          inputMode="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={fields.email}
        />
        <FormField
          id="new-password"
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fields.password}
          hint="At least 10 characters. A short phrase works well."
        />
        <Button type="submit" variant="accent" size="lg" className="w-full" disabled={busy || !name || !email || !password}>
          {busy ? 'Creating account…' : 'Create account'}
        </Button>
        <p className="text-xs leading-5 text-ink-500">
          We record your lessons, quiz scores and activity so you can track progress. Administrators of this site can see
          them. Questions you ask the lesson tutor are sent to an AI provider (NVIDIA or Google) to produce an answer; they are not stored by this site. You can download or delete your data from your account page at any time.
        </p>
      </form>

      <p className="mt-6 text-center text-sm text-ink-600">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-path-700 hover:underline">
          Sign in
        </Link>
      </p>
    </PageShell>
  );
}
