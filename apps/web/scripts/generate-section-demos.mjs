/**
 * Generate `src/data/playground/section-demos.ts`.
 *
 * The playground's section components (`react`/`nextjs`/`typescript` variants)
 * are prop-driven and ship no sample content: rendering `<Hero />` with no props
 * crashes a downloaded project. Each section's live preview, however, is already
 * a self-contained, prop-free component carrying the real sample content - the
 * exact thing a runnable download needs. This script captures those preview
 * sources (for the categories the page builder can place) so the project
 * scaffold can emit working sections with default dummy content.
 *
 * Re-run after editing any block or adding a section:
 *   pnpm --filter @adysre/web gen:section-demos
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const webRoot = join(here, '..');
const dataDir = join(webRoot, 'src/data/components');
// The demo sources moved into the published package when the previews became
// blocks (documents/NPM_LIBRARY.md §2). A block is the same file: the named
// export is the library API, the default export is still the prop-free demo
// this scaffold needs.
const blocksDir = join(webRoot, '../../packages/ui/src/blocks');
const outFile = join(webRoot, 'src/data/playground/section-demos.ts');

/** Categories a playground page is assembled from (see data/playground/index.ts). */
const EXPORTABLE_CATEGORIES = new Set([
  'navbar',
  'hero',
  'services',
  'about',
  'galleries',
  'pricing',
  'comparisons',
  'faq',
  'marketing',
  'footer',
]);

/** slug -> category, read from the component data files (field order varies). */
function readSlugCategories() {
  const map = new Map();
  for (const file of readdirSync(dataDir)) {
    if (!file.endsWith('.ts')) continue;
    const text = readFileSync(join(dataDir, file), 'utf8');
    const patterns = [
      /slug:\s*'([^']+)'[\s\S]{0,400}?category:\s*'([^']+)'/g,
      /category:\s*'([^']+)'[\s\S]{0,400}?slug:\s*'([^']+)'/g,
    ];
    patterns.forEach((re, i) => {
      let m;
      while ((m = re.exec(text)) !== null) {
        const slug = i === 0 ? m[1] : m[2];
        const category = i === 0 ? m[2] : m[1];
        if (!map.has(slug)) map.set(slug, category);
      }
    });
  }
  return map;
}

/**
 * Strip lint pragmas that reference rules a bare scaffold does not define, so
 * `next build` never fails on an unknown-rule disable. Everything else is left
 * verbatim - a preview is already valid, self-contained TSX.
 */
function cleanSource(source) {
  return source
    // JSX block comments carrying an eslint pragma, possibly multi-line.
    .replace(/\{\/\*[\s\S]*?eslint-disable[\s\S]*?\*\/\}\n?/g, '')
    // Line comments carrying an eslint pragma.
    .replace(/^[ \t]*\/\/.*eslint-disable.*\r?\n/gm, '')
    .trimEnd();
}

/**
 * Preview-only chrome that must never reach a downloaded project: copy that
 * narrates the preview card ("Scroll this panel…"), and the fixed-height
 * scrollable stages some previews used to fake page scroll. A section is a page
 * section - it spans the page and scrolls with it.
 */
const CHROME_PATTERNS = [
  { name: 'instructional copy', re: />\s*(?:Scroll|Resize|Open the menu|Try)\b[^<]*(?:this panel|the stage|the preview|then try)[^<]*</i },
  { name: 'fixed-height scroll stage', re: /className="[^"]*\bh-\d+\b[^"]*\boverflow-y-auto\b[^"]*"/ },
];

/** Report previews still carrying preview-only chrome (never silently ship it). */
function chromeIssues(slug, source) {
  return CHROME_PATTERNS.filter((p) => p.re.test(source)).map((p) => `${slug}: ${p.name}`);
}

const slugCategory = readSlugCategories();
const demos = {};
const skipped = [];
const chrome = [];

for (const file of readdirSync(blocksDir)) {
  if (!file.endsWith('.tsx')) continue;
  const slug = file.replace(/\.tsx$/, '');
  const category = slugCategory.get(slug);
  if (!category || !EXPORTABLE_CATEGORIES.has(category)) continue;

  const source = cleanSource(readFileSync(join(blocksDir, file), 'utf8'));
  // The scaffold imports the demo as a default export; skip anything without
  // one. Two shapes are valid: a default-exported function, and (for blocks
  // whose component *is* the demo) a named function re-exported as the default.
  if (!/export\s+default\s+(function|\w+\s*;)/.test(source)) {
    skipped.push(`${slug} (no default export)`);
    continue;
  }
  chrome.push(...chromeIssues(slug, source));
  demos[slug] = source;
}

const entries = Object.keys(demos)
  .sort()
  .map((slug) => `  ${JSON.stringify(slug)}: ${JSON.stringify(demos[slug])},`)
  .join('\n');

const banner = `/**
 * GENERATED - do not edit by hand.
 * Run \`pnpm --filter @adysre/web gen:section-demos\` to regenerate.
 *
 * Maps a section slug to a self-contained, prop-free demo component (its live
 * preview source) so a downloaded project renders real sample content instead
 * of crashing on missing props. The default export of each entry is the section.
 */

/** slug -> demo component source (a default-exported, prop-free React component). */
export const SECTION_DEMOS: Record<string, string> = {
${entries}
};
`;

writeFileSync(outFile, banner, 'utf8');

console.log(`Wrote ${Object.keys(demos).length} section demos to ${outFile}`);
if (skipped.length) console.log(`Skipped: ${skipped.join(', ')}`);

// A download is a real project, so this is a build failure, not a warning.
if (chrome.length) {
  console.error(`\nPreview-only chrome would ship in a download:\n  ${chrome.join('\n  ')}`);
  process.exit(1);
}
