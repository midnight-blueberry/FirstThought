import React from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import { defineFeature, loadFeature } from 'jest-cucumber';
import { renderWithProviders } from '@tests/utils/render';
import { getStickySelectionContext } from '@/features/sticky-position';
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

jest.mock('@components/header/SaveIndicator', () => {
  const hide = jest.fn();
  const showFor2s = jest.fn().mockResolvedValue(undefined);

  return {
    __mockHide: hide,
    __mockShowFor2s: showFor2s,
    useSaveIndicator: () => ({ hide, showFor2s }),
  };
});

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
      const { __mockUpdateSettings } = jest.requireMock('@/state/SettingsContext');

      expect(__mockUpdateSettings).toHaveBeenCalledWith(
        expect.objectContaining({ themeId: 'cream' }),
      );
    });

    and('save indicator hides before showing save state', () => {
      const { __mockHide, __mockShowFor2s } = jest.requireMock(
        '@components/header/SaveIndicator',
      );

      expect(__mockHide).toHaveBeenCalled();
      expect(__mockShowFor2s).toHaveBeenCalled();

      const firstHideCall = __mockHide.mock.invocationCallOrder[0];
      const firstShowCall = __mockShowFor2s.mock.invocationCallOrder[0];

      expect(firstHideCall).toBeLessThan(firstShowCall);
    });
  });
});
