/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: __dirname,
  testMatch: [
    '<rootDir>/tests/**/*.test.ts?(x)',
    '<rootDir>/src/**/*.test.ts?(x)',
    '<rootDir>/tests/bdd/**/*.steps.ts'
  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^react-native$': '<rootDir>/tests/__mocks__/react-native.ts',
    '^react-native-portalize$': '<rootDir>/tests/__mocks__/react-native-portalize.ts',
    '^jest-cucumber$': '<rootDir>/tests/__mocks__/jest-cucumber.ts',
    '^react-test-renderer$': '<rootDir>/tests/mocks/react-test-renderer.ts',
    '^glob$': require.resolve('glob')
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  modulePathIgnorePatterns: [
    '<rootDir>[/\\\\]ChatGPT[/\\\\]',
    '<rootDir>[/\\\\]vendor[/\\\\]'
  ],
  watchPathIgnorePatterns: [
    '<rootDir>[/\\\\]ChatGPT[/\\\\]',
    '<rootDir>[/\\\\]vendor[/\\\\]'
  ]
};
