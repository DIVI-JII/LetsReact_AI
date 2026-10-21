import { Minus, Plus, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { Button } from '../ui/Button';
import { DemoFrame } from './DemoFrame';

export function StateVisual() {
  const [history, setHistory] = useState<number[]>([0]);
  const count = history[history.length - 1];

  return (
    <DemoFrame
      filename="Counter.jsx"
      code={`const [count, setCount] = useState(0);\n\n<button onClick={() => setCount(count + 1)}>\n  Increase\n</button>`}
      footer={
        <Button
          variant="accent"
          size="sm"
          icon={<Plus size={15} />}
          onClick={() => setHistory((h) => [...h, h[h.length - 1] + 1].slice(-6))}
        >
          Increase
        </Button>
      }
    >
      <div className="text-center">
        <p className="text-sm font-medium text-ink-600">Counter</p>
        <p className="font-display text-7xl font-extrabold tabular-nums text-ink-950">
          <AnimatedNumber value={count} />
        </p>
        <p className="mt-2 h-5 font-mono text-sm text-ink-500" aria-label="Values so far">
          {history.slice(-4).join(' → ')}
        </p>
      </div>
    </DemoFrame>
  );
}

export function StateInteractive() {
  const [count, setCount] = useState(0);
  const [renders, setRenders] = useState(1);

  const change = (next: number) => {
    setCount(next);
    setRenders((r) => r + 1);
  };

  return (
    <DemoFrame
      filename="Counter.jsx"
      code={`const [count, setCount] = useState(0);\n\n<h2>{count}</h2>\n<button onClick={() => setCount(count + 1)}>Increase</button>\n<button onClick={() => setCount(count - 1)}>Decrease</button>\n<button onClick={() => setCount(0)}>Reset</button>`}
      footer={
        <>
          <Button variant="primary" size="sm" icon={<Plus size={15} />} onClick={() => change(count + 1)}>
            Increase
          </Button>
          <Button variant="secondary" size="sm" icon={<Minus size={15} />} onClick={() => change(count - 1)}>
            Decrease
          </Button>
          <Button variant="ghost" size="sm" icon={<RotateCcw size={15} />} onClick={() => change(0)}>
            Reset
          </Button>
        </>
      }
    >
      <div className="w-full text-center">
        <p className="font-display text-7xl font-extrabold tabular-nums text-ink-950">
          <AnimatedNumber value={count} />
        </p>
        <div className="mx-auto mt-4 max-w-[14rem] rounded-xl bg-ink-50 px-4 py-3 text-left font-mono text-xs text-ink-700">
          <p>
            count = <span className="font-semibold text-path-800">{count}</span>
          </p>
          <p className="mt-1 text-ink-500">rendered {renders} {renders === 1 ? 'time' : 'times'}</p>
        </div>
      </div>
    </DemoFrame>
  );
}
