import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-ink-200 bg-white/60 px-6 py-12 text-center">
      <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-path-50 text-path-700">
        <Icon size={22} />
      </span>
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="mt-1.5 max-w-sm text-sm text-ink-600">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
