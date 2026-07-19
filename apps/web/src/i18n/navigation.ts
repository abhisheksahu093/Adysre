import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Locale-aware navigation.
 *
 * Import Link/useRouter/redirect from HERE, not from `next/navigation` - these
 * wrappers add the active locale prefix. A plain `next/link` would drop a
 * Japanese user back onto the English route on every click.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
