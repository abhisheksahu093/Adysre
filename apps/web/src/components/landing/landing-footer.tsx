import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Logo } from '@/components/logo';
import { LANDING_LINKS } from '@/data/landing';

/** The year is stamped at render; no client clock needed. */
const YEAR = new Date().getFullYear();

/**
 * Marketing footer. Server Component. Link labels reuse the shared `nav` and
 * `userMenu` catalogues wherever an entry already exists, so the footer can
 * never disagree with the sidebar or the account menu.
 */
export async function LandingFooter() {
  const [t, tNav, tUser, tPricing] = await Promise.all([
    getTranslations('landing'),
    getTranslations('nav'),
    getTranslations('userMenu'),
    getTranslations('pricing'),
  ]);

  const columns = [
    {
      heading: t('footer.product'),
      links: [
        { href: LANDING_LINKS.components, label: tNav('components') },
        { href: LANDING_LINKS.icons, label: tNav('icons') },
        { href: LANDING_LINKS.palettes, label: tNav('palettes') },
        { href: LANDING_LINKS.gradients, label: tNav('gradients') },
        { href: LANDING_LINKS.templates, label: tNav('templates') },
        { href: LANDING_LINKS.codes, label: tNav('codes') },
        { href: LANDING_LINKS.documents, label: tNav('documents') },
        { href: LANDING_LINKS.websiteIntelligence, label: tNav('websiteIntelligence') },
        { href: LANDING_LINKS.resume, label: tNav('resume') },
      ],
    },
    {
      heading: t('footer.resources'),
      links: [
        { href: LANDING_LINKS.pricing, label: tPricing('metaTitle') },
        { href: LANDING_LINKS.docs, label: t('footer.docs') },
        { href: LANDING_LINKS.contact, label: t('footer.contact') },
      ],
    },
    {
      heading: t('footer.legal'),
      links: [
        { href: LANDING_LINKS.terms, label: tUser('terms') },
        { href: LANDING_LINKS.privacy, label: tUser('privacy') },
        { href: LANDING_LINKS.dmca, label: tUser('dmca') },
      ],
    },
  ];

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
          <div className="col-span-2">
            <Logo height={26} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>

          {columns.map((col) => (
            <nav key={col.heading} aria-label={col.heading}>
              <h3 className="text-sm font-semibold">{col.heading}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>
            &copy; {YEAR} ADYSRE. {t('footer.rights')}
          </p>
          <p>{t('footer.built')}</p>
        </div>
      </div>
    </footer>
  );
}
