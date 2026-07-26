import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

/**
 * Rewrite `./x.ts` to `./x.js` in emitted declaration files.
 *
 * `rewriteRelativeImportExtensions` fixes the JavaScript and leaves the `.d.ts`
 * alone. So a package builds cleanly, its runtime imports resolve, and a
 * TypeScript consumer gets `Cannot find module './labels.ts'` on the first
 * import - a failure that appears only after install, only for consumers, and
 * never in the workspace that produced it.
 *
 * `adysre` hit this and solved it inside its own build script. This is the same
 * fix, somewhere eleven more packages can share rather than each rediscovering
 * it the hard way.
 *
 * @example node ../config/scripts/fix-declarations.mjs
 */

const dist = join(resolve(process.argv[2] ?? process.cwd()), 'dist');

/*
 * A missing `dist` means the compile emitted nothing, and the useful answer is
 * to say so. Left to crash, it reports an ENOENT stack from inside a helper
 * script - which reads as "the tooling is broken" rather than "your build
 * produced no output", and sends the reader to the wrong file.
 */
if (!existsSync(dist)) {
  console.error(
    `\n  ✗ fix-declarations: ${dist} does not exist.\n` +
      '    The compile emitted nothing. A stale incremental cache is the usual\n' +
      '    cause: tsc reports success and skips emitting when its buildinfo says\n' +
      '    the output is current, even after the output was deleted.\n',
  );
  process.exit(1);
}

/** `from './x.ts'`, `from "../y.tsx"`, and the `import(...)` form. */
const SPECIFIER = /((?:from\s*|import\(\s*)['"])(\.\.?\/[^'"]*?)\.tsx?(['"])/g;

let touched = 0;

const walk = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const full = join(directory, entry.name);

    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.name.endsWith('.d.ts')) continue;

    const source = readFileSync(full, 'utf8');
    const fixed = source.replace(SPECIFIER, '$1$2.js$3');
    if (fixed !== source) {
      writeFileSync(full, fixed);
      touched += 1;
    }
  }
};

walk(dist);

if (touched > 0) console.log(`fix-declarations: rewrote ${String(touched)} declaration file(s)`);
