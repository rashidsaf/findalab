module.exports = {
  "env": {
    "browser": true,
    "jquery": true
  },
  "extends": [
    "eslint:recommended"
  ],
  "rules": {
    "indent": ["error", 2],
    "linebreak-style": ["error", "unix"],
    "max-len": ["error", 120],
    "no-cond-assign": ["error", "always"],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "valid-jsdoc": ["error", {
      "requireReturn": false,
      "requireReturnDescription": false,
      "requireParamDescription": false,
    }],
  }
}
