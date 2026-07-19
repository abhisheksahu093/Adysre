import base from './base.js';

/** ESLint config for the NestJS api/worker apps. */
export default [
  ...base,
  {
    rules: {
      // Nest decorators legitimately rely on parameter injection.
      '@typescript-eslint/no-extraneous-class': 'off',
    },
  },
];
