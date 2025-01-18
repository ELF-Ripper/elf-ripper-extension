module.exports = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: "tsconfig.json",
      },
    ],
    "^.+\\.js$": "babel-jest",
  },
  testMatch: [
    "<rootDir>/test/suites/**/*.test.(ts|tsx|js|jsx)",
    "<rootDir>/test/suites/**/*.spec.(ts|tsx|js|jsx)",
  ],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "identity-obj-proxy",
  },
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/out/"],
  verbose: true,
};
