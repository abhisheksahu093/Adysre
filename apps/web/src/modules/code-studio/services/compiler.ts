import type { Project, ProjectFile } from '../types';
import { languageOf, normalizePath } from '../utils/files';

/**
 * The browser compiler.
 *
 * Turns a project into a single sandboxed-iframe document (`srcdoc`). Nothing is
 * compiled on a server: TypeScript and JSX/TSX go through Babel Standalone and
 * Vue SFCs through @vue/compiler-sfc, both loaded from a public CDN on first
 * use. Cross-file imports resolve to Blob URLs inside the iframe, and bare
 * imports (`react`, `vue`) resolve to esm.sh, so `import React from 'react'`
 * just works with no install step.
 */

// esm.sh version pins so React/ReactDOM/Vue resolve to a single shared copy.
const PINS: Record<string, string> = {
  react: 'https://esm.sh/react@19',
  'react-dom': 'https://esm.sh/react-dom@19',
  'react/jsx-runtime': 'https://esm.sh/react@19/jsx-runtime',
  vue: 'https://esm.sh/vue@3.5',
};

const CDN = 'https://esm.sh/';

interface BabelStandalone {
  transform: (code: string, options: Record<string, unknown>) => { code: string | null };
}

interface VueCompiler {
  parse: (source: string, options: { filename: string }) => { descriptor: VueDescriptor };
  compileScript: (descriptor: VueDescriptor, options: Record<string, unknown>) => { content: string; bindings?: unknown };
  compileTemplate: (options: Record<string, unknown>) => { code: string };
  compileStyle: (options: Record<string, unknown>) => { code: string };
}

interface VueDescriptor {
  template: { content: string } | null;
  styles: { content: string; scoped: boolean }[];
}

let babelPromise: Promise<BabelStandalone> | null = null;
let vuePromise: Promise<VueCompiler> | null = null;

/** Native runtime import of a CDN URL, hidden from webpack and Turbopack so it
 *  stays a real browser `import()` rather than a bundled module request. */
function cdnImport(url: string): Promise<Record<string, unknown>> {
  return import(/* webpackIgnore: true */ /* turbopackIgnore: true */ url);
}

function loadBabel(): Promise<BabelStandalone> {
  babelPromise ??= cdnImport(`${CDN}@babel/standalone@7.26.4`).then(
    (m) => (m.default ?? m) as unknown as BabelStandalone,
  );
  return babelPromise;
}

function loadVue(): Promise<VueCompiler> {
  vuePromise ??= cdnImport(`${CDN}@vue/compiler-sfc@3.5.13`).then(
    (m) => (m.default ?? m) as unknown as VueCompiler,
  );
  return vuePromise;
}

function presetsFor(path: string): unknown[] {
  const lang = languageOf(path);
  switch (lang) {
    case 'tsx':
      return [['react'], ['typescript', { isTSX: true, allExtensions: true }]];
    case 'typescript':
      return [['typescript']];
    case 'jsx':
    case 'javascript':
      return [['react']];
    default:
      return [];
  }
}

async function transpileScript(path: string, code: string): Promise<string> {
  const babel = await loadBabel();
  const out = babel.transform(code, {
    filename: path,
    presets: presetsFor(path),
    sourceType: 'module',
    // Keep ESM imports intact so the in-iframe resolver can rewrite them.
    plugins: [],
    compact: false,
  });
  return out.code ?? '';
}

let scopeCounter = 0;

async function transpileVue(path: string, source: string): Promise<{ code: string; styles: string[] }> {
  const vue = await loadVue();
  const { descriptor } = vue.parse(source, { filename: path });
  const id = `${(scopeCounter += 1).toString(36)}${path.length}`;
  const scopeId = `data-v-${id}`;
  const scoped = descriptor.styles.some((s) => s.scoped);

  const script = vue.compileScript(descriptor, { id, inlineTemplate: false });
  const template = descriptor.template
    ? vue.compileTemplate({
        source: descriptor.template.content,
        filename: path,
        id,
        scoped,
        compilerOptions: { bindingMetadata: script.bindings },
      })
    : null;

  const styles = descriptor.styles.map(
    (style) => vue.compileStyle({ source: style.content, filename: path, id, scoped: style.scoped }).code,
  );

  // Stitch the compiled script and render function into one ESM module.
  const scriptBody = script.content.replace(/export\s+default/, 'const __sfc__ =');
  const renderBody = template ? template.code.replace(/export\s+function\s+render/, 'function render') : '';
  const code = [
    scriptBody,
    renderBody,
    template ? '__sfc__.render = render;' : '',
    scoped ? `__sfc__.__scopeId = ${JSON.stringify(scopeId)};` : '',
    'export default __sfc__;',
  ]
    .filter(Boolean)
    .join('\n');

  return { code, styles };
}

/** The console + error bridge injected into every preview. */
const CONSOLE_BRIDGE = `
(function () {
  var send = function (level, args) {
    try {
      var parts = Array.prototype.map.call(args, function (a) {
        if (typeof a === 'string') return a;
        try { return JSON.stringify(a, null, a && typeof a === 'object' ? 2 : 0); }
        catch (e) { return String(a); }
      });
      parent.postMessage({ source: 'adysre-studio', kind: 'console', level: level, parts: parts }, '*');
    } catch (e) {}
  };
  ['log', 'info', 'warn', 'error', 'debug'].forEach(function (level) {
    var original = console[level] ? console[level].bind(console) : function () {};
    console[level] = function () { send(level, arguments); original.apply(console, arguments); };
  });
  var origTable = console.table ? console.table.bind(console) : function () {};
  console.table = function (data) { send('table', [data]); origTable(data); };
  window.addEventListener('error', function (e) {
    parent.postMessage({ source: 'adysre-studio', kind: 'error', message: e.message,
      filename: e.filename, line: e.lineno, column: e.colno }, '*');
  });
  window.addEventListener('unhandledrejection', function (e) {
    var reason = e.reason;
    parent.postMessage({ source: 'adysre-studio', kind: 'error',
      message: 'Unhandled promise rejection: ' + ((reason && reason.message) || reason) }, '*');
  });
})();
`;

/** The in-iframe module resolver: builds Blob URLs and imports the entry. */
function bootstrapScript(modules: Record<string, string>, entry: string): string {
  const payload = JSON.stringify({ modules, entry, cdn: CDN, pins: PINS });
  return `
(function () {
  var data = ${payload};
  var modules = data.modules, entry = data.entry, CDN = data.cdn, pins = data.pins;
  var built = {}, building = {};
  function resolveBare(spec) {
    if (/^https?:/.test(spec)) return spec;
    if (pins[spec]) return pins[spec];
    for (var k in pins) { if (spec.indexOf(k + '/') === 0) return pins[k] + spec.slice(k.length); }
    return CDN + spec;
  }
  function norm(base, rel) {
    var parts = base ? base.split('/') : [];
    var segs = rel.split('/');
    for (var i = 0; i < segs.length; i++) {
      var s = segs[i];
      if (s === '.' || s === '') continue;
      if (s === '..') parts.pop(); else parts.push(s);
    }
    return parts.join('/');
  }
  var EXTS = ['', '.js', '.jsx', '.ts', '.tsx', '.vue', '/index.js', '/index.jsx', '/index.ts', '/index.tsx'];
  function match(path) {
    for (var i = 0; i < EXTS.length; i++) if (Object.prototype.hasOwnProperty.call(modules, path + EXTS[i])) return path + EXTS[i];
    return null;
  }
  function resolveSpec(spec, fromPath) {
    if (spec[0] !== '.' && spec[0] !== '/') return resolveBare(spec);
    var baseDir = fromPath.indexOf('/') >= 0 ? fromPath.slice(0, fromPath.lastIndexOf('/')) : '';
    var m = match(norm(baseDir, spec));
    return m ? build(m) : CDN + spec.replace(/^[./]+/, '');
  }
  var STATIC_RE = /((?:import|export)\\s+[^;'"]*?from\\s*|import\\s*)(['"])([^'"]+)\\2/g;
  var DYN_RE = /(import\\s*\\(\\s*)(['"])([^'"]+)\\2(\\s*\\))/g;
  function build(path) {
    if (built[path]) return built[path];
    if (building[path]) return built[path] || '';
    building[path] = true;
    var code = modules[path];
    code = code.replace(STATIC_RE, function (m, pre, q, spec) { return pre + q + resolveSpec(spec, path) + q; });
    code = code.replace(DYN_RE, function (m, pre, q, spec, post) { return pre + q + resolveSpec(spec, path) + q + post; });
    var url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' }));
    built[path] = url;
    return url;
  }
  try {
    import(build(entry)).catch(report);
  } catch (e) { report(e); }
  function report(e) {
    try { parent.postMessage({ source: 'adysre-studio', kind: 'error', message: (e && e.message) || String(e) }, '*'); } catch (x) {}
    if (window.console && console.error) console.error(e);
  }
})();
`;
}

function extractBody(html: string): { body: string; title: string } {
  const bodyMatch = /<body[^>]*>([\s\S]*?)<\/body>/i.exec(html);
  let body = bodyMatch ? bodyMatch[1]! : html;
  // Drop local <script src> and local stylesheet <link>: the studio injects the
  // compiled entry and the collected CSS itself.
  body = body.replace(/<script\b[^>]*\bsrc\s*=\s*["'](?!https?:|\/\/)[^"']*["'][^>]*>\s*<\/script>/gi, '');
  body = body.replace(/<link\b[^>]*\bhref\s*=\s*["'](?!https?:|\/\/)[^"']*["'][^>]*>/gi, '');
  const titleMatch = /<title>([\s\S]*?)<\/title>/i.exec(html);
  return { body: body.trim(), title: titleMatch ? titleMatch[1]!.trim() : 'ADYSRE Studio' };
}

function pickEntry(project: Project, scripts: ProjectFile[]): ProjectFile | null {
  if (project.entry) {
    const byEntry = scripts.find((f) => f.path === normalizePath(project.entry!));
    if (byEntry) return byEntry;
  }
  const priority = ['main.tsx', 'main.jsx', 'main.ts', 'main.js', 'index.tsx', 'index.jsx', 'index.ts', 'index.js', 'script.js', 'App.tsx', 'App.jsx'];
  for (const name of priority) {
    const hit = scripts.find((f) => f.path === name);
    if (hit) return hit;
  }
  return scripts[0] ?? null;
}

export interface BuildResult {
  srcdoc: string;
  error?: string;
}

/** Compile a project into an iframe `srcdoc`. Never throws: errors come back on `error`. */
export async function buildPreview(project: Project): Promise<BuildResult> {
  try {
    const css: string[] = [];
    const modules: Record<string, string> = {};
    const scripts: ProjectFile[] = [];
    let indexHtml: string | null = null;

    for (const file of project.files) {
      const lang = languageOf(file.path);
      if (lang === 'html') {
        if (file.path === 'index.html' || indexHtml === null) indexHtml = file.content;
      } else if (lang === 'css') {
        css.push(file.content);
      } else if (lang === 'vue') {
        scripts.push(file);
      } else if (lang === 'javascript' || lang === 'typescript' || lang === 'jsx' || lang === 'tsx') {
        scripts.push(file);
      }
    }

    // Compile every script; Vue also contributes styles.
    for (const file of scripts) {
      if (languageOf(file.path) === 'vue') {
        const { code, styles } = await transpileVue(file.path, file.content);
        modules[file.path] = code;
        css.push(...styles);
      } else {
        modules[file.path] = await transpileScript(file.path, file.content);
      }
    }

    const entry = pickEntry(project, scripts);
    const { body, title } = indexHtml
      ? extractBody(indexHtml)
      : { body: '<div id="root"></div><div id="app"></div>', title: project.name };

    const runtime = entry
      ? `<script>${CONSOLE_BRIDGE}</script><script>${bootstrapScript(modules, entry.path)}</script>`
      : `<script>${CONSOLE_BRIDGE}</script>`;

    const srcdoc = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${title}</title>
<style>${css.join('\n')}</style>
</head>
<body>
${body}
${runtime}
</body>
</html>`;

    return { srcdoc };
  } catch (error) {
    return {
      srcdoc: `<!doctype html><html><body style="font-family:ui-sans-serif,system-ui;color:#f87171;padding:1rem"><pre>${
        error instanceof Error ? error.message : String(error)
      }</pre></body></html>`,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
