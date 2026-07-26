import { defineConfig } from 'vitest/config';

/**
 * Why the two packages with components run vitest when the rest of `rules-*`
 * runs `tsx --test`.
 *
 * Their components use `adysre`'s primitives, which the workspace consumes as
 * TypeScript SOURCE, so running a test here means compiling another package's
 * JSX - and `tsx` applies its tsconfig only to files inside the package it was
 * started in. Everything outside falls back to esbuild's default, which is the
 * CLASSIC runtime, and an `adysre` component that imports no `React` then fails
 * with "React is not defined" the moment it renders.
 *
 * One `esbuild.jsx` setting for the whole run is what fixes that, and vitest is
 * the runner that exposes it. Nothing else about the tests changes.
 */
export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
  },
});
