module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  reporters: [
    "default",
    "jest-html-reporter",
    "unmock-jest/reporter",
    "./json-stringify-reporter",
  ],
};
