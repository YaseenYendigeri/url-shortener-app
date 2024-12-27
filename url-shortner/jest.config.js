export default {
  transform: {
    "^.+\\.tsx?$": "babel-jest",
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!your-esm-dependency-to-transform)/",
  ],
  testTimeout: 10000000,
};
