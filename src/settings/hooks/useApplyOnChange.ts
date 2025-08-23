import { useEffect, useRef } from 'react';

type ApplyFn<T> = (value: T) => void;

export function useApplyOnChange<T>(
  value: T,
  apply: ApplyFn<T>
) {
  const prevRef = useRef(value);

  useEffect(() => {
    if (prevRef.current !== value) {
      apply(value);
      prevRef.current = value;
    }
  }, [value, apply]);
}
