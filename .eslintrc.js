const { resolve } = require('path')

module.exports = {
  root: true,

  parserOptions: {
    extraFileExtensions: ['.vue'],
    parser: '@typescript-eslint/parser',
    project: resolve(__dirname, './tsconfig.json'),
    tsconfigRootDir: __dirname,
    ecmaVersion: 2018,
    sourceType: 'module',
  },

  env: {
    browser: true,
  },

  extends: [
    'eslint:recommended',

    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    'plugin:vue/vue3-recommended',

    'prettier',
  ],

  plugins: [
    '@typescript-eslint',

    'vue',
  ],

  globals: {
    process: 'readonly',
  },

  rules: {
    quotes: ['warn', 'single', { avoidEscape: true }],
  },
}
