import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Lightbulb, Play, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { PracticeTask } from '../types';
import { cn } from '../utils/cn';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { Button } from './ui/Button';
import { CodePreview } from './ui/CodePreview';

interface PracticeAreaProps {
  task: PracticeTask;
  solved: boolean;
  onSolved: () => void;
}

const strip = (s: string) => s.replace(/\s+/g, '');

export function PracticeArea({ task, solved, onSolved }: PracticeAreaProps) {
  const initial = task.initialValue ?? '';
  const [value, setValue] = useState(solved ? task.accepted[0] : initial);
  const [status, setStatus] = useState<'idle' | 'wrong' | 'right'>(solved ? 'right' : 'idle');
  const [showHint, setShowHint] = useState(false);
  const [count, setCount] = useState(0);
  const [lastStep, setLastStep] = useState(0);

  const numeric = Number(value);
  const isNumeric = value.trim() !== '' && Number.isFinite(numeric);

  const message = (() => {
    if (status === 'right') return task.success;
    if (status === 'wrong') {
      if (value.trim() === '') return 'Type something into the blank first, then press Try.';
      if (task.counterStep && isNumeric) {
        return `The counter went up by ${numeric}. We're aiming for 2 on each click.`;
      }
      return task.nearMiss;
    }
    return null;
  })();

  const tryIt = () => {
    const correct = task.accepted.some((a) => strip(a) === strip(value));
    setStatus(correct ? 'right' : 'wrong');
    if (correct) onSolved();
    if (task.counterStep && isNumeric) {
      setCount((c) => c + numeric);
      setLastStep(numeric);
    }
  };

  const reset = () => {
    setValue(initial);
    setStatus('idle');
    setShowHint(false);
    setCount(0);
    setLastStep(0);
  };

  const width = `${Math.max(value.length, task.placeholder.length, 3) + 1}ch`;

  return (
    <div>
      <h3 className="text-2xl font-bold sm:text-[26px]">{task.prompt}</h3>
      <p className="mt-2 text-ink-600">{task.instructions}</p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="flex flex-col">
          <div className="code-block flex-1">
            <pre className="overflow-x-auto whitespace-pre-wrap px-4 py-4 [overflow-wrap:anywhere]">
              <code>
                <span className="text-ink-300">{task.codePrefix}</span>
                <input
                  value={value}
                  onChange={(e) => {
                    setValue(e.target.value);
                    if (status !== 'idle') setStatus('idle');
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') tryIt();
                  }}
                  placeholder={task.placeholder}
                  aria-label="Your answer"
                  spellCheck={false}
                  autoComplete="off"
                  style={{ width }}
                  className={cn(
                    'rounded-md border-b-2 bg-white/10 px-1.5 py-0.5 font-mono text-[13px] outline-none transition-colors placeholder:text-ink-500 focus:bg-white/15',
                    status === 'right' && 'border-emerald-400 text-emerald-300',
                    status === 'wrong' && 'border-amber-400 text-amber-200',
                    status === 'idle' && 'border-path-400 text-path-200',
                  )}
                />
                <span className="text-ink-300">{task.codeSuffix}</span>
              </code>
            </pre>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="accent" size="sm" icon={<Play size={15} />} onClick={tryIt}>
              Try
            </Button>
            <Button
              variant="secondary"
              size="sm"
              icon={<Lightbulb size={15} />}
              onClick={() => setShowHint((v) => !v)}
              aria-expanded={showHint}
            >
              Hint
            </Button>
            <Button variant="ghost" size="sm" icon={<RotateCcw size={15} />} onClick={reset}>
              Reset
            </Button>
          </div>
        </div>

        <CodePreview title="Result" className="min-h-[11rem]">
          {task.counterStep ? (
            <div className="text-center">
              <p className="font-display text-6xl font-extrabold tabular-nums text-ink-950">
                <AnimatedNumber value={count} />
              </p>
              <p className="mt-2 h-5 text-sm text-ink-600">
                {lastStep ? `Last click added ${lastStep}` : 'Press Try to click the button once'}
              </p>
            </div>
          ) : status === 'right' ? (
            <motion.p
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 360, damping: 22 }}
              className="rounded-xl bg-emerald-50 px-4 py-2.5 font-display text-xl font-bold text-emerald-800"
            >
              {task.result}
            </motion.p>
          ) : (
            <p className="text-sm text-ink-500">Your result shows up here.</p>
          )}
        </CodePreview>
      </div>

      <div aria-live="polite" className="mt-4 space-y-3">
        <AnimatePresence>
          {showHint && (
            <motion.div
              key="hint"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex gap-3 rounded-2xl border border-path-200 bg-path-50 p-4 text-[15px] text-path-900">
                <Lightbulb size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
                <p>{task.hint}</p>
              </div>
            </motion.div>
          )}
          {message && (
            <motion.div
              key={`${status}-${message}`}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={cn(
                'flex gap-3 rounded-2xl border p-4 text-[15px]',
                status === 'right'
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-amber-200 bg-amber-50 text-amber-900',
              )}
            >
              {status === 'right' && (
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
              )}
              <p>{message}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
