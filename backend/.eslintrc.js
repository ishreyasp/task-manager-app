// ESLint configuration file that defines linting rules
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: 'module'
    },
    extends: [
      'eslint:recommended',
      'plugin:@typescript-eslint/recommended'
    ],
    env: {
      node: true,
      es6: true
    },
    // Custom rule configurations
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }]
    }
};