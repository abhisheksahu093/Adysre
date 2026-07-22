'use client';

import { MERIDIAN_CONTENT, MERIDIAN_PAGES, type MeridianPageId } from '@/data/templates/meridian-law-content';
import { MeridianFooter } from './meridian-footer';
import { MeridianHeader } from './meridian-header';
import {
  MeridianContactPage,
  MeridianFirmPage,
  MeridianHomePage,
  MeridianPracticesPage,
} from './meridian-pages';
import './meridian.css';

/**
 * MERIDIAN - the assembled site.
 *
 * Unlike the single-page templates, MERIDIAN is four pages, and it routes them
 * itself: the host passes `page` (from `?page=` in the preview route, from a
 * segment in a downloaded project), the header links back with the same query,
 * and this component picks the composition. Doing the switch here rather than
 * with a router is what lets the template render in any host - a preview iframe,
 * a card thumbnail, or the visitor's own app - without a routing dependency.
 *
 * `data-template` scopes the palette and type stack (meridian.css) so nothing
 * leaks into or out of the surrounding app.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props. Assembling on the client keeps the content one plain import.
 */
export function MeridianTemplate({ page }: { page?: string }) {
  // An unknown or absent page falls back to home rather than rendering nothing:
  // a bad link should still show the firm. Matching against the declared list
  // narrows the incoming string without a cast.
  const current: MeridianPageId = MERIDIAN_PAGES.find((id) => id === page) ?? 'home';

  return (
    <div data-template="meridian" className="min-h-screen antialiased">
      <MeridianHeader content={MERIDIAN_CONTENT} page={current} />

      {/* `key` on main so switching pages remounts the sections: their reveals
          are `once`, and a stale in-view state would leave content faded out. */}
      <main key={current} id="top">
        {current === 'about' && <MeridianFirmPage content={MERIDIAN_CONTENT} />}
        {current === 'practices' && <MeridianPracticesPage content={MERIDIAN_CONTENT} />}
        {current === 'contact' && <MeridianContactPage content={MERIDIAN_CONTENT} />}
        {current === 'home' && <MeridianHomePage content={MERIDIAN_CONTENT} />}
      </main>

      <MeridianFooter content={MERIDIAN_CONTENT} />
    </div>
  );
}
