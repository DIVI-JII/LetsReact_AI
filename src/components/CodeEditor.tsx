import { useRef } from 'react';
import type { KeyboardEvent, UIEvent } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  filename: string;
}

/** A lightweight editor: line numbers, tab-to-indent and a window frame. */
export function CodeEditor({ value, onChange, filename }: CodeEditorProps) {
  const gutterRef = useRef<HTMLDivElement>(null);
  const lineCount = value.split('\n').length;

  const onScroll = (e: UIEvent<HTMLTextAreaElement>) => {
    if (gutterRef.current) gutterRef.current.scrollTop = e.currentTarget.scrollTop;
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Tab') return;
    e.preventDefault();
    const el = e.currentTarget;
    const { selectionStart, selectionEnd } = el;
    onChange(`${value.slice(0, selectionStart)}  ${value.slice(selectionEnd)}`);
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = selectionStart + 2;
    });
  };

  return (
    <div className="code-block flex h-full min-h-[22rem] flex-col">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
          <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </span>
        <span className="ml-1 text-xs text-ink-400">{filename}</span>
      </div>
      <div className="flex min-h-0 flex-1">
        <div
          ref={gutterRef}
          aria-hidden="true"
          className="select-none overflow-hidden border-r border-white/10 px-3 py-4 text-right text-ink-500"
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={onScroll}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          wrap="off"
          aria-label={`Code editor for ${filename}`}
          className="min-w-0 flex-1 resize-none overflow-auto bg-transparent px-4 py-4 font-mono text-[13px] leading-6 text-ink-100 outline-none"
        />
      </div>
    </div>
  );
}
