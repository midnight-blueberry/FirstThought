import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { Animated, StyleSheet } from 'react-native';
import { __mock as rnMock } from '../__mocks__/react-native';
import BarIndicator from '@components/ui/atoms/bar-indicator';
import { AnchorStableScrollContext } from '@/features/scroll/useAnchorStableScroll';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

const themeMock = {
  iconSize: { xsmall: 10, small: 20 },
  margin: { small: 4 },
  borderWidth: { xsmall: 2 },
  borderRadius: 8,
};

jest.mock('@hooks/useTheme', () => jest.fn(() => themeMock));

type BarIndicatorProps = React.ComponentProps<typeof BarIndicator>;

export default (test: JestCucumberTestFn) => {
  test('rendering plus blink without onPress', ({ given, when, then }: StepDefinitions) => {
    const props: Pick<BarIndicatorProps, 'total' | 'filledCount' | 'blinkIndex'> = {
      total: 0,
      filledCount: 0,
      blinkIndex: null,
    };
    const blinkAnim = new Animated.Value(0.4);

    given('total is 3', () => {
      props.total = 3;
    });

    given('filled count is 2', () => {
      props.filledCount = 2;
    });

    given('blink index is 0', () => {
      props.blinkIndex = 0;
    });

    when('BarIndicator is rendered without onPress handler', () => {
      rnMock.views.length = 0;
      ReactDOMServer.renderToStaticMarkup(
        React.createElement(BarIndicator, {
          ...props,
          blinkAnim,
          containerColor: '#222222',
          fillColor: '#00FF00',
        }),
      );
    });

    then('3 bar containers are rendered as View', () => {
      const bars = rnMock.views.filter(({ type }) => type === 'View');
      expect(bars).toHaveLength(4);
      const containerBars = bars.filter(({ props: viewProps }) => {
        const style = StyleSheet.flatten(viewProps.style);
        return typeof style?.height === 'number' && style.height >= 10;
      });
      expect(containerBars).toHaveLength(3);
    });

    then('bar container heights are 10, 15, 20', () => {
      const containers = rnMock.views
        .filter(({ type }) => type === 'View')
        .map(({ props: viewProps }) => StyleSheet.flatten(viewProps.style))
        .filter((style) => typeof style?.height === 'number')
        .sort((a, b) => (a?.height as number) - (b?.height as number));

      expect(containers.map((style) => style?.height)).toEqual([10, 15, 20]);
    });

    then('blinking filled bar is rendered as Animated.View with fill color "#00FF00" and opacity equals blinkAnim', () => {
      const animatedView = rnMock.views.find(({ type }) => type === 'Animated.View');
      expect(animatedView).toBeDefined();

      const style = StyleSheet.flatten(animatedView?.props.style);
      expect(style?.backgroundColor).toBe('#00FF00');
      expect(style?.opacity).toBe(blinkAnim);
    });
  });

  test('pressing with onPress and AnchorStableScrollContext', ({ given, when, then }: StepDefinitions) => {
    const props: Pick<BarIndicatorProps, 'total' | 'filledCount'> = {
      total: 0,
      filledCount: 0,
    };
    const order: string[] = [];
    const setAnchor = jest.fn((target: number) => {
      order.push('setAnchor');
      return target;
    });
    const captureBeforeUpdate = jest.fn(() => {
      order.push('captureBeforeUpdate');
    });
    const onPress = jest.fn((index: number) => {
      order.push(`onPress:${index}`);
    });

    given('total is 2', () => {
      props.total = 2;
    });

    given('filled count is 0', () => {
      props.filledCount = 0;
    });

    when('BarIndicator is rendered with onPress handler', () => {
      rnMock.views.length = 0;
      ReactDOMServer.renderToStaticMarkup(
        React.createElement(
          AnchorStableScrollContext.Provider,
          { value: { setAnchor, captureBeforeUpdate } },
          React.createElement(BarIndicator, {
            ...props,
            blinkIndex: null,
            blinkAnim: new Animated.Value(1),
            containerColor: '#111111',
            fillColor: '#00FF00',
            onPress,
          }),
        ),
      );
    });

    when('user presses bar 1 with current target 777', () => {
      const bars = rnMock.views.filter(({ type }) => type === 'Pressable');
      const bar = bars[1];
      expect(bar).toBeDefined();

      bar.props.onPressIn({ currentTarget: 777 });
      bar.props.onPress();
    });

    then('anchor stable scroll context setAnchor is called with 777', () => {
      expect(setAnchor).toHaveBeenCalledWith(777);
    });

    then('anchor stable scroll context captureBeforeUpdate is called once', () => {
      expect(captureBeforeUpdate).toHaveBeenCalledTimes(1);
    });

    then('onPress callback is called with index 1', () => {
      expect(onPress).toHaveBeenCalledWith(1);
    });

    then('onPress callback is called after captureBeforeUpdate', () => {
      expect(order).toEqual(['setAnchor', 'captureBeforeUpdate', 'onPress:1']);
    });
  });
};
