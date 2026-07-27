import { spawn } from 'node:child_process';

/**
 * Runs `next build` with NODE_ENV forced to production.
 *
 * ─── WHY THIS EXISTS ────────────────────────────────────────────────────────
 * The repo's root `.env` carried `NODE_ENV=development`, and anything that
 * exports that file into the shell (`set -a; . ./.env`, a CI step that sources
 * it, a direnv setup) leaks it into the build.
 *
 * Next warns about it, mildly:
 *
 *   ⚠ You are using a non-standard "NODE_ENV" value in your environment.
 *
 * What actually happens is far worse than a warning suggests. The build
 * compiles React's DEVELOPMENT runtime into a production bundle, the two
 * runtimes disagree about where React's internals live, and prerendering dies
 * with
 *
 *   TypeError: Cannot read properties of null (reading 'useContext')
 *
 * raised from inside Next's own layout router. It names a different page on
 * different runs, every affected page renders perfectly in `next dev`, and the
 * stack points only at minified Next internals - so it reads as a bug in
 * whichever component happened to be named, which is nowhere near the truth.
 *
 * `NODE_ENV` is not configuration for this project to set. Next assigns it per
 * command: development for `next dev`, production for `next build`. Forcing it
 * here means the build cannot be poisoned by an inherited value.
 */

if (process.env.NODE_ENV && process.env.NODE_ENV !== 'production') {
  console.warn(
    `build: ignoring inherited NODE_ENV="${process.env.NODE_ENV}"; a production build requires production.`,
  );
}

const child = spawn('next', ['build', ...process.argv.slice(2)], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, NODE_ENV: 'production' },
});

child.on('exit', (code) => process.exit(code ?? 1));
