/**
 * Technology detection.
 *
 * Signature-based, in the spirit of Wappalyzer but deliberately small and
 * transparent: each detector is a name plus a predicate over the raw HTML and
 * the (lower-cased) response headers. It errs toward precision - a weak signal
 * like "has a div#root" is not enough to claim React - because a false "this
 * site runs X" is worse than a miss on a report people act on.
 */

export interface TechnologyDetector {
  name: string;
  test: (html: string, headers: Record<string, string>) => boolean;
}

const has = (html: string, needle: string) => html.includes(needle);
const header = (headers: Record<string, string>, key: string) => headers[key] ?? '';

export const TECHNOLOGY_DETECTORS: TechnologyDetector[] = [
  {
    name: 'Next.js',
    test: (html, headers) =>
      has(html, '/_next/') ||
      has(html, '__NEXT_DATA__') ||
      /next\.js/i.test(header(headers, 'x-powered-by')),
  },
  {
    name: 'React',
    test: (html) =>
      has(html, '__NEXT_DATA__') ||
      has(html, 'data-reactroot') ||
      has(html, 'data-reactid') ||
      /\/static\/js\/(main|runtime|chunk)/.test(html),
  },
  { name: 'Vue.js', test: (html) => has(html, 'data-v-') || has(html, '__VUE__') || has(html, '/vue.') },
  { name: 'Angular', test: (html) => /ng-version="/.test(html) || has(html, 'ng-app') },
  { name: 'Svelte', test: (html) => has(html, 'svelte-') || has(html, '__svelte') },
  { name: 'Astro', test: (html) => has(html, 'astro-island') || /content="astro/i.test(html) },
  {
    name: 'WordPress',
    test: (html) =>
      has(html, '/wp-content/') || has(html, '/wp-includes/') || /content="wordpress/i.test(html),
  },
  { name: 'Shopify', test: (html, headers) => has(html, 'cdn.shopify.com') || header(headers, 'x-shopify-stage') !== '' },
  { name: 'Wix', test: (html) => has(html, 'static.wixstatic.com') || has(html, 'X-Wix-') },
  { name: 'Squarespace', test: (html) => has(html, 'static1.squarespace.com') || /squarespace/i.test(html) },
  { name: 'Webflow', test: (html) => has(html, 'data-wf-page') || has(html, 'assets.website-files.com') },
  { name: 'Tailwind CSS', test: (html) => has(html, '--tw-') || /\/tailwind(\.min)?\.css/i.test(html) },
  { name: 'Bootstrap', test: (html) => /bootstrap(\.min)?\.(css|js)/i.test(html) },
  { name: 'jQuery', test: (html) => /jquery[-.]/i.test(html) },
  { name: 'Google Analytics', test: (html) => has(html, 'google-analytics.com') || /gtag\(/.test(html) || /googletagmanager\.com\/gtag/.test(html) },
  { name: 'Google Tag Manager', test: (html) => /googletagmanager\.com\/gtm\.js/.test(html) || /GTM-[A-Z0-9]+/.test(html) },
  { name: 'Google Fonts', test: (html) => has(html, 'fonts.googleapis.com') || has(html, 'fonts.gstatic.com') },
  { name: 'Cloudflare', test: (_html, headers) => header(headers, 'cf-ray') !== '' || /cloudflare/i.test(header(headers, 'server')) },
  { name: 'Vercel', test: (_html, headers) => header(headers, 'x-vercel-id') !== '' || /vercel/i.test(header(headers, 'server')) },
  { name: 'Nginx', test: (_html, headers) => /nginx/i.test(header(headers, 'server')) },
  { name: 'Apache', test: (_html, headers) => /apache/i.test(header(headers, 'server')) },
];

/** All technologies whose signature is present, in detector order. */
export function detectTechnologies(html: string, headers: Record<string, string>): string[] {
  return TECHNOLOGY_DETECTORS.filter((detector) => detector.test(html, headers)).map((d) => d.name);
}
