import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

type Theme = {
  colors: { headerBackground: string };
  iconSize: { medium: number };
  padding: { large: number };
};

type HeaderOptions = {
  headerStyle: {
    backgroundColor: string;
    elevation: number;
    height: number;
  };
  headerShadowVisible: boolean;
};

export default (test: JestCucumberTestFn) => {
  let setOptionsMock: jest.Mock;
  let mockTop = 10;
  let mockTheme: Theme = {
    colors: { headerBackground: '#123456' },
    iconSize: { medium: 24 },
    padding: { large: 8 },
  };
  let latestOptions: HeaderOptions | null = null;

  const mockModules = () => {
    jest.doMock('react', () => ({
      __esModule: true,
      useCallback: (fn: (...args: any[]) => any) => fn,
    }));

    jest.doMock('expo-router', () => ({
      __esModule: true,
      useNavigation: () => ({ setOptions: setOptionsMock }),
    }));

    jest.doMock('react-native-safe-area-context', () => ({
      __esModule: true,
      useSafeAreaInsets: () => ({ top: mockTop }),
    }));

    jest.doMock('styled-components/native', () => ({
      __esModule: true,
      useTheme: () => mockTheme,
    }));
  };

  const runHook = (offset: number) => {
    const { default: useHeaderShadow } = require('@/hooks/useHeaderShadow');
    const handler = useHeaderShadow() as (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    handler({
      nativeEvent: { contentOffset: { y: offset } },
    } as NativeSyntheticEvent<NativeScrollEvent>);
    latestOptions = setOptionsMock.mock.calls[0]?.[0] ?? null;
  };

  beforeEach(() => {
    setOptionsMock = jest.fn();
    mockTop = 10;
    mockTheme = {
      colors: { headerBackground: '#123456' },
      iconSize: { medium: 24 },
      padding: { large: 8 },
    };
    latestOptions = null;
    jest.resetModules();
    mockModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('sets header options without shadow at top', ({ given, when, then }: StepDefinitions) => {
    given('a theme with header background "#123456"', () => {
      mockTheme = {
        ...mockTheme,
        colors: { ...mockTheme.colors, headerBackground: '#123456' },
      };
    });

    given('medium icon size 24 and large padding 8', () => {
      mockTheme = {
        ...mockTheme,
        iconSize: { ...mockTheme.iconSize, medium: 24 },
        padding: { ...mockTheme.padding, large: 8 },
      };
    });

    given('a top inset of 10', () => {
      mockTop = 10;
    });

    when('the scroll offset is 0', () => {
      runHook(0);
    });

    then('the header shadow is not visible', () => {
      expect(setOptionsMock).toHaveBeenCalledTimes(1);
      expect(latestOptions?.headerShadowVisible).toBe(false);
    });

    then('the header elevation is 0', () => {
      expect(latestOptions?.headerStyle.elevation).toBe(0);
    });

    then('the header background color matches the theme', () => {
      expect(latestOptions?.headerStyle.backgroundColor).toBe(mockTheme.colors.headerBackground);
    });

    then('the header height is 50', () => {
      expect(latestOptions?.headerStyle.height).toBe(50);
    });
  });

  test('sets header options with shadow after scrolling', ({ given, when, then }: StepDefinitions) => {
    given('a theme with header background "#123456"', () => {
      mockTheme = {
        ...mockTheme,
        colors: { ...mockTheme.colors, headerBackground: '#123456' },
      };
    });

    given('medium icon size 24 and large padding 8', () => {
      mockTheme = {
        ...mockTheme,
        iconSize: { ...mockTheme.iconSize, medium: 24 },
        padding: { ...mockTheme.padding, large: 8 },
      };
    });

    given('a top inset of 10', () => {
      mockTop = 10;
    });

    when('the scroll offset is 5', () => {
      runHook(5);
    });

    then('the header shadow is visible', () => {
      expect(setOptionsMock).toHaveBeenCalledTimes(1);
      expect(latestOptions?.headerShadowVisible).toBe(true);
    });

    then('the header elevation is 4', () => {
      expect(latestOptions?.headerStyle.elevation).toBe(4);
    });

    then('the header background color matches the theme', () => {
      expect(latestOptions?.headerStyle.backgroundColor).toBe(mockTheme.colors.headerBackground);
    });

    then('the header height is 50', () => {
      expect(latestOptions?.headerStyle.height).toBe(50);
    });
  });
};
