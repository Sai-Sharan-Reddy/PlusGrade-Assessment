// jest.config.cjs
module.exports = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  moduleFileExtensions: ["js", "jsx", "json"],
  transform: { "^.+\\.[jt]sx?$": "babel-jest" },
  moduleNameMapper: {
    "\\.(css|less|scss)$": "<rootDir>/test/mocks/styleMock.js",
    "\\.(jpg|jpeg|png|gif|svg)$": "<rootDir>/test/mocks/fileMock.js",
  },
};
