import { AnimatePresence, motion } from 'framer-motion';
import { Check, Circle, Lightbulb } from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface PanelContent {
  title: string;
  summary: string;
  requirements: string[];
  hints: string[];
}

interface ChallengePanelProps {
  challenge: PanelContent;
  /** Optional extra block under the summary (badges, time, concepts). */
  header?: ReactNode;
  attempts: number;
  hintsShown: number;
  onShowHint: () => void;
  /** One entry per requirement: has the latest run satisfied it? */
  requirementsMet: boolean[];
}

/** Instructions column: what to build, requirements, hints and attempts. */
export function ChallengePanel({
  challenge,
  header,
  attempts,
  hintsShown,
  onShowHint,
  requirementsMet,
}: ChallengePanelProps) {
  const hasMoreHints = hintsShown < challenge.hints.length;
  return (
    <div className="card h-full p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-2xl font-extrabold">{challenge.title}</h2>
        <Badge tone="neutral">
          {attempts} {attempts === 1 ? 'attempt' : 'attempts'}
        </Badge>
      </div>
      <p className="mt-2 text-[15px] leading-6 text-ink-600">{challenge.summary}</p>
      {header}

      <h3 className="mt-6 text-base font-bold">Requirements</h3>
      <ul className="mt-3 space-y-2.5">
        {challenge.requirements.map((req, i) => {
          const met = requirementsMet[i];
          return (
            <li key={req} className="flex items-center gap-3 text-[15px]">
              <span
                className={cn(
                  'inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors',
                  met ? 'bg-emerald-500 text-white' : 'bg-ink-100 text-ink-400',
                )}
                aria-hidden="true"
              >
                {met ? <Check size={14} strokeWidth={3} /> : <Circle size={8} fill="currentColor" />}
              </span>
              <span className={met ? 'text-ink-900' : 'text-ink-700'}>{req}</span>
              <span className="sr-only">{met ? 'Done' : 'Not done yet'}</span>
            </li>
          );
        })}
      </ul>

      <h3 className="mt-6 text-base font-bold">Hints</h3>
      <div aria-live="polite" className="mt-3 space-y-2.5">
        <AnimatePresence initial={false}>
          {challenge.hints.slice(0, hintsShown).map((hint, i) => (
            <motion.div
              key={hint}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5 rounded-xl border border-path-200 bg-path-50 p-3 text-sm text-path-900"
            >
              <Lightbulb size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
              <span>
                <span className="sr-only">Hint {i + 1}: </span>
                {hint}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {hintsShown === 0 && (
        <p className="mt-1 text-sm text-ink-600">Stuck? Hints appear one at a time.</p>
      )}
      <Button
        className="mt-3"
        variant="secondary"
        size="sm"
        icon={<Lightbulb size={15} />}
        disabled={!hasMoreHints}
        onClick={onShowHint}
      >
        {hasMoreHints ? (hintsShown === 0 ? 'Show a hint' : 'Show another hint') : 'No more hints'}
      </Button>
    </div>
  );
}
