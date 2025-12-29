import { afterEach, jest } from '@jest/globals';
import { clearRegistry } from '@/features/sticky-position/registry';

global.requestAnimationFrame = (cb: any) => cb(0);

declare global {
  // @ts-ignore
  var __DEV__: boolean;
}

(global as any).__DEV__ = false;

jest.mock('@/components/settings/overlay', () => ({
  useOverlayTransition: () => ({
    begin: () => Promise.resolve(),
    end: () => Promise.resolve(),
    apply: async (fn?: () => any) => {
      if (fn) await fn();
    },
    transact: async (fn?: () => any) => {
      if (fn) await fn();
    },
    isBusy: () => false,
    freezeBackground: () => {},
    releaseBackground: () => {},
    isOpaque: () => false,
  }),
}));

jest.mock('@constants/fonts/resolve', () => ({
  nearestAvailableWeight: (family: string, weight: number) =>
    family === 'Roboto' ? 700 : weight,
  listAvailableWeights: () => [],
  fontKey: (family: string, weight: number) => `${family}${weight}`,
}));

afterEach(() => {
  clearRegistry();
  jest.restoreAllMocks();
});

export {};
