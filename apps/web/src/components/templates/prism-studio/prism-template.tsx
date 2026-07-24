'use client';

import {
  PRISM_LABELS,
  PRISM_PAGES,
  type PrismPageId,
} from '@/data/templates/prism-studio-content';
import { PrismFooter, PrismHeader } from './prism-sections';
import {
  PrismContactPage,
  PrismHomePage,
  PrismServicesPage,
  PrismStudioPage,
  PrismWorkPage,
} from './prism-pages';
import './prism.css';

/**
 * PRISM - the assembled site.
 *
 * Five pages, routed by the template itself: the host passes `page` (from
 * `?page=` in the preview route, from a segment in a downloaded project), the
 * header links back with the same query, and this component picks the
 * composition. Doing the switch here rather than with a router is what lets the
 * template render in any host - a preview iframe, a card thumbnail, or the
 * visitor's own app - with no routing dependency.
 *
 * `data-template` scopes the palette, the display type settings and the plate
 * treatments (prism.css) so nothing leaks into or out of the surrounding app.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props.
 */
export function PrismTemplate({ page }: { page?: string }) {
  // An unknown or absent page falls back to home rather than rendering nothing.
  const current: PrismPageId = PRISM_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="prism" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-[var(--pri-radius)] focus:bg-[var(--pri-acid)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-[var(--pri-bg)]"
      >
        {PRISM_LABELS.skipToContent}
      </a>

      <PrismHeader page={current} />

      {/* `key` on main so switching pages remounts the sections: the rail
          measures its own travel on mount, and a stale measurement from a
          different page's layout would push it to the wrong place. */}
      <main key={current} id="top">
        {current === 'work' && <PrismWorkPage />}
        {current === 'studio' && <PrismStudioPage />}
        {current === 'services' && <PrismServicesPage />}
        {current === 'contact' && <PrismContactPage />}
        {current === 'home' && <PrismHomePage />}
      </main>

      <PrismFooter />
    </div>
  );
}
