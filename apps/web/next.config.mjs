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

/** Monorepo root - used to trace files for the standalone Docker output. */
const monorepoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..');

/** Points the plugin at our request config (default location is ./i18n/request.ts). */
const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/**
 * Whether this build must emit the self-contained server for the Docker image.
 *
 * `output: 'standalone'` copies the whole traced server into `.next/standalone`
 * - several GB for an app this size, written on EVERY build. Only the Docker
 * image consumes it (apps/web/Dockerfile sets this variable); Vercel uses its
 * own adapter, and a developer running `pnpm build` locally just pays the disk.
 * Off by default, so a full local build no longer doubles its own output.
 */
const standalone = process.env.NEXT_OUTPUT === 'standalone';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Self-contained server bundle for the Docker image (apps/web/Dockerfile).
  ...(standalone ? { output: 'standalone' } : {}),
  // `outputFileTracingRoot` is required in a monorepo so tracing follows the
  // workspace packages this app imports instead of stopping at apps/web.
  outputFileTracingRoot: monorepoRoot,
  // Compile workspace packages that ship raw TS/TSX.
  transpilePackages: ['adysre', '@adysre/theme', '@adysre/sdk', '@adysre/types', '@adysre/validators'],
  typedRoutes: true,
  // Barrel-optimise the icon library so a route only bundles the icons it uses
  // instead of pulling the whole package graph (lucide-react is imported across
  // dozens of files).
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  headers: securityHeaders,
};

/**
 * Security response headers, applied to every route.
 *
 * Deliberately excludes Content-Security-Policy. A correct CSP for this app
 * needs per-request nonces to coexist with Next's inline bootstrap scripts, and
 * a wrong one breaks the app in ways that are hard to attribute. Shipping a
 * permissive `unsafe-inline` policy to claim the header would be worse than
 * having none: it reads as protection while providing almost none.
 */
async function securityHeaders() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          // Two years, and only meaningful over https, so it is skipped in
          // development where the site is served over http.
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        {
          // Stops a browser second-guessing Content-Type. Without it, a file a
          // user uploaded as text can be sniffed as HTML and executed on our
          // origin.
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          /**
           * Clickjacking: no OTHER site may frame this app, so a transparent
           * overlay cannot trick someone into clicking a real control.
           *
           * SAMEORIGIN rather than DENY, and the difference is not cosmetic.
           * DENY blocks framing by ANY document including our own, which broke
           * two real features: the playground canvas renders each section as a
           * same-origin `/preview/[slug]` iframe, and the template gallery
           * renders `/template-preview/[slug]` the same way. Both went blank
           * with "localhost refused to connect", which reads like a dead server
           * rather than a header.
           *
           * The threat this header addresses is a third-party page framing us.
           * Our own origin framing itself is not that threat, and those iframes
           * exist because Tailwind breakpoints key off the viewport: a 375px
           * div still matches `md:` while a 375px iframe genuinely does not.
           */
          key: 'X-Frame-Options',
          value: 'SAMEORIGIN',
        },
        {
          // Matters specifically for reset links. Under a permissive policy a
          // page at /reset-password?token=... leaks the whole URL, token
          // included, in the Referer of every outbound request it makes.
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
        },
        {
          // Isolates this origin's browsing context group from any window it
          // opens or is opened by.
          key: 'Cross-Origin-Opener-Policy',
          value: 'same-origin',
        },
      ],
    },
    {
      // Auth responses must never be stored. A cached 200 from /api/auth/me on
      // a shared machine or an intermediary proxy is one user's identity served
      // to the next.
      source: '/api/auth/:path*',
      headers: [
        { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, private' },
        { key: 'Pragma', value: 'no-cache' },
      ],
    },
  ];
}

export default withNextIntl(nextConfig);
