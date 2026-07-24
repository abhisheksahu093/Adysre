'use client';

import {
  SOLSTICE_LABELS,
  SOLSTICE_PAGES,
  type SolsticePageId,
} from '@/data/templates/solstice-hotel-content';
import { SolsticeFooter, SolsticeHeader } from './solstice-sections';
import {
  SolsticeContactPage,
  SolsticeDiningPage,
  SolsticeExperiencesPage,
  SolsticeHomePage,
  SolsticeRoomsPage,
} from './solstice-pages';
import './solstice.css';

/**
 * SOLSTICE - the assembled site.
 *
 * Five pages, routed by the template itself: the host passes `page` (from
 * `?page=` in the preview route, from a segment in a downloaded project), the
 * header links back with the same query, and this component picks the
 * composition. Doing the switch here rather than with a router is what lets the
 * template render in any host - a preview iframe, a card thumbnail, or the
 * visitor's own app - with no routing dependency.
 *
 * `data-template` scopes the palette, the serif stack and the plate treatments
 * (solstice.css) so nothing leaks into or out of the surrounding app.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props.
 */
export function SolsticeTemplate({ page }: { page?: string }) {
  // An unknown or absent page falls back to home rather than rendering nothing.
  const current: SolsticePageId = SOLSTICE_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="solstice" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-[var(--sol-ink)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-[var(--sol-bg)]"
      >
        {SOLSTICE_LABELS.skipToContent}
      </a>

      <SolsticeHeader page={current} />

      {/* `key` on main so switching pages remounts the sections: the split text
          rewrites its own markup, and it must be rebuilt per page rather than
          reused in whatever state it was left in. */}
      <main key={current} id="top">
        {current === 'rooms' && <SolsticeRoomsPage />}
        {current === 'dining' && <SolsticeDiningPage />}
        {current === 'experiences' && <SolsticeExperiencesPage />}
        {current === 'contact' && <SolsticeContactPage />}
        {current === 'home' && <SolsticeHomePage />}
      </main>

      <SolsticeFooter />
    </div>
  );
}
