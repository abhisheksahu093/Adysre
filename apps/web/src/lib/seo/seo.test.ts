import assert from 'node:assert/strict';
import { afterEach, beforeEach, describe, it } from 'node:test';

/**
 * The SEO URL layer.
 *
 * Everything asserted here is a pure string function, and every one of them
 * produces a tag a crawler reads once and acts on for weeks. A canonical that
 * points at the wrong host, an hreflang that is relative, a tracking parameter
 * that survives into a canonical: none of these break a page, none of them show
 * up in a screenshot, and all of them cost ranking quietly. That is exactly the
 * class of bug a unit test is for.
 *
 * `NEXT_PUBLIC_APP_URL` is read at CALL time, so each test can set it and the
 * module does not need re-importing.
 */

const ORIGIN = 'https://www.example.com';

let previousAppUrl: string | undefined;

beforeEach(() => {
  previousAppUrl = process.env.NEXT_PUBLIC_APP_URL;
  process.env.NEXT_PUBLIC_APP_URL = ORIGIN;
});

afterEach(() => {
  if (previousAppUrl === undefined) delete process.env.NEXT_PUBLIC_APP_URL;
  else process.env.NEXT_PUBLIC_APP_URL = previousAppUrl;
});

describe('siteOrigin', async () => {
  const { siteOrigin } = await import('./site');

  it('reads the configured origin', () => {
    assert.equal(siteOrigin(), ORIGIN);
  });

  it('strips a trailing slash so callers can concatenate a path', () => {
    process.env.NEXT_PUBLIC_APP_URL = `${ORIGIN}/`;
    assert.equal(siteOrigin(), ORIGIN);
  });

  it('falls back to localhost when nothing is configured', () => {
    delete process.env.NEXT_PUBLIC_APP_URL;
    assert.equal(siteOrigin(), 'http://localhost:3000');
  });

  it('treats an empty value as unconfigured rather than as an empty origin', () => {
    // A platform that defines the variable but leaves it blank would otherwise
    // produce `//pricing` for every canonical on the site.
    process.env.NEXT_PUBLIC_APP_URL = '   ';
    assert.equal(siteOrigin(), 'http://localhost:3000');
  });
});

describe('localePath', async () => {
  const { localePath } = await import('./site');

  it('leaves the default locale unprefixed, matching localePrefix: as-needed', () => {
    assert.equal(localePath('en', '/pricing'), '/pricing');
    assert.equal(localePath('en', '/'), '/');
  });

  it('prefixes every other locale', () => {
    assert.equal(localePath('ja', '/pricing'), '/ja/pricing');
    assert.equal(localePath('ja', '/'), '/ja');
  });

  it('normalises a missing leading slash and a stray trailing one', () => {
    assert.equal(localePath('en', 'pricing'), '/pricing');
    assert.equal(localePath('en', '/pricing/'), '/pricing');
  });
});

describe('localeUrl', async () => {
  const { localeUrl } = await import('./site');

  it('is absolute, because crawlers do not resolve relative hreflang', () => {
    assert.equal(localeUrl('ja', '/pricing'), `${ORIGIN}/ja/pricing`);
  });

  it('emits the home page without a trailing slash, matching the rendered tag', () => {
    assert.equal(localeUrl('en', '/'), ORIGIN);
  });
});

describe('languageAlternates', async () => {
  const { languageAlternates } = await import('./site');

  it('covers every locale plus x-default', () => {
    const alternates = languageAlternates('/pricing');
    assert.deepEqual(alternates, {
      en: `${ORIGIN}/pricing`,
      ja: `${ORIGIN}/ja/pricing`,
      zh: `${ORIGIN}/zh/pricing`,
      hi: `${ORIGIN}/hi/pricing`,
      'x-default': `${ORIGIN}/pricing`,
    });
  });

  it('points x-default at the default locale', () => {
    const alternates = languageAlternates('/');
    assert.equal(alternates['x-default'], alternates.en);
  });
});

describe('canonicalLinkHeader', async () => {
  const { canonicalLinkHeader } = await import('./canonical-header');

  it('formats a Link header for a normal page', () => {
    assert.equal(canonicalLinkHeader('/pricing'), `<${ORIGIN}/pricing>; rel="canonical"`);
  });

  it('agrees with localeUrl on the home page', async () => {
    const { localeUrl } = await import('./site');
    assert.equal(canonicalLinkHeader('/'), `<${localeUrl('en', '/')}>; rel="canonical"`);
  });

  it('keeps the locale prefix, because a translation is not a duplicate', () => {
    assert.equal(canonicalLinkHeader('/ja/pricing'), `<${ORIGIN}/ja/pricing>; rel="canonical"`);
  });

  it('drops campaign parameters that do not change the page', () => {
    assert.equal(
      canonicalLinkHeader('/pricing', '?utm_source=x&ref=y&gclid=z'),
      `<${ORIGIN}/pricing>; rel="canonical"`,
    );
  });

  it('keeps ?page, which selects a different document on a showcase site', () => {
    assert.equal(
      canonicalLinkHeader('/websites/lumen-store', '?page=about&utm_source=x'),
      `<${ORIGIN}/websites/lumen-store?page=about>; rel="canonical"`,
    );
  });

  it('declares nothing for routes robots.txt disallows', () => {
    assert.equal(canonicalLinkHeader('/preview/hero-split'), null);
    assert.equal(canonicalLinkHeader('/ja/template-preview/lumen-store'), null);
    assert.equal(canonicalLinkHeader('/website-intelligence-report/abc'), null);
  });

  it('matches a whole segment, so a future /previews page still gets one', () => {
    assert.equal(canonicalLinkHeader('/previews'), `<${ORIGIN}/previews>; rel="canonical"`);
  });
});
