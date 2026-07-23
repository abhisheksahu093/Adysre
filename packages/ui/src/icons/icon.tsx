/**
 * `<Icon name="arrow-up-right" />` - look an icon up by name at runtime.
 *
 * ─── When to use this instead of the named component ────────────────────────
 * Importing `{ ArrowUpRight }` lets the bundler drop the other 447 icons, and is
 * what you want in hand-written JSX. Reach for `<Icon>` only when the name is
 * data (a CMS field, a config file, a user choice) and therefore not knowable at
 * build time - it pulls the whole catalogue into the chunk that imports it.
 *
 * The body is injected as markup because icon bodies are authored in this repo
 * and sanitised to a strict element whitelist by the generator - they are never
 * user input. Do not extend this to render arbitrary strings.
 */

import type { IconProps } from './types.ts';
import { getIcon } from './catalog.ts';

export interface DynamicIconProps extends IconProps {
  /** Catalogue name, e.g. `arrow-up-right`. Unknown names render nothing. */
  name: string;
}

export function Icon({
  name,
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.5,
  ...props
}: DynamicIconProps) {
  const icon = getIcon(name);
  if (!icon) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={props['aria-label'] ? undefined : true}
      {...props}
      dangerouslySetInnerHTML={{ __html: icon.body }}
    />
  );
}
