import type { ReactNode } from 'react';

// A tiny, dependency-free highlighter. Good enough for short teaching snippets.
const TOKEN =
  /(\/\/.*|\{\/\*[\s\S]*?\*\/\})|('[^'\n]*'|"[^"\n]*"|`[^`\n]*`)|(<\/?[A-Za-z][\w.]*|\/?>)|\b(import|from|export|default|function|return|const|let|if|else|true|false|null)\b|\b(\d+)\b|\b(use[A-Z]\w*)\b/g;

const CLASSES = ['', 'tok-com', 'tok-str', 'tok-tag', 'tok-kw', 'tok-num', 'tok-hook'];

export function highlight(code: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const match of code.matchAll(TOKEN)) {
    const start = match.index ?? 0;
    if (start > last) nodes.push(code.slice(last, start));
    let group = 1;
    while (group < match.length && match[group] === undefined) group++;
    nodes.push(
      <span key={key++} className={CLASSES[group]}>
        {match[0]}
      </span>,
    );
    last = start + match[0].length;
  }
  if (last < code.length) nodes.push(code.slice(last));
  return nodes;
}
