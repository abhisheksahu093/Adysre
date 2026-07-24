import type {
  CookieFacts,
  HeadingFacts,
  PageFacts,
  PageSnapshot,
  SecurityFacts,
} from './types';
import { detectTechnologies } from './technology';

/**
 * Turn a fetched page into {@link PageFacts}.
 *
 * The HTML is read with regular expressions rather than a DOM, on purpose: this
 * first slice ships no parser dependency and runs anywhere, and the facts it
 * needs (tag counts, a handful of attributes, meta tags) are exactly what regex
 * does acceptably. When the browser phase lands it brings a real DOM, and this
 * module is where that swap happens - every rule downstream reads `PageFacts`
 * and never the raw HTML, so nothing else changes.
 *
 * Everything here is pure: snapshot in, facts out, no network and no clock.
 */

const attr = (tag: string, name: string): string | null => {
  const match = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  if (!match) return null;
  return (match[2] ?? match[3] ?? match[4] ?? '').trim();
};

const tags = (html: string, name: string): string[] => html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) ?? [];

const stripTags = (input: string): string =>
  input
    .replace(/<[^>]*>/g, ' ')
    .replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Absolute host of a possibly-relative href, or null if it will not parse. */
function hostOf(href: string, base: string): string | null {
  try {
    return new URL(href, base).hostname.toLowerCase();
  } catch {
    return null;
  }
}

function extractHeadings(html: string): { headings: HeadingFacts[]; orderOk: boolean } {
  const headings: HeadingFacts[] = [];
  const re = /<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    headings.push({ level: Number(m[1]), text: stripTags(m[2] ?? '').slice(0, 200) });
  }

  // "Order ok" ⇒ level never jumps DOWN the outline by more than one (h2→h4 is
  // the accessibility problem; h4→h1 going back up is fine).
  let orderOk = true;
  let previous = 0;
  for (const h of headings) {
    if (previous && h.level > previous + 1) orderOk = false;
    previous = h.level;
  }
  return { headings, orderOk };
}

function extractMeta(html: string): {
  description: string | null;
  viewport: string | null;
  charset: string | null;
  openGraph: Record<string, string>;
  twitter: Record<string, string>;
} {
  const metas = tags(html, 'meta');
  const openGraph: Record<string, string> = {};
  const twitter: Record<string, string> = {};
  let description: string | null = null;
  let viewport: string | null = null;
  let charset: string | null = null;

  for (const meta of metas) {
    const charsetAttr = attr(meta, 'charset');
    if (charsetAttr) charset = charsetAttr;

    const name = attr(meta, 'name')?.toLowerCase();
    const property = attr(meta, 'property')?.toLowerCase();
    const content = attr(meta, 'content');
    if (content == null) continue;

    if (name === 'description') description = content;
    else if (name === 'viewport') viewport = content;
    else if (property?.startsWith('og:')) openGraph[property] = content;
    else if (name?.startsWith('twitter:')) twitter[name] = content;
  }

  return { description, viewport, charset, openGraph, twitter };
}

function extractImages(html: string): PageFacts['images'] {
  const imgs = tags(html, 'img');
  let missingAlt = 0;
  let lazy = 0;
  let withDimensions = 0;
  for (const img of imgs) {
    if (attr(img, 'alt') == null) missingAlt += 1;
    if ((attr(img, 'loading') ?? '').toLowerCase() === 'lazy') lazy += 1;
    if (attr(img, 'width') != null && attr(img, 'height') != null) withDimensions += 1;
  }
  return { total: imgs.length, missingAlt, lazy, withDimensions };
}

function extractScripts(html: string): PageFacts['scripts'] {
  const scripts = tags(html, 'script');
  let blocking = 0;
  let asyncCount = 0;
  let deferCount = 0;
  for (const s of scripts) {
    const hasSrc = attr(s, 'src') != null;
    if (!hasSrc) continue;
    const isAsync = /\basync\b/i.test(s);
    const isDefer = /\bdefer\b/i.test(s);
    const type = (attr(s, 'type') ?? '').toLowerCase();
    const isModule = type === 'module'; // modules are deferred by default
    if (isAsync) asyncCount += 1;
    if (isDefer) deferCount += 1;
    if (!isAsync && !isDefer && !isModule) blocking += 1;
  }
  return { total: scripts.length, blocking, async: asyncCount, defer: deferCount };
}

function extractStylesheets(html: string): PageFacts['stylesheets'] {
  const links = tags(html, 'link').filter((l) => /rel\s*=\s*["']?stylesheet/i.test(l));
  let blocking = 0;
  for (const l of links) {
    const media = (attr(l, 'media') ?? '').toLowerCase();
    // Print-only or non-matching media stylesheets do not block render.
    if (media && media !== 'all' && media !== 'screen') continue;
    blocking += 1;
  }
  return { total: links.length, blocking };
}

function extractLinks(html: string, base: string): PageFacts['links'] {
  const anchors = tags(html, 'a');
  const baseHost = hostOf(base, base);
  let external = 0;
  let total = 0;
  for (const a of anchors) {
    const href = attr(a, 'href');
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) continue;
    total += 1;
    const host = hostOf(href, base);
    if (host && baseHost && host !== baseHost) external += 1;
  }
  return { total, external };
}

/** Parse one `set-cookie` value's flags. */
function parseCookie(raw: string): CookieFacts {
  const [pair, ...attrs] = raw.split(';');
  const name = (pair ?? '').split('=')[0]?.trim() ?? '';
  const flags = attrs.map((a) => a.trim().toLowerCase());
  const sameSiteAttr = flags.find((f) => f.startsWith('samesite='));
  return {
    name,
    secure: flags.includes('secure'),
    httpOnly: flags.includes('httponly'),
    sameSite: sameSiteAttr ? sameSiteAttr.split('=')[1] ?? null : null,
  };
}

function extractSecurity(
  https: boolean,
  headers: Record<string, string>,
  setCookies: string[],
): SecurityFacts {
  const cookies = setCookies.map(parseCookie);
  const insecureCookies = cookies.filter((c) => !c.secure || !c.httpOnly).length;
  return {
    https,
    hsts: 'strict-transport-security' in headers,
    csp: 'content-security-policy' in headers,
    xFrameOptions: 'x-frame-options' in headers,
    xContentTypeOptions: 'x-content-type-options' in headers,
    referrerPolicy: 'referrer-policy' in headers,
    permissionsPolicy: 'permissions-policy' in headers,
    cookies,
    insecureCookies,
  };
}

/** Build the full fact sheet from a page snapshot. Pure. */
export function extractFacts(snapshot: PageSnapshot): PageFacts {
  const { html, finalUrl, headers } = snapshot;
  const https = finalUrl.startsWith('https:');

  const htmlTag = html.match(/<html\b[^>]*>/i)?.[0] ?? '';
  const lang = attr(htmlTag, 'lang');

  const titleRaw = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const title = titleRaw != null ? stripTags(titleRaw) : null;

  const canonical =
    tags(html, 'link')
      .filter((l) => /rel\s*=\s*["']?canonical/i.test(l))
      .map((l) => attr(l, 'href'))
      .find((h): h is string => Boolean(h)) ?? null;

  const favicon = tags(html, 'link').some((l) => /rel\s*=\s*["'][^"']*icon/i.test(l));

  const { description, viewport, charset, openGraph, twitter } = extractMeta(html);
  const { headings, orderOk } = extractHeadings(html);
  const jsonLdBlocks = (html.match(/<script\b[^>]*type\s*=\s*["']application\/ld\+json["'][^>]*>/gi) ?? []).length;

  return {
    url: snapshot.requestedUrl,
    finalUrl,
    status: snapshot.status,
    redirects: snapshot.redirects,
    timingMs: snapshot.timingMs,
    htmlBytes: snapshot.htmlBytes,

    lang: lang && lang.length > 0 ? lang : null,
    charset: charset ?? (headers['content-type']?.match(/charset=([^;]+)/i)?.[1] ?? null),
    viewport,
    title,
    titleLength: title?.length ?? 0,
    metaDescription: description,
    metaDescriptionLength: description?.length ?? 0,
    canonical,
    favicon,

    h1Count: headings.filter((h) => h.level === 1).length,
    headings,
    headingOrderOk: orderOk,

    images: extractImages(html),
    links: extractLinks(html, finalUrl),
    scripts: extractScripts(html),
    stylesheets: extractStylesheets(html),

    openGraph,
    twitter,
    jsonLdBlocks,

    security: extractSecurity(https, headers, snapshot.setCookies),
    technologies: detectTechnologies(html, headers),
  };
}
