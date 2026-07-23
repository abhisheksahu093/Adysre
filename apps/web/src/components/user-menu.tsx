'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocale, useTranslations } from 'next-intl';
import { LogOut, ChevronRight, Check, ExternalLink, Loader2, type LucideIcon } from 'lucide-react';
import { cn } from 'adysre';
import { Link, getPathname, usePathname, useRouter } from '@/i18n/navigation';
import { LOCALE_LABELS, routing, type Locale } from '@/i18n/routing';
import { USER_MENU_ITEMS, type UserMenuItem } from '@/config/user-menu';
import { fetchProfile, initials, DEMO_USER } from '@/lib/session';
import { logout } from '@/lib/auth';

const ROW =
  'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:bg-muted';

/** Leaf row - internal Link, or an anchor for mailto/external. */
function MenuLink({ item, onSelect }: { item: UserMenuItem; onSelect: () => void }) {
  const t = useTranslations('userMenu');
  const Icon = item.icon;
  const content = (
    <>
      <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="truncate">{t(item.key)}</span>
      {item.external && <ExternalLink className="ml-auto h-3 w-3 shrink-0 text-muted-foreground" />}
    </>
  );

  if (item.external) {
    return (
      <a
        href={item.href}
        role="menuitem"
        // mailto: must not get target=_blank - it would open a blank tab.
        {...(item.href?.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        onClick={onSelect}
        className={ROW}
      >
        {content}
      </a>
    );
  }

  return (
    <Link href={item.href ?? '#'} role="menuitem" onClick={onSelect} className={ROW}>
      {content}
    </Link>
  );
}

/**
 * Row that owns a submenu.
 *
 * The submenu flies out to the left on desktop (the panel is pinned to the
 * right edge, so a right-hand flyout would leave the viewport) and expands
 * inline on mobile, where there is no room for a flyout at all.
 */
function SubmenuRow({
  label,
  icon: Icon,
  open,
  onToggle,
  children,
}: {
  label: string;
  icon: LucideIcon;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <button
        type="button"
        role="menuitem"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={onToggle}
        className={cn(ROW, open && 'bg-muted')}
      >
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{label}</span>
        <ChevronRight
          className={cn(
            'ml-auto h-4 w-4 shrink-0 text-muted-foreground transition-transform',
            open && 'rotate-90 sm:rotate-0',
          )}
        />
      </button>

      {open && (
        <div
          role="menu"
          aria-label={label}
          className={cn(
            'mt-1 space-y-0.5 border-l border-border pl-3',
            'sm:absolute sm:right-full sm:top-0 sm:mr-1 sm:mt-0 sm:w-52 sm:space-y-0',
            'sm:rounded-lg sm:border sm:border-border sm:bg-card sm:p-1 sm:pl-1 sm:shadow-lg',
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function UserMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('userMenu');
  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  const { data: user = DEMO_USER } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 60_000,
  });

  const closeAll = () => {
    setOpen(false);
    setOpenSub(null);
  };

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) closeAll();
    }
    function onKey(e: KeyboardEvent) {
      if (e.key !== 'Escape') return;
      // Escape backs out one level at a time rather than nuking the whole menu.
      setOpenSub((sub) => {
        if (sub) return null;
        setOpen(false);
        return null;
      });
    }
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  async function onLogout() {
    closeAll();
    await logout();
    router.push('/login');
  }

  /**
   * Switch language on the current route.
   *
   * Deliberately a full document navigation, not `router.replace`: a soft
   * locale swap re-renders the root layout on the client, and next-themes'
   * inline theme script can't execute there (React drops script tags on client
   * render), which both errors and risks a theme flash. A reload also
   * guarantees `<html lang>` is server-rendered correctly for screen readers.
   *
   * The cookie must be written by hand. next-intl's router sets it for us, but
   * a raw navigation doesn't - and with `localePrefix: 'as-needed'` the English
   * URL carries no prefix, so a stale cookie would make the middleware bounce
   * us straight back to the old locale.
   */
  function onSelectLocale(next: Locale) {
    closeAll();
    if (next === locale) return;
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;samesite=lax`;
    startTransition(() => {
      window.location.href = getPathname({ href: pathname, locale: next });
    });
  }

  const toggleSub = (id: string) => setOpenSub((cur) => (cur === id ? null : id));

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => (open ? closeAll() : setOpen(true))}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t('open')}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
      >
        {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : initials(user.name)}
      </button>

      {open && (
        <div
          role="menu"
          aria-label={t('label')}
          className="absolute right-0 top-10 z-20 w-64 rounded-lg border border-border bg-card shadow-lg"
        >
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
              aria-hidden
            >
              {initials(user.name)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <nav className="p-1">
            {USER_MENU_ITEMS.map((item) =>
              item.id === 'language' ? (
                <SubmenuRow
                  key={item.id}
                  label={t(item.key)}
                  icon={item.icon}
                  open={openSub === item.id}
                  onToggle={() => toggleSub(item.id)}
                >
                  {routing.locales.map((code) => (
                    <button
                      key={code}
                      type="button"
                      role="menuitemradio"
                      aria-checked={locale === code}
                      onClick={() => onSelectLocale(code)}
                      className={ROW}
                    >
                      <Check
                        className={cn(
                          'h-4 w-4 shrink-0 text-primary',
                          locale === code ? 'opacity-100' : 'opacity-0',
                        )}
                        aria-hidden
                      />
                      {/* Endonym, never translated - users look for their own language. */}
                      <span className="truncate">{LOCALE_LABELS[code]}</span>
                    </button>
                  ))}
                </SubmenuRow>
              ) : item.items ? (
                <SubmenuRow
                  key={item.id}
                  label={t(item.key)}
                  icon={item.icon}
                  open={openSub === item.id}
                  onToggle={() => toggleSub(item.id)}
                >
                  {item.items.map((child) => (
                    <MenuLink key={child.id} item={child} onSelect={closeAll} />
                  ))}
                </SubmenuRow>
              ) : (
                <MenuLink key={item.id} item={item} onSelect={closeAll} />
              ),
            )}

            <div className="my-1 h-px bg-border" role="separator" />

            <button type="button" role="menuitem" onClick={onLogout} className={cn(ROW, 'text-danger')}>
              <LogOut className="h-4 w-4 shrink-0" />
              {t('signOut')}
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
