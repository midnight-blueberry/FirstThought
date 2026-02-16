import React from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import { renderWithProviders } from '@tests/utils/render';
import useSettingsVm from '@/components/pages/settings/useSettingsVm';
import { unmountTree } from '@tests/utils/unmountTree';
import { showErrorToast } from '@utils/showErrorToast';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

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
  const mockSettings = {
    themeId: 'light',
    accent: 'blue',
    fontFamily: 'Inter',
    fontWeight: '400',
    fontSizeLevel: 3,
    noteTextAlign: 'left',
  };

  const mockUpdateSettings = jest
    .fn()
    .mockImplementationOnce(() => {
      throw new Error('boom');
    })
    .mockImplementation((nextSettings) => nextSettings);

  return {
    __mockUpdateSettings: mockUpdateSettings,
    __mockSettings: mockSettings,
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

  afterEach(async () => {
    tree = await unmountTree(tree);
    jest.clearAllMocks();
  });

  test('Changing theme rolls back settings and shows error toast when update fails', ({
    given,
    when,
    then,
  }: StepDefinitions) => {
    given('settings VM is rendered', async () => {
      const captureBeforeUpdate = jest.fn();
      const Wrapper = () => {
        vm = useSettingsVm(captureBeforeUpdate);
        return null;
      };

      await act(async () => {
        tree = renderWithProviders(React.createElement(Wrapper));
      });
    });

    when('user selects theme "Кремовая"', async () => {
      await act(async () => {
        vm!.sectionProps.theme.onSelectTheme('Кремовая');
        await Promise.resolve();
        await Promise.resolve();
      });
    });

    then('updateSettings is called twice during failed theme change', () => {
      const { __mockUpdateSettings } = jest.requireMock('@/state/SettingsContext');

      expect(__mockUpdateSettings).toHaveBeenCalledTimes(2);
    });

    then('first updateSettings call contains theme patch "cream"', () => {
      const { __mockUpdateSettings } = jest.requireMock('@/state/SettingsContext');

      expect(__mockUpdateSettings).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ themeId: 'cream' }),
      );
    });

    then('second updateSettings call contains rollback settings', () => {
      const { __mockUpdateSettings, __mockSettings } = jest.requireMock(
        '@/state/SettingsContext',
      );

      expect(__mockUpdateSettings).toHaveBeenNthCalledWith(2, __mockSettings);
    });

    then('error toast is shown with message "boom"', () => {
      expect(showErrorToast).toHaveBeenCalledWith('boom');
    });
  });
};
