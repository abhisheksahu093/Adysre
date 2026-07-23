/**
 * `adysre/icons` - 448 original 24x24 line icons.
 *
 * Three ways in, in the order you should reach for them:
 *
 *   import { ArrowUpRight } from 'adysre/icons';   // tree-shaken, preferred
 *   import { Icon } from 'adysre/icons';           // <Icon name={fromCms} />
 *   import { ICONS, getIcon } from 'adysre/icons'; // build your own picker
 *
 * Every icon is an original drawing authored for this project - no third-party
 * icon set is copied - and every one inherits `currentColor`, so colour comes
 * from CSS rather than a prop unless you want it to.
 */

export type { IconProps } from './types.ts';
export { Icon, type DynamicIconProps } from './icon.tsx';

// The catalogue: metadata for pickers, search and docs.
export {
  ICONS,
  ICON_CATEGORIES,
  ICON_CATEGORY_IDS,
  ICON_COUNT,
  getIcon,
  similarIcons,
  type Icon as IconMeta,
  type IconCategoryId,
  type RawIcon,
} from './catalog.ts';

// Builders, for anyone generating their own exports (SVG file, data URI, CSS mask).
export {
  DEFAULT_ICON_STYLE,
  ICON_COPY_FORMATS,
  ICON_SIZES,
  buildCssRule,
  buildDataUri,
  buildJsxSnippet,
  buildReactComponent,
  buildSvgMarkup,
  formatIcon,
  humanize,
  pascalCase,
  slugify,
  toJsxAttrs,
  type IconCopyFormat,
  type IconCopyFormatId,
  type IconStyle,
} from './svg.ts';

// The 448 generated components.
export * from './generated/index.ts';
