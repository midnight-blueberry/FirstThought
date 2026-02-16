import React from 'react';
// @ts-ignore
import { act } from 'react-test-renderer';
import { renderWithProviders } from '@tests/utils/render';
import { getStickySelectionContext } from '@/features/sticky-position';
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
  let applySpy: jest.SpyInstance | null = null;

  afterEach(async () => {
    tree = await unmountTree(tree);
    applySpy?.mockRestore();
    applySpy = null;
    jest.clearAllMocks();
  });

  test('Changing accent rolls back settings and shows error toast when update fails', ({
    given,
    when,
    then,
  }: StepDefinitions) => {
    given('settings VM is rendered with sticky context', async () => {
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

    given('sticky press is registered', async () => {
      const ctx = getStickySelectionContext();
      const pressedRef = {
        current: { measureInWindow: (cb: any) => cb(0, 120, 0, 20) },
      } as any;

      await act(async () => {
        await ctx!.registerPress('accent:#00FF00', pressedRef);
      });
    });

    when('user selects accent "#00FF00"', async () => {
      await act(async () => {
        vm!.sectionProps.accent.onSelectAccent('#00FF00');
        await Promise.resolve();
        await Promise.resolve();
      });
    });

    then('sticky apply is triggered', () => {
      expect(applySpy).toBeTruthy();
      expect(applySpy).toHaveBeenCalled();
    });

    then('updateSettings is called with accent patch', () => {
      const { __mockUpdateSettings } = jest.requireMock('@/state/SettingsContext');

      expect(__mockUpdateSettings).toHaveBeenCalledTimes(2);
      expect(__mockUpdateSettings).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({ accent: '#00FF00' }),
      );
    });

    then('updateSettings is called with rollback settings', () => {
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
