/**
 * Rebuild `src/blocks/index.ts` from whatever is on disk.
 *
 * Split out from `migrate-blocks.ts` because the barrel needs regenerating far
 * more often than blocks need migrating: add a block by hand, rename an export,
 * change a dependency, and this is the one command that puts the public surface
 * back in sync. It reads the blocks themselves rather than a manifest, so the
 * barrel cannot drift from the files it points at.
 *
 *   pnpm --filter adysre gen:blocks
 *
 * ─── Why some blocks are deliberately left out of the barrel ────────────────
 * A barrel is eagerly evaluated by anything that does not tree-shake — Node ESM,
 * Jest, a consumer's SSR entry. One block importing an OPTIONAL peer dependency
 * would therefore break `import { Button } from 'adysre/blocks'` for every
 * consumer who has not installed that peer, which is most of them. Those blocks
 * stay deep-import-only: you opt into the dependency by naming the file.
 */

import { readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const HERE = dirname(fileURLToPath(import.meta.url));
const BLOCKS = join(HERE, '..', 'src', 'blocks');

/** Bare imports every consumer already has. Anything else gates the barrel. */
const ALWAYS_AVAILABLE = new Set(['react', 'react-dom', 'react/jsx-runtime']);

function pascalCase(name: string): string {
  return name
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

interface Block {
  slug: string;
  /** Named exports, in source order. Excludes the default (a demo). */
  exports: string[];
  /** Bare specifiers beyond React — these keep a block out of the barrel. */
  externals: string[];
}

function readBlock(slug: string): Block {
  const source = readFileSync(join(BLOCKS, `${slug}.tsx`), 'utf8');
  const sf = ts.createSourceFile(`${slug}.tsx`, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const exports: string[] = [];
  const externals: string[] = [];

  for (const stmt of sf.statements) {
    if (ts.isImportDeclaration(stmt) && ts.isStringLiteral(stmt.moduleSpecifier)) {
      const spec = stmt.moduleSpecifier.text;
      // A type-only import vanishes at runtime, so it cannot break the barrel.
      const typeOnly = stmt.importClause?.isTypeOnly === true;
      if (!spec.startsWith('.') && !ALWAYS_AVAILABLE.has(spec) && !typeOnly) externals.push(spec);
      continue;
    }
    if (!ts.isFunctionDeclaration(stmt) || !stmt.name) continue;
    const mods = stmt.modifiers ?? [];
    const isExported = mods.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    const isDefault = mods.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
    if (isExported && !isDefault) exports.push(stmt.name.text);
  }

  return { slug, exports, externals: [...new Set(externals)] };
}

function main(): void {
  const slugs = readdirSync(BLOCKS)
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => f.replace(/\.tsx$/, ''))
    .sort();

  const blocks = slugs.map(readBlock);
  const barrelled = blocks.filter((b) => b.externals.length === 0 && b.exports.length > 0);
  const gated = blocks.filter((b) => b.externals.length > 0);
  const empty = blocks.filter((b) => b.externals.length === 0 && b.exports.length === 0);

  // Two blocks can name their component the same thing (`Tooltip` appears in
  // several). First one wins its name; the rest are aliased off their slug, so
  // nothing is silently shadowed.
  const taken = new Set<string>();
  const lines: string[] = [];

  for (const block of barrelled) {
    const clauses: string[] = [];
    for (const name of block.exports) {
      let alias = name;
      if (taken.has(alias)) {
        alias = pascalCase(block.slug);
        let n = 2;
        while (taken.has(alias)) alias = `${pascalCase(block.slug)}${n++}`;
      }
      taken.add(alias);
      clauses.push(alias === name ? name : `${name} as ${alias}`);
    }
    lines.push(`export { ${clauses.join(', ')} } from './${block.slug}.tsx';`);
  }

  const gatedDocs = gated.length
    ? [
        ' *',
        ' * ─── Deep-import only ──────────────────────────────────────────────────────',
        ' * These blocks need an optional peer dependency, so they are not re-exported',
        ' * here — a barrel is evaluated eagerly, and one missing peer would break every',
        ' * import from this module. Import them by path and install the peer:',
        ' *',
        ...gated.map(
          (b) =>
            ` *   import { ${b.exports[0] ?? 'default'} } from 'adysre/blocks/${b.slug}';   // needs ${b.externals.join(', ')}`,
        ),
      ]
    : [];

  const header = [
    '/**',
    ' * `adysre/blocks` — every section- and page-level ADYSRE component.',
    ' *',
    " *   import { AboutStats } from 'adysre/blocks';",
    ' *',
    ' * Prefer the deep import when you only need one, so your bundler and your dev',
    ' * server never have to walk the whole barrel:',
    ' *',
    " *   import { AboutStats } from 'adysre/blocks/about-stats';",
    ' *',
    ' * Each module also default-exports a zero-prop demo with realistic sample',
    ' * content — handy for a storybook page, and what the ADYSRE site itself renders.',
    ...gatedDocs,
    ' *',
    ' * AUTO-GENERATED by scripts/generate-blocks-barrel.ts. Do not edit by hand.',
    ' */',
    '',
    '',
  ].join('\n');

  writeFileSync(join(BLOCKS, 'index.ts'), header + lines.join('\n') + '\n', 'utf8');

  console.log(
    `generate-blocks: ${barrelled.length} in the barrel, ${gated.length} deep-import only, ${empty.length} with no named export`,
  );
  for (const b of gated) console.log(`  gated: ${b.slug.padEnd(38)} needs ${b.externals.join(', ')}`);
  for (const b of empty) console.log(`  no named export: ${b.slug}`);
}

main();
