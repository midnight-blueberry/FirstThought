import React from 'react';
import ThemeSelector from '@/components/ui/organisms/theme-selector';
import { register, unregister } from '@/features/sticky-position/registry';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

const RealRenderer = jest.requireActual('react-test-renderer') as typeof import('react-test-renderer');
const { createRequire } = require('module');
const nodeRequire = createRequire(__filename);
const ActualRenderer = nodeRequire('react-test-renderer') as typeof import('react-test-renderer');
const RealRendererFromNodeModules = nodeRequire(require('path').join(process.cwd(), 'node_modules/react-test-renderer/cjs/react-test-renderer.development.js')) as typeof import('react-test-renderer');
const Renderer = RealRendererFromNodeModules.create ? RealRendererFromNodeModules : ActualRenderer;

const globalWithActFlag = globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean };
globalWithActFlag.IS_REACT_ACT_ENVIRONMENT = true;

const registerPressSpy = jest.fn();

jest.mock('@theme/buildTheme', () => ({
  themeList: [
    { name: 'Light', colors: { background: '#ffffff' } },
    { name: 'Dark', colors: { background: '#000000' } },
  ],
}));

jest.mock('@components/ui/organisms/settings-section', () => {
  const ReactLocal = require('react');
  return function SettingsSectionMock(props: { children?: React.ReactNode }) {
    return ReactLocal.createElement(ReactLocal.Fragment, null, props.children);
  };
});

jest.mock('@components/ui/molecules', () => {
  const ReactLocal = require('react');
  return {
    SelectableRow: (props: Record<string, unknown>) => ReactLocal.createElement('SelectableRow', props),
  };
});

jest.mock('@/features/sticky-position', () => ({
  useStickySelection: () => ({ registerPress: registerPressSpy }),
}));

jest.mock('@/features/sticky-position/registry', () => ({
  register: jest.fn(),
  unregister: jest.fn(),
}));

type Deferred = {
  promise: Promise<void>;
  resolve: () => void;
};

const createDeferred = (): Deferred => {
  let resolvePromise: (() => void) | null = null;
  const promise = new Promise<void>((resolve) => {
    resolvePromise = resolve;
  });

  return {
    promise,
    resolve: () => {
      if (!resolvePromise) {
        throw new Error('Deferred resolver is not initialized.');
      }
      resolvePromise();
    },
  };
};

export default (test: JestCucumberTestFn) => {
  let selectedThemeName = 'Light';
  let tree: ReturnType<typeof RealRenderer.create> | null = null;
  let onSelectThemeSpy: jest.Mock;
  let pendingRegisterPress: Deferred | null = null;

  const getRegisterMock = () => register as jest.Mock;
  const getUnregisterMock = () => unregister as jest.Mock;

  const withSuppressedDeprecatedRendererWarning = <T,>(callback: () => T): T => {
    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      const hasDeprecatedMessage = args.some((arg) => String(arg).includes('react-test-renderer is deprecated'));
      if (hasDeprecatedMessage) {
        return;
      }
      originalConsoleError(...args);
    };

    try {
      return callback();
    } finally {
      console.error = originalConsoleError;
    }
  };

  const renderSelector = async () => {
    pendingRegisterPress = createDeferred();
    registerPressSpy.mockImplementation(() => pendingRegisterPress?.promise ?? Promise.resolve());

    await Renderer.act(async () => {
      tree = withSuppressedDeprecatedRendererWarning(() =>
        Renderer.create(React.createElement(ThemeSelector, {
          selectedThemeName,
          onSelectTheme: onSelectThemeSpy,
        })),
      );
    });
  };

  const unmountSelector = async () => {
    if (!tree) {
      throw new Error('ThemeSelector is not rendered.');
    }

    await Renderer.act(async () => {
      tree?.unmount();
    });
    tree = null;
  };

  const getRowByLabel = (label: 'Light' | 'Dark') => {
    if (!tree) {
      throw new Error('ThemeSelector is not rendered.');
    }

    return tree.root
      .findAllByType('SelectableRow')
      .find((node: { props: { label?: string } }) => node.props.label === label);
  };

  afterEach(async () => {
    if (tree) {
      await unmountSelector();
    }
    selectedThemeName = 'Light';
    onSelectThemeSpy = jest.fn();
    pendingRegisterPress = null;
    registerPressSpy.mockReset();
    getRegisterMock().mockReset();
    getUnregisterMock().mockReset();
  });

  test('Pressing theme row waits for sticky registerPress and keeps registry lifecycle', ({ given, when, then }: StepDefinitions) => {
    given('selected theme name is "Light"', () => {
      selectedThemeName = 'Light';
      onSelectThemeSpy = jest.fn();
    });

    when('ThemeSelector is rendered', async () => {
      await renderSelector();
    });

    then('registry register is called for "theme:Light"', () => {
      expect(getRegisterMock()).toHaveBeenCalledWith('theme:Light', expect.any(Object));
    });

    then('registry register is called for "theme:Dark"', () => {
      expect(getRegisterMock()).toHaveBeenCalledWith('theme:Dark', expect.any(Object));
    });

    when('theme row "Dark" is pressed', async () => {
      const row = getRowByLabel('Dark');
      if (!row) {
        throw new Error('Theme row Dark is not found.');
      }

      await Renderer.act(async () => {
        row.props.onPress();
        await Promise.resolve();
      });
    });

    then('registerPress is called with "theme:Dark"', () => {
      expect(registerPressSpy).toHaveBeenCalledWith('theme:Dark', expect.any(Object));
    });

    then('onSelectTheme is not called yet', () => {
      expect(onSelectThemeSpy).not.toHaveBeenCalled();
    });

    when('registerPress promise resolves', async () => {
      if (!pendingRegisterPress) {
        throw new Error('Pending registerPress promise is not initialized.');
      }

      await Renderer.act(async () => {
        pendingRegisterPress?.resolve();
        await pendingRegisterPress?.promise;
      });
    });

    then('onSelectTheme is called once with "Dark"', () => {
      expect(onSelectThemeSpy).toHaveBeenCalledTimes(1);
      expect(onSelectThemeSpy).toHaveBeenCalledWith('Dark');
    });

    when('ThemeSelector is unmounted', async () => {
      await unmountSelector();
    });

    then('registry unregister is called for "theme:Light"', () => {
      expect(getUnregisterMock()).toHaveBeenCalledWith('theme:Light');
    });

    then('registry unregister is called for "theme:Dark"', () => {
      expect(getUnregisterMock()).toHaveBeenCalledWith('theme:Dark');
    });
  });
};
