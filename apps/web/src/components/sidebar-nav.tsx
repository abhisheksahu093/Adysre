'use client';

import { Suspense, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '@adysre/ui';
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
 * Modules that expose a submenu (components, prompts, icons, gradients,
 * palettes) render as expandable dropdowns whose items are the categories/tags
 * that used to sit as filter chips on the page. Each item links to the module
 * with a `?category=` / `?tag=` query the page reads, so choosing a filter is a
 * navigation and stays shareable.
 *
 * `useSearchParams` (for the active-item highlight) suspends on statically
 * rendered routes, so it lives behind a Suspense boundary; the fallback renders
 * the same tree with no active-item highlight until hydration.
 */
export function SidebarNav({ onNavigate = () => {} }: { onNavigate?: () => void }) {
  return (
    <Suspense fallback={<SidebarNavInner onNavigate={onNavigate} activeValue={null} />}>
      <SidebarNavWithParams onNavigate={onNavigate} />
    </Suspense>
  );
}

/** Reads the active filter value off the URL and hands it to the renderer. */
function SidebarNavWithParams({ onNavigate }: { onNavigate: () => void }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  // The value filtering the module the user is currently on (if any).
  const activeModule = Object.values(NAV_SUBMENUS).find(
    (m) => pathname === m.href || pathname.startsWith(`${m.href}/`),
  );
  const activeValue = activeModule ? searchParams.get(activeModule.param) : null;

  return <SidebarNavInner onNavigate={onNavigate} activeValue={activeValue} />;
}

function SidebarNavInner({
  onNavigate,
  activeValue,
}: {
  onNavigate: () => void;
  activeValue: string | null;
}) {
  const pathname = usePathname();
  const t = useTranslations('nav');
  const tCommon = useTranslations('common');
  const tComponents = useTranslations('components');
  const tIcons = useTranslations('icons');
  const tPrompts = useTranslations('promptLibrary');

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
    const translate = mode.ns === 'components' ? tComponents : mode.ns === 'icons' ? tIcons : tPrompts;
    const key = `${mode.prefix}${value}`;
    return translate.has(key) ? translate(key) : humanizeKey(value);
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

  return (
    <nav aria-label={t('mainLabel')} className="flex-1 space-y-1 overflow-y-auto p-3">
      {NAV_ITEMS.map((item) => {
        const { key, href, icon: Icon, comingSoon } = item;
        const submenu = NAV_SUBMENUS[key];
        // usePathname is locale-stripped, so it compares cleanly to hrefs.
        const active = pathname === href || pathname.startsWith(`${href}/`);

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
                {submenu.groups
                  ? submenu.groups.map((group) => {
                      const groupOpen = openGroup === group.groupKey;
                      return (
                        <div key={group.groupKey}>
                          <button
                            type="button"
                            onClick={() =>
                              setOpenGroup(groupOpen ? null : group.groupKey)
                            }
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
                              {group.values.map((value) => (
                                <Leaf key={value} submenu={submenu} value={value} />
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  : submenu.values?.map((value) => (
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
