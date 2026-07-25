'use client';

import { cn } from 'adysre';
import { useAppShellStore } from '@/stores/app-shell-store';
import { SidebarBrand, SidebarBrandIcon, SidebarNav } from './sidebar-nav';
// Promo card temporarily hidden (see below).
// import { PromoCard } from './promo-card';

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
  const collapsed = useAppShellStore((s) => s.sidebarCollapsed);

  return (
    <aside
      className={cn(
        'hidden h-screen shrink-0 flex-col border-r border-border bg-card transition-[width] duration-200 md:flex',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      {/* Collapsed, the wordmark gives way to the compact icon mark - 16rem of
          logo does not fit in 4. The collapse/expand control lives at the left
          of the topbar (SidebarToggle), so both states keep the brand visible. */}
      {collapsed ? <SidebarBrandIcon /> : <SidebarBrand />}

      {/* SidebarNav takes flex-1 and scrolls, so the footer stays pinned to the
          bottom no matter how many nav items exist. */}
      <SidebarNav collapsed={collapsed} />
      {/* Promo card hidden for now; pinned copyright takes the bottom slot. */}
      {/* {!collapsed && <PromoCard />} */}
      <div className="shrink-0 border-t border-border px-4 py-3 text-center text-[11px] text-muted-foreground">
        {collapsed ? '©' : `© ${new Date().getFullYear()} Adysre. All rights reserved.`}
      </div>
    </aside>
  );
}
