import React from 'react';
// @ts-ignore
import renderer from 'react-test-renderer';
import { StickySelectionProvider } from '@/features/sticky-position';

type Opts = { scrollRef?: any };

export function renderWithProviders(ui: React.ReactElement, opts: Opts = {}) {
  return renderer.create(
    <StickySelectionProvider scrollRef={opts.scrollRef}>
      {ui}
    </StickySelectionProvider>
  );
}
