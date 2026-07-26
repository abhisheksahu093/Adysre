/**
 * Loads the Monaco editor from a public CDN on demand.
 *
 * Monaco is ~5 MB and DOM-bound, so it never belongs in the app bundle or on the
 * server. We pull its AMD build the first time the studio opens and hand every
 * caller the same `monaco` namespace. A data-URL worker proxy sidesteps the
 * cross-origin worker restriction that otherwise breaks CDN-hosted Monaco.
 */

const VERSION = '0.52.2';
const BASE_PATH = `https://cdn.jsdelivr.net/npm/monaco-editor@${VERSION}/min`;
const VS_PATH = `${BASE_PATH}/vs`;

// A minimal typed surface for the pieces of the Monaco API the studio uses; the
// full monaco-editor types are not installed since Monaco loads at runtime.
export interface MonacoTextModel {
  getValue(): string;
  setValue(value: string): void;
  onDidChangeContent(cb: () => void): { dispose(): void };
  dispose(): void;
  uri: unknown;
}

export interface MonacoEditorInstance {
  getValue(): string;
  setModel(model: MonacoTextModel | null): void;
  updateOptions(options: Record<string, unknown>): void;
  addCommand(keybinding: number, handler: () => void): void;
  getAction(id: string): { run(): void } | null;
  trigger(source: string, handlerId: string, payload?: unknown): void;
  revealLineInCenter(line: number): void;
  setPosition(position: { lineNumber: number; column: number }): void;
  focus(): void;
  layout(): void;
  dispose(): void;
}

interface LanguageDefaults {
  setCompilerOptions(options: Record<string, unknown>): void;
  setDiagnosticsOptions(options: Record<string, unknown>): void;
}

export interface MonacoApi {
  editor: {
    create(container: HTMLElement, options: Record<string, unknown>): MonacoEditorInstance;
    createModel(value: string, language: string, uri?: unknown): MonacoTextModel;
    getModel(uri: unknown): MonacoTextModel | null;
    setModelLanguage(model: MonacoTextModel, language: string): void;
    setTheme(theme: string): void;
  };
  Uri: { parse(value: string): unknown };
  KeyMod: { CtrlCmd: number; Shift: number; Alt: number; WinCtrl: number };
  KeyCode: Record<string, number>;
  languages: {
    typescript: {
      typescriptDefaults: LanguageDefaults;
      javascriptDefaults: LanguageDefaults;
      ScriptTarget: Record<string, number>;
      JsxEmit: Record<string, number>;
      ModuleKind: Record<string, number>;
      ModuleResolutionKind: Record<string, number>;
    };
  };
}

interface AmdRequire {
  (deps: string[], onLoad: () => void): void;
  config(options: { paths: Record<string, string> }): void;
}

declare global {
  interface Window {
    monaco?: MonacoApi;
    require?: AmdRequire;
    MonacoEnvironment?: { getWorkerUrl: (moduleId: string, label: string) => string };
  }
}

let loaderPromise: Promise<MonacoApi> | null = null;

function injectScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(script);
  });
}

export function loadMonaco(): Promise<MonacoApi> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Monaco can only load in the browser'));
  }
  if (window.monaco) return Promise.resolve(window.monaco);

  loaderPromise ??= (async () => {
    // The worker's baseUrl is the directory that CONTAINS `vs` (so it resolves
    // `vs/language/.../worker.js`), while importScripts loads workerMain from vs.
    window.MonacoEnvironment = {
      getWorkerUrl: () =>
        `data:text/javascript;charset=utf-8,${encodeURIComponent(
          `self.MonacoEnvironment={baseUrl:'${BASE_PATH}/'};importScripts('${VS_PATH}/base/worker/workerMain.js');`,
        )}`,
    };

    await injectScript(`${VS_PATH}/loader.js`);
    const amdRequire = window.require;
    if (!amdRequire) throw new Error('Monaco AMD loader unavailable');
    amdRequire.config({ paths: { vs: VS_PATH } });

    await new Promise<void>((resolve) => amdRequire(['vs/editor/editor.main'], () => resolve()));
    const monaco = window.monaco;
    if (!monaco) throw new Error('Monaco failed to initialise');

    configureTypeScript(monaco);
    return monaco;
  })();

  return loaderPromise;
}

/** Loosen TS/JS defaults so single-file editing does not drown in import errors. */
function configureTypeScript(monaco: MonacoApi): void {
  const ts = monaco.languages.typescript;
  const compilerOptions = {
    target: ts.ScriptTarget.ESNext,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs ?? 2,
    jsx: ts.JsxEmit.ReactJSX,
    allowNonTsExtensions: true,
    allowJs: true,
    esModuleInterop: true,
    isolatedModules: true,
    noEmit: true,
  };
  ts.typescriptDefaults.setCompilerOptions(compilerOptions);
  ts.javascriptDefaults.setCompilerOptions(compilerOptions);
  // Module resolution can't follow esm.sh URLs, so silence "cannot find module".
  const diagnostics = { diagnosticCodesToIgnore: [2307, 2792, 2686, 7016, 2304] };
  ts.typescriptDefaults.setDiagnosticsOptions(diagnostics);
  ts.javascriptDefaults.setDiagnosticsOptions(diagnostics);
}

export { VS_PATH };
