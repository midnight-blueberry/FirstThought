import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

export default (test: JestCucumberTestFn) => {
  let setOptionsMock: jest.Mock;
  let runError: unknown = null;

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
      useSafeAreaInsets: () => ({ top: 0 }),
    }));

    jest.doMock('styled-components/native', () => ({
      __esModule: true,
      useTheme: () => ({}),
    }));
  };

  const runHook = (offset: number) => {
    const { default: useHeaderShadow } = require('@/hooks/useHeaderShadow');
    const handler = useHeaderShadow() as (event: NativeSyntheticEvent<NativeScrollEvent>) => void;

    try {
      handler({
        nativeEvent: { contentOffset: { y: offset } },
      } as NativeSyntheticEvent<NativeScrollEvent>);
    } catch (error) {
      runError = error;
    }
  };

  beforeEach(() => {
    setOptionsMock = jest.fn();
    runError = null;
    jest.resetModules();
    mockModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('ignores scroll updates at top', ({ given, when, then }: StepDefinitions) => {
    given('the header scroll handler hook is initialized', () => {
      // Initialized by mocks in beforeEach.
    });

    when('the scroll offset is 0', () => {
      runHook(0);
    });

    then('no header options are changed', () => {
      expect(runError).toBeNull();
      expect(setOptionsMock).not.toHaveBeenCalled();
    });
  });

  test('ignores scroll updates after scrolling', ({ given, when, then }: StepDefinitions) => {
    given('the header scroll handler hook is initialized', () => {
      // Initialized by mocks in beforeEach.
    });

    when('the scroll offset is 5', () => {
      runHook(5);
    });

    then('no header options are changed', () => {
      expect(runError).toBeNull();
      expect(setOptionsMock).not.toHaveBeenCalled();
    });
  });
};
