import React from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import { renderWithProviders } from '@tests/utils/render';
import { getStickySelectionContext } from '@/features/sticky-position';
import useSettingsVm from '@/components/pages/settings/useSettingsVm';
import { unmountTree } from '@tests/utils/unmountTree';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

jest.mock('@constants/fonts', () => ({
  fonts: [],
  FONT_VARIANTS: {},
  defaultFontName: 'Inter',
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

jest.mock('@components/header/SaveIndicator', () => ({
  useSaveIndicator: () => ({ showFor2s: jest.fn().mockResolvedValue(undefined) }),
}));

jest.mock('@utils/showErrorToast', () => ({ showErrorToast: jest.fn() }));

export default (test: JestCucumberTestFn) => {
  let vm: ReturnType<typeof useSettingsVm> | null = null;
  let tree: any;
  let applySpy: jest.SpyInstance | null = null;

  afterEach(async () => {
    tree = await unmountTree(tree);
    applySpy?.mockRestore();
    applySpy = null;
    jest.clearAllMocks();
  });

  test('Changing theme does not trigger sticky apply', ({ given, when, then, and = () => {} }: StepDefinitions) => {
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
  });
};
