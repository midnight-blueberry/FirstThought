import { Alert, Platform, ToastAndroid } from 'react-native';

import { showErrorToast } from '@/utils/showErrorToast';
import type { JestCucumberTestFn, StepDefinitions } from '@tests/bdd/bddTypes';

type PlatformSetter = typeof Platform & { OS: typeof Platform.OS };

export default (test: JestCucumberTestFn) => {
  const setPlatform = (platform: PlatformSetter['OS']) => {
    (Platform as PlatformSetter).OS = platform as PlatformSetter['OS'];
  };

  beforeEach(() => {
    (ToastAndroid.show as jest.Mock).mockClear();
    (Alert.alert as jest.Mock).mockClear();
    setPlatform('ios');
  });

  test('Android displays toast', ({ given, when, then }: StepDefinitions) => {
    let message = '';

    given(/^the platform is "(android|ios)"$/, (platform: PlatformSetter['OS']) => {
      setPlatform(platform);
    });

    when(/^showErrorToast is called with "(.+)"$/, (text: string) => {
      message = text;
      showErrorToast(text);
    });

    then('ToastAndroid.show is called with the message and short duration', () => {
      expect(ToastAndroid.show).toHaveBeenCalledWith(message, ToastAndroid.SHORT);
    });

    then('Alert.alert is not called', () => {
      expect(Alert.alert).not.toHaveBeenCalled();
    });
  });

  test('iOS displays alert', ({ given, when, then }: StepDefinitions) => {
    let message = '';

    given(/^the platform is "(android|ios)"$/, (platform: PlatformSetter['OS']) => {
      setPlatform(platform);
    });

    when(/^showErrorToast is called with "(.+)"$/, (text: string) => {
      message = text;
      showErrorToast(text);
    });

    then('Alert.alert is called with the message', () => {
      expect(Alert.alert).toHaveBeenCalledWith('', message);
    });

    then('ToastAndroid.show is not called', () => {
      expect(ToastAndroid.show).not.toHaveBeenCalled();
    });
  });
};
