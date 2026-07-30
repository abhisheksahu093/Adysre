'use client';

import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { buttonVariants, cn } from 'adysre';
import { Link } from '@/i18n/navigation';

/**
 * Topbar upsell. The label collapses to the icon on narrow viewports.
 *
 * The only button in the product that is allowed to shine: `.premium-cta` in
 * globals.css runs a light around its edge and a sheen across it, and `.cta`
 * gives it the same lift on hover every other action has, so it stands out by
 * being more alive than its neighbours rather than a different colour from them.
 */
export function PremiumButton() {
  const t = useTranslations('premium');

  return (
    <Link
      href="/pricing"
      aria-label={t('cta')}
      // A Link styled as a button, not a Button with an onClick: it's a
      // navigation, so it must be middle-clickable and open in a new tab.
      className={cn(buttonVariants({ size: 'sm' }), 'cta premium-cta gap-1.5')}
    >
      <Sparkles className="premium-glyph h-3.5 w-3.5 shrink-0" aria-hidden />
      {/* Hidden below `lg` - the topbar already carries search, bell, theme,
          cart and avatar; the full label is what breaks the row first. */}
      <span className="hidden lg:inline">{t('cta')}</span>
    </Link>
  );
}
