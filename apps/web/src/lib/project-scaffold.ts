/**
 * Turn an assembled playground page into a complete, runnable project the user
 * can unzip and `npm install` - either a Next.js (App Router) app or a React +
 * Vite app. Each chosen section becomes its own component file; a page/App
 * imports and renders them in order. Both targets ship Tailwind pre-wired.
 */

import type { PlaygroundSection } from '@/data/playground';
import { applyContentOverrides } from '@/lib/playground/content';
import type { ZipEntry } from './zip';

export type ScaffoldTarget = 'nextjs' | 'react';

interface SectionModule {
  slug: string;
  name: string;
  isDefault: boolean;
  code: string;
}

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
): { modules: SectionModule[]; skipped: string[] } {
  const modules: SectionModule[] = [];
  const skipped: string[] = [];
  const seen = new Set<string>();

  for (const { component } of sections) {
    if (seen.has(component.slug)) continue;
    seen.add(component.slug);

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
    modules.push({ slug: component.slug, name: info.name, isDefault: info.isDefault, code });
  }

  return { modules, skipped };
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

/** Build the full file list for the chosen target. */
export function buildProjectScaffold(
  target: ScaffoldTarget,
  sections: PlaygroundSection[],
  projectName = 'adysre-page',
  overridesBySlug: Record<string, Record<string, string>> = {},
): ZipEntry[] {
  const { modules, skipped } = resolveModules(target, sections, overridesBySlug);
  const files: ZipEntry[] = [];

  const skippedNote = skipped.length
    ? `\n> Note: these sections had no ${target} source and were left out: ${skipped.join(', ')}.\n`
    : '';

  if (target === 'nextjs') {
    const importBase = '../components';
    const imports = modules.map((m) => importLine(m, importBase)).join('\n');
    const renders = modules.map((m) => `      <${m.name} />`).join('\n');

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
        content: `import type { Metadata } from 'next';\nimport './globals.css';\n\nexport const metadata: Metadata = {\n  title: '${projectName}',\n  description: 'Built with ADYSRE',\n};\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang=\"en\">\n      <body className=\"bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100\">{children}</body>\n    </html>\n  );\n}\n`,
      },
      {
        path: 'app/page.tsx',
        content: `${imports}\n\nexport default function Home() {\n  return (\n    <main>\n${renders}\n    </main>\n  );\n}\n`,
      },
    );
  } else {
    const importBase = './components';
    const imports = modules.map((m) => importLine(m, importBase)).join('\n');
    const renders = modules.map((m) => `      <${m.name} />`).join('\n');

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
      { path: 'index.html', content: `<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"UTF-8\" />\n    <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\" />\n    <title>${projectName}</title>\n  </head>\n  <body>\n    <div id=\"root\"></div>\n    <script type=\"module\" src=\"/src/main.tsx\"></script>\n  </body>\n</html>\n` },
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
        content: `import { StrictMode } from 'react';\nimport { createRoot } from 'react-dom/client';\nimport App from './App';\nimport './index.css';\n\ncreateRoot(document.getElementById('root')!).render(\n  <StrictMode>\n    <App />\n  </StrictMode>,\n);\n`,
      },
      {
        path: 'src/App.tsx',
        content: `${imports}\n\nexport default function App() {\n  return (\n    <main className=\"bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100\">\n${renders}\n    </main>\n  );\n}\n`,
      },
    );
  }

  // One component file per section.
  const componentDir = target === 'nextjs' ? 'components' : 'src/components';
  for (const m of modules) {
    files.push({ path: `${componentDir}/${m.slug}.tsx`, content: `${m.code}\n` });
  }

  files.push(
    { path: '.gitignore', content: `node_modules\n${target === 'nextjs' ? '.next' : 'dist'}\n*.log\n.DS_Store\n` },
    {
      path: 'README.md',
      content: `# ${projectName}\n\nA ${target === 'nextjs' ? 'Next.js (App Router)' : 'React + Vite'} project generated by ADYSRE, with Tailwind CSS pre-wired.\n\n## Getting started\n\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\`\n\nEach section lives in \`${componentDir}/\` and is composed in ${target === 'nextjs' ? '`app/page.tsx`' : '`src/App.tsx`'}. Some components take props (title, items, image sources) - open a component file to pass your own content.\n${skippedNote}`,
    },
  );

  return files;
}
