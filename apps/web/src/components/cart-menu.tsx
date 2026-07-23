'use client';

import { useCallback, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ShoppingCart } from 'lucide-react';
import { Button, buttonVariants, cn } from 'adysre';
import { Link } from '@/i18n/navigation';
import { useDismissable } from '@/hooks/use-dismissable';

/**
 * Cart popover.
 *
 * The cart is presentational for now - there is no orders API or line-item
 * model yet, so it always shows the empty state and points at the pass. When a
 * real cart lands, this component owns the item list; the empty branch stays.
 */
export function CartMenu() {
  const [open, setOpen] = useState(false);
  const t = useTranslations('cart');

  const close = useCallback(() => setOpen(false), []);
  const ref = useDismissable<HTMLDivElement>(open, close);

  return (
    <div ref={ref} className="relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={t('open')}
        onClick={() => setOpen((v) => !v)}
        className="text-muted-foreground hover:text-foreground"
      >
        <ShoppingCart className="h-4 w-4" />
      </Button>

      {open && (
        <div
          role="dialog"
          aria-label={t('label')}
          // Right-anchored to the trigger, which is NOT the viewport edge - the
          // premium button and avatar sit to its right (~6rem, wider once the
          // premium label appears at `lg`). The width therefore clamps against
          // that offset plus a margin; at a flat 20rem the panel's left edge
          // lands off-screen on a phone.
          className="absolute right-0 top-10 z-20 w-[min(20rem,calc(100vw-7rem))] rounded-lg border border-border bg-card p-6 text-center shadow-lg"
        >
          <p className="text-sm font-medium text-foreground">{t('empty')}</p>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {t.rich('emptyHint', {
              b: (chunks) => <strong className="font-semibold text-foreground">{chunks}</strong>,
            })}
          </p>

          <Link
            href="/pricing"
            onClick={close}
            className={cn(buttonVariants({ variant: 'outline' }), 'mt-5 w-full')}
          >
            {t('cta')}
          </Link>
        </div>
      )}
    </div>
  );
}
