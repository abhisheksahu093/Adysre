import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import createNextIntlPlugin from 'next-intl/plugin';

/**
 * The monorepo keeps a single `.env` at the root (see `.env.example`), but Next
 * only reads env files from this app's own directory - so server-only secrets
 * such as `ANTHROPIC_API_KEY` never reached the route handlers.
 *
 * Fill in only the keys nothing has set yet: the real process environment and
 * `apps/web/.env.local` both still win, and a container that injects variables
 * directly is unaffected.
 */
function loadRootEnv() {
  const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
  let contents;
  try {
    contents = readFileSync(resolve(root, '.env'), 'utf8');
  } catch {
    return; // No root .env (CI, or a container passing real env vars).
  }

  for (const line of contents.split('\n')) {
    if (line.trim().startsWith('#')) continue;
    const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key] !== undefined) continue;
    process.env[key] = rawValue.replace(/^(['"])([\s\S]*)\1$/, '$2');
  }
}

loadRootEnv();

/** Points the plugin at our request config (default location is ./i18n/request.ts). */
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Compile workspace packages that ship raw TS/TSX.
  transpilePackages: ['@adysre/ui', '@adysre/theme', '@adysre/sdk', '@adysre/types', '@adysre/validators'],
  typedRoutes: true,
  // Barrel-optimise the icon library so a route only bundles the icons it uses
  // instead of pulling the whole package graph (lucide-react is imported across
  // dozens of files).
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default withNextIntl(nextConfig);
