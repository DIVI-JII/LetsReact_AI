import { useEffect, useState } from 'react';
import type { Dispatch, SetStateAction } from 'react';

/** useState that survives page reloads. Falls back quietly if storage is blocked. */
export function useLocalStorage<T>(
  key: string,
  createInitial: () => T,
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) return JSON.parse(raw) as T;
    } catch {
      // Storage unavailable or corrupted: start fresh.
    }
    return createInitial();
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota or privacy-mode errors.
    }
  }, [key, value]);

  return [value, setValue];
}
