import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Animated } from 'react-native';
import { __mock as rnMock } from '../__mocks__/react-native';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

type SectionConfig = {
  key: string;
  Component: React.ComponentType<any>;
};

let sectionsState: SectionConfig[] = [];
let stickyOnScrollSpy = jest.fn();
let lastOverlayProps: any = null;
let alphaProps: any = null;
let betaProps: any = null;
let externalOnScrollSpy: jest.Mock;

jest.mock('@settings/sections.config', () => ({
  __esModule: true,
  get sections() {
    return sectionsState;
  },
}));

jest.mock('@/features/sticky-position', () => ({
  __esModule: true,
  useStickySelection: () => ({ onScroll: stickyOnScrollSpy }),
}));

jest.mock('@components/ui/atoms', () => {
  return {
    __esModule: true,
    Overlay: (props: any) => {
      lastOverlayProps = props;
      return null;
    },
  };
});

const renderSettingsContent = ({
  overlayVisible = false,
  overlayColor = '#000000',
  overlayBlocks = false,
}: {
  overlayVisible?: boolean;
  overlayColor?: string;
  overlayBlocks?: boolean;
} = {}) => {
  rnMock.views.length = 0;
  externalOnScrollSpy = jest.fn();

  const SettingsContent =
    require('@components/pages/settings/SettingsContent').default;

  const theme = {
    padding: {
      xlarge: 30,
    },
    margin: {
      medium: 10,
    },
  } as any;

  ReactDOMServer.renderToStaticMarkup(
    React.createElement(SettingsContent, {
      sectionProps: {
        alpha: { testProp: 'A' },
        beta: { testProp: 'B' },
      } as any,
      theme,
      overlayVisible,
      overlayColor,
      overlayAnim: new Animated.Value(0),
      overlayBlocks,
      onScroll: externalOnScrollSpy,
      scrollRef: { current: null },
    }),
  );
};

const findScrollView = () =>
  rnMock.views.find((view: any) => view.type === 'ScrollView');

export default (test: JestCucumberTestFn) => {
  test(
    'Scroll event is forwarded to sticky selection and external handler',
    ({ given, when, then }: StepDefinitions) => {
      given('sticky selection onScroll spy is reset', () => {
        stickyOnScrollSpy = jest.fn();
      });

      given('SettingsContent is rendered', () => {
        sectionsState = [];
        renderSettingsContent();
      });

      when('I trigger ScrollView onScroll with y 123', () => {
        const scrollView = findScrollView();
        const event = { nativeEvent: { contentOffset: { y: 123 } } };
        scrollView?.props.onScroll(event);
      });

      then('sticky selection onScroll is called with y 123', () => {
        expect(stickyOnScrollSpy).toHaveBeenCalledWith({
          nativeEvent: { contentOffset: { y: 123 } },
        });
      });

      then('external onScroll is called with y 123', () => {
        expect(externalOnScrollSpy).toHaveBeenCalledWith({
          nativeEvent: { contentOffset: { y: 123 } },
        });
      });
    },
  );

  test('Sections and overlay props are forwarded', ({ given, then }: StepDefinitions) => {
    given('SettingsContent is rendered with two sections', () => {
      alphaProps = null;
      betaProps = null;
      sectionsState = [
        {
          key: 'alpha',
          Component: (props: any) => {
            alphaProps = props;
            return null;
          },
        },
        {
          key: 'beta',
          Component: (props: any) => {
            betaProps = props;
            return null;
          },
        },
      ];
      renderSettingsContent({
        overlayVisible: true,
        overlayColor: '#ABCDEF',
        overlayBlocks: true,
      });
    });

    then('first section receives prop testProp "A"', () => {
      expect(alphaProps?.testProp).toBe('A');
    });

    then('second section receives prop testProp "B"', () => {
      expect(betaProps?.testProp).toBe('B');
    });

    then('Overlay receives visible true', () => {
      expect(lastOverlayProps?.visible).toBe(true);
    });

    then('Overlay receives color "#ABCDEF"', () => {
      expect(lastOverlayProps?.color).toBe('#ABCDEF');
    });

    then('Overlay receives blocks true', () => {
      expect(lastOverlayProps?.blocks).toBe(true);
    });

    then('ScrollView has scrollIndicatorInsets right 30', () => {
      const scrollView = findScrollView();
      expect(scrollView?.props.scrollIndicatorInsets?.right).toBe(30);
    });

    then('ScrollView has scrollIndicatorInsets bottom 30', () => {
      const scrollView = findScrollView();
      expect(scrollView?.props.scrollIndicatorInsets?.bottom).toBe(30);
    });
  });
};
