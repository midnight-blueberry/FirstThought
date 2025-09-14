declare module 'jest-cucumber' {
  export function loadFeature(path: string): any;
  export function defineFeature(feature: any, cb: (test: any) => void): void;
}
