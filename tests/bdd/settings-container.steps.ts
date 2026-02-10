import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

type Deferred = {
  promise: Promise<void>;
  resolve: () => void;
};

type ScrollEvent = {
  nativeEvent: {
    contentOffset: {
      y: number;
    };
  };
};

const createDeferred = (): Deferred => {
  let resolve!: () => void;
  const promise = new Promise<void>((res) => {
    resolve = res;
  });

  return { promise, resolve };
};

export default (test: JestCucumberTestFn) => {
  let lastSettingsContentProps: any = null;
  let vmHandleScrollMock: jest.Mock;
  let anchorHandleScrollMock: jest.Mock;
  let anchorAdjustAfterLayoutMock: jest.Mock;
  let waitForOpaqueMock: jest.Mock;
  let overlayOpaqueDeferred: Deferred | null;

  const mockModules = () => {
    jest.doMock('react', () => {
      const actual = jest.requireActual('react');
      return {
        __esModule: true,
        default: actual,
        ...actual,
        useLayoutEffect: (cb: () => void) => cb(),
      };
    });

    jest.doMock('@components/pages/settings/SettingsContent', () => ({
      __esModule: true,
      default: (props: any) => {
        lastSettingsContentProps = props;
        return null;
      },
    }));

    jest.doMock('@components/pages/settings/useSettingsVm', () => ({
      __esModule: true,
      default: () => ({
        handleScroll: vmHandleScrollMock,
        sectionProps: {},
        theme: { colors: {} },
        overlayVisible: false,
        overlayColor: 'transparent',
        overlayAnim: 0,
        overlayBlocks: false,
        settingsVersion: 1,
      }),
    }));

    jest.doMock('@/features/scroll/useAnchorStableScroll', () => {
      const actualReact = jest.requireActual('react');
      const anchor = {
        scrollRef: { current: null },
        contextValue: { captureBeforeUpdate: jest.fn() },
        handleScroll: anchorHandleScrollMock,
        adjustAfterLayout: anchorAdjustAfterLayoutMock,
      };

      return {
        __esModule: true,
        default: () => anchor,
        AnchorStableScrollContext: actualReact.createContext(null),
      };
    });

    jest.doMock('@components/header/SaveIndicator', () => ({
      __esModule: true,
      useSaveIndicator: () => ({ hide: jest.fn() }),
    }));

    jest.doMock('@/features/sticky-position', () => ({
      __esModule: true,
      StickySelectionProvider: ({ children }: { children: any }) => children,
    }));

    jest.doMock('@/components/settings/overlay', () => {
      const overlay = { opaqueAt: 1 };

      return {
        __esModule: true,
        useOverlayTransition: () => overlay,
        waitForOpaque: (...args: any[]) => waitForOpaqueMock(...args),
      };
    });
  };

  const renderSettingsContainer = async () => {
    const React = require('react');
    const ReactDOMServer = require('react-dom/server');
    const module = await import('@/components/pages/settings/SettingsContainer');
    const SettingsContainer = module.default as any;
    ReactDOMServer.renderToStaticMarkup(React.createElement(SettingsContainer));
  };

  beforeEach(() => {
    lastSettingsContentProps = null;
    vmHandleScrollMock = jest.fn();
    anchorHandleScrollMock = jest.fn();
    anchorAdjustAfterLayoutMock = jest.fn();
    overlayOpaqueDeferred = null;
    waitForOpaqueMock = jest.fn(() => Promise.resolve());
    jest.resetModules();
    mockModules();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  test('forwards scroll events to VM and anchor handlers', ({ given, when, then }: StepDefinitions) => {
    let scrollEvent: ScrollEvent;

    given('SettingsContainer is rendered', async () => {
      await renderSettingsContainer();
    });

    when('I trigger onScroll with y 123', () => {
      scrollEvent = { nativeEvent: { contentOffset: { y: 123 } } };
      lastSettingsContentProps.onScroll(scrollEvent);
    });

    then('settings VM handleScroll is called with y 123', () => {
      expect(vmHandleScrollMock).toHaveBeenCalledWith(
        expect.objectContaining({
          nativeEvent: expect.objectContaining({
            contentOffset: expect.objectContaining({ y: 123 }),
          }),
        }),
      );
    });

    then('anchor stable scroll handleScroll is called with y 123', () => {
      expect(anchorHandleScrollMock).toHaveBeenCalledWith(
        expect.objectContaining({
          nativeEvent: expect.objectContaining({
            contentOffset: expect.objectContaining({ y: 123 }),
          }),
        }),
      );
    });
  });

  test('waits for opaque overlay before adjusting anchor layout', ({ given, when, then }: StepDefinitions) => {
    given('SettingsContainer is rendered with pending overlay opaque wait', async () => {
      overlayOpaqueDeferred = createDeferred();
      waitForOpaqueMock.mockImplementation(() => overlayOpaqueDeferred!.promise);
      await renderSettingsContainer();
    });

    then('anchor adjustAfterLayout is not called', () => {
      expect(anchorAdjustAfterLayoutMock).not.toHaveBeenCalled();
    });

    when('overlay becomes opaque', async () => {
      overlayOpaqueDeferred!.resolve();
      await Promise.resolve();
      await Promise.resolve();
      await Promise.resolve();
    });

    then('anchor adjustAfterLayout is called', () => {
      expect(anchorAdjustAfterLayoutMock).toHaveBeenCalledTimes(1);
    });
  });
};
