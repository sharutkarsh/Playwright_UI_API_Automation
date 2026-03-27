'use strict';

module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  plugins: ['playwright'],
  overrides: [
    {
      files: ['tests/**/*.js'],
      extends: 'plugin:playwright/recommended',
      rules: {
        // Assertions live inside page object methods called from test.step() — ESLint can't trace them statically
        'playwright/expect-expect': 'off',
        // test.step titles are descriptive prose, not test titles — prefix rule doesn't apply
        'playwright/valid-title': 'off',
      },
    },
  ],
  rules: {
    'no-unused-vars': 'warn',
    'no-console': 'off',
    'eqeqeq': ['error', 'always'],
    'semi': ['error', 'always'],
    'quotes': ['error', 'single'],
  },
};
