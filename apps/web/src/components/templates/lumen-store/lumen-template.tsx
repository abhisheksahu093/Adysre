'use client';

import {
  LUMEN_CONTENT,
  LUMEN_SHOP,
  toLumenPage,
  type LumenPageId,
} from '@/data/templates/lumen-store-content';
import { LumenCartPage } from './lumen-cart-page';
import { LumenCheckoutPage } from './lumen-checkout-page';
import { LumenFooter } from './lumen-footer';
import { LumenHeader } from './lumen-header';
import { LumenHomePage } from './lumen-home-page';
import { LumenLoginPage } from './lumen-login-page';
import { LumenProductPage } from './lumen-product-page';
import { LumenShopPage } from './lumen-shop-page';
import { LumenSignupPage } from './lumen-signup-page';
import { useLumenCart } from './lumen-use-cart';
import './lumen.css';

/**
 * LUMEN - the assembled store.
 *
 * `data-template` scopes the palette and type (lumen.css), so the template
 * renders identically wherever it is mounted: the preview route, a card
 * thumbnail, or the visitor's own project after download.
 *
 * A Client Component for the same reason NOVA and SAFFRON are - the content
 * module carries Lucide icon components, which cannot cross a server/client
 * boundary as props - and additionally because the basket is React state.
 *
 * MULTIPAGE, WITHOUT A ROUTER
 * `page` is the `?page=` query value, resolved upstream by whatever renders this
 * (the preview route reads `searchParams`). Every internal link in the store is
 * a plain `<a href="?page=…">`, so the same markup navigates correctly inside a
 * Next route, inside an iframe and inside a downloaded Vite project, none of
 * which share a routing library. An unknown or missing value falls back to the
 * home page rather than rendering nothing.
 */
export function LumenTemplate({ page }: { page?: string }) {
  const current: LumenPageId = toLumenPage(page);
  const cart = useLumenCart();

  return (
    <div data-template="lumen" className="min-h-screen antialiased">
      <LumenHeader
        content={LUMEN_CONTENT}
        shop={LUMEN_SHOP}
        page={current}
        cartCount={cart.count}
      />

      <main>
        {current === 'home' && <LumenHomePage content={LUMEN_CONTENT} />}
        {current === 'shop' && <LumenShopPage />}
        {current === 'product' && <LumenProductPage cart={cart} />}
        {current === 'cart' && <LumenCartPage cart={cart} />}
        {current === 'checkout' && <LumenCheckoutPage cart={cart} />}
        {current === 'login' && <LumenLoginPage />}
        {current === 'signup' && <LumenSignupPage />}
      </main>

      <LumenFooter content={LUMEN_CONTENT} shop={LUMEN_SHOP} />
    </div>
  );
}
