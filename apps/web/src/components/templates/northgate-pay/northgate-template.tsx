'use client';

import {
  NORTHGATE_CONTENT,
  NORTHGATE_LABELS,
  NORTHGATE_PAGES,
  type NorthgatePageId,
} from '@/data/templates/northgate-pay-content';
import { NorthgateFooter } from './northgate-footer';
import { NorthgateHeader } from './northgate-header';
import {
  NorthgateContactPage,
  NorthgateDevelopersPage,
  NorthgateHomePage,
  NorthgatePricingPage,
  NorthgateProductsPage,
} from './northgate-pages';
import './northgate.css';

/**
 * NORTHGATE - the assembled site.
 *
 * Five pages, routed by the template itself: the host passes `page` (from
 * `?page=` in the preview route, from a segment in a downloaded project), the
 * header links back with the same query, and this component picks the
 * composition. Doing the switch here rather than with a router is what lets the
 * template render in any host - a preview iframe, a card thumbnail, or the
 * visitor's own app - without a routing dependency.
 *
 * `data-template` scopes the palette and type stack (northgate.css) so nothing
 * leaks into or out of the surrounding app.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props. Assembling on the client keeps the content one plain import.
 */
export function NorthgateTemplate({ page }: { page?: string }) {
  // An unknown or absent page falls back to home rather than rendering nothing:
  // a bad link should still show the company. Matching against the declared
  // list narrows the incoming string without a cast.
  const current: NorthgatePageId = NORTHGATE_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="northgate" className="min-h-screen antialiased">
      {/* Keyboard users land on the nav on every page switch, so the first stop
          is a way past it. Visible only when focused. */}
      <a
        href="#top"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-[var(--ngp-ink)] focus:px-5 focus:py-3 focus:text-[13px] focus:text-[var(--ngp-bg)]"
      >
        {NORTHGATE_LABELS.skipToContent}
      </a>

      <NorthgateHeader content={NORTHGATE_CONTENT} page={current} />

      {/* `key` on main so switching pages remounts the sections: their reveals
          are `once`, and a stale in-view state would leave content faded out. */}
      <main key={current} id="top">
        {current === 'products' && <NorthgateProductsPage content={NORTHGATE_CONTENT} />}
        {current === 'developers' && <NorthgateDevelopersPage />}
        {current === 'pricing' && <NorthgatePricingPage content={NORTHGATE_CONTENT} />}
        {current === 'contact' && <NorthgateContactPage content={NORTHGATE_CONTENT} />}
        {current === 'home' && <NorthgateHomePage content={NORTHGATE_CONTENT} />}
      </main>

      <NorthgateFooter content={NORTHGATE_CONTENT} />
    </div>
  );
}
