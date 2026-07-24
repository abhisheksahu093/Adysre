'use client';

import {
  MARFA_LABELS,
  MARFA_PAGES,
  type MarfaPageId,
} from '@/data/templates/marfa-studio-content';
import { MarfaFooter, MarfaHeader } from './marfa-sections';
import {
  MarfaContactPage,
  MarfaHomePage,
  MarfaStudioPage,
  MarfaWordsPage,
  MarfaWorkPage,
} from './marfa-pages';
import './marfa.css';

/**
 * MARFA - the assembled site.
 *
 * Five pages, routed by the template itself: the host passes `page` (from
 * `?page=` in the preview route, from a segment in a downloaded project), the
 * header links back with the same query, and this component picks the
 * composition. Doing the switch here rather than with a router is what lets the
 * template render in any host - a preview iframe, a card thumbnail, or the
 * visitor's own app - with no routing dependency.
 *
 * `data-template` scopes the palette, the serif display settings and the
 * parallax frame (marfa.css) so nothing leaks into or out of the app.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props.
 */
export function MarfaTemplate({ page }: { page?: string }) {
  // An unknown or absent page falls back to home rather than rendering nothing.
  const current: MarfaPageId = MARFA_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="marfa" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--mar-ink)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-[var(--mar-paper)]"
      >
        {MARFA_LABELS.skipToContent}
      </a>

      <MarfaHeader page={current} />

      {/* `key` on main so switching pages remounts the sections: the parallax
          frames measure their own travel on mount, and a stale measurement from
          a different page's layout would scrub them wrong. */}
      <main key={current} id="top">
        {current === 'work' && <MarfaWorkPage />}
        {current === 'studio' && <MarfaStudioPage />}
        {current === 'words' && <MarfaWordsPage />}
        {current === 'contact' && <MarfaContactPage />}
        {current === 'home' && <MarfaHomePage />}
      </main>

      <MarfaFooter />
    </div>
  );
}
