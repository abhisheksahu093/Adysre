import { SidebarBrand, SidebarNav } from './sidebar-nav';
import { PromoCard } from './promo-card';

/**
 * Persistent sidebar (UI_DESIGN_SYSTEM.md). Desktop only - below `md` the
 * viewport is too narrow for a 16rem rail, so the same nav is served through
 * MobileNav's drawer instead.
 */
export function Sidebar() {
  return (
    <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-border bg-card md:flex">
      <SidebarBrand />
      {/* SidebarNav takes flex-1 and scrolls, so the promo stays pinned to the
          bottom no matter how many nav items exist. */}
      <SidebarNav />
      <PromoCard />
    </aside>
  );
}
