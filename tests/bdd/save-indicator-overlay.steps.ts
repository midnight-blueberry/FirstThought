import React from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { renderWithProviders } from '@tests/utils/render';
import useSettingsVm from '@/components/pages/settings/useSettingsVm';

jest.mock('@constants/fonts', () => ({
  fonts: [],
  FONT_VARIANTS: {},
  defaultFontName: 'Inter',
}));

jest.mock('@constants/fonts/resolve', () => ({
  nearestAvailableWeight: (_family: string, weight: number) => weight,
  listAvailableWeights: () => [],
  fontKey: (_family: string, weight: number) => `${_family}_${weight}`,
}));

jest.mock('@utils/fontHelpers', () => ({
  getFontByName: () => ({
    family: 'Inter',
    defaultWeight: '400',
    defaultSize: 16,
  }),
  hasMultipleWeights: () => false,
}));

jest.mock('@/state/SettingsContext', () => {
  const mockUpdateSettings = jest.fn();
  const mockSettings = {
    themeId: 'light',
    accent: 'blue',
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSizeLevel: 3,
    noteTextAlign: 'left',
  };

  return {
    __mockUpdateSettings: mockUpdateSettings,
    __mockSettings: mockSettings,
    useSettings: () => ({ settings: mockSettings, updateSettings: mockUpdateSettings }),
  };
});

jest.mock('@hooks/useTheme', () => () => ({
  colors: { background: '#ffffff', accent: '#000000' },
  fontWeight: '400',
  noteTextAlign: 'left',
}));

jest.mock('@hooks/useHeaderShadow', () => () => jest.fn());

const showFor2s = jest.fn().mockResolvedValue(undefined);
const hide = jest.fn();

jest.mock('@components/header/SaveIndicator', () => ({
  useSaveIndicator: () => ({ showFor2s, hide }),
}));

const createOverlayMock = () => {
  const overlay = {
    begin: jest.fn(),
    end: jest.fn(),
    apply: jest.fn(),
    transact: jest.fn(async (cb: () => void | Promise<void>) => {
      await cb();
    }),
    isBusy: jest.fn(() => false),
    freezeBackground: jest.fn(),
    releaseBackground: jest.fn(),
    isOpaque: jest.fn(() => false),
    reset: () => {
      overlay.begin.mockClear();
      overlay.end.mockClear();
      overlay.apply.mockClear();
      overlay.transact.mockClear();
      overlay.isBusy.mockClear();
      overlay.freezeBackground.mockClear();
      overlay.releaseBackground.mockClear();
      overlay.isOpaque.mockClear();
    },
  } as const;

  return overlay;
};

const overlayMock = createOverlayMock();

jest.mock('@/components/settings/overlay', () => {
  const actual = jest.requireActual('@/components/settings/overlay');
  return {
    ...actual,
    useOverlayTransition: () => overlayMock,
  };
});

jest.mock('@utils/showErrorToast', () => ({ showErrorToast: jest.fn() }));

const feature = loadFeature('tests/bdd/save-indicator-overlay.feature');

const debounceMs = 250;

defineFeature(feature, (test) => {
  let vm: ReturnType<typeof useSettingsVm> | null = null;
  let tree: any;

  afterEach(async () => {
    if (tree) {
      await act(async () => {
        tree.unmount();
      });
      tree = null;
    }
    vm = null;
    overlayMock.reset();
    showFor2s.mockClear();
    hide.mockClear();
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('Save indicator appears once after rapid overlay transactions', ({
    given,
    when,
    then,
    and,
  }) => {
    given('settings VM with overlay save indicator debounce is rendered', async () => {
      jest.useFakeTimers();
      const captureBeforeUpdate = jest.fn();
      const Wrapper = () => {
        vm = useSettingsVm(captureBeforeUpdate);
        return null;
      };

      await act(async () => {
        tree = renderWithProviders(React.createElement(Wrapper));
      });
    });

    when('user quickly selects two themes', async () => {
      await act(async () => {
        vm!.sectionProps.theme.onSelectTheme('Кремовая');
        vm!.sectionProps.theme.onSelectTheme('Темная');
        await Promise.resolve();
      });
    });

    then('save indicator is not shown before debounce time', () => {
      expect(showFor2s).not.toHaveBeenCalled();
      act(() => {
        jest.advanceTimersByTime(debounceMs - 1);
      });
      expect(showFor2s).not.toHaveBeenCalled();
    });

    and('save indicator is shown once after debounce time', () => {
      act(() => {
        jest.advanceTimersByTime(1);
      });
      expect(showFor2s).toHaveBeenCalledTimes(1);
    });

    and('save indicator is hidden before overlay transaction starts', () => {
      expect(hide).toHaveBeenCalled();
      expect(overlayMock.transact).toHaveBeenCalled();
      expect(hide.mock.invocationCallOrder[0]).toBeLessThan(
        overlayMock.transact.mock.invocationCallOrder[0],
      );
    });
  });
});
