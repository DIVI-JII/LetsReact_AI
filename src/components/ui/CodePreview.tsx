import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CodePreviewProps {
  title?: string;
  className?: string;
  bodyClassName?: string;
  children: ReactNode;
}

/** A small browser-style frame that shows what the code on screen produces. */
export function CodePreview({
  title = 'Preview',
  className,
  bodyClassName,
  children,
}: CodePreviewProps) {
  return (
    <div className={cn('flex flex-col overflow-hidden rounded-2xl border border-ink-200 bg-white', className)}>
      <div className="flex items-center gap-2 border-b border-ink-100 bg-ink-50 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
          <span className="h-2.5 w-2.5 rounded-full bg-ink-200" />
        </span>
        <span className="ml-1 text-xs font-medium text-ink-500">{title}</span>
      </div>
      <div
        className={cn('flex flex-1 items-center justify-center p-6', bodyClassName)}
        aria-live="polite"
      >
        {children}
      </div>
    </div>
  );
}
