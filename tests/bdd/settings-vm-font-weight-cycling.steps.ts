import React from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import { renderWithProviders } from '@tests/utils/render';
import useSettingsVm from '@/components/pages/settings/useSettingsVm';
import { getStickySelectionContext } from '@/features/sticky-position';
import { unmountTree } from '@tests/utils/unmountTree';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

jest.mock('@constants/fonts', () => ({
  fonts: [
    {
      family: 'Inter',
      label: 'Inter',
      value: 'Inter',
      defaultWeight: '400',
      defaultSize: 16,
    },
  ],
  FONT_VARIANTS: {
    Inter: {
      400: true,
      500: true,
      700: true,
    },
  },
  defaultFontName: 'Inter',
}));

jest.mock('@constants/fonts/resolve', () => ({
  nearestAvailableWeight: (_family: string, weight: number) => weight,
  listAvailableWeights: () => [400, 500, 700],
  fontKey: (_family: string, weight: number) => `${_family}_${weight}`,
}));

jest.mock('@utils/fontHelpers', () => ({
  getFontByName: () => ({
    family: 'Inter',
    defaultWeight: '400',
    defaultSize: 16,
  }),
  hasMultipleWeights: () => true,
}));

jest.mock('@/state/SettingsContext', () => {
  let mockSettings = {
    themeId: 'light',
    accent: 'blue',
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSizeLevel: 3,
    noteTextAlign: 'left',
  };

  const mockUpdateSettings = jest.fn((patch: Record<string, unknown>) => {
    mockSettings = { ...mockSettings, ...patch };
    return mockSettings;
  });

  return {
    __mockUpdateSettings: mockUpdateSettings,
    __setMockSettings: (next: Partial<typeof mockSettings>) => {
      mockSettings = { ...mockSettings, ...next };
    },
    useSettings: () => ({
      settings: mockSettings,
      updateSettings: mockUpdateSettings,
    }),
  };
});

jest.mock('@hooks/useTheme', () => () => ({
  colors: { background: '#ffffff', accent: '#000000' },
  fontWeight: '400',
  noteTextAlign: 'left',
}));

jest.mock('@hooks/useHeaderShadow', () => () => jest.fn());

jest.mock('@components/header/SaveIndicator', () => ({
  useSaveIndicator: () => ({ showFor2s: jest.fn().mockResolvedValue(undefined) }),
}));

jest.mock('@utils/showErrorToast', () => ({ showErrorToast: jest.fn() }));

export default (test: JestCucumberTestFn) => {
  let vm: ReturnType<typeof useSettingsVm> | null = null;
  let tree: any;

  const flushTransaction = async () => {
    await act(async () => {
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });
  };

  const setCurrentWeight = (weight: string) => {
    const { __setMockSettings } = jest.requireMock('@/state/SettingsContext');
    __setMockSettings({ fontWeight: weight });
  };

  const renderVm = async () => {
    const Wrapper = () => {
      vm = useSettingsVm(jest.fn());
      return null;
    };

    const scrollRef = {
      current: {
        scrollTo: jest.fn(),
        measure: jest.fn(),
      },
    };

    await act(async () => {
      tree = renderWithProviders(React.createElement(Wrapper), { scrollRef });
    });
  };

  const registerStickyPress = async () => {
    const ctx = getStickySelectionContext();
    const pressedRef = {
      current: {
        measureInWindow: (cb: (x: number, y: number, width: number, height: number) => void) =>
          cb(0, 120, 120, 28),
      },
    } as any;

    await act(async () => {
      await ctx!.registerPress('fontWeight', pressedRef);
    });
  };

  beforeEach(() => {
    const { __setMockSettings, __mockUpdateSettings } = jest.requireMock(
      '@/state/SettingsContext',
    );

    __setMockSettings({
      themeId: 'light',
      accent: 'blue',
      fontFamily: 'Inter',
      fontWeight: '400',
      fontSizeLevel: 3,
      noteTextAlign: 'left',
    });
    __mockUpdateSettings.mockClear();

    vm = null;
    tree = null;
  });

  afterEach(async () => {
    tree = await unmountTree(tree);
    jest.clearAllMocks();
  });

  test('Increase cycles from 400 to 500 for available weights 400, 500, 700', ({ given, when, then }: StepDefinitions) => {
    given(/^current font weight is "(.*)"$/, (weight: string) => {
      setCurrentWeight(weight);
    });

    given('settings VM is rendered', async () => {
      await renderVm();
    });

    given('sticky press is registered for font weight', async () => {
      await registerStickyPress();
    });

    when('font weight increase is triggered', async () => {
      vm!.sectionProps.fontWeight.onIncrease();
      await flushTransaction();
    });

    then('updateSettings receives patch with fontWeight "500"', () => {
      const { __mockUpdateSettings } = jest.requireMock('@/state/SettingsContext');

      expect(__mockUpdateSettings).toHaveBeenCalledWith(
        expect.objectContaining({ fontWeight: '500' }),
      );
    });
  });

  test('Increase wraps from 700 to 400 for available weights 400, 500, 700', ({ given, when, then }: StepDefinitions) => {
    given(/^current font weight is "(.*)"$/, (weight: string) => {
      setCurrentWeight(weight);
    });

    given('settings VM is rendered', async () => {
      await renderVm();
    });

    given('sticky press is registered for font weight', async () => {
      await registerStickyPress();
    });

    when('font weight increase is triggered', async () => {
      vm!.sectionProps.fontWeight.onIncrease();
      await flushTransaction();
    });

    then('updateSettings receives patch with fontWeight "400"', () => {
      const { __mockUpdateSettings } = jest.requireMock('@/state/SettingsContext');

      expect(__mockUpdateSettings).toHaveBeenCalledWith(
        expect.objectContaining({ fontWeight: '400' }),
      );
    });
  });

  test('Decrease wraps from 400 to 700 for available weights 400, 500, 700', ({ given, when, then }: StepDefinitions) => {
    given(/^current font weight is "(.*)"$/, (weight: string) => {
      setCurrentWeight(weight);
    });

    given('settings VM is rendered', async () => {
      await renderVm();
    });

    given('sticky press is registered for font weight', async () => {
      await registerStickyPress();
    });

    when('font weight decrease is triggered', async () => {
      vm!.sectionProps.fontWeight.onDecrease();
      await flushTransaction();
    });

    then('updateSettings receives patch with fontWeight "700"', () => {
      const { __mockUpdateSettings } = jest.requireMock('@/state/SettingsContext');

      expect(__mockUpdateSettings).toHaveBeenCalledWith(
        expect.objectContaining({ fontWeight: '700' }),
      );
    });
  });
};
