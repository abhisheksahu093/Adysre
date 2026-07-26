import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Refuse to ship a `dist` that cannot be imported.
 *
 * Three ways a build passes and the tarball is still broken, none of which
 * `tsc` reports:
 *
 * 1. `dist` is stale or absent, because the build was skipped. The tarball
 *    ships `files: ["dist"]` and contains nothing.
 * 2. A relative import still carries a TypeScript extension. Every `rules-*`
 *    package relies on `rewriteRelativeImportExtensions` to turn `./labels.ts`
 *    into `./labels.js` on emit; if that ever stops applying, the emitted
 *    JavaScript imports a file that is not in the tarball and every deep import
 *    fails at the consumer's bundler.
 * 3. The declarations are missing, so a TypeScript consumer gets `any` for the
 *    whole package and finds out at review rather than at install.
 *
 * Run from `prepublishOnly`, before the tarball is built, so a broken publish
 * is a loud local failure rather than a version number nobody can reuse.
 *
 * @example node ../config/scripts/verify-dist.mjs
 */

const root = resolve(process.argv[2] ?? process.cwd());
const dist = join(root, 'dist');
const name = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8')).name;

const problems = [];

if (!existsSync(dist)) {
  problems.push('there is no dist directory - run the build first');
} else {
  if (!existsSync(join(dist, 'index.js'))) problems.push('dist/index.js is missing');
  if (!existsSync(join(dist, 'index.d.ts'))) problems.push('dist/index.d.ts is missing');

  /*
   * Both ways an emitted relative import fails to resolve under Node's ESM
   * loader, which is the loader a consumer has.
   *
   * A `.ts` extension means the rewrite stopped applying. EXTENSIONLESS means
   * the source never had an extension to rewrite - and that is the one that
   * actually happened here: `export * from './builders'` emits verbatim, Node
   * refuses to guess, and every import of the package throws
   * ERR_MODULE_NOT_FOUND. It passed `tsc`, it passed every test in the
   * workspace (which resolves through a bundler), and it would have shipped.
   *
   * Checking only for the first is why an end-to-end install caught this
   * instead of the verifier that exists to catch it.
   */
  const relativeImport = /(?:from\s*|import\(\s*)['"](\.\.?\/[^'"]*)['"]/g;
  const offenders = [];

  const walk = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const full = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(full);
        continue;
      }
      if (!entry.name.endsWith('.js') && !entry.name.endsWith('.d.ts')) continue;

      const source = readFileSync(full, 'utf8');
      for (const [, specifier] of source.matchAll(relativeImport)) {
        if (/\.tsx?$/.test(specifier)) {
          offenders.push(`${full}: imports a TypeScript extension (${specifier})`);
        } else if (!/\.(js|mjs|cjs|json|css)$/.test(specifier)) {
          offenders.push(`${full}: imports ${specifier} with no extension`);
        }
      }
    }
  };

  walk(dist);

  if (offenders.length > 0) {
    problems.push(
      `${String(offenders.length)} emitted import(s) Node cannot resolve, e.g. ${offenders[0]}`,
    );
  }
}

if (problems.length > 0) {
  console.error(`\n  ✗ ${name} is not publishable:\n`);
  for (const problem of problems) console.error(`    - ${problem}`);
  console.error('');
  process.exit(1);
}
