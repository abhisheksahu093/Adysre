import {
  CreditCard,
  Headphones,
  FileText,
  Globe,
  Scale,
  Mail,
  LifeBuoy,
  BookOpen,
  Code2,
  ScrollText,
  ShieldCheck,
  Copyright,
  type LucideIcon,
} from 'lucide-react';
import { SUPPORT_MAILTO } from './site';

/**
 * Profile menu - the single source of truth for the topbar avatar dropdown.
 *
 * `key` is a translation key under the `userMenu` namespace, not display text.
 * Reorder or nest by editing this list; the component renders what it finds.
 * One level of nesting is supported, which is all the design calls for.
 */
export interface UserMenuItem {
  id: string;
  /** Key under `userMenu`, e.g. 'profileBilling' → userMenu.profileBilling. */
  key: string;
  icon: LucideIcon;
  /** Internal route, or an absolute/mailto URL when `external` is set. */
  href?: string;
  external?: boolean;
  items?: UserMenuItem[];
}

export const USER_MENU_ITEMS: UserMenuItem[] = [
  {
    id: 'profile-billing',
    key: 'profileBilling',
    icon: CreditCard,
    href: '/profile',
  },
  {
    id: 'contact',
    key: 'contactUs',
    icon: Headphones,
    items: [
      { id: 'contact-email', key: 'emailSupport', icon: Mail, href: SUPPORT_MAILTO, external: true },
      { id: 'contact-help', key: 'helpCentre', icon: LifeBuoy, href: '/contact' },
    ],
  },
  {
    id: 'document',
    key: 'document',
    icon: FileText,
    items: [
      { id: 'docs-start', key: 'gettingStarted', icon: BookOpen, href: '/docs' },
      { id: 'docs-api', key: 'apiReference', icon: Code2, href: '/docs/api' },
    ],
  },
  {
    id: 'language',
    key: 'language',
    icon: Globe,
    // Rendered by a dedicated submenu driven by `routing.locales`.
  },
  {
    id: 'legal',
    key: 'legal',
    icon: Scale,
    items: [
      { id: 'legal-terms', key: 'terms', icon: ScrollText, href: '/legal/terms' },
      { id: 'legal-privacy', key: 'privacy', icon: ShieldCheck, href: '/legal/privacy' },
      { id: 'legal-dmca', key: 'dmca', icon: Copyright, href: '/legal/dmca' },
    ],
  },
];
