/**
 * Components Platform - public entry point.
 *
 * ─── Adding a component ─────────────────────────────────────────────────────
 * Append an entry to its category file (e.g. `./buttons.ts`). The index page,
 * search, filters and detail route pick it up automatically. TypeScript rejects
 * an unknown category, framework or difficulty, so a typo fails the build
 * rather than producing an entry no filter can reach.
 *
 * ─── Adding a category ──────────────────────────────────────────────────────
 * 1. Add it to COMPONENT_CATEGORIES in `./types.ts` (with its target count).
 * 2. Create `./<category>.ts` exporting `<name>Components: ComponentEntry[]`.
 * 3. Import and spread it into COMPONENTS below.
 * 4. Add `components.categories.<id>` to all four message catalogues.
 *
 * The rest of the app imports only from `@/data/components`.
 */

import type { ComponentEntry } from './types';
import type { ComponentContent, ComponentContentMap } from './content/types';

import { buttonComponents } from './buttons';
import { cardComponents } from './cards';
import { faqComponents } from './faq';
import { loaderComponents } from './loaders';
import { animationComponents } from './animation';
import { navbarComponents } from './navbar';
import { footerComponents } from './footer';
import { heroComponents } from './hero';
import { marketingComponents } from './marketing';
import { tabsComponents } from './tabs';
import { carouselComponents } from './carousel';
import { formsTextComponents } from './forms-text';
import { formsSelectComponents } from './forms-select';
import { formsChoiceComponents } from './forms-choice';
import { servicesComponents } from './services';
import { aboutComponents } from './about';
import { modalsComponents } from './modals';
import { popoverComponents } from './popover';
import { dropdownsComponents } from './dropdowns';
import { notificationsComponents } from './notifications';
import { alertsComponents } from './alerts';
import { sidebarsComponents } from './sidebars';
import { docksComponents } from './docks';
import { fabComponents } from './fab';
import { comparisonsComponents } from './comparisons';
import { pricingComponents } from './pricing';
import { galleriesComponents } from './galleries';
import { paginationComponents } from './pagination';
import { resetPasswordComponents } from './reset-password';
import { changePasswordComponents } from './change-password';
import { checkoutComponents } from './checkout';
import { cartComponents } from './cart';
import { contactComponents } from './contact';
import { socialComponents } from './social';
import { bentoComponents } from './bento';
import { globesComponents } from './globes';
import { errorPagesComponents } from './error-pages';
import { teamComponents } from './team';
import { statsComponents } from './stats';
import { signUpComponents } from './sign-up';
import { signInComponents } from './sign-in';
import { ctaComponents } from './cta';
import { tablesComponents } from './tables';
import { tourComponents } from './tour';
import { togglesComponents } from './toggles';
import { searchBarsComponents } from './search-bars';
import { listsComponents } from './lists';
import { fileUploadsComponents } from './file-uploads';
import { colorPickersComponents } from './color-pickers';
import { tagsComponents } from './tags';
import { progressComponents } from './progress';
import { menusComponents } from './menus';
import { fileTreesComponents } from './file-trees';
import { timePickersComponents } from './time-pickers';
import { datePickersComponents } from './date-pickers';
import { tooltipsComponents } from './tooltips';
import { cursorsComponents } from './cursors';
import { calendarComponents } from './calendar';
import { steppersComponents } from './steppers';
import { mapsComponents } from './maps';
import { marqueesComponents } from './marquees';
import { timelineComponents } from './timeline';
import { testimonialsComponents } from './testimonials';
import { badgesComponents } from './badges';
import { avatarsComponents } from './avatars';
import { gradientsComponents } from './gradients';
import { blogComponents } from './blog';
import { imagesComponents } from './images';

export * from './types';

export const COMPONENTS: ComponentEntry[] = [
  ...buttonComponents,
  ...cardComponents,
  ...faqComponents,
  ...loaderComponents,
  ...animationComponents,
  ...navbarComponents,
  ...footerComponents,
  ...heroComponents,
  ...marketingComponents,
  ...tabsComponents,
  ...carouselComponents,
  ...formsTextComponents,
  ...formsSelectComponents,
  ...formsChoiceComponents,
  ...servicesComponents,
  ...aboutComponents,
  ...modalsComponents,
  ...popoverComponents,
  ...dropdownsComponents,
  ...notificationsComponents,
  ...alertsComponents,
  ...sidebarsComponents,
  ...docksComponents,
  ...fabComponents,
  ...comparisonsComponents,
  ...pricingComponents,
  ...galleriesComponents,
  ...paginationComponents,
  ...gradientsComponents,
  ...avatarsComponents,
  ...badgesComponents,

  ...testimonialsComponents,
  ...timelineComponents,
  ...marqueesComponents,
  ...mapsComponents,
  ...steppersComponents,
  ...calendarComponents,
  ...cursorsComponents,
  ...tooltipsComponents,
  ...datePickersComponents,
  ...timePickersComponents,
  ...fileTreesComponents,
  ...menusComponents,
  ...progressComponents,
  ...tagsComponents,
  ...colorPickersComponents,
  ...fileUploadsComponents,
  ...listsComponents,
  ...searchBarsComponents,
  ...togglesComponents,
  ...tourComponents,
  ...tablesComponents,
  ...ctaComponents,
  ...signInComponents,
  ...signUpComponents,
  ...statsComponents,
  ...teamComponents,
  ...errorPagesComponents,
  ...globesComponents,
  ...bentoComponents,
  ...socialComponents,
  ...contactComponents,
  ...cartComponents,
  ...checkoutComponents,
  ...changePasswordComponents,
  ...resetPasswordComponents,
  ...blogComponents,
  ...imagesComponents,
];

/**
 * Duplicate slugs would collide on the permalink and silently shadow an entry.
 * At 700 components across 25 files that is easy to miss in review, so fail
 * loudly in development.
 */
if (process.env.NODE_ENV !== 'production') {
  const seen = new Set<string>();
  const dupes = COMPONENTS.filter((c) => (seen.has(c.slug) ? true : (seen.add(c.slug), false)));
  if (dupes.length > 0) {
    throw new Error(
      `Duplicate component slugs in @/data/components: ${[...new Set(dupes.map((d) => d.slug))].join(', ')}`,
    );
  }
}

/** Every tag in use, deduped and sorted. */
export const ALL_COMPONENT_TAGS: string[] = [
  ...new Set(COMPONENTS.flatMap((c) => c.tags)),
].sort();

export function countComponentsByCategory(entries: ComponentEntry[]): Record<string, number> {
  return entries.reduce<Record<string, number>>((acc, c) => {
    acc[c.category] = (acc[c.category] ?? 0) + 1;
    return acc;
  }, {});
}

/** An entry resolved for a locale, with its prose swapped in. */
export interface LocalizedComponent extends ComponentEntry {
  title: string;
  description: string;
  customization?: string;
  seoTitle?: string;
  seoDescription?: string;
  keywords?: string[];
  /** True when no translation exists for this locale and English is showing. */
  untranslated: boolean;
}

/** English prose, loaded from the same per-locale shape for consistency. */
async function loadContent(locale: string): Promise<ComponentContentMap> {
  try {
    const mod = (await import(`./content/${locale}`)) as { default?: ComponentContentMap };
    return mod.default ?? {};
  } catch {
    return {};
  }
}

/**
 * Components with prose in `locale`, falling back to English per field.
 *
 * Call from a Server Component: the import is dynamic, so a visitor downloads
 * only their own language's copy rather than all four.
 */
export async function getComponents(locale: string): Promise<LocalizedComponent[]> {
  const [en, translated] = await Promise.all([
    loadContent('en'),
    locale === 'en' ? Promise.resolve<ComponentContentMap>({}) : loadContent(locale),
  ]);

  return COMPONENTS.map((entry) => {
    const base = en[entry.slug] ?? {};
    const t = translated[entry.slug];
    // English is the source of truth; the locale layers over it per field.
    const pick = <K extends keyof ComponentContent>(key: K): ComponentContent[K] =>
      t?.[key] ?? base[key];

    const customization = pick('customization');
    const seoTitle = pick('seoTitle');
    const seoDescription = pick('seoDescription');
    const keywords = pick('keywords');

    return {
      ...entry,
      title: pick('title') ?? entry.slug,
      description: pick('description') ?? '',
      // Spread-if-defined rather than assigning undefined: the repo runs
      // `exactOptionalPropertyTypes`, so `customization?: string` and
      // `customization: undefined` are different types.
      ...(customization !== undefined && { customization }),
      ...(seoTitle !== undefined && { seoTitle }),
      ...(seoDescription !== undefined && { seoDescription }),
      ...(keywords !== undefined && { keywords }),
      untranslated: locale !== 'en' && t?.description === undefined,
    };
  });
}

export async function getComponent(
  locale: string,
  slug: string,
): Promise<LocalizedComponent | undefined> {
  const all = await getComponents(locale);
  return all.find((c) => c.slug === slug);
}

/** Up to `limit` components sharing this one's category, for Related. */
export function relatedComponents(
  all: LocalizedComponent[],
  current: LocalizedComponent,
  limit = 6,
): LocalizedComponent[] {
  const sameCategory = all.filter((c) => c.slug !== current.slug && c.category === current.category);
  if (sameCategory.length >= limit) return sameCategory.slice(0, limit);
  // Top up with tag overlap so a thin category still shows a full row.
  const byTag = all.filter(
    (c) =>
      c.slug !== current.slug &&
      c.category !== current.category &&
      c.tags.some((t) => current.tags.includes(t)),
  );
  return [...sameCategory, ...byTag].slice(0, limit);
}
