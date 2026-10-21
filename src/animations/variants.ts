import type { Transition, Variants } from 'framer-motion';

export const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export const spring: Transition = { type: 'spring', stiffness: 320, damping: 26 };

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease } },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease } },
};

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 360, damping: 22 } },
};

export const shake: Variants = {
  idle: { x: 0 },
  shake: { x: [0, -6, 6, -4, 4, 0], transition: { duration: 0.4 } },
};
