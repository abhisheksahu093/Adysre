/**
 * Icon catalogue — now published in `adysre/icons`.
 *
 * See `@/lib/palettes/color` for why this is an alias rather than a copy.
 *
 * One rename to note: the package exports `Icon` as the *component* and
 * `IconMeta` as the metadata record. This app has always called the record
 * `Icon`, so the alias is restored here rather than touching ~7 call sites.
 */

export {
  ICONS,
  ICON_CATEGORIES,
  ICON_CATEGORY_IDS,
  ICON_COUNT,
  getIcon,
  similarIcons,
  type IconCategoryId,
  type IconMeta as Icon,
  type RawIcon,
} from 'adysre/icons';
