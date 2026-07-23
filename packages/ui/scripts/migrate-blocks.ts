/**
 * Promote the site's component previews into publishable blocks.
 *
 * ─── What this does ─────────────────────────────────────────────────────────
 * `apps/web/.../previews/<slug>-preview.tsx` defines the real component as a
 * *private* inner function and default-exports a zero-prop demo of it. That is
 * fine for a preview stage and useless as a library: nothing is importable.
 *
 * This codemod moves each file to `packages/ui/src/blocks/<slug>.tsx` and adds
 * the missing `export` to the primary component, so the same file now serves
 * both audiences - the named export is the library API, the default export stays
 * the demo the site renders. One file, one implementation, no drift.
 *
 * ─── Why the TypeScript AST and not a regex ─────────────────────────────────
 * "Which function is the component" is a real question: files carry helpers
 * (`buildWeeks`, `coarse`), some define several components, and 46 have no inner
 * function at all because the default export *is* the component. Resolving that
 * means asking which capitalised JSX tags the default export actually renders,
 * which is an AST question. A regex gets ~68% of them and silently mangles the
 * rest.
 *
 * ─── Safety ────────────────────────────────────────────────────────────────
 * Idempotent, and refuses to overwrite an existing block. Anything it cannot
 * resolve confidently is SKIPPED and listed at the end rather than guessed at -
 * a wrong `export` is worse than a missing one. Run with `--dry` first.
 *
 *   pnpm --filter adysre migrate:blocks -- --dry
 *   pnpm --filter adysre migrate:blocks
 */

import { existsSync, readFileSync, readdirSync, writeFileSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import ts from 'typescript';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = join(HERE, '..', '..', '..');
const PREVIEWS = join(REPO, 'apps', 'web', 'src', 'components', 'components', 'previews');
const CATALOGUE = join(REPO, 'apps', 'web', 'src', 'data', 'components');
const BLOCKS = join(HERE, '..', 'src', 'blocks');
const REGISTRY = join(PREVIEWS, 'registry.ts');

const DRY = process.argv.includes('--dry');

/** Files in `previews/` that are infrastructure, not a component preview. */
const NOT_A_PREVIEW = new Set(['registry.ts', 'preview-stage.tsx']);

function pascalCase(name: string): string {
  return name
    .split(/[^a-z0-9]+/i)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
}

/**
 * Slugs the catalogue marks `premium: true`.
 *
 * These stay out of the published package: the site sells them. Today the set is
 * empty, and that is the point - flag an entry in the catalogue and the next
 * migration run drops it from the library with no other edit.
 */
function premiumSlugs(): Set<string> {
  const out = new Set<string>();
  for (const file of readdirSync(CATALOGUE).filter((f) => f.endsWith('.ts'))) {
    const src = readFileSync(join(CATALOGUE, file), 'utf8');
    // Entries are object literals opening with `slug:`; scan each entry's text
    // for the flag rather than the file's, so one premium entry does not taint
    // its neighbours.
    for (const entry of src.split(/\n    slug: '/).slice(1)) {
      const slug = entry.slice(0, entry.indexOf("'"));
      const body = entry.slice(0, entry.indexOf('\n  },'));
      if (/premium:\s*true/.test(body)) out.add(slug);
    }
  }
  return out;
}

interface Resolution {
  /** Statement text to write out. */
  source: string;
  /** The name the block is exported under. */
  exportName: string;
  /** True when the default export had to be converted into the named one. */
  converted: boolean;
}

/** Every capitalised JSX tag rendered anywhere inside `node`. */
function jsxTagsIn(node: ts.Node): Set<string> {
  const tags = new Set<string>();
  const visit = (n: ts.Node): void => {
    if (ts.isJsxOpeningElement(n) || ts.isJsxSelfClosingElement(n)) {
      const name = n.tagName.getText();
      if (/^[A-Z]/.test(name)) tags.add(name);
    }
    ts.forEachChild(n, visit);
  };
  visit(node);
  return tags;
}

/**
 * Work out which declaration is the component and return the rewritten source.
 *
 * Two shapes, both common:
 *  - an inner `function X()` rendered by the default export -> add `export` to it;
 *  - no inner function, the default export *is* the component -> convert it to a
 *    named export and re-add the default so the site's registry still works.
 */
function resolve(slug: string, source: string): Resolution | { skip: string } {
  const sf = ts.createSourceFile(`${slug}.tsx`, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  const topLevelFns = new Map<string, ts.FunctionDeclaration>();
  const topLevelConsts = new Set<string>();
  let defaultExport: ts.FunctionDeclaration | undefined;

  for (const stmt of sf.statements) {
    if (ts.isVariableStatement(stmt)) {
      for (const d of stmt.declarationList.declarations) {
        if (ts.isIdentifier(d.name)) topLevelConsts.add(d.name.text);
      }
      continue;
    }
    if (!ts.isFunctionDeclaration(stmt) || !stmt.name) continue;
    const isDefault = stmt.modifiers?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
    if (isDefault) defaultExport = stmt;
    else topLevelFns.set(stmt.name.text, stmt);
  }

  if (!defaultExport) return { skip: 'no default export' };

  // Already migrated (a named export exists alongside the default)?
  const alreadyExported = [...topLevelFns.values()].find((fn) =>
    fn.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword),
  );
  if (alreadyExported?.name) {
    return { source, exportName: alreadyExported.name.text, converted: false };
  }

  const rendered = jsxTagsIn(defaultExport);
  const candidates = [...topLevelFns.keys()].filter((n) => rendered.has(n));

  if (candidates.length === 0) {
    // A component declared as `const X = () => …` is out of scope: adding
    // `export` to an arrow const is a different edit and rare enough to do by
    // hand. Bail rather than mistake the demo for the component.
    const constComponent = [...topLevelConsts].find((n) => rendered.has(n));
    if (constComponent) {
      return { skip: `component is a const arrow function (${constComponent}) — migrate by hand` };
    }
    // Otherwise the default export *is* the component and any remaining
    // top-level functions are private helpers (`pageRange`, a custom hook).
    // Rename it and re-add the default so the site's registry still works.
    const oldName = defaultExport.name!.text;
    const newName = oldName.replace(/Preview$/, '') || pascalCase(slug);
    const start = defaultExport.getStart(sf);
    const decl = source.slice(start);
    const renamed = decl.replace(/^export default function \w+/, `export function ${newName}`);
    return {
      source: `${source.slice(0, start)}${renamed}\n\nexport default ${newName};\n`,
      exportName: newName,
      converted: true,
    };
  }

  // Several components in one file. Prefer the one named after the slug;
  // failing that, the root of the local render tree — a component that another
  // candidate renders is a part, not the block (a `Tooltip` inside a
  // `TooltipGroup`). Anything still ambiguous is a skip.
  let primary = candidates[0]!;
  if (candidates.length > 1) {
    const bySlug = candidates.find((c) => c === pascalCase(slug));
    if (bySlug) {
      primary = bySlug;
    } else {
      const roots = candidates.filter((c) =>
        !candidates.some((other) => other !== c && jsxTagsIn(topLevelFns.get(other)!).has(c)),
      );
      if (roots.length !== 1) return { skip: `ambiguous primary component: ${candidates.join(', ')}` };
      primary = roots[0]!;
    }
  }

  const fn = topLevelFns.get(primary)!;
  const start = fn.getStart(sf);
  return {
    source: `${source.slice(0, start)}export ${source.slice(start)}`,
    exportName: primary,
    converted: false,
  };
}

async function main(): Promise<void> {
  const premium = premiumSlugs();
  const files = readdirSync(PREVIEWS)
    .filter((f) => f.endsWith('-preview.tsx') && !NOT_A_PREVIEW.has(f))
    .sort();

  const migrated: { slug: string; exportName: string }[] = [];
  const skipped: { slug: string; why: string }[] = [];
  const taken = new Map<string, string>();

  for (const file of files) {
    const slug = file.replace(/-preview\.tsx$/, '');
    if (premium.has(slug)) {
      skipped.push({ slug, why: 'premium — stays on the site' });
      continue;
    }

    const target = join(BLOCKS, `${slug}.tsx`);
    if (existsSync(target)) {
      skipped.push({ slug, why: 'block already exists' });
      continue;
    }

    const result = resolve(slug, readFileSync(join(PREVIEWS, file), 'utf8'));
    if ('skip' in result) {
      skipped.push({ slug, why: result.skip });
      continue;
    }

    // Two files can name their component the same thing. The barrel aliases the
    // later one rather than shadowing it silently.
    let exportName = result.exportName;
    if (taken.has(exportName)) {
      exportName = pascalCase(slug);
      if (taken.has(exportName)) {
        skipped.push({ slug, why: `export name collision on ${result.exportName}` });
        continue;
      }
    }
    taken.set(exportName, slug);

    if (!DRY) {
      writeFileSync(target, result.source, 'utf8');
      rmSync(join(PREVIEWS, file));
    }
    migrated.push({ slug, exportName: result.exportName });
  }

  if (!DRY) {
    rewriteRegistry(new Set(migrated.map((m) => m.slug)));
    // The barrel is derived from what is on disk, not from what this run did,
    // so hand-migrated blocks are picked up too. Importing runs it.
    void taken;
    await import('./generate-blocks-barrel.ts');
  }

  console.log(`${DRY ? '[dry] ' : ''}migrate-blocks: ${migrated.length} migrated, ${skipped.length} skipped`);
  if (skipped.length) {
    console.log('\nSkipped (these stay site-only until handled by hand):');
    for (const s of skipped) console.log(`  ${s.slug.padEnd(42)} ${s.why}`);
  }
}

/**
 * Point the site's preview registry at the package.
 *
 * The registry is the only place that referenced the moved files, and every
 * entry has the same `import('./<slug>-preview')` shape, so this is a rewrite of
 * one specifier per migrated slug.
 */
function rewriteRegistry(migrated: Set<string>): void {
  let src = readFileSync(REGISTRY, 'utf8');
  for (const slug of migrated) {
    src = src.replaceAll(`import('./${slug}-preview')`, `import('adysre/blocks/${slug}')`);
  }
  writeFileSync(REGISTRY, src, 'utf8');
}

await main();
