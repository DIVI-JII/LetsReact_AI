import { useState } from 'react';
import type { CounterFeatures } from '../utils/challenge';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { Button } from './ui/Button';
import { CodePreview } from './ui/CodePreview';

const labels = { increase: 'Increase', decrease: 'Decrease', reset: 'Reset' } as const;

/** Renders whatever the learner's code has built so far. */
export function CounterPreview({ features }: { features: CounterFeatures }) {
  const [count, setCount] = useState(0);
  const empty = !features.display && features.actions.length === 0;

  const run = (action: 'increase' | 'decrease' | 'reset') => {
    setCount((c) => (action === 'increase' ? c + 1 : action === 'decrease' ? c - 1 : 0));
  };

  return (
    <CodePreview title="Live preview" className="min-h-[14rem]">
      {empty ? (
        <p className="max-w-[16rem] text-center text-sm text-ink-500">
          Your counter appears here as you build it. Run the tests to update this preview.
        </p>
      ) : (
        <div className="text-center">
          {features.display && (
            <p className="font-display text-6xl font-extrabold tabular-nums text-ink-950">
              <AnimatedNumber value={count} />
            </p>
          )}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {features.actions.map((a) => (
              <Button key={a} size="sm" variant={a === 'reset' ? 'secondary' : 'primary'} onClick={() => run(a)}>
                {labels[a]}
              </Button>
            ))}
          </div>
        </div>
      )}
    </CodePreview>
  );
}
