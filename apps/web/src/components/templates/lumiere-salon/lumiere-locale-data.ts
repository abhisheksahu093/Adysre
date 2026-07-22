import {
  LUMIERE_CONTENT,
  LUMIERE_PRODUCTS,
  LUMIERE_PRODUCT_CATEGORIES,
  LUMIERE_SALON,
  LUMIERE_SERVICE_CATEGORIES,
  LUMIERE_STYLISTS,
  type LumiereProduct,
  type LumiereProductCategory,
  type LumiereSalonCopy,
  type LumiereServiceCategory,
  type LumiereStylist,
} from '@/data/templates/lumiere-salon-content';
import {
  LUMIERE_CONTENT_JA,
  LUMIERE_PRODUCTS_JA,
  LUMIERE_PRODUCT_CATEGORIES_JA,
  LUMIERE_SALON_JA,
  LUMIERE_SERVICE_CATEGORIES_JA,
  LUMIERE_STYLISTS_JA,
} from '@/data/templates/lumiere-salon-content-ja';
import type { TemplateContent } from '@/data/templates/types';
import type { LumiereLocaleId } from './lumiere-settings';

/**
 * LUMIERE - everything the salon renders, per language.
 *
 * The whole catalogue is localised, not just the chrome: a visitor reading in
 * Japanese should see 「シグネチャーカット」 on the treatment, in the menu and in
 * the basket, not an English name inside a Japanese page.
 *
 * The two bundles are structurally identical BY CONTRACT - same ids, same
 * hrefs, same prices, same array order - because ids drive filtering and
 * `?page=` routing. Only human-readable text differs. `lumiere-locale-data.test`
 * asserts that parity, since a drifted id would break the shop filter silently
 * and only in one language.
 */
export interface LumiereBundle {
  content: TemplateContent;
  salon: LumiereSalonCopy;
  serviceCategories: LumiereServiceCategory[];
  productCategories: LumiereProductCategory[];
  products: LumiereProduct[];
  stylists: LumiereStylist[];
}

export const LUMIERE_BUNDLES: Record<LumiereLocaleId, LumiereBundle> = {
  en: {
    content: LUMIERE_CONTENT,
    salon: LUMIERE_SALON,
    serviceCategories: LUMIERE_SERVICE_CATEGORIES,
    productCategories: LUMIERE_PRODUCT_CATEGORIES,
    products: LUMIERE_PRODUCTS,
    stylists: LUMIERE_STYLISTS,
  },
  ja: {
    content: LUMIERE_CONTENT_JA,
    salon: LUMIERE_SALON_JA,
    serviceCategories: LUMIERE_SERVICE_CATEGORIES_JA,
    productCategories: LUMIERE_PRODUCT_CATEGORIES_JA,
    products: LUMIERE_PRODUCTS_JA,
    stylists: LUMIERE_STYLISTS_JA,
  },
};
