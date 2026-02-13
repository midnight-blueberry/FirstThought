import type { Diary } from '@types';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

let lastDiaryListProps: any;
let lastIconButtonProps: any;

const headerShadowHandlerSpy = jest.fn();
const fixedTheme = {
  colors: {
    accent: '#AABBCC',
  },
  iconSize: {
    medium: 18,
  },
  buttonSizes: {
    medium: 40,
  },
};

const initialDiariesState: { value: Diary[] } = { value: [] };
let setDiariesSpy: jest.Mock;

const renderHomePage = (options?: { mockUseState?: boolean }) => {
  jest.resetModules();
  lastDiaryListProps = undefined;
  lastIconButtonProps = undefined;

  jest.doMock('@components/ui/organisms', () => ({
    __esModule: true,
    DiaryList: (props: any) => {
      lastDiaryListProps = props;
      return null;
    },
  }));

  jest.doMock('@components/ui/atoms', () => ({
    __esModule: true,
    IconButton: (props: any) => {
      lastIconButtonProps = props;
      return null;
    },
  }));

  jest.doMock('@hooks/useHeaderShadow', () => ({
    __esModule: true,
    default: jest.fn(() => headerShadowHandlerSpy),
  }));

  jest.doMock('@hooks/useTheme', () => ({
    __esModule: true,
    default: jest.fn(() => fixedTheme),
  }));

  if (options?.mockUseState) {
    setDiariesSpy = jest.fn();

    jest.doMock('react', () => {
      const actualReact = jest.requireActual('react');
      return {
        ...actualReact,
        useState: jest.fn(() => [initialDiariesState.value, setDiariesSpy]),
      };
    });
  }

  const React = require('react');
  const ReactDOMServer = require('react-dom/server');
  const HomePage = require('@/components/pages/home-page').default;

  ReactDOMServer.renderToStaticMarkup(React.createElement(HomePage));
};

export default (test: JestCucumberTestFn) => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.resetModules();
    jest.dontMock('react');
    initialDiariesState.value = [];
  });

  test(
    'HomePage passes props to DiaryList and IconButton',
    ({ given, when, then }: StepDefinitions) => {
      given('initial diaries are empty', () => {
        initialDiariesState.value = [];
      });

      when('HomePage is rendered', () => {
        renderHomePage();
      });

      then('DiaryList receives 0 items', () => {
        expect(lastDiaryListProps.data).toHaveLength(0);
      });

      then('DiaryList receives the header shadow handler as onScroll', () => {
        expect(lastDiaryListProps.onScroll).toBe(headerShadowHandlerSpy);
      });

      then('IconButton receives icon "add"', () => {
        expect(lastIconButtonProps.icon).toBe('add');
      });

      then('IconButton receives color "onAccent"', () => {
        expect(lastIconButtonProps.color).toBe('onAccent');
      });

      then('IconButton receives size 18', () => {
        expect(lastIconButtonProps.size).toBe(18);
      });

      then(
        'IconButton style has backgroundColor "#AABBCC" and width 40 and height 40 and borderRadius 20',
        () => {
          const { StyleSheet } = require('react-native');
          const flattenedStyle = StyleSheet.flatten(lastIconButtonProps.style);

          expect(flattenedStyle).toEqual(
            expect.objectContaining({
              backgroundColor: '#AABBCC',
              width: 40,
              height: 40,
              borderRadius: 20,
            }),
          );
        },
      );
    },
  );

  test(
    'HomePage addDiary prepends a generated diary',
    ({ given, when, then }: StepDefinitions) => {
      given('initial diaries contain 2 items', () => {
        initialDiariesState.value = [
          { id: 'old-1', icon: 'book', title: 'Diary 1' },
          { id: 'old-2', icon: 'journal', title: 'Diary 2' },
        ];
      });

      given('Date.now is 111', () => {
        jest.spyOn(Date, 'now').mockReturnValue(111);
      });

      given('Math.random is 0.41', () => {
        jest.spyOn(Math, 'random').mockReturnValue(0.41);
      });

      when('HomePage is rendered', () => {
        renderHomePage({ mockUseState: true });
      });

      when('the add diary button is pressed', () => {
        lastIconButtonProps.onPress();
      });

      then(
        'setDiaries is called with a new diary id "111" icon "document" title "Diary 3" prepended to the existing diaries',
        () => {
          expect(setDiariesSpy).toHaveBeenCalledTimes(1);
          expect(setDiariesSpy).toHaveBeenCalledWith([
            {
              id: '111',
              icon: 'document',
              title: 'Diary 3',
            },
            ...initialDiariesState.value,
          ]);
        },
      );
    },
  );
};
