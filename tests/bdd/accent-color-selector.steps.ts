import React from 'react';
import AccentColorSelector from '@/components/ui/organisms/accent-color-selector';
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

jest.mock('@constants/AccentColors', () => ({
  accentColors: [
    { name: 'Green', hex: '#00FF00' },
    { name: 'Red', hex: '#FF0000' },
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
  let selectedAccentColor = '#00FF00';
  let tree: ReturnType<typeof RealRenderer.create> | null = null;
  let onSelectAccentSpy: jest.Mock;
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
        Renderer.create(React.createElement(AccentColorSelector, {
          selectedAccentColor,
          onSelectAccent: onSelectAccentSpy,
        })),
      );
    });
  };

  const unmountSelector = async () => {
    if (!tree) {
      throw new Error('AccentColorSelector is not rendered.');
    }

    await Renderer.act(async () => {
      tree?.unmount();
    });
    tree = null;
  };

  const getRowBySwatchColor = (hex: '#00FF00' | '#FF0000') => {
    if (!tree) {
      throw new Error('AccentColorSelector is not rendered.');
    }

    return tree.root
      .findAllByType('SelectableRow')
      .find((node: { props: { swatchColor?: string } }) => node.props.swatchColor === hex);
  };

  afterEach(async () => {
    if (tree) {
      await unmountSelector();
    }
    selectedAccentColor = '#00FF00';
    onSelectAccentSpy = jest.fn();
    pendingRegisterPress = null;
    registerPressSpy.mockReset();
    getRegisterMock().mockReset();
    getUnregisterMock().mockReset();
  });

  test('Pressing accent row waits for sticky registerPress and keeps registry lifecycle', ({ given, when, then }: StepDefinitions) => {
    given('selected accent color is "#00FF00"', () => {
      selectedAccentColor = '#00FF00';
      onSelectAccentSpy = jest.fn();
    });

    when('AccentColorSelector is rendered', async () => {
      await renderSelector();
    });

    then('registry register is called for "accent:#00FF00"', () => {
      expect(getRegisterMock()).toHaveBeenCalledWith('accent:#00FF00', expect.any(Object));
    });

    then('registry register is called for "accent:#FF0000"', () => {
      expect(getRegisterMock()).toHaveBeenCalledWith('accent:#FF0000', expect.any(Object));
    });

    when('accent row "#FF0000" is pressed', async () => {
      const row = getRowBySwatchColor('#FF0000');
      if (!row) {
        throw new Error('Accent row #FF0000 is not found.');
      }

      await Renderer.act(async () => {
        row.props.onPress();
        await Promise.resolve();
      });
    });

    then('registerPress is called with "accent:#FF0000"', () => {
      expect(registerPressSpy).toHaveBeenCalledWith('accent:#FF0000', expect.any(Object));
    });

    then('onSelectAccent is not called yet', () => {
      expect(onSelectAccentSpy).not.toHaveBeenCalled();
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

    then('onSelectAccent is called once with "#FF0000"', () => {
      expect(onSelectAccentSpy).toHaveBeenCalledTimes(1);
      expect(onSelectAccentSpy).toHaveBeenCalledWith('#FF0000');
    });

    when('AccentColorSelector is unmounted', async () => {
      await unmountSelector();
    });

    then('registry unregister is called for "accent:#00FF00"', () => {
      expect(getUnregisterMock()).toHaveBeenCalledWith('accent:#00FF00');
    });

    then('registry unregister is called for "accent:#FF0000"', () => {
      expect(getUnregisterMock()).toHaveBeenCalledWith('accent:#FF0000');
    });
  });
};
