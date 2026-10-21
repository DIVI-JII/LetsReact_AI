import type { ReactNode } from 'react';
import { CodeBlock } from '../ui/CodeBlock';
import { CodePreview } from '../ui/CodePreview';

interface DemoFrameProps {
  code: string;
  filename: string;
  /** Rendered inside the preview frame. */
  children: ReactNode;
  /** Controls shown under the preview. */
  footer?: ReactNode;
}

/** Code on one side, what it produces on the other. Stacks on small screens. */
export function DemoFrame({ code, filename, children, footer }: DemoFrameProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <CodeBlock code={code} filename={filename} className="h-full" />
      <div className="flex flex-col gap-3">
        <CodePreview className="min-h-[11rem] flex-1">{children}</CodePreview>
        {footer && <div className="flex flex-wrap items-center gap-2">{footer}</div>}
      </div>
    </div>
  );
}
