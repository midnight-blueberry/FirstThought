import { useContext } from 'react';
import { StickySelectionContext } from './StickySelectionProvider';

export default function useStickySelection() {
  const ctx = useContext(StickySelectionContext);
  if (!ctx) {
    throw new Error('useStickySelection must be used within StickySelectionProvider');
  }
  return ctx;
}

