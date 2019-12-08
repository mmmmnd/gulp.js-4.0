module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true,
    "jquery": true
  },
  "extends": "eslint:recommended",
  "globals": {
    "Atomics": "readonly",
    "SharedArrayBuffer": "readonly"
  },
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "rules": {
    "no-console": 0,
    "no-cond-assign": 0,
    "no-empty": 0,
    "no-prototype-builtins": 0,
    "no-useless-escape": 0,
    "no-inner-declarations": 0,
    "no-undef": 0,
    "no-unused-vars": 0
  }
};