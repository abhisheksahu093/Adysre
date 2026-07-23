'use client';

import { useTranslations } from 'next-intl';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { cn } from '@adysre/ui';
import { useAppShellStore } from '@/stores/app-shell-store';
import { SidebarBrand, SidebarNav } from './sidebar-nav';
import { PromoCard } from './promo-card';

/**
 * Persistent sidebar (UI_DESIGN_SYSTEM.md). Desktop only - below `md` the
 * viewport is too narrow for a 16rem rail, so the same nav is served through
 * MobileNav's drawer instead.
 *
 * It collapses to an icon rail, which is what gives a wide module page (the
 * component grid, the templates gallery) back a full column of width without
 * making the user leave the shell. The choice persists, and the drawer is never
 * collapsed - `collapsed` is passed explicitly rather than read from the store
 * inside the nav, so the mobile drawer always renders its labels.
 */
export function Sidebar() {
  const t = useTranslations('nav');
  const collapsed = useAppShellStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppShellStore((s) => s.toggleSidebar);

  const label = collapsed ? t('expandSidebar') : t('collapseSidebar');
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <aside
      className={cn(
        'hidden h-screen shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200 md:flex',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* The brand row doubles as the toggle's home, so collapsing costs no
          vertical space. Collapsed, the wordmark gives way to the control -
          16rem of logo does not fit in 4. */}
      {collapsed ? (
        <div className="flex h-14 shrink-0 items-center justify-center border-b border-border">
          <SidebarToggle label={label} icon={Icon} onClick={toggleSidebar} />
        </div>
      ) : (
        <div className="relative">
          <SidebarBrand />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <SidebarToggle label={label} icon={Icon} onClick={toggleSidebar} />
          </div>
        </div>
      )}

      {/* SidebarNav takes flex-1 and scrolls, so the promo stays pinned to the
          bottom no matter how many nav items exist. */}
      <SidebarNav collapsed={collapsed} />
      {/* The upsell is all copy and artwork; there is nothing of it to show in a
          4rem rail, so it steps aside rather than being squeezed. */}
      {!collapsed && <PromoCard />}
    </aside>
  );
}

function SidebarToggle({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: typeof PanelLeftClose;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
