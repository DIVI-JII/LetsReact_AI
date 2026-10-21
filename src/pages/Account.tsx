import { Download, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { FormField } from '../components/ui/FormField';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import { PageShell } from '../components/ui/PageShell';
import { useAuth } from '../hooks/useAuth';
import { useProgress } from '../hooks/useProgress';
import { ApiError, api } from '../lib/api';

function ChangePassword() {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [fields, setFields] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setFields({});
    setMessage(null);
    try {
      await api.post('/api/auth/change-password', { currentPassword: current, newPassword: next });
      setCurrent('');
      setNext('');
      setMessage({ ok: true, text: 'Password updated. You’ve been signed out on your other devices.' });
    } catch (err) {
      if (err instanceof ApiError) {
        setFields(err.fields ?? {});
        setMessage({ ok: false, text: err.message });
      } else setMessage({ ok: false, text: 'Something went wrong. Please try again.' });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="text-lg font-bold">Change password</h2>
      <form onSubmit={onSubmit} className="mt-4 max-w-sm space-y-4" noValidate>
        <FormField id="current" label="Current password" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} error={fields.currentPassword} />
        <FormField id="next" label="New password" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} error={fields.newPassword} hint="At least 10 characters." />
        {message && (
          <p role="status" className={message.ok ? 'text-sm font-medium text-emerald-700' : 'text-sm font-medium text-red-700'}>
            {message.text}
          </p>
        )}
        <Button type="submit" disabled={busy || !current || !next}>
          {busy ? 'Updating…' : 'Update password'}
        </Button>
      </form>
    </Card>
  );
}

function DeleteAccount() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onDelete = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api.delete('/api/account', { password });
      await logout().catch(() => undefined);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong. Please try again.');
      setBusy(false);
    }
  };

  return (
    <>
      <Button variant="secondary" icon={<Trash2 size={16} />} onClick={() => setOpen(true)} className="text-red-700">
        Delete my account
      </Button>
      <Modal open={open} onClose={() => setOpen(false)} label="Delete account">
        <form onSubmit={onDelete} className="p-6 sm:p-7" noValidate>
          <h2 className="pr-8 text-xl font-bold">Delete your account?</h2>
          <p className="mt-2 text-ink-600">
            This permanently removes your account, progress and activity history. It can’t be undone.
          </p>
          <div className="mt-5">
            <FormField id="delete-password" label="Confirm with your password" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} error={error ?? undefined} />
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Keep my account
            </Button>
            <Button type="submit" variant="primary" disabled={busy || !password} className="!bg-red-700 hover:!bg-red-800">
              {busy ? 'Deleting…' : 'Delete permanently'}
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default function Account() {
  const { user } = useAuth();
  const { resetProgress } = useProgress();
  const [confirmReset, setConfirmReset] = useState(false);

  if (!user) return null;
  return (
    <PageShell className="max-w-3xl">
      <PageHeader title="Your account" description="Manage your sign-in and your data." />
      <div className="space-y-5">
        <Card className="p-6">
          <h2 className="text-lg font-bold">Profile</h2>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-ink-600">Name</dt>
              <dd className="mt-0.5 font-semibold text-ink-950">{user.name}</dd>
            </div>
            <div>
              <dt className="text-ink-600">Email</dt>
              <dd className="mt-0.5 font-semibold text-ink-950">{user.email}</dd>
            </div>
          </dl>
        </Card>

        <ChangePassword />

        <Card className="p-6">
          <h2 className="text-lg font-bold">Your data</h2>
          <p className="mt-1 text-sm text-ink-600">Download everything we hold about you, or start your course over.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {/* A plain link: the browser sends the session cookie and saves the file. */}
            <a href="/api/account/export" download className="btn btn-md btn-secondary">
              <Download size={16} aria-hidden="true" />
              <span>Download my data</span>
            </a>
            {confirmReset ? (
              <Button
                variant="secondary"
                onClick={() => {
                  resetProgress();
                  setConfirmReset(false);
                }}
              >
                Yes, reset my progress
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => setConfirmReset(true)}>
                Reset my progress
              </Button>
            )}
          </div>
        </Card>

        <Card className="border-red-100 p-6">
          <h2 className="text-lg font-bold">Delete account</h2>
          <p className="mb-4 mt-1 text-sm text-ink-600">Permanently remove your account and everything attached to it.</p>
          <DeleteAccount />
        </Card>
      </div>
    </PageShell>
  );
}
