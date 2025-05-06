const jestConfig = {
  verbose: true,
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '(\\.+/.+)\\.js$': '$1',
  },
  transform: {
    '^.+\\.(t|j)sx?$': '@swc/jest',
  },
  testMatch: ['**/*.spec.ts'],
  testPathIgnorePatterns: ['node_modules', 'dist'],
  collectCoverage: true,
  coverageReporters: ['html', 'text-summary', 'lcov'],
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['node_modules', 'test'],
  modulePathIgnorePatterns: ['dist'],
};

export default jestConfig;
