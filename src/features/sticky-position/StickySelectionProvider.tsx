import React from 'react';
import type { ScrollView } from 'react-native';
import { StickySelectionContext } from './StickySelectionContext';
import { useStickySelectionState } from './useStickySelectionState';

export const StickySelectionProvider: React.FC<{
  children: React.ReactNode;
  scrollRef: React.RefObject<ScrollView>;
}> = ({ children, scrollRef }) => {
  const value = useStickySelectionState(scrollRef);

  return (
    <StickySelectionContext.Provider value={value}>
      {children}
    </StickySelectionContext.Provider>
  );
};

