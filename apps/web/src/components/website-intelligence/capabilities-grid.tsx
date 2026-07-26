import { getTranslations } from 'next-intl/server';
import { cn } from 'adysre';
import { INTEL_CAPABILITIES } from '@/data/website-intelligence';

/**
 * The eleven capability cards.
 *
 * Shared by both surfaces that describe the platform - the home-page section
 * and the in-app overview page - so the list, the icons and the copy stay in
 * one place (Rule 3). Server Component: it reads its own translations, so a
 * caller just drops it in.
 */
export async function IntelCapabilitiesGrid({ className }: { className?: string }) {
  const t = await getTranslations('websiteIntel.capabilities');

  return (
    <ul className={cn('grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3', className)}>
      {INTEL_CAPABILITIES.map(({ id, icon: Icon }) => (
        <li
          key={id}
          className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
        >
          <span
            aria-hidden
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10"
          >
            <Icon className="h-5 w-5 text-primary" />
          </span>
          <h3 className="mt-4 text-sm font-semibold tracking-tight">{t(`${id}.title`)}</h3>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t(`${id}.desc`)}</p>
        </li>
      ))}
    </ul>
  );
}
