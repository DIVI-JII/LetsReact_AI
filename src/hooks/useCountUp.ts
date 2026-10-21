import { animate } from 'framer-motion';
import { useEffect, useState } from 'react';

/** Counts from 0 to `target` once, for headline numbers. */
export function useCountUp(target: number, duration = 1.1): number {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [target, duration]);
  return value;
}
