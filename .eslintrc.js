module.exports = {

  "extends": "defaults",
  //"parser": "babel-eslint",

  "globals": {
    "Promise": true,
    "chai": true, // TODO remove after refactoring to modules
    "chaiAsPromised": true, // TODO remove after refactoring to modules
    "$": true // TODO remove after refactoring to modules
  },

  "env": {
    "browser": true,
    "node": true,
    "mocha": true
  },

  "rules": {
    "no-console": 0,
    "semi": 2,
    "no-debugger": 0,
    "no-unused-vars": 0
  }
};