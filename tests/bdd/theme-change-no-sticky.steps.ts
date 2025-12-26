import React from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { renderWithProviders } from '@tests/utils/render';
import { getStickySelectionContext } from '@/features/sticky-position';
import type { Settings } from '@/state/SettingsContext';
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

const overlayMock = {
  begin: jest.fn(),
  end: jest.fn(),
  isBusy: jest.fn(() => false),
  freezeBackground: jest.fn(),
  releaseBackground: jest.fn(),
  isOpaque: jest.fn(() => true),
  transact: jest.fn(async (fn: () => void | Promise<void>) => {
    await fn();
    return Promise.resolve();
  }),
};

jest.mock('@/components/settings/overlay', () => ({
  useOverlayTransition: () => overlayMock,
}));

const updateSettings = jest.fn();
const settings: Settings = {
  themeId: 'light',
  accent: 'blue',
  fontFamily: 'Inter',
  fontWeight: '400',
  fontSizeLevel: 3,
  noteTextAlign: 'left',
};

jest.mock('@/state/SettingsContext', () => ({
  useSettings: () => ({ settings, updateSettings }),
}));

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

const feature = loadFeature('tests/bdd/theme-change-no-sticky.feature');

defineFeature(feature, (test) => {
  let vm: ReturnType<typeof useSettingsVm> | null = null;
  let tree: any;
  let applySpy: jest.SpyInstance | null = null;

  afterEach(async () => {
    if (tree) {
      await act(async () => {
        tree.unmount();
      });
      tree = null;
    }
    applySpy?.mockRestore();
    applySpy = null;
    jest.clearAllMocks();
  });

  test('Changing theme does not trigger sticky apply', ({ given, when, then, and }) => {
    given('settings VM is rendered', async () => {
      const captureBeforeUpdate = jest.fn();
      const Wrapper = () => {
        vm = useSettingsVm(captureBeforeUpdate);
        return null;
      };

      await act(async () => {
        tree = renderWithProviders(React.createElement(Wrapper));
      });

      const ctx = getStickySelectionContext();
      applySpy = jest.spyOn(ctx!, 'applyWithSticky');
    });

    when('user selects theme "Кремовая"', async () => {
      await act(async () => {
        vm!.sectionProps.theme.onSelectTheme('Кремовая');
        await Promise.resolve();
      });
    });

    then('sticky selection is not applied during theme change', () => {
      expect(applySpy).toBeTruthy();
      expect(applySpy).not.toHaveBeenCalled();
    });

    and('settings are updated with theme "cream"', () => {
      expect(updateSettings).toHaveBeenCalledWith(
        expect.objectContaining({ themeId: 'cream' }),
      );
    });
  });
});
