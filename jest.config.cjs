/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: __dirname,
  testMatch: [
    '<rootDir>/tests/bdd/**/*.feature'
  ],
  setupFilesAfterEnv: ['<rootDir>/tests/setup/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@constants/(.*)$': '<rootDir>/src/constants/$1',
    '^@hooks/(.*)$': '<rootDir>/src/hooks/$1',
    '^@theme/(.*)$': '<rootDir>/src/theme/$1',
    '^@utils/(.*)$': '<rootDir>/src/utils/$1',
    '^@tests/(.*)$': '<rootDir>/tests/$1',
    '^react-native$': '<rootDir>/tests/__mocks__/react-native.ts',
    '^react-native-portalize$': '<rootDir>/tests/__mocks__/react-native-portalize.ts',
    '^react-test-renderer$': '<rootDir>/tests/mocks/react-test-renderer.ts',
    '^glob$': require.resolve('glob')
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
    '\\.(feature)$': '<rootDir>/tests/setup/jest.feature.transform.cjs'
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'feature'],
  modulePathIgnorePatterns: [
    '<rootDir>[/\\\\]ChatGPT[/\\\\]',
    '<rootDir>[/\\\\]vendor[/\\\\]'
  ],
  watchPathIgnorePatterns: [
    '<rootDir>[/\\\\]ChatGPT[/\\\\]',
    '<rootDir>[/\\\\]vendor[/\\\\]'
  ]
};
