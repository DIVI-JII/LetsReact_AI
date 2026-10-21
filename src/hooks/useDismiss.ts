import { useEffect } from 'react';
import type { RefObject } from 'react';

/** Calls onDismiss on Escape, and on clicks outside `ref` when one is given. */
export function useDismiss(
  active: boolean,
  onDismiss: () => void,
  ref?: RefObject<HTMLElement>,
): void {
  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onDismiss();
    };
    const onPointer = (e: MouseEvent) => {
      if (ref?.current && !ref.current.contains(e.target as Node)) onDismiss();
    };
    document.addEventListener('keydown', onKey);
    if (ref) document.addEventListener('mousedown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      if (ref) document.removeEventListener('mousedown', onPointer);
    };
  }, [active, onDismiss, ref]);
}
