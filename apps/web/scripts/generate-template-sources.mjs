#!/usr/bin/env node
/*
 * Templates - embed each template's authored source for download.
 *
 * The detail dialog zips a runnable project in the BROWSER, so it needs the
 * template's own source as strings. Rather than maintain a second copy by hand
 * (which would drift the moment a section is edited), this script reads the
 * real files under `src/components/templates/<slug>/` and writes them into a
 * generated module.
 *
 * Mirrors `generate-section-demos.mjs`: same contract, same "never edit the
 * output" rule. Run it after touching any template source:
 *
 *   pnpm --filter @adysre/web gen:template-sources
 */
import { readdirSync, readFileSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const TEMPLATES_DIR = resolve(here, '../src/components/templates');
const OUT_FILE = resolve(here, '../src/data/templates/generated/template-sources.ts');

/** Files worth shipping in a download. Anything else in the folder is ours. */
const INCLUDED = /\.(tsx|ts|css|html|js)$/;

/** Directory names that never belong in a template download. */
const SKIPPED_DIRS = new Set(['__tests__', 'node_modules']);

function walk(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (SKIPPED_DIRS.has(entry)) continue;
      found.push(...walk(full));
    } else if (INCLUDED.test(entry)) {
      found.push(full);
    }
  }
  return found;
}

const templateDirs = readdirSync(TEMPLATES_DIR).filter((entry) =>
  statSync(join(TEMPLATES_DIR, entry)).isDirectory(),
);

const sources = {};
let fileCount = 0;

for (const slugDir of templateDirs) {
  const root = join(TEMPLATES_DIR, slugDir);
  const files = {};

  for (const file of walk(root)) {
    // Keys are paths relative to the template folder, which is exactly the
    // layout the scaffold reproduces inside the zip.
    files[relative(root, file).split('\\').join('/')] = readFileSync(file, 'utf8');
    fileCount += 1;
  }

  if (Object.keys(files).length > 0) sources[slugDir] = files;
}

/*
 * The data modules a download also needs: the shared content types, and each
 * template's own content. They live under src/data/templates rather than beside
 * the sections, because the app imports them too.
 */
const DATA_DIR = resolve(here, '../src/data/templates');
const dataSources = {};

for (const entry of readdirSync(DATA_DIR)) {
  if (entry === 'types.ts' || entry.endsWith('-content.ts')) {
    dataSources[entry] = readFileSync(join(DATA_DIR, entry), 'utf8');
    fileCount += 1;
  }
}

const banner = `/*
 * GENERATED - do not edit by hand.
 *
 * Produced by scripts/generate-template-sources.mjs from the real template
 * sources under src/components/templates/. Re-run:
 *
 *   pnpm --filter @adysre/web gen:template-sources
 */

`;

const body = `export const TEMPLATE_SOURCES: Record<string, Record<string, string>> = ${JSON.stringify(
  sources,
  null,
  2,
)};

/** Shared data modules: \`types.ts\` and each \`<slug>-content.ts\`. */
export const TEMPLATE_DATA_SOURCES: Record<string, string> = ${JSON.stringify(
  dataSources,
  null,
  2,
)};\n`;

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(OUT_FILE, banner + body, 'utf8');

const dirNames = Object.keys(sources);
console.log(
  `Wrote ${relative(resolve(here, '..'), OUT_FILE)} - ${dirNames.length} template(s), ${fileCount} file(s).`,
);
for (const name of dirNames) {
  console.log(`  ${name}: ${Object.keys(sources[name]).length} file(s)`);
}
