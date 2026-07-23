import type { LucideIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Card, CardContent } from 'adysre';
import { getNavItem } from '@/config/navigation';

interface ComingSoonProps {
  /** Look the copy up from NAV_ITEMS - use for sidebar modules. */
  href?: string;
  /** Or pass keys under the `pages` namespace - for non-sidebar pages. */
  titleKey?: string;
  descriptionKey?: string;
  icon?: LucideIcon;
}

/**
 * Shared placeholder for pages that are scaffolded but not built yet.
 *
 * Sidebar modules pass `href` so the copy comes from NAV_ITEMS and can't drift
 * from the menu. Pages reached only from the profile menu (legal, docs,
 * contact) aren't in NAV_ITEMS, so they pass `pages.*` keys directly.
 * Server Component (Server Components first - CODING_STANDARDS.md).
 */
export async function ComingSoon({ href, titleKey, descriptionKey, icon }: ComingSoonProps) {
  const [tNav, tPages, tComing] = await Promise.all([
    getTranslations('nav'),
    getTranslations('pages'),
    getTranslations('comingSoon'),
  ]);

  const nav = href ? getNavItem(href) : undefined;

  const title = titleKey ? tPages(`${titleKey}.title`) : nav ? tNav(nav.key) : undefined;
  const description = descriptionKey
    ? tPages(`${descriptionKey}.description`)
    : nav?.descriptionKey
      ? tNav(`descriptions.${nav.descriptionKey}`)
      : undefined;
  const Icon = icon ?? nav?.icon;

  if (!title || !Icon) {
    throw new Error(
      `ComingSoon: pass titleKey + icon, or an href with a NAV_ITEMS entry (got href="${href}").`,
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h1>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center sm:py-16">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary"
            aria-hidden
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-medium">{tComing('heading', { title })}</p>
            <p className="mx-auto max-w-sm text-sm text-muted-foreground">{tComing('body')}</p>
          </div>
          <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground">
            {(await getTranslations('common'))('inDevelopment')}
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
