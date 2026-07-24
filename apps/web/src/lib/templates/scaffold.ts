import type { ZipEntry } from '@/lib/zip';
import { TEMPLATE_DATA_SOURCES, TEMPLATE_SOURCES } from '@/data/templates/generated/template-sources';
import { getTemplate } from '@/data/templates';
import type { TemplateDownloadId, TemplateEntry } from '@/data/templates/types';

/**
 * Templates - build the file list for one download.
 *
 * The template's own source is authored, not assembled: `TEMPLATE_SOURCES`
 * holds the real files (generated from disk), and this module wraps them in
 * whatever a given target needs to run - a Next.js app, a Vite app, or nothing
 * at all for the static build.
 *
 * The React sources import through the repo's `@/` alias. A download has no
 * such alias, so those imports are rewritten to the flat layout the zip ships.
 */

const CONTENT_TYPES_NOTE = `/*
 * Types for this template's content module. Extracted from the ADYSRE
 * repository so the download stands alone.
 */
`;

/**
 * Runtime packages a template may import, with the version a download pins.
 *
 * Adding a library to a template means adding it here once; which templates get
 * it is worked out from their source, not declared twice.
 */
const KNOWN_DEPENDENCIES: Record<string, string> = {
  'framer-motion': '^12.0.0',
  'lucide-react': '^0.451.0',
  animejs: '^4.5.0',
};

/**
 * The third-party packages THIS template actually imports.
 *
 * Read from the template's own source rather than declared on the entry,
 * because a declared list is a second source of truth that silently rots: a
 * section starts importing something, nobody updates the manifest, and the
 * download fails at `npm install` for the one person who tried it. Scanning is
 * always right by construction.
 *
 * React itself is always present and is added by the target's package builder.
 */
function templateDependencies(slug: string): Record<string, string> {
  const files = TEMPLATE_SOURCES[slug] ?? {};
  const found = new Set<string>();

  for (const [path, source] of Object.entries(files)) {
    if (!path.endsWith('.tsx') && !path.endsWith('.ts')) continue;
    for (const match of source.matchAll(/(?:from|import)\s*['"]([^'".][^'"]*)['"]/g)) {
      const specifier = match[1];
      if (!specifier) continue;
      // `animejs/svg` and the like still resolve to the root package.
      const pkg = specifier.startsWith('@')
        ? specifier.split('/').slice(0, 2).join('/')
        : (specifier.split('/')[0] ?? '');
      if (KNOWN_DEPENDENCIES[pkg]) found.add(pkg);
    }
  }

  return Object.fromEntries(
    [...found].sort().map((pkg) => [pkg, KNOWN_DEPENDENCIES[pkg] as string]),
  );
}

/** Rewrite repo-internal aliases to the paths used inside the download. */
function rewriteImports(source: string, prefix: string): string {
  return source
    .replace(/from '@\/data\/templates\/types'/g, `from '${prefix}template-types'`)
    .replace(/from '@\/data\/templates\/[a-z0-9-]+-content'/g, `from '${prefix}content'`);
}

/** Files common to both React targets: sections, content, styles. */
function reactSources(slug: string, prefix: string): ZipEntry[] {
  const files = TEMPLATE_SOURCES[slug] ?? {};

  return Object.entries(files)
    .filter(([path]) => path.endsWith('.tsx') || path.endsWith('.css'))
    .filter(([path]) => !path.startsWith('static/'))
    .map(([path, content]) => ({
      path: `${prefix}${path}`,
      content: path.endsWith('.tsx') ? rewriteImports(content, './') : content,
    }));
}

const GITIGNORE = `node_modules
.next
dist
.DS_Store
`;

const TAILWIND_CONFIG = (content: string) => `/** @type {import('tailwindcss').Config} */
export default {
  content: [${content}],
  theme: { extend: {} },
  plugins: [],
};
`;

const POSTCSS_CONFIG = `export default {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};
`;

const TAILWIND_CSS = `@tailwind base;
@tailwind components;
@tailwind utilities;
`;

function readme(template: TemplateEntry, target: TemplateDownloadId, run: string): string {
  return `# ${template.name}

A single-page website template from ADYSRE, downloaded as the **${target}** build.

## Getting started

\`\`\`bash
${run}
\`\`\`

## What's inside

Every section lives in its own file, and all copy lives in \`content.ts\` - edit
that one file to make the template yours. Colours are CSS custom properties in
\`${template.entry.stylesheet}\`, scoped to \`[data-template='${template.entry.scope}']\`, so
re-branding is a handful of values rather than a search across the markup.

## Licence

Yours to use in personal and commercial projects.
`;
}

/** package.json for the Next.js target. */
const NEXT_PACKAGE = (name: string, deps: Record<string, string>) =>
  JSON.stringify(
    {
      name,
      private: true,
      version: '0.1.0',
      scripts: { dev: 'next dev', build: 'next build', start: 'next start' },
      dependencies: {
        next: '^15.0.0',
        react: '^19.0.0',
        'react-dom': '^19.0.0',
        ...deps,
      },
      devDependencies: {
        '@types/node': '^22.0.0',
        '@types/react': '^19.0.0',
        autoprefixer: '^10.4.0',
        postcss: '^8.4.0',
        tailwindcss: '^3.4.0',
        typescript: '^5.6.0',
      },
    },
    null,
    2,
  ) + '\n';

const VITE_PACKAGE = (name: string, deps: Record<string, string>) =>
  JSON.stringify(
    {
      name,
      private: true,
      version: '0.1.0',
      type: 'module',
      scripts: { dev: 'vite', build: 'tsc && vite build', preview: 'vite preview' },
      dependencies: {
        react: '^19.0.0',
        'react-dom': '^19.0.0',
        ...deps,
      },
      devDependencies: {
        '@types/react': '^19.0.0',
        '@types/react-dom': '^19.0.0',
        '@vitejs/plugin-react': '^4.3.0',
        autoprefixer: '^10.4.0',
        postcss: '^8.4.0',
        tailwindcss: '^3.4.0',
        typescript: '^5.6.0',
        vite: '^5.4.0',
      },
    },
    null,
    2,
  ) + '\n';

const TSCONFIG = (jsx: string, extra: Record<string, unknown> = {}) =>
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        lib: ['dom', 'dom.iterable', 'ES2022'],
        strict: true,
        esModuleInterop: true,
        module: 'ESNext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        skipLibCheck: true,
        noEmit: true,
        jsx,
        ...extra,
      },
      include: ['**/*.ts', '**/*.tsx'],
      exclude: ['node_modules'],
    },
    null,
    2,
  ) + '\n';

/**
 * Build every file for one template download.
 *
 * Pure - the caller zips and saves - so the file list can be asserted in a test
 * without touching the DOM.
 */
export function buildTemplateDownload(slug: string, target: TemplateDownloadId): ZipEntry[] {
  const template = getTemplate(slug);
  if (!template) throw new Error(`Unknown template: ${slug}`);

  const files = TEMPLATE_SOURCES[template.slug] ?? {};
  const name = `${template.slug}-${target}`;

  /** The content module and its types, flattened beside the sections. */
  const withContent = (prefix: string): ZipEntry[] => {
    const typesSource = TEMPLATE_DATA_SOURCES['types.ts'] ?? '';
    const contentSource = TEMPLATE_DATA_SOURCES[`${template.slug}-content.ts`] ?? '';

    return [
      { path: `${prefix}template-types.ts`, content: CONTENT_TYPES_NOTE + typesSource },
      { path: `${prefix}content.ts`, content: rewriteImports(contentSource, './') },
    ];
  };

  if (target === 'nextjs') {
    const prefix = 'components/';
    return [
      { path: 'package.json', content: NEXT_PACKAGE(name, templateDependencies(template.slug)) },
      { path: 'next.config.mjs', content: 'export default {};\n' },
      { path: 'tsconfig.json', content: TSCONFIG('preserve', { plugins: [{ name: 'next' }], incremental: true }) },
      { path: 'tailwind.config.mjs', content: TAILWIND_CONFIG("'./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'") },
      { path: 'postcss.config.mjs', content: POSTCSS_CONFIG },
      { path: 'app/globals.css', content: TAILWIND_CSS },
      {
        path: 'app/layout.tsx',
        content: `import './globals.css';
import type { ReactNode } from 'react';

export const metadata = {
  title: '${template.name}',
  description: ${JSON.stringify(template.content.hero.subtitle)},
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
`,
      },
      {
        path: 'app/page.tsx',
        content: `import { ${template.entry.symbol} } from '../components/${template.entry.file}';

export default function Page() {
  return <${template.entry.symbol} />;
}
`,
      },
      ...reactSources(template.slug, prefix),
      ...withContent(prefix),
      { path: '.gitignore', content: GITIGNORE },
      { path: 'README.md', content: readme(template, target, 'npm install\nnpm run dev') },
    ];
  }

  if (target === 'react') {
    const prefix = 'src/components/';
    return [
      { path: 'package.json', content: VITE_PACKAGE(name, templateDependencies(template.slug)) },
      { path: 'tsconfig.json', content: TSCONFIG('react-jsx') },
      { path: 'tailwind.config.mjs', content: TAILWIND_CONFIG("'./index.html', './src/**/*.{ts,tsx}'") },
      { path: 'postcss.config.mjs', content: POSTCSS_CONFIG },
      {
        path: 'vite.config.ts',
        content: `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({ plugins: [react()] });
`,
      },
      {
        path: 'index.html',
        content: `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${template.name}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`,
      },
      { path: 'src/index.css', content: TAILWIND_CSS },
      {
        path: 'src/main.tsx',
        content: `import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ${template.entry.symbol} } from './components/${template.entry.file}';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <${template.entry.symbol} />
  </StrictMode>,
);
`,
      },
      ...reactSources(template.slug, prefix),
      ...withContent(prefix),
      { path: '.gitignore', content: GITIGNORE },
      { path: 'README.md', content: readme(template, target, 'npm install\nnpm run dev') },
    ];
  }

  /*
   * Static builds. Both share the files directly under `static/` (the token
   * stylesheet and the behaviour script), then take their own
   * markup: `tailwind/` is utility-class HTML against the Play CDN, `plain/` is
   * semantic HTML with a stylesheet and no toolchain at all.
   */
  const variant = target === 'tailwind' ? 'tailwind' : 'plain';

  const staticFiles = Object.entries(files)
    .filter(([path]) => path.startsWith('static/'))
    .filter(([path]) => {
      const rest = path.slice('static/'.length);
      // Shared files sit directly in static/; anything nested belongs to one variant.
      return !rest.includes('/') || rest.startsWith(`${variant}/`);
    })
    .map(([path, content]) => ({
      path: path.slice('static/'.length).replace(`${variant}/`, ''),
      content,
    }));

  return [
    ...staticFiles,
    {
      path: 'README.md',
      content: readme(
        template,
        target,
        'open index.html   # no build step - it is plain HTML, CSS and JS',
      ),
    },
  ];
}

export type { ZipEntry };
