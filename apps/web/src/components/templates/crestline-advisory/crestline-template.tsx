'use client';

import {
  CRESTLINE_LABELS,
  CRESTLINE_PAGES,
  type CrestlinePageId,
} from '@/data/templates/crestline-advisory-content';
import { CrestlineFooter, CrestlineHeader } from './crestline-sections';
import {
  CrestlineAboutPage,
  CrestlineContactPage,
  CrestlineHomePage,
  CrestlineServicesPage,
} from './crestline-pages';
import './crestline.css';

/**
 * CRESTLINE - the assembled site.
 *
 * Four pages, routed by the template itself: the host passes `page` (from
 * `?page=` in the preview route, from a segment in a downloaded project), the
 * header links back with the same query, and this component picks the
 * composition. Doing the switch here rather than with a router is what lets the
 * template render in any host - a preview iframe, a card thumbnail, or the
 * visitor's own app - with no routing dependency.
 *
 * `data-template` scopes the palette, the particle field, the orbit ring and
 * the marquee (crestline.css) so nothing leaks into or out of the surrounding
 * app.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props.
 */
export function CrestlineTemplate({ page }: { page?: string }) {
  // An unknown or absent page falls back to home rather than rendering nothing.
  const current: CrestlinePageId = CRESTLINE_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="crestline" className="min-h-screen antialiased">
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--crl-green)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-white"
      >
        {CRESTLINE_LABELS.skipToContent}
      </a>

      <CrestlineHeader page={current} />

      {/* `key` on main so switching pages remounts the sections: the scroll
          reveals and counters rebind their observers to the new layout. */}
      <main key={current}>
        {current === 'about' && <CrestlineAboutPage />}
        {current === 'services' && <CrestlineServicesPage />}
        {current === 'contact' && <CrestlineContactPage />}
        {current === 'home' && <CrestlineHomePage />}
      </main>

      <CrestlineFooter />
    </div>
  );
}
