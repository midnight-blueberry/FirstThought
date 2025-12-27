import { afterEach, jest } from '@jest/globals';
import { clearRegistry } from '@/features/sticky-position/registry';

global.requestAnimationFrame = (cb: any) => cb(0);

declare global {
  // @ts-ignore
  var __DEV__: boolean;
}

(global as any).__DEV__ = false;
(global as any).IS_REACT_ACT_ENVIRONMENT = true;

const suppressedConsoleErrors = ['react-test-renderer is deprecated.'];
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const firstArg = args[0];
  if (typeof firstArg === 'string' && suppressedConsoleErrors.some((msg) => firstArg.includes(msg))) {
    return;
  }

  originalConsoleError(...args);
};

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

afterEach(() => {
  clearRegistry();
  jest.restoreAllMocks();
});

export {};
