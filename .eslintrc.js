module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ["google"],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2020,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks"],
  rules: {
    "react-hooks/exhaustive-deps": "warn",
    indent: ["error", 2, { SwitchCase: 1 }],
    "valid-jsdoc": 0,
    "require-jsdoc": 0,
    "no-unused-vars": 1,
    "new-cap": 0,
    "prefer-template": 2,
    semi: ["error", "never"],
    "react/jsx-uses-react": "error",
    "react/jsx-uses-vars": "error",
    "react/jsx-first-prop-new-line": "error",
    "react/jsx-max-props-per-line": ["error", { maximum: 1 }],
    "react-hooks/rules-of-hooks": "error",
    "object-curly-spacing": ["warn", "always"],
    "react/jsx-max-props-per-line": 0,
    quotes: 0,
  },
}
