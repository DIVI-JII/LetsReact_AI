import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLMotionProps<'div'> {
  /** Lifts slightly on hover. Use for cards that lead somewhere. */
  interactive?: boolean;
  glass?: boolean;
}

export function Card({ interactive, glass, className, children, ...rest }: CardProps) {
  return (
    <motion.div
      whileHover={interactive ? { y: -3 } : undefined}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cn(
        glass ? 'glass rounded-2xl' : 'card',
        interactive && 'transition-colors duration-200 hover:border-path-200',
        className,
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
