import type { ReactNode } from 'react';
import { cn } from '../../utils/cn';

export function PageShell({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('container-x py-8 sm:py-12', className)}>{children}</div>;
}
