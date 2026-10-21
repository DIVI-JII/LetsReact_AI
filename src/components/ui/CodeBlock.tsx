import { useMemo } from 'react';
import { cn } from '../../utils/cn';
import { highlight } from '../../utils/highlight';

interface CodeBlockProps {
  code: string;
  filename?: string;
  /** Shows a blinking caret after the last character. */
  caret?: boolean;
  className?: string;
}

export function CodeBlock({ code, filename, caret, className }: CodeBlockProps) {
  const nodes = useMemo(() => highlight(code), [code]);
  return (
    <div className={cn('code-block', className)}>
      {filename && (
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          </span>
          <span className="ml-1 text-xs text-ink-400">{filename}</span>
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-4">
        <code>
          {nodes}
          {caret && (
            <span
              aria-hidden="true"
              className="ml-px inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-blink bg-path-300"
            />
          )}
        </code>
      </pre>
    </div>
  );
}
