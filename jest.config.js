module.exports = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/setupTests.js"],
  moduleFileExtensions: ["js", "jsx"],
  testMatch: ["**/__tests__/**/*.js", "**/*.test.js", "**/*.test.jsx"],
  transform: {"^.+\\.(js|jsx)$": "babel-jest"},
  moduleNameMapper: {"\\.(css|less|scss)$": "<rootDir>/__mocks__/styleMock.js"},
  collectCoverageFrom: ["lms/static/js/**/*.{js,jsx}", "!**/node_modules/**"],
};
