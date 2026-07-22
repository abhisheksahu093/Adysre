/**
 * Turn an assembled playground page into a complete, runnable project the user
 * can unzip and `npm install` - either a Next.js (App Router) app or a React +
 * Vite app. Each chosen section becomes its own component file; a page/App
 * imports and renders them in order. Both targets ship Tailwind pre-wired.
 */

import type { PlaygroundSection } from '@/data/playground';
import { applyContentOverrides } from '@/lib/playground/content';
import {
  SECTION_ATTR,
  hasSectionStyle,
  pageSectionStylesCss,
  type SectionStyle,
} from '@/lib/playground/section-style';
import type { ZipEntry } from './zip';

export type ScaffoldTarget = 'nextjs' | 'react';

interface SectionModule {
  slug: string;
  name: string;
  isDefault: boolean;
  code: string;
}

/** One line of the page: which module renders, and under which slot's styling. */
interface SectionRender {
  slotId: string;
  name: string;
}

/** The stylesheet shipped alongside the components when sections are styled. */
const SECTION_STYLES_FILE = 'section-styles.css';

/** The code variant to prefer per target, most-specific first. */
const VARIANT_ORDER: Record<ScaffoldTarget, ('nextjs' | 'typescript' | 'react')[]> = {
  nextjs: ['nextjs', 'typescript', 'react'],
  react: ['react', 'typescript', 'nextjs'],
};

function pascalCase(slug: string): string {
  return slug
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join('');
}

/** The bundled placeholder every local image path is pointed at. */
const PLACEHOLDER_ASSET = '/placeholder.svg';

/**
 * Point local image references at the bundled placeholder so a fresh download
 * never 404s. Sections quote demo asset paths (`/promo/all-access.svg`,
 * `/images/photo-1.jpg`, `/your-image.jpg`) that only exist in the ADYSRE app;
 * a real download ships just `public/placeholder.svg` for the user to swap.
 * Only quoted, root-relative image paths are touched - remote URLs, video
 * sources and non-asset strings are left alone.
 */
function rewriteAssetPaths(code: string): string {
  return code.replace(
    /(["'`])(\/[^"'`\s?#]*\.(?:png|jpe?g|gif|webp|svg|avif))\1/gi,
    (_match, quote: string) => `${quote}${PLACEHOLDER_ASSET}${quote}`,
  );
}

/** Find the component's exported name so the page can import it. */
function exportInfo(code: string, slug: string): { name: string; isDefault: boolean } {
  const named = code.match(/export\s+function\s+([A-Za-z0-9_]+)/);
  if (named?.[1]) return { name: named[1], isDefault: false };
  const def = code.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)/);
  if (def?.[1]) return { name: def[1], isDefault: true };
  // Anonymous default: rename it so it can be imported by name.
  return { name: pascalCase(slug), isDefault: false };
}

/** Resolve each section to a component module for the target, in page order. */
function resolveModules(
  target: ScaffoldTarget,
  sections: PlaygroundSection[],
  overridesBySlug: Record<string, Record<string, string>>,
  demos: Record<string, string>,
): { modules: SectionModule[]; renders: SectionRender[]; skipped: string[] } {
  const modules: SectionModule[] = [];
  const renders: SectionRender[] = [];
  const skipped: string[] = [];
  const bySlug = new Map<string, SectionModule>();

  for (const { slot, component } of sections) {
    // A slug already resolved gets one module file but still renders in every
    // slot that chose it - each with its own styling.
    const done = bySlug.get(component.slug);
    if (done) {
      renders.push({ slotId: slot.id, name: done.name });
      continue;
    }

    const push = (module: SectionModule): void => {
      modules.push(module);
      bySlug.set(module.slug, module);
      renders.push({ slotId: slot.id, name: module.name });
    };

    // Prefer the section's self-contained demo (its live preview): a prop-free
    // component that already ships sample content, so the page renders instead
    // of crashing on missing props. Imported by its default export.
    const demo = demos[component.slug];
    if (demo !== undefined) {
      const code = rewriteAssetPaths(
        applyContentOverrides(demo, overridesBySlug[component.slug]).trim(),
      );
      push({
        slug: component.slug,
        name: pascalCase(component.slug),
        isDefault: true,
        code,
      });
      continue;
    }

    const variant = VARIANT_ORDER[target].find((v) => component.code[v] !== undefined);
    const raw = variant ? component.code[variant] : undefined;
    if (raw === undefined) {
      skipped.push(component.title);
      continue;
    }

    let code = applyContentOverrides(raw, overridesBySlug[component.slug]).trim();
    const info = exportInfo(code, component.slug);
    // Give an anonymous default export a stable name.
    if (info.isDefault === false && !/export\s+function/.test(code) && /export\s+default\s+function\s*\(/.test(code)) {
      code = code.replace(/export\s+default\s+function\s*\(/, `export function ${info.name}(`);
    }
    push({ slug: component.slug, name: info.name, isDefault: info.isDefault, code: rewriteAssetPaths(code) });
  }

  return { modules, renders, skipped };
}

/**
 * The page body: each section rendered in order, wrapped in a tagged `<div>`
 * when the user styled it. The wrapper carries no inline style - the rules live
 * in `section-styles.css`, matched on the same attribute the live preview uses,
 * so the download looks exactly like the canvas did.
 */
function renderLines(
  renders: SectionRender[],
  stylesBySlot: Record<string, SectionStyle | undefined>,
  indent: string,
): string {
  return renders
    .map(({ slotId, name }) =>
      hasSectionStyle(stylesBySlot[slotId])
        ? `${indent}<div ${SECTION_ATTR}="${slotId}">\n${indent}  <${name} />\n${indent}</div>`
        : `${indent}<${name} />`,
    )
    .join('\n');
}

function importLine(m: SectionModule, base: string): string {
  return m.isDefault
    ? `import ${m.name} from '${base}/${m.slug}';`
    : `import { ${m.name} } from '${base}/${m.slug}';`;
}

const TAILWIND_CONFIG = (content: string) => `/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media',
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

/** Neutral placeholder every section image points at until the user swaps it. */
const PLACEHOLDER_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600" role="img" aria-label="Placeholder image">
  <rect width="800" height="600" fill="#e5e7eb" />
  <g fill="none" stroke="#9ca3af" stroke-width="8" stroke-linecap="round" stroke-linejoin="round">
    <rect x="270" y="200" width="260" height="190" rx="16" />
    <circle cx="335" cy="265" r="24" />
    <path d="M285 372l82-74 66 56 58-48 74 66" />
  </g>
  <text x="400" y="452" font-family="system-ui, -apple-system, Segoe UI, sans-serif" font-size="26" fill="#6b7280" text-anchor="middle">Replace with your image</text>
</svg>
`;

const PUBLIC_README = `# public/

Static assets served from the site root (\`/\`).

Every section was scaffolded to point its images at \`/placeholder.svg\`. Drop your
own images into this folder and update the \`src\` in the matching section
component to use them.
`;

/** The public/ folder shipped with every download - kept mandatory by design. */
const PUBLIC_FILES: ZipEntry[] = [
  { path: 'public/placeholder.svg', content: PLACEHOLDER_SVG },
  { path: 'public/README.md', content: PUBLIC_README },
  // Keeps the folder present in git even before the user adds real assets.
  { path: 'public/.gitkeep', content: '' },
];

/** Build the full file list for the chosen target. */
export function buildProjectScaffold(
  target: ScaffoldTarget,
  sections: PlaygroundSection[],
  projectName = 'adysre-page',
  overridesBySlug: Record<string, Record<string, string>> = {},
  demos: Record<string, string> = {},
  /** Per-slot background / text / border styling, keyed by slot id. */
  stylesBySlot: Record<string, SectionStyle | undefined> = {},
): ZipEntry[] {
  const { modules, renders: sectionRenders, skipped } = resolveModules(
    target,
    sections,
    overridesBySlug,
    demos,
  );
  const files: ZipEntry[] = [];

  const sectionStylesCss = pageSectionStylesCss(
    sections.map(({ slot, component }) => ({
      slotId: slot.id,
      title: component.title,
      style: stylesBySlot[slot.id],
    })),
  );
  const styled = sectionStylesCss !== '';

  const skippedNote = skipped.length
    ? `\n> Note: these sections had no ${target} source and were left out: ${skipped.join(', ')}.\n`
    : '';

  if (target === 'nextjs') {
    const importBase = '../components';
    const imports = modules.map((m) => importLine(m, importBase)).join('\n');
    const renders = renderLines(sectionRenders, stylesBySlot, '      ');

    files.push(
      {
        path: 'package.json',
        content: `${JSON.stringify(
          {
            name: projectName,
            version: '0.1.0',
            private: true,
            scripts: { dev: 'next dev', build: 'next build', start: 'next start' },
            dependencies: { next: '^14.2.5', react: '^18.3.1', 'react-dom': '^18.3.1' },
            devDependencies: {
              '@types/node': '^20.14.10',
              '@types/react': '^18.3.3',
              '@types/react-dom': '^18.3.0',
              autoprefixer: '^10.4.19',
              postcss: '^8.4.39',
              tailwindcss: '^3.4.6',
              typescript: '^5.5.3',
            },
          },
          null,
          2,
        )}\n`,
      },
      { path: 'next.config.mjs', content: `/** @type {import('next').NextConfig} */\nconst nextConfig = {};\nexport default nextConfig;\n` },
      { path: 'postcss.config.mjs', content: POSTCSS_CONFIG },
      { path: 'tailwind.config.mjs', content: TAILWIND_CONFIG(`'./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'`) },
      {
        path: 'tsconfig.json',
        content: `${JSON.stringify(
          {
            compilerOptions: {
              target: 'ES2020',
              lib: ['dom', 'dom.iterable', 'esnext'],
              allowJs: true,
              skipLibCheck: true,
              strict: false,
              noEmit: true,
              esModuleInterop: true,
              module: 'esnext',
              moduleResolution: 'bundler',
              resolveJsonModule: true,
              isolatedModules: true,
              jsx: 'preserve',
              incremental: true,
              plugins: [{ name: 'next' }],
            },
            include: ['next-env.d.ts', '**/*.ts', '**/*.tsx'],
            exclude: ['node_modules'],
          },
          null,
          2,
        )}\n`,
      },
      { path: 'next-env.d.ts', content: `/// <reference types="next" />\n/// <reference types="next/image-types/global" />\n` },
      { path: 'app/globals.css', content: TAILWIND_CSS },
      {
        path: 'app/layout.tsx',
        content: `import type { Metadata } from 'next';\nimport './globals.css';\n${styled ? `import './${SECTION_STYLES_FILE}';\n` : ''}\nexport const metadata: Metadata = {\n  title: '${projectName}',\n  description: 'Built with ADYSRE',\n};\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">{children}</body>\n    </html>\n  );\n}\n`,
      },
      {
        path: 'app/page.tsx',
        content: `${imports}\n\nexport default function Home() {\n  return (\n    <main>\n${renders}\n    </main>\n  );\n}\n`,
      },
    );
  } else {
    const importBase = './components';
    const imports = modules.map((m) => importLine(m, importBase)).join('\n');
    const renders = renderLines(sectionRenders, stylesBySlot, '      ');

    files.push(
      {
        path: 'package.json',
        content: `${JSON.stringify(
          {
            name: projectName,
            version: '0.1.0',
            private: true,
            type: 'module',
            scripts: { dev: 'vite', build: 'tsc -b && vite build', preview: 'vite preview' },
            dependencies: { react: '^18.3.1', 'react-dom': '^18.3.1' },
            devDependencies: {
              '@types/react': '^18.3.3',
              '@types/react-dom': '^18.3.0',
              '@vitejs/plugin-react': '^4.3.1',
              autoprefixer: '^10.4.19',
              postcss: '^8.4.39',
              tailwindcss: '^3.4.6',
              typescript: '^5.5.3',
              vite: '^5.3.4',
            },
          },
          null,
          2,
        )}\n`,
      },
      { path: 'index.html', content: `<!doctype html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>${projectName}</title>\n  </head>\n  <body>\n    <div id="root"></div>\n    <script type="module" src="/src/main.tsx"></script>\n  </body>\n</html>\n` },
      { path: 'vite.config.ts', content: `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\n\nexport default defineConfig({ plugins: [react()] });\n` },
      { path: 'postcss.config.js', content: POSTCSS_CONFIG },
      { path: 'tailwind.config.js', content: TAILWIND_CONFIG(`'./index.html', './src/**/*.{ts,tsx}'`) },
      {
        path: 'tsconfig.json',
        content: `${JSON.stringify(
          {
            compilerOptions: {
              target: 'ES2020',
              useDefineForClassFields: true,
              lib: ['ES2020', 'DOM', 'DOM.Iterable'],
              module: 'ESNext',
              skipLibCheck: true,
              moduleResolution: 'bundler',
              resolveJsonModule: true,
              isolatedModules: true,
              noEmit: true,
              jsx: 'react-jsx',
              strict: false,
            },
            include: ['src'],
          },
          null,
          2,
        )}\n`,
      },
      { path: 'src/index.css', content: TAILWIND_CSS },
      {
        path: 'src/main.tsx',
        content: `import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n${styled ? `import './${SECTION_STYLES_FILE}';\n` : ''}\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n);\n`,
      },
      {
        path: 'src/App.tsx',
        content: `${imports}\n\nexport default function App() {\n  return (\n    <main className="bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">\n${renders}\n    </main>\n  );\n}\n`,
      },
    );
  }

  // One component file per section.
  const componentDir = target === 'nextjs' ? 'components' : 'src/components';
  for (const m of modules) {
    files.push({ path: `${componentDir}/${m.slug}.tsx`, content: `${m.code}\n` });
  }

  // The section styling the user set in the playground, as one plain stylesheet
  // the page imports - edit it to retune the look without touching a component.
  if (styled) {
    files.push({
      path: target === 'nextjs' ? `app/${SECTION_STYLES_FILE}` : `src/${SECTION_STYLES_FILE}`,
      content: sectionStylesCss,
    });
  }

  // Every project ships a public/ folder with a placeholder for section images.
  files.push(...PUBLIC_FILES);

  files.push(
    { path: '.gitignore', content: `node_modules\n${target === 'nextjs' ? '.next' : 'dist'}\n*.log\n.DS_Store\n` },
    {
      path: 'README.md',
      content: `# ${projectName}\n\nA ${target === 'nextjs' ? 'Next.js (App Router)' : 'React + Vite'} project generated by ADYSRE, with Tailwind CSS pre-wired.\n\n## Getting started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\nEach section lives in \`${componentDir}/\` and is composed in ${target === 'nextjs' ? '`app/page.tsx`' : '`src/App.tsx`'}. Every section ships with sample content, so the project runs as soon as you install it - edit a section file to make it your own.\n\nSection images point at \`public/placeholder.svg\`; drop your own images into \`public/\` and update the \`src\` in the matching section.\n${
        styled
          ? `\nThe background, text and border styling you set per section lives in \`${
              target === 'nextjs' ? 'app' : 'src'
            }/${SECTION_STYLES_FILE}\`, matched on each section's \`${SECTION_ATTR}\` wrapper. Edit that one file to retune the look.\n`
          : ''
      }${skippedNote}`,
    },
  );

  return files;
}
