import { defineConfig } from 'vitest/config';

/**
 * Why this package runs vitest when every other `rules-*` package runs
 * `tsx --test`.
 *
 * The builder is the only one of them with components, and its components use
 * `adysre`'s primitives, which the workspace consumes as TypeScript SOURCE. So
 * running a test here means compiling another package's JSX, and `tsx` applies
 * its tsconfig only to files inside the package it was started in: everything
 * outside falls back to esbuild's default, which is the CLASSIC runtime, and an
 * `adysre` component that imports no `React` then fails with "React is not
 * defined" the moment it renders.
 *
 * One `esbuild.jsx` setting for the whole run is what fixes that, and vitest is
 * the runner that exposes it. Nothing else about the tests changes: they are
 * still `node:test`-shaped assertions with no DOM.
 */
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
