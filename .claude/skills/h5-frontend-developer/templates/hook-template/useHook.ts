import { useState, useEffect } from 'react';

export interface UseHookOptions<T> {
  defaultValue?: T;
}

export function useHook<T>(
  initialValue?: T
): [T, (value: T | ((val: T) => T)) => void] {
  const [value, setValue] = useState<T>(initialValue as T);

  useEffect(() => {
    return () => {
    };
  }, []);

  return [value, setValue];
}