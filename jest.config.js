module.exports = {
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.ts,tsx}"],
  coverageDirectory: "coverage",
  preset: "ts-jest/presets/default-esm",
  roots: ["<rootDir>"],
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
};
