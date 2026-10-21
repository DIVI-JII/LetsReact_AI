import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, RotateCcw } from 'lucide-react';
import { useState } from 'react';
import type { Quiz as QuizModel } from '../types';
import { cn } from '../utils/cn';
import { QuizOption } from './QuizOption';
import type { QuizOptionState } from './QuizOption';
import { Button } from './ui/Button';

interface QuizProps {
  quiz: QuizModel;
  /** Called with the first-try score (0–100) when the learner continues from the summary. */
  onComplete: (percent: number) => void;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

function summaryMessage(percent: number): string {
  if (percent === 100) return 'Spot on. Every answer right on the first try.';
  if (percent >= 66) return 'Nicely done. You have the main ideas down.';
  return 'Good effort. Every question helped you learn something. You can revisit the sections any time.';
}

export function Quiz({ quiz, onComplete }: QuizProps) {
  const [index, setIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [wrongIds, setWrongIds] = useState<string[]>([]);
  const [answered, setAnswered] = useState(false);
  const [firstTryRight, setFirstTryRight] = useState(0);
  const [finished, setFinished] = useState(false);

  const total = quiz.questions.length;
  const question = quiz.questions[index];
  const selectedOption = question.options.find((o) => o.id === selectedId);
  const isLast = index === total - 1;
  const percent = Math.round((firstTryRight / total) * 100);

  const select = (id: string) => {
    if (answered || wrongIds.includes(id)) return;
    setSelectedId(id);
    if (id === question.correctOptionId) {
      setAnswered(true);
      if (wrongIds.length === 0) setFirstTryRight((n) => n + 1);
    } else {
      setWrongIds((prev) => [...prev, id]);
    }
  };

  const next = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelectedId(null);
    setWrongIds([]);
    setAnswered(false);
  };

  const stateFor = (id: string): QuizOptionState => {
    if (answered && id === question.correctOptionId) return 'correct';
    if (wrongIds.includes(id)) return 'incorrect';
    if (selectedId === id) return 'selected';
    return 'idle';
  };

  if (finished) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-ink-100 bg-white p-8 text-center"
      >
        <p className="font-display text-6xl font-extrabold text-ink-950">{percent}%</p>
        <p className="mt-1 text-sm text-ink-600">
          {firstTryRight} of {total} right on the first try
        </p>
        <p className="mx-auto mt-4 max-w-sm text-lg text-ink-800">{summaryMessage(percent)}</p>
        <Button
          className="mt-6"
          variant="accent"
          size="lg"
          iconRight={<ArrowRight size={18} />}
          onClick={() => onComplete(percent)}
        >
          Finish lesson
        </Button>
      </motion.div>
    );
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {quiz.questions.map((q, i) => (
            <span
              key={q.id}
              className={cn(
                'h-1.5 w-8 rounded-full transition-colors',
                i < index ? 'bg-path-500' : i === index ? 'bg-path-300' : 'bg-ink-200',
              )}
            />
          ))}
        </div>
        <p className="text-sm text-ink-600">
          Question {index + 1} of {total} · Score {firstTryRight}/{total}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={question.id}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
        >
          <h3 className="text-2xl font-bold leading-snug sm:text-[26px]" id={`${question.id}-prompt`}>
            {question.prompt}
          </h3>
          <div
            role="radiogroup"
            aria-labelledby={`${question.id}-prompt`}
            className="mt-5 flex flex-col gap-3"
          >
            {question.options.map((option, i) => (
              <QuizOption
                key={option.id}
                letter={LETTERS[i]}
                text={option.text}
                state={stateFor(option.id)}
                disabled={answered || wrongIds.includes(option.id)}
                onSelect={() => select(option.id)}
              />
            ))}
          </div>

          <div aria-live="polite" className="mt-5 min-h-[7rem]">
            <AnimatePresence mode="wait">
              {selectedOption && (
                <motion.div
                  key={`${selectedId}-${answered}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn(
                    'rounded-2xl border p-4',
                    answered ? 'border-emerald-200 bg-emerald-50' : 'border-amber-200 bg-amber-50',
                  )}
                >
                  <p className="font-semibold text-ink-950">
                    {answered ? 'That’s right.' : 'Not quite yet.'}
                  </p>
                  <p className="mt-1 text-[15px] text-ink-800">
                    {answered ? question.explanation : selectedOption.feedback}
                  </p>
                  <div className="mt-3">
                    {answered ? (
                      <Button
                        size="sm"
                        variant="primary"
                        iconRight={<ArrowRight size={16} />}
                        onClick={next}
                      >
                        {isLast ? 'See how you did' : 'Next question'}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="secondary"
                        icon={<RotateCcw size={15} />}
                        onClick={() => setSelectedId(null)}
                      >
                        Try again
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
