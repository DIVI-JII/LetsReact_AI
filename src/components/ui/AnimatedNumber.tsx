import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '../../utils/cn';

interface AnimatedNumberProps {
  value: number | string;
  className?: string;
}

/** Slides the old value out and the new one in whenever `value` changes. */
export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  return (
    <span className={cn('relative inline-flex overflow-hidden align-bottom', className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={String(value)}
          initial={{ y: '60%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '-60%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 420, damping: 30 }}
          className="inline-block"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
