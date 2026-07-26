'use client';

import { useTranslations } from 'next-intl';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAppShellStore } from '@/stores/app-shell-store';

/**
 * Collapse/expand control for the desktop sidebar. It lives at the left of the
 * topbar (just past the rail) so the sidebar itself keeps the brand visible in
 * both states. Desktop only - below `md` the sidebar is a drawer with its own
 * hamburger trigger.
 */
export function SidebarToggle() {
  const t = useTranslations('nav');
  const collapsed = useAppShellStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useAppShellStore((s) => s.toggleSidebar);

  const label = collapsed ? t('expandSidebar') : t('collapseSidebar');
  const Icon = collapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <button
      type="button"
      onClick={toggleSidebar}
      title={label}
      aria-label={label}
      className="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:inline-flex"
    >
      <Icon className="h-4 w-4" aria-hidden />
    </button>
  );
}
