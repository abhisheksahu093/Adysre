'use client';

import { toLumierePage, type LumierePageId } from '@/data/templates/lumiere-salon-content';
import { LumiereBookingPage } from './lumiere-booking-page';
import { LumiereCartPage } from './lumiere-cart-page';
import { LumiereContactPage } from './lumiere-contact-page';
import { LumiereFooter } from './lumiere-footer';
import { LumiereHeader } from './lumiere-header';
import { LumiereHomePage } from './lumiere-home-page';
import { LumiereProductPage } from './lumiere-product-page';
import { LumiereServicesPage } from './lumiere-services-page';
import { LumiereSettingsProvider, useLumiereSettings } from './lumiere-settings';
import { LumiereShopPage } from './lumiere-shop-page';
import { useLumiereCart } from './lumiere-use-cart';
import './lumiere.css';

/**
 * LUMIERE - the assembled salon.
 *
 * `data-template` scopes the palette, the type and every ornament (lumiere.css),
 * so the template renders identically wherever it is mounted: the preview route,
 * a card thumbnail, or the visitor's own project after download.
 *
 * A Client Component for the same reason NOVA and LUMEN are - the content module
 * carries Lucide icon components, which cannot cross a server/client boundary as
 * props - and additionally because the retail basket is React state.
 *
 * MULTIPAGE, WITHOUT A ROUTER
 * `page` is the `?page=` query value, resolved upstream by whatever renders this
 * (the preview route reads `searchParams`). Every internal link in the salon is a
 * plain `<a href="?page=…">`, so the same markup navigates correctly inside a
 * Next route, inside an iframe and inside a downloaded Vite project, none of
 * which share a routing library. An unknown or missing value falls back to the
 * home page rather than rendering nothing.
 */
export function LumiereTemplate({ page }: { page?: string }) {
  return (
    /*
     * Currency and language are shared state, so they live above the header and
     * every page: switching currency has to move the price on a product card,
     * in the basket and in the treatments menu at the same instant.
     */
    <LumiereSettingsProvider>
      {/* Spread rather than pass `page={page}`: `exactOptionalPropertyTypes`
          rejects handing an optional prop an explicit undefined. */}
      <LumiereSalon {...(page !== undefined && { page })} />
    </LumiereSettingsProvider>
  );
}

function LumiereSalon({ page }: { page?: string }) {
  const current: LumierePageId = toLumierePage(page);
  const cart = useLumiereCart();
  /*
   * Content comes from the active locale bundle, never from the English module
   * directly - the header and footer are the two places a stale import would be
   * most obvious, because the nav would stay in English around a Japanese page.
   */
  const { data } = useLumiereSettings();

  return (
    <div data-template="lumiere" className="min-h-screen antialiased">
      <LumiereHeader
        content={data.content}
        salon={data.salon}
        page={current}
        cartCount={cart.count}
      />

      <main>
        {current === 'home' && <LumiereHomePage content={data.content} />}
        {current === 'services' && <LumiereServicesPage />}
        {current === 'shop' && <LumiereShopPage />}
        {current === 'product' && <LumiereProductPage cart={cart} />}
        {current === 'cart' && <LumiereCartPage cart={cart} />}
        {current === 'booking' && <LumiereBookingPage />}
        {current === 'contact' && <LumiereContactPage content={data.content} />}
      </main>

      <LumiereFooter content={data.content} salon={data.salon} />
    </div>
  );
}
