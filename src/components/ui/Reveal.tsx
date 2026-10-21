import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { ease } from '../../animations/variants';

interface RevealProps {
  delay?: number;
  className?: string;
  children: ReactNode;
}

/** Fades content up the first time it scrolls into view. */
export function Reveal({ delay = 0, className, children }: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, ease, delay }}
    >
      {children}
    </motion.div>
  );
}
