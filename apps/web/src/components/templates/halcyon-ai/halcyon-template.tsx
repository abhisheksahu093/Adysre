'use client';

import {
  HALCYON_LABELS,
  HALCYON_PAGES,
  type HalcyonPageId,
} from '@/data/templates/halcyon-ai-content';
import { HalcyonHeader } from './halcyon-header';
import { HalcyonFooter } from './halcyon-sections';
import {
  HalcyonAboutPage,
  HalcyonContactPage,
  HalcyonHomePage,
  HalcyonPlatformPage,
  HalcyonPricingPage,
} from './halcyon-pages';
import './halcyon.css';

/**
 * HALCYON - the assembled site.
 *
 * Five pages, routed by the template itself: the host passes `page` (from
 * `?page=` in the preview route, from a segment in a downloaded project), the
 * header links back with the same query, and this component picks the
 * composition. Doing the switch here rather than with a router is what lets the
 * template render in any host - a preview iframe, a card thumbnail, or the
 * visitor's own app - with no routing dependency.
 *
 * `data-template` scopes the palette and the glass utilities (halcyon.css) so
 * nothing leaks into or out of the surrounding app.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props. Assembling on the client keeps the content one plain import.
 */
export function HalcyonTemplate({ page }: { page?: string }) {
  // An unknown or absent page falls back to home rather than rendering nothing:
  // a bad link should still show the company.
  const current: HalcyonPageId = HALCYON_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="halcyon" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--hal-ink)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-[var(--hal-bg)]"
      >
        {HALCYON_LABELS.skipToContent}
      </a>

      <HalcyonHeader page={current} />

      {/* `key` on main so switching pages remounts the sections: their reveals
          run once, and a stale observed state would leave content faded out. */}
      <main key={current} id="top">
        {current === 'platform' && <HalcyonPlatformPage />}
        {current === 'pricing' && <HalcyonPricingPage />}
        {current === 'about' && <HalcyonAboutPage />}
        {current === 'contact' && <HalcyonContactPage />}
        {current === 'home' && <HalcyonHomePage />}
      </main>

      <HalcyonFooter />
    </div>
  );
}
