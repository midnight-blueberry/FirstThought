import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

let fontsLoaded = false;
let themeBackground = '#000000';
let themeIsDark = false;

let lastStatusBarStyle: string | null = null;
let lastSafeAreaViewProps: Record<string, unknown> | null = null;
let lastDrawerNavigatorProps: Record<string, unknown> | null = null;

let renderResult: { toJSON: () => unknown } | null = null;

let reactModule: any;
let actFn: (cb: () => Promise<any> | void) => Promise<void>;
let createFn: (element: any) => { toJSON: () => unknown };

let preventAutoHideAsyncMock: jest.Mock;
let hideAsyncMock: jest.Mock;
let setBackgroundColorAsyncMock: jest.Mock;

const globalWithActFlag = globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean };
globalWithActFlag.IS_REACT_ACT_ENVIRONMENT = true;

const withSuppressedReactTestRendererWarnings = <T,>(callback: () => T): T => {
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const shouldSuppress = args.some(arg => {
      const msg = String(arg);
      return (
        msg.includes('react-test-renderer is deprecated') ||
        msg.includes('The current testing environment is not configured to support act')
      );
    });

    if (shouldSuppress) {
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

const setupModuleMocks = () => {
  jest.resetModules();

  lastStatusBarStyle = null;
  lastSafeAreaViewProps = null;
  lastDrawerNavigatorProps = null;

  preventAutoHideAsyncMock = jest.fn(() => Promise.resolve());
  hideAsyncMock = jest.fn(() => Promise.resolve());
  setBackgroundColorAsyncMock = jest.fn(() => Promise.resolve());

  jest.doMock('expo-font', () => ({
    useFonts: () => [fontsLoaded],
  }));

  jest.doMock('expo-splash-screen', () => ({
    preventAutoHideAsync: preventAutoHideAsyncMock,
    hideAsync: hideAsyncMock,
  }));

  jest.doMock('expo-system-ui', () => ({
    setBackgroundColorAsync: setBackgroundColorAsyncMock,
  }));

  jest.doMock('expo-status-bar', () => ({
    StatusBar: ({ style }: { style: string }) => {
      lastStatusBarStyle = style;
      return null;
    },
  }));

  jest.doMock('react-native-gesture-handler', () => ({
    GestureHandlerRootView: ({ children }: { children?: any }) => children ?? null,
  }));

  jest.doMock('react-native-reanimated', () => ({}));


  jest.doMock('react-native-safe-area-context', () => ({
    SafeAreaProvider: ({ children }: { children?: any }) => children ?? null,
    SafeAreaView: (props: Record<string, unknown>) => {
      lastSafeAreaViewProps = props;
      return (props.children as any) ?? null;
    },
  }));

  jest.doMock('@hooks/useTheme', () => ({
    __esModule: true,
    default: () => ({
      isDark: themeIsDark,
      colors: {
        background: themeBackground,
      },
    }),
  }));

  jest.doMock('@/state/SettingsContext', () => ({
    SettingsProvider: ({ children }: { children?: any }) => children ?? null,
    useSettings: () => ({ settings: {} }),
  }));

  jest.doMock('@theme/ThemeProvider', () => ({
    __esModule: true,
    default: ({ children }: { children?: any }) => children ?? null,
  }));

  jest.doMock('@/constants/fonts/files', () => ({
    FONT_FILES: {
      TestFont: {
        400: 'test-font-file',
      },
    },
  }));

  jest.doMock('@components/ui/StatusBarBackground', () => () => null);

  jest.doMock('@components/header/SaveIndicator', () => ({
    SaveIndicatorProvider: ({ children }: { children?: any }) => children ?? null,
  }));

  const drawerPath = require.resolve('../../src/navigation/DrawerNavigator');
  jest.doMock(drawerPath, () => ({
    __esModule: true,
    default: (props: Record<string, unknown>) => {
      lastDrawerNavigatorProps = props;
      return null;
    },
  }));
};

const renderRootLayout = async () => {
  setupModuleMocks();

  reactModule = require('react');
  const rendererModule = require('../../node_modules/react-test-renderer');
  actFn = rendererModule.act;
  createFn = rendererModule.create;

  const RootLayout = require('../../src/screens/root-layout').default;

  await actFn(async () => {
    renderResult = withSuppressedReactTestRendererWarnings(() =>
      createFn(reactModule.createElement(RootLayout)),
    );
  });
};

export default (test: JestCucumberTestFn) => {
  test('Does not render until fonts are loaded', ({ given, when, then }: StepDefinitions) => {
    given('fonts are not loaded', () => {
      fontsLoaded = false;
      themeBackground = '#000000';
      themeIsDark = false;
      renderResult = null;
    });

    when('RootLayout is rendered', async () => {
      await renderRootLayout();
    });

    then('nothing is rendered', () => {
      expect(renderResult?.toJSON()).toBeNull();
    });
  });

  test(
    'Renders content and runs initialization side effects when fonts are loaded',
    ({ given, when, then }: StepDefinitions) => {
      given('fonts are loaded', () => {
        fontsLoaded = true;
        renderResult = null;
      });

      given('theme background color is "#ABCDEF"', () => {
        themeBackground = '#ABCDEF';
      });

      given('theme is dark', () => {
        themeIsDark = true;
      });

      when('RootLayout is rendered', async () => {
        await renderRootLayout();
      });

      then('SplashScreen.preventAutoHideAsync is called once', () => {
        expect(preventAutoHideAsyncMock).toHaveBeenCalledTimes(1);
      });

      then('SystemUI.setBackgroundColorAsync is called with "#ABCDEF"', () => {
        expect(setBackgroundColorAsyncMock).toHaveBeenCalledWith('#ABCDEF');
      });

      then('StatusBar style is "light"', () => {
        expect(lastStatusBarStyle).toBe('light');
      });

      then('DrawerNavigator is rendered', () => {
        expect(lastDrawerNavigatorProps).toBeTruthy();
      });

      then('DrawerNavigator receives homePageHeaderTitle "Мои дневники"', () => {
        expect(lastDrawerNavigatorProps?.homePageHeaderTitle).toBe('Мои дневники');
      });

      then('DrawerNavigator receives settingsPageHeaderTitle "Настройки"', () => {
        expect(lastDrawerNavigatorProps?.settingsPageHeaderTitle).toBe('Настройки');
      });

      when('I trigger the root SafeAreaView layout', async () => {
        const onLayout = lastSafeAreaViewProps?.onLayout as undefined | (() => void);
        expect(onLayout).toBeDefined();

        await actFn(async () => {
          onLayout?.();
        });
      });

      then('SplashScreen.hideAsync is called once', () => {
        expect(hideAsyncMock).toHaveBeenCalledTimes(1);
      });
    },
  );
};

