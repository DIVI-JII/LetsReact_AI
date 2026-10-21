import { Heart } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Button } from '../ui/Button';
import { DemoFrame } from './DemoFrame';

const steps = ['Click event', 'handleLike runs', 'Screen updates'];

export function EventsVisual() {
  const [active, setActive] = useState(0);
  const [likes, setLikes] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(
    () => () => {
      timers.current.forEach((t) => window.clearTimeout(t));
    },
    [],
  );

  const press = () => {
    if (active !== 0) return;
    setActive(1);
    timers.current.push(window.setTimeout(() => setActive(2), 450));
    timers.current.push(
      window.setTimeout(() => {
        setActive(3);
        setLikes((n) => n + 1);
      }, 900),
    );
    timers.current.push(window.setTimeout(() => setActive(0), 1700));
  };

  return (
    <DemoFrame
      filename="LikeButton.jsx"
      code={`function handleLike() {\n  setLikes(likes + 1);\n}\n\n<button onClick={handleLike}>Like</button>`}
    >
      <div className="flex w-full flex-col items-center gap-5">
        <Button
          variant="primary"
          icon={<Heart size={16} className={likes > 0 ? 'fill-current' : ''} />}
          onClick={press}
          disabled={active !== 0}
        >
          Like · <AnimatedNumber value={likes} />
        </Button>
        <ol className="flex w-full max-w-sm flex-col gap-2 sm:flex-row" aria-label="What happens after a click">
          {steps.map((label, i) => (
            <li
              key={label}
              className={cn(
                'flex-1 rounded-lg border px-3 py-2 text-center text-xs font-semibold transition-colors duration-300',
                active > i
                  ? 'border-path-300 bg-path-50 text-path-800'
                  : active === i + 1
                    ? 'border-path-300 bg-path-50 text-path-800'
                    : 'border-ink-200 bg-white text-ink-500',
              )}
            >
              {label}
            </li>
          ))}
        </ol>
      </div>
    </DemoFrame>
  );
}

export function EventsInteractive() {
  const [log, setLog] = useState<string[]>([]);
  const add = (message: string) => setLog((l) => [message, ...l].slice(0, 5));

  return (
    <DemoFrame
      filename="Playground.jsx"
      code={`<button onClick={() => log('click')}>Click me</button>\n\n<div onMouseEnter={() => log('hover')}>\n  Hover me\n</div>\n\n<input\n  onChange={(e) => log('typed: ' + e.target.value)}\n/>`}
    >
      <div className="flex w-full max-w-xs flex-col gap-3">
        <Button size="sm" variant="primary" onClick={() => add('click')}>
          Click me
        </Button>
        <div
          onMouseEnter={() => add('hover')}
          className="rounded-xl border border-dashed border-ink-300 px-4 py-3 text-center text-sm text-ink-700 transition-colors hover:border-path-400 hover:bg-path-50"
        >
          Hover me
        </div>
        <label className="sr-only" htmlFor="events-input">
          Type something
        </label>
        <input
          id="events-input"
          className="field"
          placeholder="Type something"
          onChange={(e) => add(`typed: ${e.target.value}`)}
        />
        <div className="rounded-xl bg-ink-50 p-3" aria-live="polite">
          <p className="text-xs font-semibold text-ink-600">Event log</p>
          {log.length === 0 ? (
            <p className="mt-1 text-sm text-ink-500">Try the controls above.</p>
          ) : (
            <ul className="mt-1 space-y-0.5 font-mono text-xs text-ink-800">
              {log.map((entry, i) => (
                <li key={`${entry}-${i}`} className={i === 0 ? 'font-semibold text-path-800' : ''}>
                  {entry}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </DemoFrame>
  );
}
