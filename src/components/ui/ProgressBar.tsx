import { motion } from 'framer-motion';
import { ease } from '../../animations/variants';
import { cn } from '../../utils/cn';

interface ProgressBarProps {
  /** 0–100 */
  value: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  tone?: 'accent' | 'success' | 'dark';
  className?: string;
}

const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };
const fills = {
  accent: 'bg-gradient-to-r from-path-400 to-path-600',
  success: 'bg-gradient-to-r from-emerald-400 to-emerald-600',
  dark: 'bg-ink-950',
};

export function ProgressBar({
  value,
  label,
  size = 'md',
  tone = 'accent',
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn('w-full overflow-hidden rounded-full bg-ink-100', heights[size], className)}
    >
      <motion.div
        className={cn('h-full rounded-full', fills[tone])}
        initial={{ width: 0 }}
        animate={{ width: `${clamped}%` }}
        transition={{ duration: 0.9, ease }}
      />
    </div>
  );
}
