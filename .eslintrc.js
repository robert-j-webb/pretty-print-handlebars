'use strict';

module.exports = {
  root: true,
  extends: ['eslint:recommended', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module'
  },
  env: {
    node: true,
  },
  rules: {
    // Prettier
    'prettier/prettier': ['error', { singleQuote: true }]
  },
};
