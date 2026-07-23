'use client';

import { toTavolaPage, type TavolaPageId } from '@/data/templates/tavola-kitchen-content';
import { TavolaBlogPage } from './tavola-blog-page';
import { TavolaCartPage } from './tavola-cart-page';
import { TavolaContactPage } from './tavola-contact-page';
import { TavolaFooter } from './tavola-footer';
import { TavolaHeader } from './tavola-header';
import { TavolaHomePage } from './tavola-home-page';
import { TavolaMenuPage } from './tavola-menu-page';
import { TavolaServicesPage } from './tavola-services-page';
import { TavolaSettingsProvider, useTavolaSettings } from './tavola-settings';
import { useTavolaCart } from './tavola-use-cart';
import './tavola.css';

/**
 * TAVOLA - the assembled restaurant.
 *
 * `data-template` scopes the palette and every ornament (tavola.css), so the
 * template renders identically wherever it is mounted: the preview route, a
 * card thumbnail, or the visitor's own project after download.
 *
 * A Client Component because the content module carries Lucide icon components,
 * which cannot cross a server/client boundary as props, and because the basket,
 * the currency and the language are React state.
 *
 * MULTIPAGE, WITHOUT A ROUTER
 * `page` is the `?page=` query value, resolved upstream by whatever renders
 * this. Every internal link is a plain `<a href="?page=…">`, so the same markup
 * navigates correctly inside a Next route, inside an iframe and inside a
 * downloaded Vite project, none of which share a routing library.
 */
export function TavolaTemplate({ page }: { page?: string }) {
  return (
    /*
     * Currency and language sit above the header and every page: switching
     * currency has to move the price on a dish card, in the basket and in the
     * hero at the same instant.
     */
    <TavolaSettingsProvider>
      {/* Spread rather than `page={page}`: `exactOptionalPropertyTypes` rejects
          handing an optional prop an explicit undefined. */}
      <TavolaKitchen {...(page !== undefined && { page })} />
    </TavolaSettingsProvider>
  );
}

function TavolaKitchen({ page }: { page?: string }) {
  const current: TavolaPageId = toTavolaPage(page);
  const cart = useTavolaCart();
  /*
   * Content comes from the active locale bundle, never from the English module
   * directly - the header and footer are where a stale import would be most
   * obvious, because the nav would stay in English around a Japanese page.
   */
  const { data } = useTavolaSettings();

  return (
    <div data-template="tavola" className="min-h-screen antialiased">
      <TavolaHeader
        content={data.content}
        copy={data.copy}
        page={current}
        cartCount={cart.count}
      />

      <main>
        {current === 'home' && <TavolaHomePage cart={cart} />}
        {current === 'menu' && <TavolaMenuPage cart={cart} />}
        {current === 'services' && <TavolaServicesPage />}
        {current === 'blog' && <TavolaBlogPage />}
        {current === 'contact' && <TavolaContactPage />}
        {current === 'cart' && <TavolaCartPage cart={cart} />}
      </main>

      <TavolaFooter content={data.content} />
    </div>
  );
}
