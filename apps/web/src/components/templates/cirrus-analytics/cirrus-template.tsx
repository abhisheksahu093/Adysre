'use client';

import {
  CIRRUS_LABELS,
  CIRRUS_PAGES,
  type CirrusPageId,
} from '@/data/templates/cirrus-analytics-content';
import { CirrusFooter, CirrusHeader } from './cirrus-sections';
import {
  CirrusContactPage,
  CirrusHomePage,
  CirrusPricingPage,
  CirrusProductPage,
  CirrusSecurityPage,
} from './cirrus-pages';
import './cirrus.css';

/**
 * CIRRUS - the assembled site.
 *
 * Five pages, routed by the template itself: the host passes `page` (from
 * `?page=` in the preview route, from a segment in a downloaded project), the
 * header links back with the same query, and this component picks the
 * composition. Doing the switch here rather than with a router is what lets the
 * template render in any host - a preview iframe, a card thumbnail, or the
 * visitor's own app - with no routing dependency.
 *
 * `data-template` scopes the palette, the hairline structure and the chart
 * styling (cirrus.css) so nothing leaks into or out of the surrounding app.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props.
 */
export function CirrusTemplate({ page }: { page?: string }) {
  // An unknown or absent page falls back to home rather than rendering nothing.
  const current: CirrusPageId = CIRRUS_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="cirrus" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[var(--cir-radius)] focus:bg-[var(--cir-ink)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-[var(--cir-bg)]"
      >
        {CIRRUS_LABELS.skipToContent}
      </a>

      <CirrusHeader page={current} />

      {/* `key` on main so switching pages remounts the sections: the charts are
          scrubbed to scroll and must rebind their observers to the new layout. */}
      <main key={current} id="top">
        {current === 'product' && <CirrusProductPage />}
        {current === 'security' && <CirrusSecurityPage />}
        {current === 'pricing' && <CirrusPricingPage />}
        {current === 'contact' && <CirrusContactPage />}
        {current === 'home' && <CirrusHomePage />}
      </main>

      <CirrusFooter />
    </div>
  );
}
