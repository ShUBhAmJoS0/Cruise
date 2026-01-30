export default {
  testEnvironment: "node",
  transform: {},
  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  testMatch: ["**/src/test/**/*.test.js"],
  setupFilesAfterEnv: ["<rootDir>/src/test/setup.js"],
  collectCoverageFrom: ["src/**/*.js", "!src/**/*.test.js", "!src/Database/**"],
  coverageDirectory: "coverage",
  verbose: true,
  testTimeout: 30000,
  forceExit: true,
  detectOpenHandles: false,
};
