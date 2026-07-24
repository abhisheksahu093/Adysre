'use client';

import {
  NOCTIS_LABELS,
  NOCTIS_PAGES,
  type NoctisPageId,
} from '@/data/templates/noctis-folio-content';
import { NoctisFooter, NoctisHeader } from './noctis-sections';
import {
  NoctisAboutPage,
  NoctisContactPage,
  NoctisHomePage,
  NoctisJournalPage,
  NoctisWorkPage,
} from './noctis-pages';
import './noctis.css';

/**
 * NOCTIS - the assembled site.
 *
 * Five pages, routed by the template itself: the host passes `page` (from
 * `?page=` in the preview route, from a segment in a downloaded project), the
 * header links back with the same query, and this component picks the
 * composition. Doing the switch here rather than with a router is what lets the
 * template render in any host - a preview iframe, a card thumbnail, or the
 * visitor's own app - with no routing dependency.
 *
 * `data-template` scopes the palette, the display type settings and the duotone
 * plate treatments (noctis.css) so nothing leaks into or out of the app.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props.
 */
export function NoctisTemplate({ page }: { page?: string }) {
  // An unknown or absent page falls back to home rather than rendering nothing.
  const current: NoctisPageId = NOCTIS_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="noctis" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[var(--noc-radius)] focus:bg-[var(--noc-amber)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-[var(--noc-bg)]"
      >
        {NOCTIS_LABELS.skipToContent}
      </a>

      <NoctisHeader page={current} />

      {/* `key` on main so switching pages remounts the sections: the strip
          measures its own travel on mount, and a stale measurement from a
          different page's layout would push it to the wrong place. */}
      <main key={current} id="top">
        {current === 'work' && <NoctisWorkPage />}
        {current === 'about' && <NoctisAboutPage />}
        {current === 'journal' && <NoctisJournalPage />}
        {current === 'contact' && <NoctisContactPage />}
        {current === 'home' && <NoctisHomePage />}
      </main>

      <NoctisFooter />
    </div>
  );
}
