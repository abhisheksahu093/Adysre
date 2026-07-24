'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { Tooltip, cn } from 'adysre';
import { Link, usePathname } from '@/i18n/navigation';
import { NAV_ITEMS } from '@/config/navigation';
import { NAV_SUBMENUS, type LabelMode, type ModuleSubmenu } from '@/config/nav-submenus';
import { humanizeKey } from '@/lib/humanize';
import { Logo } from './logo';

/** Brand mark - shared by the desktop sidebar and the mobile drawer. */
export function SidebarBrand() {
  const t = useTranslations('nav');
  return (
    // h-14 must match the topbar's height - they sit side by side and their
    // bottom borders read as one continuous line. px-4 rather than px-5 buys
    // the wordmark room without crowding the 16rem rail.
    <div className="flex h-14 shrink-0 items-center border-b border-border px-4">
      {/* The wordmark links home to the public landing page - the expected
          affordance for a logo. It already reads "ADYSRE", so an aria-label
          names the destination rather than repeating the brand. */}
      <Link
        href="/"
        aria-label={t('backToHome')}
        className="rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Logo height={34} priority />
      </Link>
    </div>
  );
}

/**
 * Sidebar navigation, rendered from NAV_ITEMS.
 *
 * Every list here - modules, submenu groups and the filters inside them - is
 * ordered alphabetically by the label the user actually reads, not by the order
 * the config happens to declare. The sort therefore happens at RENDER time,
 * against the translated string and the active locale's collation, so a Japanese
 * or Hindi sidebar is alphabetical in its own alphabet rather than in English's.
 * `NAV_ITEMS` stays in declaration order because `APP_HOME` (and the marketing
 * links that point at it) is defined as its first entry.
 *
 * Modules that expose a submenu (components, icons, gradients,
 * palettes) render as expandable dropdowns whose items are the categories/tags
 * that used to sit as filter chips on the page. Each item links to the module
 * with a `?category=` / `?tag=` query the page reads, so choosing a filter is a
 * navigation and stays shareable.
 *
 * `useSearchParams` (for the active-item highlight) suspends on statically
 * rendered routes, so it lives behind a Suspense boundary; the fallback renders
 * the same tree with no active-item highlight until hydration.
 */
export function SidebarNav({
  onNavigate = () => {},
  collapsed = false,
}: {
  onNavigate?: () => void;
  /** Icon-rail mode. Never set by the mobile drawer, which always has room. */
  collapsed?: boolean;
}) {
  return (
    <Suspense
      fallback={
        <SidebarNavInner onNavigate={onNavigate} activeValue={null} collapsed={collapsed} />
      }
    >
      <SidebarNavWithParams onNavigate={onNavigate} collapsed={collapsed} />
    </Suspense>
  );
}

/** Reads the active filter value off the URL and hands it to the renderer. */
function SidebarNavWithParams({
  onNavigate,
  collapsed,
}: {
  onNavigate: () => void;
  collapsed: boolean;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // The value filtering the module the user is currently on (if any).
  const activeModule = Object.values(NAV_SUBMENUS).find(
    (m) => pathname === m.href || pathname.startsWith(`${m.href}/`),
  );
  const activeValue = activeModule ? searchParams.get(activeModule.param) : null;

  return (
    <SidebarNavInner onNavigate={onNavigate} activeValue={activeValue} collapsed={collapsed} />
  );
}

function SidebarNavInner({
  onNavigate,
  activeValue,
  collapsed,
}: {
  onNavigate: () => void;
  activeValue: string | null;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tComponents = useTranslations('components');
  const tIcons = useTranslations('icons');

  // One collator for the whole tree: `localeCompare` rebuilds the collation
  // table on every call, and the submenus sort a few hundred labels between
  // them. `numeric` so "Heading 2" sorts before "Heading 10".
  const collator = useMemo(
    () => new Intl.Collator(locale, { sensitivity: 'base', numeric: true }),
    [locale],
  );

  // The module whose page we're on (drives which submenu auto-opens).
  const activeModuleKey =
    NAV_ITEMS.find(
      (i) => NAV_SUBMENUS[i.key] && (pathname === i.href || pathname.startsWith(`${i.href}/`)),
    )?.key ?? null;

  // Every submenu starts collapsed; the user opens what they want. (Only the
  // group holding an active category auto-opens, and only once its module is.)
  const [openModule, setOpenModule] = useState<string | null>(null);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    const submenu = activeModuleKey ? NAV_SUBMENUS[activeModuleKey] : undefined;
    if (submenu?.groups && activeValue) {
      const group = submenu.groups.find((g) => g.values.includes(activeValue));
      if (group) setOpenGroup(group.groupKey);
    }
  }, [activeModuleKey, activeValue]);

  /** Resolve a filter value to its sidebar label. */
  function resolveLabel(mode: LabelMode, value: string): string {
    if (mode === 'humanize') return humanizeKey(value);
    const translate = mode.ns === 'components' ? tComponents : tIcons;
    const key = `${mode.prefix}${value}`;
    return translate.has(key) ? translate(key) : humanizeKey(value);
  }

  /** Filter values, A-Z by the label they render as. Never mutates the config. */
  function sortedValues(mode: LabelMode, values: readonly string[]): string[] {
    return [...values].sort((a, b) =>
      collator.compare(resolveLabel(mode, a), resolveLabel(mode, b)),
    );
  }

  /** One filter link (a submenu leaf). */
  function Leaf({ submenu, value }: { submenu: ModuleSubmenu; value: string }) {
    const isActive = activeModuleKey === submenu.navKey && activeValue === value;
    return (
      <Link
        href={`${submenu.href}?${submenu.param}=${value}`}
        onClick={onNavigate}
        aria-current={isActive ? 'page' : undefined}
        className={cn(
          'block truncate rounded-md px-3 py-1.5 text-[13px] transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          isActive
            ? 'bg-primary/10 font-medium text-primary'
            : 'text-muted-foreground hover:bg-muted hover:text-foreground',
        )}
      >
        {resolveLabel(submenu.labelMode, value)}
      </Link>
    );
  }

  const items = [...NAV_ITEMS].sort((a, b) => collator.compare(t(a.key), t(b.key)));

  return (
    <nav
      aria-label={t('mainLabel')}
      className={cn('flex-1 space-y-1 overflow-y-auto', collapsed ? 'px-2 py-3' : 'p-3')}
    >
      {items.map((item) => {
        const { key, href, icon: Icon, comingSoon } = item;
        const submenu = NAV_SUBMENUS[key];
        const sortedGroups = submenu?.groups
          ? [...submenu.groups].sort((a, b) =>
              collator.compare(t(`groups.${a.groupKey}`), t(`groups.${b.groupKey}`)),
            )
          : undefined;
        // usePathname is locale-stripped, so it compares cleanly to hrefs.
        const active = pathname === href || pathname.startsWith(`${href}/`);

        // Collapsed, every item is the same thing: one icon that navigates.
        // A 4rem rail has no room for a label, a badge or an expanding submenu,
        // and a chevron that opens a panel with nowhere to draw it would be a
        // control that lies. The module page carries the same filters.
        if (collapsed) {
          return (
            // The label is the only thing naming this icon, so it is a real
            // tooltip rather than `title`: it appears at once, on focus as well
            // as hover, and escapes the rail's own scroll clipping.
            <Tooltip key={href} label={t(key)} side="right">
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-10 items-center justify-center rounded-md transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  active
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
                {/* The accessible name. The tooltip is aria-hidden decoration. */}
                <span className="sr-only">{t(key)}</span>
              </Link>
            </Tooltip>
          );
        }

        if (!submenu) {
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{t(key)}</span>
              {comingSoon && (
                <span className="ml-auto shrink-0 rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                  {tCommon('comingSoon')}
                </span>
              )}
            </Link>
          );
        }

        const expanded = openModule === key;
        return (
          <div key={href}>
            <div
              className={cn(
                'flex items-stretch gap-0.5 rounded-md transition-colors',
                active ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted',
              )}
            >
              <Link
                href={href}
                onClick={onNavigate}
                aria-current={active && !activeValue ? 'page' : undefined}
                className={cn(
                  'flex min-w-0 flex-1 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                  active ? 'text-primary' : 'hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{t(key)}</span>
              </Link>
              <button
                type="button"
                onClick={() => setOpenModule(expanded ? null : key)}
                aria-expanded={expanded}
                aria-label={
                  expanded
                    ? t('collapseSection', { label: t(key) })
                    : t('expandSection', { label: t(key) })
                }
                className={cn(
                  'flex w-8 shrink-0 items-center justify-center rounded-md',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                  active ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <ChevronDown
                  className={cn('h-4 w-4 transition-transform', expanded && 'rotate-180')}
                  aria-hidden
                />
              </button>
            </div>

            {expanded && (
              <div className="mt-1 space-y-0.5 border-l border-border pl-2">
                {/* "All X" - jumps to the unfiltered module page. */}
                <Link
                  href={submenu.href}
                  onClick={onNavigate}
                  aria-current={active && !activeValue ? 'page' : undefined}
                  className={cn(
                    'block truncate rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                    active && !activeValue
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                  )}
                >
                  {t('viewAll', { label: t(key) })}
                </Link>
                {sortedGroups
                  ? sortedGroups.map((group) => {
                      const groupOpen = openGroup === group.groupKey;
                      return (
                        <div key={group.groupKey}>
                          <button
                            type="button"
                            onClick={() => setOpenGroup(groupOpen ? null : group.groupKey)}
                            aria-expanded={groupOpen}
                            className={cn(
                              'flex w-full items-center justify-between gap-2 rounded-md px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors',
                              'text-muted-foreground/80 hover:bg-muted hover:text-foreground',
                              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                            )}
                          >
                            <span className="truncate">{t(`groups.${group.groupKey}`)}</span>
                            <ChevronDown
                              className={cn(
                                'h-3.5 w-3.5 shrink-0 transition-transform',
                                groupOpen && 'rotate-180',
                              )}
                              aria-hidden
                            />
                          </button>
                          {groupOpen && (
                            <div className="mt-0.5 space-y-0.5 pl-1">
                              {sortedValues(submenu.labelMode, group.values).map((value) => (
                                <Leaf key={value} submenu={submenu} value={value} />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  : sortedValues(submenu.labelMode, submenu.values ?? []).map((value) => (
                      <Leaf key={value} submenu={submenu} value={value} />
                    ))}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
