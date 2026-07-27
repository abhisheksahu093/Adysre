import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Writes `docs/openapi.json` from the same builder the `/api/docs` route uses.
 *
 * Committing the generated file is the point: a spec that only exists at
 * runtime cannot be diffed, so nobody notices when a change alters the contract
 * until a client breaks. In review, a modified `openapi.json` in the diff is the
 * signal that a pull request changed the API.
 *
 * Run with `pnpm --filter @adysre/web gen:openapi`.
 */

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '../../..');
const outputPath = resolve(repoRoot, 'docs/openapi.json');

// tsx registers the TypeScript loader, so the shared builder is imported rather
// than duplicated here. One description of the API, not two.
const { buildOpenApiDocument } = await import(resolve(here, '../src/lib/openapi/document.ts'));

const document = buildOpenApiDocument();

mkdirSync(dirname(outputPath), { recursive: true });
// Trailing newline so the file is well-formed for git and diffs stay minimal.
writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');

const paths = Object.keys(document.paths ?? {}).length;
console.log(`Wrote ${outputPath} (${paths} paths)`);
