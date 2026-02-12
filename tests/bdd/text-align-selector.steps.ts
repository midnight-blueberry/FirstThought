import React from 'react';
import TextAlignSelector from '@/components/ui/organisms/text-align-selector';
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

jest.mock('@hooks/useTheme', () => () => ({
  padding: { large: 12 },
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
    TextAlignButton: (props: Record<string, unknown>) => ReactLocal.createElement('TextAlignButton', props),
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
  const promise = new Promise<void>(resolve => {
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
  let noteTextAlign: 'left' | 'justify' = 'left';
  let tree: ReturnType<typeof RealRenderer.create> | null = null;
  let onChangeSpy: jest.Mock;
  let pendingRegisterPress: Deferred | null = null;

  const getRegisterMock = () => register as jest.Mock;
  const getUnregisterMock = () => unregister as jest.Mock;

  const getButtonByVariant = (variant: 'left' | 'justify') => {
    if (!tree) {
      throw new Error('TextAlignSelector is not rendered.');
    }

    return tree.root
      .findAllByType('TextAlignButton')
      .find((node: { props: { variant?: string } }) => node.props.variant === variant);
  };


  const withSuppressedDeprecatedRendererWarning = <T,>(callback: () => T): T => {
    const originalConsoleError = console.error;
    console.error = (...args: unknown[]) => {
      const hasDeprecatedMessage = args.some(arg => String(arg).includes('react-test-renderer is deprecated'));
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
        Renderer.create(React.createElement(TextAlignSelector, {
          noteTextAlign,
          onChange: onChangeSpy,
        })),
      );
    });
  };

  const unmountSelector = async () => {
    if (!tree) {
      throw new Error('TextAlignSelector is not rendered.');
    }

    await Renderer.act(async () => {
      tree?.unmount();
    });
    tree = null;
  };

  afterEach(async () => {
    if (tree) {
      await unmountSelector();
    }
    noteTextAlign = 'left';
    onChangeSpy = jest.fn();
    pendingRegisterPress = null;
    registerPressSpy.mockReset();
    getRegisterMock().mockReset();
    getUnregisterMock().mockReset();
  });

  test('Left alignment press updates value after sticky registerPress resolves', ({ given, when, then }: StepDefinitions) => {
    given('note text align is "justify"', () => {
      noteTextAlign = 'justify';
      onChangeSpy = jest.fn();
    });

    when('TextAlignSelector is rendered', async () => {
      await renderSelector();
    });

    then('registry register is called for "align:left"', () => {
      expect(getRegisterMock()).toHaveBeenCalledWith('align:left', expect.any(Object));
    });

    then('registry register is called for "align:justify"', () => {
      expect(getRegisterMock()).toHaveBeenCalledWith('align:justify', expect.any(Object));
    });

    when('left align button is pressed', async () => {
      const button = getButtonByVariant('left');
      if (!button) {
        throw new Error('Left align button is not found.');
      }

      await Renderer.act(async () => {
        button.props.onPress();
        await Promise.resolve();
      });
    });

    then('registerPress is called with "align:left"', () => {
      expect(registerPressSpy).toHaveBeenCalledWith('align:left', expect.any(Object));
    });

    then('onChange is not called yet', () => {
      expect(onChangeSpy).not.toHaveBeenCalled();
    });

    when('registerPress resolves', async () => {
      if (!pendingRegisterPress) {
        throw new Error('Pending registerPress promise is not initialized.');
      }

      await Renderer.act(async () => {
        pendingRegisterPress?.resolve();
        await pendingRegisterPress?.promise;
      });
    });

    then('onChange is called with "left"', () => {
      expect(onChangeSpy).toHaveBeenCalledWith('left');
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });

    when('TextAlignSelector is unmounted', async () => {
      await unmountSelector();
    });

    then('registry unregister is called with "align:left"', () => {
      expect(getUnregisterMock()).toHaveBeenCalledWith('align:left');
    });

    then('registry unregister is called with "align:justify"', () => {
      expect(getUnregisterMock()).toHaveBeenCalledWith('align:justify');
    });
  });

  test('Justify alignment press updates value after sticky registerPress resolves', ({ given, when, then }: StepDefinitions) => {
    given('note text align is "left"', () => {
      noteTextAlign = 'left';
      onChangeSpy = jest.fn();
    });

    when('TextAlignSelector is rendered', async () => {
      await renderSelector();
    });

    then('registry register is called for "align:left"', () => {
      expect(getRegisterMock()).toHaveBeenCalledWith('align:left', expect.any(Object));
    });

    then('registry register is called for "align:justify"', () => {
      expect(getRegisterMock()).toHaveBeenCalledWith('align:justify', expect.any(Object));
    });

    when('justify align button is pressed', async () => {
      const button = getButtonByVariant('justify');
      if (!button) {
        throw new Error('Justify align button is not found.');
      }

      await Renderer.act(async () => {
        button.props.onPress();
        await Promise.resolve();
      });
    });

    then('registerPress is called with "align:justify"', () => {
      expect(registerPressSpy).toHaveBeenCalledWith('align:justify', expect.any(Object));
    });

    then('onChange is not called yet', () => {
      expect(onChangeSpy).not.toHaveBeenCalled();
    });

    when('registerPress resolves', async () => {
      if (!pendingRegisterPress) {
        throw new Error('Pending registerPress promise is not initialized.');
      }

      await Renderer.act(async () => {
        pendingRegisterPress?.resolve();
        await pendingRegisterPress?.promise;
      });
    });

    then('onChange is called with "justify"', () => {
      expect(onChangeSpy).toHaveBeenCalledWith('justify');
      expect(onChangeSpy).toHaveBeenCalledTimes(1);
    });

    when('TextAlignSelector is unmounted', async () => {
      await unmountSelector();
    });

    then('registry unregister is called with "align:left"', () => {
      expect(getUnregisterMock()).toHaveBeenCalledWith('align:left');
    });

    then('registry unregister is called with "align:justify"', () => {
      expect(getUnregisterMock()).toHaveBeenCalledWith('align:justify');
    });
  });
};
