import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Animated, StyleSheet, Text } from 'react-native';
import FontWeightSelector from '@components/ui/organisms/font-weight-selector';
import { __mock as rnMock } from '../__mocks__/react-native';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

const themeMock = {
  margin: {
    small: 4,
    medium: 8,
  },
  iconSize: {
    xsmall: 10,
    small: 14,
    large: 20,
  },
  borderWidth: {
    xsmall: 1,
  },
  borderRadius: 6,
  colors: {
    basic: '#111111',
    accent: '#22AA33',
    disabled: '#888888',
    control: {
      disabled: {
        fg: '#999999',
      },
    },
  },
  fontSize: {
    small: 12,
  },
};

let registerPressSpy: jest.Mock;

const state = {
  availableWeights: [400, 500, 700] as number[],
  fontFamily: 'Roboto Slab',
  fontWeight: '500',
};

jest.mock('@hooks/useTheme', () => jest.fn(() => themeMock));

jest.mock('@components/ui/organisms/settings-section', () => {
  const ReactLocal = require('react');
  return function SettingsSectionMock(props: { children?: React.ReactNode }) {
    return ReactLocal.createElement(ReactLocal.Fragment, null, props.children);
  };
});

jest.mock('@/state/SettingsContext', () => ({
  __esModule: true,
  useSettings: () => ({
    settings: {
      fontFamily: state.fontFamily,
      fontWeight: state.fontWeight,
    },
  }),
}));

jest.mock('@/constants/fonts/resolve', () => {
  const actual = jest.requireActual('@/constants/fonts/resolve');
  return {
    __esModule: true,
    ...actual,
    listAvailableWeights: () => state.availableWeights,
  };
});

jest.mock('@expo/vector-icons/Ionicons', () => {
  const ReactLocal = require('react');
  const Ionicons = (props: any) =>
    ReactLocal.createElement('span', { 'data-ionicon': props?.name });

  return { __esModule: true, default: Ionicons };
});

jest.mock('@/features/sticky-position', () => ({
  __esModule: true,
  useStickySelection: () => ({ registerPress: registerPressSpy }),
}));


jest.mock('@components/ui/atoms/bar-indicator', () => {
  const ReactLocal = require('react');
  const { View: ViewComponent } = require('react-native');

  return {
    __esModule: true,
    default: (props: any) => ReactLocal.createElement(ViewComponent, { style: props?.style }),
  };
});
jest.mock('@components/ui/atoms/AppText', () => {
  const ReactLocal = require('react');
  const { Text: TextComponent } = require('react-native');

  return {
    __esModule: true,
    default: (props: any) => ReactLocal.createElement(TextComponent, props, props.children),
  };
});

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
  let onSelectSpy: jest.Mock;
  let html = '';
  let pendingRegisterPress: Deferred | null = null;

  const renderSelector = () => {
    rnMock.views.length = 0;
    html = ReactDOMServer.renderToStaticMarkup(
      React.createElement(FontWeightSelector, {
        fontWeight: '500',
        onIncrease: jest.fn(),
        onDecrease: jest.fn(),
        onSelect: onSelectSpy,
        blinkAnim: new Animated.Value(0),
        disabled: false,
      }),
    );
  };

  const getButtons = () => {
    const touchables = rnMock.views.filter(view => view.type === 'TouchableOpacity');
    const decreaseButton = touchables.find(view =>
      StyleSheet.flatten(view.props.style)?.marginRight !== undefined,
    );
    const increaseButton = touchables.find(view =>
      StyleSheet.flatten(view.props.style)?.marginLeft !== undefined,
    );

    if (!decreaseButton || !increaseButton) {
      throw new Error('Expected both decrease and increase buttons.');
    }

    return { decreaseButton, increaseButton };
  };

  beforeEach(() => {
    state.availableWeights = [400, 500, 700];
    state.fontFamily = 'Roboto Slab';
    state.fontWeight = '500';
    onSelectSpy = jest.fn();
    registerPressSpy = jest.fn(() => Promise.resolve());
    pendingRegisterPress = null;
    html = '';
  });

  test('Increase waits for sticky registerPress before calling onSelect', ({ given, when, then }: StepDefinitions) => {
    given('available font weights are [400, 500, 700]', () => {
      state.availableWeights = [400, 500, 700];
      pendingRegisterPress = createDeferred();
      registerPressSpy = jest.fn(() => pendingRegisterPress?.promise ?? Promise.resolve());
    });

    given('settings font family is "Roboto Slab"', () => {
      state.fontFamily = 'Roboto Slab';
    });

    given('settings font weight is "500"', () => {
      state.fontWeight = '500';
    });

    when('FontWeightSelector is rendered', () => {
      renderSelector();
    });

    then('increase button is enabled', () => {
      const { increaseButton } = getButtons();
      expect(increaseButton.props.disabled).toBe(false);
    });

    then('decrease button is enabled', () => {
      const { decreaseButton } = getButtons();
      expect(decreaseButton.props.disabled).toBe(false);
    });

    when('increase button is pressed', () => {
      const { increaseButton } = getButtons();
      increaseButton.props.onPress();
    });

    then('registerPress is called with id "fontWeight"', () => {
      expect(registerPressSpy).toHaveBeenCalledWith('fontWeight', expect.anything());
      expect(registerPressSpy).toHaveBeenCalledTimes(1);
    });

    then('onSelect is not called yet', () => {
      expect(onSelectSpy).not.toHaveBeenCalled();
    });

    when('registerPress resolves', async () => {
      if (!pendingRegisterPress) {
        throw new Error('Pending registerPress promise is not initialized.');
      }

      pendingRegisterPress.resolve();
      await pendingRegisterPress.promise;
      await Promise.resolve();
    });

    then('onSelect is called with font weight "700"', () => {
      expect(onSelectSpy).toHaveBeenCalledWith('700');
      expect(onSelectSpy).toHaveBeenCalledTimes(1);
    });
  });

  test('Decrease waits for sticky registerPress before calling onSelect', ({ given, when, then }: StepDefinitions) => {
    given('available font weights are [400, 500, 700]', () => {
      state.availableWeights = [400, 500, 700];
      pendingRegisterPress = createDeferred();
      registerPressSpy = jest.fn(() => pendingRegisterPress?.promise ?? Promise.resolve());
    });

    given('settings font family is "Roboto Slab"', () => {
      state.fontFamily = 'Roboto Slab';
    });

    given('settings font weight is "500"', () => {
      state.fontWeight = '500';
    });

    when('FontWeightSelector is rendered', () => {
      renderSelector();
    });

    when('decrease button is pressed', () => {
      const { decreaseButton } = getButtons();
      decreaseButton.props.onPress();
    });

    then('registerPress is called with id "fontWeight"', () => {
      expect(registerPressSpy).toHaveBeenCalledWith('fontWeight', expect.anything());
      expect(registerPressSpy).toHaveBeenCalledTimes(1);
    });

    then('onSelect is not called yet', () => {
      expect(onSelectSpy).not.toHaveBeenCalled();
    });

    when('registerPress resolves', async () => {
      if (!pendingRegisterPress) {
        throw new Error('Pending registerPress promise is not initialized.');
      }

      pendingRegisterPress.resolve();
      await pendingRegisterPress.promise;
      await Promise.resolve();
    });

    then('onSelect is called with font weight "400"', () => {
      expect(onSelectSpy).toHaveBeenCalledWith('400');
      expect(onSelectSpy).toHaveBeenCalledTimes(1);
    });
  });

  test('Single available weight disables both buttons and shows helper text', ({ given, when, then }: StepDefinitions) => {
    given('available font weights are [500]', () => {
      state.availableWeights = [500];
    });

    given('settings font family is "Roboto Slab"', () => {
      state.fontFamily = 'Roboto Slab';
    });

    given('settings font weight is "500"', () => {
      state.fontWeight = '500';
    });

    when('FontWeightSelector is rendered', () => {
      renderSelector();
    });

    then('increase button is disabled', () => {
      const { increaseButton } = getButtons();
      expect(increaseButton.props.disabled).toBe(true);
    });

    then('decrease button is disabled', () => {
      const { decreaseButton } = getButtons();
      expect(decreaseButton.props.disabled).toBe(true);
    });

    then('helper text "Недоступно для данного шрифта" is rendered', () => {
      expect(html).toContain('Недоступно для данного шрифта');
    });
  });
};
