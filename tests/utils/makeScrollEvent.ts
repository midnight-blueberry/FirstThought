import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

export function makeScrollEvent(y: number): NativeSyntheticEvent<NativeScrollEvent> {
  return { nativeEvent: { contentOffset: { y } } } as any;
}
