import React from 'react';
import FontSelector from '@/components/ui/organisms/font-selector';
import { fontKey } from '@/constants/fonts/resolve';
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

jest.mock('@hooks/useTheme', () => jest.fn(() => ({ colors: { basic: '#111111' } })));

jest.mock('@constants/fonts', () => ({
  fonts: [
    { name: 'Alpha Sans', family: 'AlphaFamily', defaultSize: 18 },
    { name: 'Beta Serif', family: 'BetaFamily', defaultSize: 22 },
  ],
  nearestAvailableWeight: (family: string, requested: number) => {
    if (requested !== 400) {
      return 400;
    }
    return family === 'AlphaFamily' ? 500 : 300;
  },
}));

const getMockedFonts = () => (jest.requireMock('@constants/fonts') as { fonts: Array<{ name: string; family: string; defaultSize: number }> }).fonts;

jest.mock('@components/ui/molecules', () => {
  const ReactLocal = require('react');
  return {
    SelectableRow: (props: Record<string, unknown>) => ReactLocal.createElement('SelectableRow', props),
  };
});

jest.mock('@components/ui/organisms/settings-section', () => {
  const ReactLocal = require('react');
  return function SettingsSectionMock(props: { children?: React.ReactNode }) {
    return ReactLocal.createElement(ReactLocal.Fragment, null, props.children);
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
  let selectedFontName = 'Beta Serif';
  let fontSizeLevel = 4;
  let tree: ReturnType<typeof RealRenderer.create> | null = null;
  let onSelectFontSpy: jest.Mock;
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
        Renderer.create(React.createElement(FontSelector, {
          selectedFontName,
          onSelectFont: onSelectFontSpy,
          fontSizeLevel,
        })),
      );
    });
  };

  const unmountSelector = async () => {
    if (!tree) {
      throw new Error('FontSelector is not rendered.');
    }

    await Renderer.act(async () => {
      tree?.unmount();
    });
    tree = null;
  };

  const getRows = () => {
    if (!tree) {
      throw new Error('FontSelector is not rendered.');
    }
    return tree.root.findAllByType('SelectableRow');
  };

  const getRowByLabel = (label: string) => {
    const row = getRows().find((node: { props: { label?: string } }) => node.props.label === label);
    if (!row) {
      throw new Error(`Row with label "${label}" is not found.`);
    }
    return row;
  };

  afterEach(async () => {
    if (tree) {
      await unmountSelector();
    }
    selectedFontName = 'Beta Serif';
    fontSizeLevel = 4;
    onSelectFontSpy = jest.fn();
    pendingRegisterPress = null;
    registerPressSpy.mockReset();
    getRegisterMock().mockReset();
    getUnregisterMock().mockReset();
  });

  test('FontSelector renders rows with computed props and applies sticky press before selection', ({ given, when, then }: StepDefinitions) => {
    given('selected font name is "Beta Serif"', () => {
      selectedFontName = 'Beta Serif';
      onSelectFontSpy = jest.fn();
    });

    when('FontSelector is rendered with font size level 4', async () => {
      fontSizeLevel = 4;
      await renderSelector();
    });

    then('a row is rendered for each font', () => {
      expect(getRows()).toHaveLength(getMockedFonts().length);
    });

    then('row "Alpha Sans" is not selected', () => {
      expect(getRowByLabel('Alpha Sans').props.selected).toBe(false);
    });

    then('row "Beta Serif" is selected', () => {
      expect(getRowByLabel('Beta Serif').props.selected).toBe(true);
    });

    then('each row swatchColor equals "#111111"', () => {
      expect(getRows().every((node: { props: { swatchColor?: string } }) => node.props.swatchColor === '#111111')).toBe(true);
    });

    then('row "Alpha Sans" has computed font size 20', () => {
      expect(getRowByLabel('Alpha Sans').props.fontSize).toBe(20);
    });

    then('row "Beta Serif" has computed font size 24', () => {
      expect(getRowByLabel('Beta Serif').props.fontSize).toBe(24);
    });

    then('row "Alpha Sans" has labelStyle fontFamily from fontKey and nearest weight', () => {
      const expected = fontKey('AlphaFamily', 500);
      expect(getRowByLabel('Alpha Sans').props.labelStyle?.fontFamily).toBe(expected);
    });

    then('row "Beta Serif" has labelStyle fontFamily from fontKey and nearest weight', () => {
      const expected = fontKey('BetaFamily', 300);
      expect(getRowByLabel('Beta Serif').props.labelStyle?.fontFamily).toBe(expected);
    });

    then('registry register is called for "fontFamily:Alpha Sans"', () => {
      expect(getRegisterMock()).toHaveBeenCalledWith('fontFamily:Alpha Sans', expect.any(Object));
    });

    then('registry register is called for "fontFamily:Beta Serif"', () => {
      expect(getRegisterMock()).toHaveBeenCalledWith('fontFamily:Beta Serif', expect.any(Object));
    });

    when('row "Alpha Sans" is pressed', async () => {
      await Renderer.act(async () => {
        getRowByLabel('Alpha Sans').props.onPress();
        await Promise.resolve();
      });
    });

    then('registerPress is called with "fontFamily:Alpha Sans"', () => {
      expect(registerPressSpy).toHaveBeenCalledWith('fontFamily:Alpha Sans', expect.any(Object));
    });

    then('onSelectFont is not called yet', () => {
      expect(onSelectFontSpy).not.toHaveBeenCalled();
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

    then('onSelectFont is called once with "Alpha Sans"', () => {
      expect(onSelectFontSpy).toHaveBeenCalledTimes(1);
      expect(onSelectFontSpy).toHaveBeenCalledWith('Alpha Sans');
    });

    when('FontSelector is unmounted', async () => {
      await unmountSelector();
    });

    then('registry unregister is called for "fontFamily:Alpha Sans"', () => {
      expect(getUnregisterMock()).toHaveBeenCalledWith('fontFamily:Alpha Sans');
    });

    then('registry unregister is called for "fontFamily:Beta Serif"', () => {
      expect(getUnregisterMock()).toHaveBeenCalledWith('fontFamily:Beta Serif');
    });
  });
};
