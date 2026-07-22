'use client';

import { VANTA_CONTENT, VANTA_PAGES, type VantaPageId } from '@/data/templates/vanta-markets-content';
import { VantaContactPage } from './vanta-contact-page';
import { VantaFooter } from './vanta-footer';
import { VantaHeader } from './vanta-header';
import { VantaHomePage } from './vanta-home-page';
import { VantaMarketsPage } from './vanta-markets-page';
import { VantaPlatformPage } from './vanta-platform-page';
import { VantaPricingPage } from './vanta-pricing-page';
import { VantaTicker } from './vanta-ticker';
import './vanta.css';

/**
 * VANTA - the assembled site.
 *
 * A five-page trading platform. `page` is the id the host route read out of
 * `?page=`, and the header's links write that same query string back, so the
 * whole site navigates with plain anchors: no router, no link component, and
 * identical behaviour in the preview route and in a downloaded copy.
 *
 * `data-template` scopes the palette and every CSS-drawn chart (vanta.css), so
 * the template renders the same wherever it is mounted.
 *
 * A Client Component, and it has to be: the content module carries Lucide icon
 * components, which are functions and cannot cross a server/client boundary as
 * props. Assembling on the client keeps the content one plain import.
 */
function resolvePage(page: string | undefined): VantaPageId {
  // An unknown or missing id lands on the home page rather than 404ing: the
  // query string is user-editable and a template has no error route.
  const match = VANTA_PAGES.find((id) => id === page);
  return match ?? 'home';
}

export function VantaTemplate({ page }: { page?: string }) {
  const current = resolvePage(page);

  return (
    <div data-template="vanta" className="min-h-screen antialiased">
      <VantaHeader content={VANTA_CONTENT} page={current} />
      {/* The quote strip is chrome, not a section: it sits on all five pages. */}
      <VantaTicker />

      <main id="vanta-main">
        {current === 'markets' && <VantaMarketsPage content={VANTA_CONTENT} />}
        {current === 'platform' && <VantaPlatformPage content={VANTA_CONTENT} />}
        {current === 'pricing' && <VantaPricingPage content={VANTA_CONTENT} />}
        {current === 'contact' && <VantaContactPage content={VANTA_CONTENT} />}
        {current === 'home' && <VantaHomePage content={VANTA_CONTENT} />}
      </main>

      <VantaFooter content={VANTA_CONTENT} />
    </div>
  );
}
