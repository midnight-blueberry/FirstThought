import { Platform } from 'react-native';

const DEFAULT_HEADER_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
export const HEADER_HEIGHT = DEFAULT_HEADER_HEIGHT * 0.75;

