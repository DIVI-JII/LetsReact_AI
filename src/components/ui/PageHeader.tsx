import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  description?: string;
  back?: { to: string; label: string };
  actions?: ReactNode;
  children?: ReactNode;
}

export function PageHeader({ title, description, back, actions, children }: PageHeaderProps) {
  return (
    <header className="mb-8 sm:mb-10">
      {back && (
        <Link
          to={back.to}
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-ink-600 transition hover:text-ink-950"
        >
          <ArrowLeft size={15} />
          {back.label}
        </Link>
      )}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
          {description && <p className="mt-2 text-base text-ink-600 sm:text-lg">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
      </div>
      {children}
    </header>
  );
}
