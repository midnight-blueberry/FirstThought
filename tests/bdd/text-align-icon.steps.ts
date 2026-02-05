import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { StyleSheet } from 'react-native';
import { __mock as rnMock } from '../__mocks__/react-native';
import TextAlignIcon from '@components/ui/atoms/text-align-icon';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

type Variant = React.ComponentProps<typeof TextAlignIcon>['variant'];

type RenderConfig = {
  variant: Variant;
  color: string;
};

export default (test: JestCucumberTestFn) => {
  const renderIcon = ({ variant, color }: RenderConfig) => {
    rnMock.views.length = 0;

    ReactDOMServer.renderToStaticMarkup(
      React.createElement(TextAlignIcon, {
        variant,
        color,
      }),
    );
  };

  const getLineViews = () =>
    rnMock.views.filter(({ type, props }) => {
      if (type !== 'View') {
        return false;
      }

      return StyleSheet.flatten(props.style)?.height === 2;
    });

  const expectLines = (expectedWidths: number[], color: string) => {
    const lineViews = getLineViews();
    const lineStyles = lineViews.map(view => StyleSheet.flatten(view.props.style));
    const lineWidths = lineStyles.map(style => style?.width);

    expect(lineViews).toHaveLength(3);
    expect(lineWidths).toEqual(expectedWidths);
    lineStyles.forEach(style => expect(style?.backgroundColor).toBe(color));
  };

  test('Left variant renders lines with specific widths', ({ given, when, then }: StepDefinitions) => {
    const renderConfig: RenderConfig = { variant: 'left', color: '#FF00FF' };

    given('text align icon variant is left', () => {
      renderConfig.variant = 'left';
    });

    when('icon is rendered with color "#FF00FF"', () => {
      renderIcon(renderConfig);
    });

    then('lines have widths 16 20 12 and color "#FF00FF"', () => {
      expectLines([16, 20, 12], '#FF00FF');
    });
  });

  test('Justify variant renders lines with specific widths', ({ given, when, then }: StepDefinitions) => {
    const renderConfig: RenderConfig = { variant: 'justify', color: '#FF00FF' };

    given('text align icon variant is justify', () => {
      renderConfig.variant = 'justify';
    });

    when('icon is rendered with color "#FF00FF"', () => {
      renderIcon(renderConfig);
    });

    then('lines have widths 24 24 24 and color "#FF00FF"', () => {
      expectLines([24, 24, 24], '#FF00FF');
    });
  });
};
