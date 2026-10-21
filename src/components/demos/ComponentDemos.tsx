import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/Button';
import { DemoFrame } from './DemoFrame';

const people = ['Ada', 'Grace', 'Linus', 'Katherine', 'Alan'];

export function ComponentVisual() {
  const [count, setCount] = useState(1);
  const usage = Array.from({ length: count }, () => '<ProfileCard />').join('\n');
  return (
    <DemoFrame
      filename="App.jsx"
      code={`function ProfileCard() {\n  return <div className="card">…</div>;\n}\n\n// Used on the page:\n${usage}`}
      footer={
        <>
          <Button
            variant="accent"
            size="sm"
            icon={<Plus size={15} />}
            disabled={count >= 5}
            onClick={() => setCount((c) => c + 1)}
          >
            Add another card
          </Button>
          <Button
            variant="ghost"
            size="sm"
            icon={<Minus size={15} />}
            disabled={count <= 1}
            onClick={() => setCount((c) => c - 1)}
          >
            Remove one
          </Button>
        </>
      }
    >
      <div className="flex w-full flex-wrap justify-center gap-2.5">
        <AnimatePresence mode="popLayout">
          {people.slice(0, count).map((name) => (
            <motion.div
              key={name}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2"
            >
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-path-100 text-xs font-bold text-path-800">
                {name[0]}
              </span>
              <span className="text-sm font-semibold text-ink-900">{name}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </DemoFrame>
  );
}

const parts = ['Header', 'Stats', 'Footer'] as const;
type Part = (typeof parts)[number];
const blockStyles: Record<Part, string> = {
  Header: 'h-10 bg-ink-950 text-white',
  Stats: 'h-16 bg-path-100 text-path-900',
  Footer: 'h-8 bg-ink-200 text-ink-700',
};

export function ComponentInteractive() {
  const [shown, setShown] = useState<Part[]>(['Header', 'Stats']);
  const toggle = (p: Part) =>
    setShown((s) => (s.includes(p) ? s.filter((x) => x !== p) : [...s, p]));
  const ordered = parts.filter((p) => shown.includes(p));
  const lines = ordered.map((p) => `      <${p} />`).join('\n');

  return (
    <DemoFrame
      filename="App.jsx"
      code={`function App() {\n  return (\n    <main>\n${lines || '      {/* nothing yet */}'}\n    </main>\n  );\n}`}
      footer={
        <fieldset className="flex flex-wrap items-center gap-4">
          <legend className="sr-only">Components on the page</legend>
          {parts.map((p) => (
            <label key={p} className="flex items-center gap-2 text-sm font-medium text-ink-700">
              <input
                type="checkbox"
                checked={shown.includes(p)}
                onChange={() => toggle(p)}
                className="h-4 w-4 accent-path-600"
              />
              {p}
            </label>
          ))}
        </fieldset>
      }
    >
      <div className="flex w-full max-w-xs flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {ordered.map((p) => (
            <motion.div
              key={p}
              layout
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`flex items-center justify-center rounded-lg text-xs font-semibold ${blockStyles[p]}`}
            >
              {`<${p} />`}
            </motion.div>
          ))}
        </AnimatePresence>
        {ordered.length === 0 && (
          <p className="text-center text-sm text-ink-500">Tick a component to add it to the page.</p>
        )}
      </div>
    </DemoFrame>
  );
}
