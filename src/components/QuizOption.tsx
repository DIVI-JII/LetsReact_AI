import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { cn } from '../utils/cn';

export type QuizOptionState = 'idle' | 'selected' | 'correct' | 'incorrect';

interface QuizOptionProps {
  letter: string;
  text: string;
  state: QuizOptionState;
  disabled?: boolean;
  onSelect: () => void;
}

const styles: Record<QuizOptionState, string> = {
  idle: 'border-ink-200 bg-white hover:border-path-300 hover:bg-path-50/40',
  selected: 'border-path-500 bg-path-50',
  correct: 'border-emerald-400 bg-emerald-50',
  incorrect: 'border-amber-300 bg-amber-50',
};

export function QuizOption({ letter, text, state, disabled, onSelect }: QuizOptionProps) {
  return (
    <motion.button
      type="button"
      role="radio"
      aria-checked={state === 'selected' || state === 'correct'}
      disabled={disabled}
      onClick={onSelect}
      whileTap={disabled ? undefined : { scale: 0.99 }}
      animate={state === 'incorrect' ? { x: [0, -6, 6, -4, 4, 0] } : { x: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        'flex w-full items-center gap-3.5 rounded-2xl border-2 px-4 py-3.5 text-left transition-colors duration-200',
        styles[state],
        disabled && state === 'idle' && 'opacity-60',
      )}
    >
      <span
        className={cn(
          'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sm font-bold transition-colors',
          state === 'correct' && 'bg-emerald-500 text-white',
          state === 'incorrect' && 'bg-amber-400 text-white',
          state === 'selected' && 'bg-path-600 text-white',
          state === 'idle' && 'bg-ink-100 text-ink-600',
        )}
        aria-hidden="true"
      >
        {state === 'correct' ? (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 18 }}>
            <Check size={16} strokeWidth={3} />
          </motion.span>
        ) : state === 'incorrect' ? (
          <X size={16} strokeWidth={3} />
        ) : (
          letter
        )}
      </span>
      <span className="font-mono text-[15px] font-medium text-ink-900 [overflow-wrap:anywhere]">
        {text}
      </span>
    </motion.button>
  );
}
