import type { Language, ProjectFile } from '../types';

/** A short, collision-resistant id without pulling in a uuid dependency. */
export function createId(prefix = 'f'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`;
}

const EXTENSION_LANGUAGE: Record<string, Language> = {
  html: 'html',
  htm: 'html',
  css: 'css',
  js: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
  vue: 'vue',
  json: 'json',
};

export function extensionOf(path: string): string {
  const dot = path.lastIndexOf('.');
  return dot === -1 ? '' : path.slice(dot + 1).toLowerCase();
}

export function languageOf(path: string): Language {
  return EXTENSION_LANGUAGE[extensionOf(path)] ?? 'plaintext';
}

/** Monaco's language id for a file (its ids differ slightly from ours). */
export function monacoLanguageOf(path: string): string {
  const lang = languageOf(path);
  switch (lang) {
    case 'jsx':
      return 'javascript';
    case 'tsx':
      return 'typescript';
    case 'vue':
      return 'html';
    case 'plaintext':
      return 'plaintext';
    default:
      return lang;
  }
}

export function baseName(path: string): string {
  const slash = path.lastIndexOf('/');
  return slash === -1 ? path : path.slice(slash + 1);
}

export function dirName(path: string): string {
  const slash = path.lastIndexOf('/');
  return slash === -1 ? '' : path.slice(0, slash);
}

export function normalizePath(path: string): string {
  return path.replace(/^\/+/, '').replace(/\/+/g, '/').trim();
}

export function findByPath(files: ProjectFile[], path: string): ProjectFile | undefined {
  const target = normalizePath(path);
  return files.find((f) => f.path === target);
}

/** True when the path denotes a runnable/compilable script (not html/css/asset). */
export function isScript(path: string): boolean {
  return ['javascript', 'typescript', 'jsx', 'tsx', 'vue'].includes(languageOf(path));
}
