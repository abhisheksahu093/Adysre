'use client';

import {
  SCULPT_LABELS,
  SCULPT_PAGES,
  type SculptPageId,
} from '@/data/templates/sculpt-audio-content';
import { SculptFooter, SculptHeader } from './sculpt-sections';
import {
  SculptContactPage,
  SculptHomePage,
  SculptProductsPage,
  SculptSupportPage,
  SculptTechnologyPage,
} from './sculpt-pages';
import './sculpt.css';

/**
 * SCULPT - the assembled site.
 *
 * Five pages, routed by the template itself: the host passes `page` (from
 * `?page=` in the preview route, from a segment in a downloaded project), the
 * header links back with the same query, and this component picks the
 * composition. Doing the switch here rather than with a router is what lets the
 * template render in any host - a preview iframe, a card thumbnail, or the
 * visitor's own app - with no routing dependency.
 *
 * `data-template` scopes the palette and the soft-surface utilities
 * (sculpt.css) so nothing leaks into or out of the surrounding app.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props.
 */
export function SculptTemplate({ page }: { page?: string }) {
  // An unknown or absent page falls back to home rather than rendering nothing.
  const current: SculptPageId = SCULPT_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="sculpt" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--scu-ink)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-[var(--scu-bg)]"
      >
        {SCULPT_LABELS.skipToContent}
      </a>

      <SculptHeader page={current} />

      {/* `key` on main so switching pages remounts the sections: their reveals
          run once, and a stale observed state would leave content faded out. */}
      <main key={current} id="top">
        {current === 'products' && <SculptProductsPage />}
        {current === 'technology' && <SculptTechnologyPage />}
        {current === 'support' && <SculptSupportPage />}
        {current === 'contact' && <SculptContactPage />}
        {current === 'home' && <SculptHomePage />}
      </main>

      <SculptFooter />
    </div>
  );
}
