import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

interface SaveIndicatorContextValue {
  show: () => void;
  hide: () => void;
  reset: () => void;
  active: boolean;
}

const SaveIndicatorContext =
  createContext<SaveIndicatorContextValue | undefined>(undefined);

const noopContext: SaveIndicatorContextValue = {
  show: () => {},
  hide: () => {},
  reset: () => {},
  active: false,
};

export const SaveIndicatorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [active, setActive] = useState(false);

  const show = useCallback(() => {
    setActive((prev) => (prev === true ? prev : true));
  }, []);

  const hide = useCallback(() => {
    setActive((prev) => (prev === false ? prev : false));
  }, []);

  const reset = useCallback(() => setActive(false), []);

  const value = useMemo(
    () => ({ active, show, hide, reset }),
    [active, show, hide, reset],
  );

  return (
    <SaveIndicatorContext.Provider value={value}>
      {children}
    </SaveIndicatorContext.Provider>
  );
};

export function useSaveIndicator(): SaveIndicatorContextValue {
  const ctx = useContext(SaveIndicatorContext);
  if (!ctx) {
    if (__DEV__) {
      throw new Error('useSaveIndicator must be used within SaveIndicatorProvider');
    }
    return noopContext;
  }
  return ctx;
}
