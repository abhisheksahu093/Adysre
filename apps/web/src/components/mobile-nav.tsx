'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { Button } from 'adysre';
import { SidebarBrand, SidebarNav } from './sidebar-nav';

/**
 * Slide-in navigation for viewports below `md`, where the persistent sidebar
 * is hidden. Renders the same SidebarNav so the two can't drift.
 */
export function MobileNav() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  // The raw pathname is right here: we only need a change signal, and the
  // locale-aware one wouldn't fire on a locale switch.
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const t = useTranslations('nav');

  // Portals need a DOM; this component still server-renders.
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close when the route changes - otherwise the drawer would stay open on top
  // of the page the user just navigated to.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    // Lock body scroll so the page behind the overlay doesn't move.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    panelRef.current?.focus();

    // Capture the trigger while the effect runs: by cleanup time the ref may
    // already point at a different element (or null), and focus would land
    // somewhere arbitrary instead of back where the user opened the menu.
    const trigger = triggerRef.current;

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      // Send focus back to the trigger so keyboard users don't lose their place.
      trigger?.focus();
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        size="icon"
        aria-label={t('openMenu')}
        aria-expanded={open}
        onClick={() => setOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Portalled to <body>: the topbar sets `backdrop-blur`, and a
          backdrop-filter makes an element the containing block for its
          fixed-position descendants - rendered in place, `inset-0` would
          resolve against the 56px header instead of the viewport. */}
      {open &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-label={t('mainLabel')}
              tabIndex={-1}
              className="absolute inset-y-0 left-0 flex w-64 max-w-[80vw] flex-col border-r border-border bg-card shadow-lg outline-none"
            >
              <div className="relative">
                <SidebarBrand />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label={t('closeMenu')}
                  className="absolute right-2 top-2"
                  onClick={() => setOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <SidebarNav onNavigate={() => setOpen(false)} />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
