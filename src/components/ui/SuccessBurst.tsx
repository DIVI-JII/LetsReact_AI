import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const DOTS = Array.from({ length: 10 }, (_, i) => (i / 10) * Math.PI * 2);

/** A check mark that pops in, with a ring of dots flying outward. */
export function SuccessBurst({ size = 96 }: { size?: number }) {
  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      aria-hidden="true"
    >
      {DOTS.map((angle, i) => (
        <motion.span
          key={i}
          className="absolute h-2 w-2 rounded-full bg-path-400"
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{
            x: Math.cos(angle) * size * 0.78,
            y: Math.sin(angle) * size * 0.78,
            opacity: [0, 1, 0],
            scale: [0.4, 1, 0.6],
          }}
          transition={{ duration: 0.9, delay: 0.25 + i * 0.015, ease: 'easeOut' }}
        />
      ))}
      <motion.span
        className="absolute inset-0 rounded-full bg-emerald-100"
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 18 }}
      />
      <motion.span
        className="relative inline-flex items-center justify-center rounded-full bg-emerald-500 text-white"
        style={{ width: size * 0.62, height: size * 0.62 }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 16, delay: 0.1 }}
      >
        <Check size={size * 0.34} strokeWidth={3} />
      </motion.span>
    </div>
  );
}
