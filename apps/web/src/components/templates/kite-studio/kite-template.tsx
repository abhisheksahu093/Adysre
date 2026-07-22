'use client';

import { KITE_CONTENT, KITE_PAGES, type KitePageId } from '@/data/templates/kite-studio-content';
import { KiteContactPage } from './kite-contact-page';
import { KiteFooter } from './kite-footer';
import { KiteHeader } from './kite-header';
import { KiteHomePage } from './kite-home-page';
import { KiteServicesPage } from './kite-services-page';
import { KiteStudioPage } from './kite-studio-page';
import { KiteWorkPage } from './kite-work-page';
import './kite.css';

/**
 * KITE - the assembled site.
 *
 * MULTIPAGE. `page` is the id the host route read out of `?page=`, and the
 * header's links write that same query string back, so the whole site navigates
 * with plain anchors: no router, no link component, and identical behaviour in
 * the preview route and in a downloaded copy.
 *
 * `data-template` scopes the palette (kite.css), so the template renders the
 * same wherever it is mounted and leaks no colour into the app around it.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props. Assembling on the client keeps the content one plain import.
 */
function resolvePage(page: string | undefined): KitePageId {
  // An unknown or missing id lands on the home page rather than 404ing: the
  // query string is user-editable and a template has no error route.
  const match = KITE_PAGES.find((id) => id === page);
  return match ?? 'home';
}

export function KiteTemplate({ page }: { page?: string }) {
  const current = resolvePage(page);

  return (
    <div data-template="kite" className="min-h-screen antialiased">
      <KiteHeader content={KITE_CONTENT} page={current} />

      <main id="kite-main">
        {current === 'work' && <KiteWorkPage content={KITE_CONTENT} />}
        {current === 'services' && <KiteServicesPage content={KITE_CONTENT} />}
        {current === 'studio' && <KiteStudioPage content={KITE_CONTENT} />}
        {current === 'contact' && <KiteContactPage content={KITE_CONTENT} />}
        {current === 'home' && <KiteHomePage content={KITE_CONTENT} />}
      </main>

      <KiteFooter content={KITE_CONTENT} />
    </div>
  );
}
