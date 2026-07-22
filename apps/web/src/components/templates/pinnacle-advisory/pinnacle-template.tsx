'use client';

import {
  PINNACLE_CONTENT,
  PINNACLE_LABELS,
  PINNACLE_PAGES,
  type PinnaclePageId,
} from '@/data/templates/pinnacle-advisory-content';
import { PinnacleFooter } from './pinnacle-footer';
import { PinnacleHeader } from './pinnacle-header';
import {
  PinnacleContactPage,
  PinnacleExpertisePage,
  PinnacleHomePage,
  PinnacleInsightsPage,
  PinnacleTeamPage,
} from './pinnacle-pages';
import './pinnacle.css';

/**
 * PINNACLE - the assembled site.
 *
 * Unlike the single-page templates, PINNACLE is five pages and it routes them
 * itself: the host passes `page` (from `?page=` in the preview route, from a
 * segment in a downloaded project), the header links back with the same query,
 * and this component picks the composition. Doing the switch here rather than
 * with a router is what lets the template render in any host - a preview iframe,
 * a card thumbnail, or the visitor's own app - with no routing dependency.
 *
 * `data-template="pinnacle"` scopes the palette, the type scale and the motion
 * curve (pinnacle.css) so nothing leaks into or out of the surrounding app.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props. Assembling on the client keeps the content one plain import.
 */
export function PinnacleTemplate({ page }: { page?: string }) {
  // An unknown or absent page falls back to home rather than rendering nothing:
  // a bad link should still show the firm. Matching against the declared list
  // narrows the incoming string without a cast.
  const current: PinnaclePageId = PINNACLE_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="pinnacle" className="min-h-screen antialiased">
      {/* The header is sticky and the pages are long, so a keyboard user needs a
          way past the navigation. Visible only when focused. */}
      <a
        href="#pinnacle-main"
        className="pin-btn pin-btn-primary sr-only focus:not-sr-only focus:inline-flex focus:absolute focus:top-6 focus:left-6 focus:z-[60]"
      >
        {PINNACLE_LABELS.skipToContent}
      </a>

      <PinnacleHeader content={PINNACLE_CONTENT} page={current} />

      {/* `key` on main so switching pages remounts the sections: their reveals
          are `once`, and a stale in-view state would leave content faded out. */}
      <main key={current} id="pinnacle-main">
        {current === 'expertise' && <PinnacleExpertisePage content={PINNACLE_CONTENT} />}
        {current === 'insights' && <PinnacleInsightsPage />}
        {current === 'team' && <PinnacleTeamPage content={PINNACLE_CONTENT} />}
        {current === 'contact' && <PinnacleContactPage content={PINNACLE_CONTENT} />}
        {current === 'home' && <PinnacleHomePage content={PINNACLE_CONTENT} />}
      </main>

      <PinnacleFooter content={PINNACLE_CONTENT} />
    </div>
  );
}
