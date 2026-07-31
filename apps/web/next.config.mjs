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
    /**
     * Inline the route's CSS into the document instead of linking it.
     *
     * A stylesheet is render-blocking by definition: the browser will not paint
     * until it has one, so the 53 KB chunk cost a whole extra round trip in
     * front of first paint - measured at 430ms of the critical path, and the
     * longest chain on the page (1,630ms) was the document followed by exactly
     * this file. Inlined, the CSS arrives WITH the document that needs it and
     * the chain is one hop.
     *
     * The trade is that the CSS is no longer separately cacheable across
     * navigations, so a repeat visitor re-downloads it inside each document.
     * That is the right way round for a marketing page, where the visit that
     * matters is the first one and most visitors only ever have a first one.
     *
     * Compatible with the policy below, which already allows inline styles for
     * next/font's injected faces; this needs nothing new from the CSP.
     */
    inlineCss: true,
  },
  headers: securityHeaders,
};

/**
 * Content-Security-Policy.
 *
 * ─── Why `script-src` allows inline, and what that costs ────────────────────
 * The textbook policy is `script-src 'nonce-<random>' 'strict-dynamic'`, and it
 * is not available to this app. A nonce has to be minted per request and
 * stamped onto Next's own bootstrap tags, which means generating it in the
 * proxy and rendering every page DYNAMICALLY. Every page here is prerendered
 * (`x-nextjs-prerender: 1` on the live site) and served from the edge cache;
 * switching them to per-request rendering to gain the nonce would trade the
 * site's entire first-byte story for it. The RSC payload is itself a sequence
 * of inline `self.__next_f.push` scripts, so there is no hash set to enumerate
 * either: it changes with every render.
 *
 * So this policy does NOT stop an injected inline `<script>`. What it does stop
 * is everything an injection normally needs to be useful, and that is not
 * nothing:
 *
 *   script-src 'self'   no loading code from an attacker's host
 *   connect-src         no exfiltrating what it reads to one
 *   base-uri 'none'     no injected <base> silently re-pointing every relative
 *                       script URL on the page at another origin
 *   object-src 'none'   no <object>/<embed> plugin bypass
 *   form-action 'self'  no re-targeting a form post at an attacker's collector
 *   frame-ancestors     clickjacking, and the directive that actually binds
 *                       (X-Frame-Options is the legacy spelling below)
 *
 * The honest summary: this is a containment policy, not an XSS-proof one. It is
 * documented that way so nobody reads the header's presence as more than it is.
 * The upgrade path is a nonce, and it is gated on being willing to render
 * dynamically, not on effort.
 *
 * ─── The two `unsafe-inline` grants ─────────────────────────────────────────
 * `style-src` needs it for next/font's injected faces, Tailwind's runtime
 * custom properties and every `style` attribute the workbench canvas animates.
 * `script-src` needs it for the reasons above.
 *
 * ─── Sources that are not 'self' ────────────────────────────────────────────
 * `img-src https:` because the API Studio response viewer and Website
 * Intelligence render images fetched from whatever URL the user pointed them
 * at. `blob:` and `data:` because half the tools build their download or
 * preview client-side out of a Blob. `connect-src` gains the NestJS API's
 * origin only when it is configured and genuinely cross-origin.
 */
function contentSecurityPolicy() {
  const dev = process.env.NODE_ENV !== 'production';

  /**
   * The NestJS API, when it is on another origin.
   *
   * `api-client.ts` calls it straight from the browser, so a cross-origin
   * deployment fails every request with a CSP violation if it is not named
   * here. Same-origin (the Vercel default, where the route handlers serve the
   * browser) adds nothing.
   */
  const apiOrigin = (() => {
    const raw = process.env.NEXT_PUBLIC_API_URL;
    if (!raw) return null;
    try {
      return new URL(raw).origin;
    } catch {
      return null; // Malformed value: the app has bigger problems than the CSP.
    }
  })();

  const directives = {
    'default-src': ["'self'"],
    // No nonce is available (see above), so this is containment, not prevention.
    'script-src': ["'self'", "'unsafe-inline'", ...(dev ? ["'unsafe-eval'"] : [])],
    'style-src': ["'self'", "'unsafe-inline'"],
    'img-src': ["'self'", 'data:', 'blob:', 'https:'],
    'font-src': ["'self'", 'data:'],
    'connect-src': [
      "'self'",
      ...(apiOrigin ? [apiOrigin] : []),
      // Turbopack's HMR socket. Development only; a production build must never
      // permit an arbitrary websocket.
      ...(dev ? ['ws:', 'wss:'] : []),
    ],
    // Same-origin only, matching X-Frame-Options: SAMEORIGIN below. `blob:` is
    // for the tools that preview a generated document before download.
    'frame-src': ["'self'", 'blob:', 'data:'],
    'media-src': ["'self'", 'data:', 'blob:'],
    'worker-src': ["'self'", 'blob:'],
    'manifest-src': ["'self'"],
    'form-action': ["'self'"],
    'frame-ancestors': ["'self'"],
    'base-uri': ["'none'"],
    'object-src': ["'none'"],
  };

  const serialised = Object.entries(directives)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ');

  // Valueless directive, so it is appended rather than mapped. Skipped in
  // development, where the site is served over plain http and upgrading every
  // subresource to https would break local asset loading outright.
  return dev ? serialised : `${serialised}; upgrade-insecure-requests`;
}

/**
 * Security response headers, applied to every route.
 */
async function securityHeaders() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: contentSecurityPolicy(),
        },
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
