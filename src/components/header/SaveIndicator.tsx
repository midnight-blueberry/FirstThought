import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import useTheme from '@hooks/useTheme';

interface SaveIndicatorContextValue {
  dirty: boolean;
  markDirty: () => void;
  clearDirty: () => void;
}

const SaveIndicatorContext =
  createContext<SaveIndicatorContextValue | undefined>(undefined);

export const SaveIndicatorProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [dirty, setDirty] = useState(false);

  const markDirty = useCallback(() => setDirty(true), []);
  const clearDirty = useCallback(() => setDirty(false), []);

  const value = useMemo(
    () => ({ dirty, markDirty, clearDirty }),
    [dirty, markDirty, clearDirty],
  );

  return (
    <SaveIndicatorContext.Provider value={value}>
      {children}
    </SaveIndicatorContext.Provider>
  );
};

export function useSaveIndicator() {
  const ctx = useContext(SaveIndicatorContext);
  if (!ctx) {
    throw new Error('useSaveIndicator must be used within SaveIndicatorProvider');
  }
  return ctx;
}

interface IndicatorProps {
  visible?: boolean;
}

const SaveIndicator: React.FC<IndicatorProps> = ({ visible = false }) => {
  const theme = useTheme();

  if (!visible) {
    return null;
  }

  return (
    <Ionicons
      name="save-outline"
      size={theme.iconSize.medium}
      color={theme.colors.headerForeground}
      style={styles.icon}
    />
  );
};

const styles = StyleSheet.create({
  icon: {},
});

export default SaveIndicator;

