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

let busy = false;
let overlayMock: {
  freezeBackground: jest.Mock;
  releaseBackground: jest.Mock;
  transact: jest.Mock;
  isBusy: jest.Mock;
};

jest.mock('@/components/settings/overlay', () => ({
  useOverlayTransition: jest.fn(),
}));

const { useOverlayTransition } = jest.requireMock('@/components/settings/overlay');
const SAVE_INDICATOR_OVERLAY_DEBOUNCE_MS = 250;

const feature = loadFeature('tests/bdd/save-indicator-overlay.feature');

defineFeature(feature, (test) => {
  let vm: ReturnType<typeof useSettingsVm> | null = null;
  let tree: any;

  const resetOverlayMock = () => {
    busy = false;
    overlayMock = {
      freezeBackground: jest.fn(),
      releaseBackground: jest.fn(),
      transact: jest.fn(async (cb: () => void | Promise<void>) => {
        busy = true;
        try {
          await cb();
        } finally {
          busy = false;
        }
      }),
      isBusy: jest.fn(() => busy),
    };
    useOverlayTransition.mockReturnValue(overlayMock);
  };

  beforeEach(() => {
    jest.useFakeTimers();
    resetOverlayMock();
  });

  afterEach(async () => {
    if (tree) {
      await act(async () => {
        tree.unmount();
      });
      tree = null;
    }
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  test('Save indicator is debounced across rapid overlay theme changes', ({
    given,
    when,
    then,
    and,
  }) => {
    given('settings VM is rendered with fake timers', async () => {
      const captureBeforeUpdate = jest.fn();
      const Wrapper = () => {
        vm = useSettingsVm(captureBeforeUpdate);
        return null;
      };

      await act(async () => {
        tree = renderWithProviders(React.createElement(Wrapper));
      });
    });

    when('user quickly selects two themes through overlay transactions', async () => {
      await act(async () => {
        vm!.sectionProps.theme.onSelectTheme('Кремовая');
        vm!.sectionProps.theme.onSelectTheme('Темная');
        await Promise.resolve();
      });
    });

    then('save indicator is shown once after overlay debounce', async () => {
      expect(showFor2s).not.toHaveBeenCalled();

      await act(async () => {
        jest.advanceTimersByTime(SAVE_INDICATOR_OVERLAY_DEBOUNCE_MS);
      });

      expect(showFor2s).toHaveBeenCalledTimes(1);
    });

    and('hide is called before overlay transaction begins', () => {
      expect(hide.mock.invocationCallOrder[0]).toBeLessThan(
        overlayMock.transact.mock.invocationCallOrder[0],
      );
    });
  });
});
