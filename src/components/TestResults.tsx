import { motion } from 'framer-motion';
import { Check, Circle, X } from 'lucide-react';
import type { TestResult } from '../utils/challenge';
import { cn } from '../utils/cn';

interface TestResultsProps {
  results: TestResult[];
  /** False until the learner has run the tests at least once. */
  hasRun: boolean;
}

export function TestResults({ results, hasRun }: TestResultsProps) {
  const passed = results.filter((r) => r.passed).length;
  const firstFail = results.find((r) => !r.passed);

  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold">Test results</h3>
        <span className="text-sm text-ink-600">
          {hasRun ? `${passed} of ${results.length} passing` : 'Not run yet'}
        </span>
      </div>
      <ul className="mt-3 space-y-2">
        {results.map((r) => {
          const state = !hasRun ? 'idle' : r.passed ? 'pass' : 'fail';
          return (
            <motion.li
              key={r.id}
              layout
              className="flex items-center gap-3 text-sm"
              animate={state === 'fail' ? { x: [0, -4, 4, 0] } : { x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span
                className={cn(
                  'inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full',
                  state === 'pass' && 'bg-emerald-500 text-white',
                  state === 'fail' && 'bg-amber-400 text-white',
                  state === 'idle' && 'bg-ink-100 text-ink-400',
                )}
                aria-hidden="true"
              >
                {state === 'pass' ? (
                  <Check size={12} strokeWidth={3} />
                ) : state === 'fail' ? (
                  <X size={12} strokeWidth={3} />
                ) : (
                  <Circle size={6} fill="currentColor" />
                )}
              </span>
              <span className={state === 'idle' ? 'text-ink-600' : 'text-ink-900'}>{r.label}</span>
              <span className="sr-only">
                {state === 'pass' ? 'Passing' : state === 'fail' ? 'Not passing yet' : 'Not run'}
              </span>
            </motion.li>
          );
        })}
      </ul>
      <div aria-live="polite" className="mt-4">
        {hasRun && firstFail && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-semibold">Next step</p>
            <p className="mt-0.5">{firstFail.failHint}</p>
          </div>
        )}
        {hasRun && !firstFail && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
            Every test passes. Nicely built.
          </div>
        )}
      </div>
    </div>
  );
}
