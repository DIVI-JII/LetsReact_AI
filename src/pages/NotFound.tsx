import { Compass } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { PageShell } from '../components/ui/PageShell';

interface NotFoundProps {
  title?: string;
  description?: string;
}

export default function NotFound({
  title = 'This page doesn’t exist',
  description = 'The link may be old or mistyped. Head back to your dashboard to pick up where you left off.',
}: NotFoundProps) {
  return (
    <PageShell className="max-w-2xl">
      <EmptyState
        icon={Compass}
        title={title}
        description={description}
        action={<Button to="/dashboard">Go to dashboard</Button>}
      />
    </PageShell>
  );
}
