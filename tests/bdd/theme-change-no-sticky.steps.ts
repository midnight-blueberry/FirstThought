import React from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import { defineFeature, loadFeature } from 'jest-cucumber';
import useSettingsVm from '@/components/pages/settings/useSettingsVm';
import { renderWithProviders } from '@tests/utils/render';
import { getStickySelectionContext } from '@/features/sticky-position';
import type { Settings } from '@/state/SettingsContext';
import { themes } from '@theme/buildTheme';

const overlayMock = {
  begin: jest.fn(),
  end: jest.fn(),
  apply: jest.fn(),
  transact: (fn: () => void | Promise<void>) => {
    const result = fn();
    return Promise.resolve(result);
  },
  isBusy: jest.fn(() => false),
  freezeBackground: jest.fn(),
  releaseBackground: jest.fn(),
  isOpaque: jest.fn(() => false),
};

const baseSettings: Settings = {
  themeId: 'light',
  accent: themes.light.colors.accent,
  fontFamily: 'DefaultFont',
  fontWeight: '400',
  fontSizeLevel: 3,
  noteTextAlign: 'left',
};

const updateSettings = jest.fn((patch: Partial<Settings>) => ({
  ...baseSettings,
  ...patch,
}));

jest.mock('@/components/settings/overlay', () => ({
  useOverlayTransition: () => overlayMock,
}));

jest.mock('@hooks/useTheme', () => () => themes.light);

jest.mock('@hooks/useHeaderShadow', () => () => jest.fn());

jest.mock('@components/header/SaveIndicator', () => ({
  useSaveIndicator: () => ({ showFor2s: jest.fn(() => Promise.resolve()) }),
}));

jest.mock('@/state/SettingsContext', () => ({
  useSettings: () => ({ settings: baseSettings, updateSettings }),
}));

jest.mock('@utils/showErrorToast', () => ({
  showErrorToast: jest.fn(),
}));

const feature = loadFeature('tests/bdd/theme-change-no-sticky.feature');

defineFeature(feature, (test) => {
  let vm: ReturnType<typeof useSettingsVm> | null = null;
  let ctxSpy: jest.SpyInstance | null = null;

  afterEach(() => {
    jest.clearAllMocks();
    vm = null;
    if (ctxSpy) {
      ctxSpy.mockRestore();
      ctxSpy = null;
    }
  });

  test('Theme change bypasses sticky apply', ({ given, when, then, and }) => {
    given('the settings view model is initialized', async () => {
      const Container = () => {
        vm = useSettingsVm(jest.fn());
        return null;
      };

      await act(async () => {
        renderWithProviders(<Container />);
      });

      const ctx = getStickySelectionContext();
      ctxSpy = jest.spyOn(ctx!, 'applyWithSticky');
    });

    when('the user selects the cream theme', () => {
      vm?.sectionProps.theme.onSelectTheme('Кремовая');
    });

    then('sticky applyWithSticky is not called', () => {
      expect(ctxSpy).toHaveBeenCalledTimes(0);
    });

    and('settings update is called with the cream theme', () => {
      expect(updateSettings).toHaveBeenCalledWith(
        expect.objectContaining({ themeId: 'cream' }),
      );
    });
  });
});
